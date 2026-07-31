import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { Command } from 'commander'
import {
  Project,
  SyntaxKind,
  JsxElement,
  JsxSelfClosingElement,
  JsxFragment,
  Node,
  Identifier
} from 'ts-morph'

// Simple mapping for React to Vue specific components
const tagMapping: Record<string, string> = {
  // Lucide icons stay the same
}

const attrMapping: Record<string, string> = {
  className: 'class',
  strokeWidth: 'stroke-width',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  viewBox: 'viewBox',
  defaultValue: 'default-value',
  defaultOpen: 'default-open',
  onValueChange: 'on-value-change', // handled dynamically later
  onOpenChange: 'on-open-change',
  onClick: 'on-click',
}

// Event naming mappings per platform
const vueEventMapping: Record<string, string> = {
  'on-click': '@click',
  'on-value-change': '@update:modelValue',
  'on-open-change': '@update:open',
  'on-change': '@change',
  'on-submit': '@submit',
}

const wxmlEventMapping: Record<string, string> = {
  'on-click': 'bindtap',
  'on-value-change': 'bindchange',
  'on-open-change': 'bindchange',
  'on-change': 'bindchange',
  'on-submit': 'bindsubmit',
}

type ParsedImport = { named: string[]; default?: string; module: string }

function resolveVueImports(
  tags: string[],
  originalImports: ParsedImport[],
  componentDirRef: string
): string {
  const uiImports: Record<string, string[]> = {}
  const lucideImports: string[] = []
  const localImports: string[] = []
  let hasCn = false

  originalImports.forEach((imp) => {
    if (imp.module === 'lucide-react') imp.named.forEach((n) => lucideImports.push(n))
    if (imp.module === '@timui/core' && imp.named.includes('cn')) hasCn = true

    if (imp.module === '@timui/react') {
      imp.named.forEach((comp) => {
        let group = comp
        
        // Handle Hooks
        if (comp.startsWith('use')) {
           const path = `@/components/hooks/${comp.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`
           if (!localImports.includes(`import { ${comp} } from '${path}';`)) {
               localImports.push(`import { ${comp} } from '${path}';`)
           }
           return
        }
        
        if (comp.startsWith('NavigationMenu')) group = 'navigation-menu'
        else if (comp.startsWith('Breadcrumb')) group = 'breadcrumb'
        else if (comp.startsWith('Popover')) group = 'popover'
        else if (comp.startsWith('Select')) group = 'select'
        else if (comp.startsWith('Pagination')) group = 'pagination'
        else if (comp.startsWith('Button') || comp === 'buttonVariants') group = 'button'
        else if (comp.startsWith('Dialog')) group = 'dialog'
        else if (comp.startsWith('DropdownMenu')) group = 'dropdown-menu'
        else if (comp.startsWith('Avatar')) group = 'avatar'
        else if (comp.startsWith('Sheet')) group = 'sheet'
        else if (comp.startsWith('Cropper')) group = 'image-cropper' // Handle cropper tokens
        else group = comp.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

        // Handle specific skip cases (DateInputStyle, Option)
        if (group === 'date-input-style' || group === 'option' || group === 'cropper-crop-area') {
           return
        }

        const path = `@/components/ui/${group}`
        if (!uiImports[path]) uiImports[path] = []
        uiImports[path].push(comp)
      })
    }

    if (imp.module.startsWith('.')) {
      // Re-map relative imports
      const resolvedRef = imp.module.replace('.tsx', '')
      if (imp.named.length > 0)
        localImports.push(`import { ${imp.named.join(', ')} } from '${resolvedRef}.vue';`)
      if (imp.default) localImports.push(`import ${imp.default} from '${resolvedRef}.vue';`)
    } else if (imp.module.startsWith('@/registry/')) {
      const resolvedRef = imp.module.replace('.tsx', '')
      if (imp.named.length > 0)
        localImports.push(`import { ${imp.named.join(', ')} } from '${resolvedRef}.vue';`)
      if (imp.default) localImports.push(`import ${imp.default} from '${resolvedRef}.vue';`)
    } else if (imp.module !== '@timui/react' && imp.module !== '@timui/core' && imp.module !== 'lucide-react' && imp.module !== 'react') {
      // Preserve other third party imports like date-fns
      if (imp.named.length > 0)
        localImports.push(`import { ${imp.named.join(', ')} } from '${imp.module}';`)
      if (imp.default) localImports.push(`import ${imp.default} from '${imp.module}';`)
    }
  })

  let importBlock = ''
  if (hasCn) importBlock += `import { cn } from '@/lib/utils';\n`
  if (lucideImports.length > 0)
    importBlock += `import { ${lucideImports.join(', ')} } from 'lucide-vue-next';\n`

  for (const [path, items] of Object.entries(uiImports)) {
    importBlock += `import { ${items.join(', ')} } from '${path}';\n`
  }

  importBlock += localImports.join('\n') + '\n'
  return importBlock
}

function processAttributes(
  tagName: string,
  attributes: Node[],
  platform: 'vue' | 'html' | 'wxml'
): string {
  const renderedAttrs = attributes
    .map((attr) => {
      if (attr.isKind(SyntaxKind.JsxAttribute)) {
        const name = attr.getNameNode().getText()
        let mappedName = attrMapping[name] || name

        // Component-specific attribute overrides
        if (tagName === 'Calendar' && name === 'onSelect') {
            if (platform === 'vue') mappedName = '@update:modelValue'
            if (platform === 'wxml') mappedName = 'bindchange'
        } else if (platform === 'vue' && vueEventMapping[mappedName]) {
          mappedName = vueEventMapping[mappedName]
        } else if (platform === 'wxml' && wxmlEventMapping[mappedName]) {
          mappedName = wxmlEventMapping[mappedName]
        } else if (platform === 'html' || platform === 'wxml') {
          mappedName = name === 'className' ? 'class' : mappedName.toLowerCase()
        }

        const init = attr.getInitializer()
        if (init?.isKind(SyntaxKind.StringLiteral)) {
          return `${mappedName}=${init.getText()}`
        } else if (init?.isKind(SyntaxKind.JsxExpression)) {
          const expression = init.getExpression()
          let exp = expression?.getText() || '""'

          // Extract inner body if arrow function used in event handler
          if (expression?.isKind(SyntaxKind.ArrowFunction) && (mappedName.startsWith('@') || mappedName.startsWith('bind'))) {
            const arrow = expression.asKind(SyntaxKind.ArrowFunction)
            if (arrow) exp = arrow.getBody().getText()
          }

          if (platform === 'vue') {
            if (mappedName === 'asChild' || mappedName === 'as-child') return `as-child`
            if (mappedName.startsWith('@')) return `${mappedName}="${exp}"`
            return `:${mappedName}="${exp}"`
          } else if (platform === 'wxml') {
            if (mappedName === 'asChild' || mappedName === 'as-child') return ``
            if (mappedName.startsWith('bind')) return `${mappedName}="${exp}"`
            return `${mappedName}="{{${exp}}}"`
          } else {
            if (mappedName === 'asChild' || mappedName === 'as-child') return ``
            return `${mappedName}="\${${exp}}"`
          }
        }

        // Handle boolean attributes without initializers
        if (platform === 'vue') {
          if (mappedName === 'asChild' || mappedName === 'as-child') return 'as-child'
        } else if (platform === 'wxml' || platform === 'html') {
          if (mappedName === 'asChild' || mappedName === 'as-child') return ''
        }
        return mappedName // boolean attr
      }
      return ''
    })
    .filter(Boolean)

  // Deduplicate attributes by rendered name (e.g. ":key"), keeping the last one.
  const dedupedAttrs = new Map<string, string>()
  renderedAttrs.forEach((entry) => {
    const attrName = entry.split('=')[0]?.trim()
    if (!attrName) return
    dedupedAttrs.set(attrName, entry)
  })

  const attrs = Array.from(dedupedAttrs.values()).join(' ')

  return attrs ? ` ${attrs}` : ''
}

function processJsxNode(node: Node, platform: 'vue' | 'html' | 'wxml'): string {
  if (node.isKind(SyntaxKind.JsxText)) {
    return node.getText().replace(/^{|}$/g, '') // Basic text mapping
  }

  if (node.isKind(SyntaxKind.JsxExpression)) {
    const expr = node.getExpression()
    if (!expr) return ''

    // Handle array maps like {navigationLinks.map(...)}
    if (expr.isKind(SyntaxKind.CallExpression)) {
      const caller = expr.getExpression()
      if (caller.isKind(SyntaxKind.PropertyAccessExpression)) {
        if (caller.getName() === 'map') {
          const arrName = caller.getExpression().getText()
          const args = expr.getArguments()
          if (args.length > 0 && args[0].isKind(SyntaxKind.ArrowFunction)) {
            const arrowFunc = args[0]
            const params = arrowFunc.getParameters()
            const itemParam = params[0]?.getName() || 'item'
            const indexParam = params[1]?.getName() || 'index'
            const body = arrowFunc.getBody()

            let innerContent = ''
            if (body.isKind(SyntaxKind.ParenthesizedExpression)) {
              innerContent = processJsxNode(body.getExpression(), platform)
            } else if (Node.isJsxElement(body) || Node.isJsxSelfClosingElement(body)) {
              innerContent = processJsxNode(body, platform)
            }

            // Extract the root tag of the inner content and attach loop directive
            const tagMatch = innerContent.match(/^<([\w-]+)([^>]*)>/)
            if (tagMatch) {
              const [fullMatch, tagName, attrs] = tagMatch
              // Strip original key attr if any
              const newAttrs = attrs.replace(/key=\{[^}]+\}/, '').trim()

              if (platform === 'vue') {
                const vForStr = `v-for="(${itemParam}, ${indexParam}) in ${arrName}" :key="${indexParam}" ${newAttrs}`
                return innerContent.replace(/^<[\w-]+[^>]*>/, `<${tagName} ${vForStr}>`)
              } else if (platform === 'wxml') {
                const wxForStr = `wx:for="{{${arrName}}}" wx:for-item="${itemParam}" wx:for-index="${indexParam}" wx:key="${indexParam}" ${newAttrs}`
                return innerContent.replace(/^<[\w-]+[^>]*>/, `<${tagName} ${wxForStr}>`)
              } else {
                return `<!-- Loop ${arrName} -->\n${innerContent}\n<!-- End Loop -->`
              }
            }
          }
        }
      }
    }

    // Handle conditional rendering like {condition && <Element />}
    if (expr.isKind(SyntaxKind.BinaryExpression)) {
      const binExpr = expr.asKind(SyntaxKind.BinaryExpression)
      if (binExpr?.getOperatorToken().getText() === '&&') {
        const left = binExpr.getLeft()
        const right = binExpr.getRight()

        let rootNode = right
        if (right.isKind(SyntaxKind.ParenthesizedExpression)) {
          rootNode = right.getExpression()
        }

        if (
          rootNode.isKind(SyntaxKind.JsxElement) ||
          rootNode.isKind(SyntaxKind.JsxSelfClosingElement) ||
          rootNode.isKind(SyntaxKind.JsxFragment)
        ) {
          const condition = left.getText()
          let innerContent = processJsxNode(rootNode, platform)

          const tagMatch = innerContent.match(/^<([\w-]+)([^>]*)>/)
          if (tagMatch) {
            const [fullMatch, tagName, attrs] = tagMatch
            if (platform === 'vue') {
              return innerContent.replace(
                /^<[\w-]+[^>]*>/,
                `<${tagName} v-if="${condition}"${attrs}>`
              )
            } else if (platform === 'wxml') {
              return innerContent.replace(
                /^<[\w-]+[^>]*>/,
                `<${tagName} wx:if="{{${condition}}}"${attrs}>`
              )
            } else {
              return `<!-- if ${condition} -->\n${innerContent}\n<!-- endif -->`
            }
          } else if (rootNode.isKind(SyntaxKind.JsxFragment)) {
            // Since fragmented roots can't hold v-if, wrap it
            if (platform === 'vue') {
              return `<template v-if="${condition}">\n${innerContent}\n</template>`
            } else if (platform === 'wxml') {
              return `<block wx:if="{{${condition}}}">\n${innerContent}\n</block>`
            } else {
              return `<!-- if ${condition} -->\n${innerContent}\n<!-- endif -->`
            }
          }
        }
      }
    }

    // Handle Ternary expressions {condition ? <True /> : <False />}
    if (expr.isKind(SyntaxKind.ConditionalExpression)) {
      const condExpr = expr.asKind(SyntaxKind.ConditionalExpression)
      if (condExpr) {
        const condition = condExpr.getCondition().getText()
        let trueNode = condExpr.getWhenTrue()
        let falseNode = condExpr.getWhenFalse()
        
        if (trueNode.isKind(SyntaxKind.ParenthesizedExpression)) trueNode = trueNode.getExpression()
        if (falseNode.isKind(SyntaxKind.ParenthesizedExpression)) falseNode = falseNode.getExpression()

        let trueContent = ''
        let falseContent = ''

        if (Node.isJsxElement(trueNode) || Node.isJsxSelfClosingElement(trueNode) || Node.isJsxFragment(trueNode)) {
          trueContent = processJsxNode(trueNode, platform)
        } else {
          trueContent = platform === 'wxml' ? `{{ ${trueNode.getText()} }}` : (platform === 'vue' ? `{{ ${trueNode.getText()} }}` : `\${${trueNode.getText()}}`)
        }

        if (Node.isJsxElement(falseNode) || Node.isJsxSelfClosingElement(falseNode) || Node.isJsxFragment(falseNode)) {
          falseContent = processJsxNode(falseNode, platform)
        } else {
          falseContent = platform === 'wxml' ? `{{ ${falseNode.getText()} }}` : (platform === 'vue' ? `{{ ${falseNode.getText()} }}` : `\${${falseNode.getText()}}`)
        }

        if (platform === 'vue') {
           return `<template v-if="${condition}">\n${trueContent}\n</template>\n<template v-else>\n${falseContent}\n</template>`
        } else if (platform === 'wxml') {
           return `<block wx:if="{{${condition}}}">\n${trueContent}\n</block>\n<block wx:else>\n${falseContent}\n</block>`
        } else {
           return `<!-- if ${condition} -->\n${trueContent}\n<!-- else -->\n${falseContent}\n<!-- endif -->`
        }
      }
    }

    // expression output
    if (platform === 'vue') return `{{ ${expr.getText()} }}`
    if (platform === 'wxml') return `{{ ${expr.getText()} }}`
    // HTML placeholder
    return `\${${expr.getText()}}`
  }

  if (node.isKind(SyntaxKind.JsxElement)) {
    const opening = node.getOpeningElement()
    const originalTagName = opening.getTagNameNode().getText()
    // basic tag mapping for wxml
    const tagName =
      platform === 'wxml'
        ? originalTagName === 'div'
          ? 'view'
          : originalTagName === 'span' || originalTagName === 'p'
          ? 'text'
          : originalTagName.toLowerCase()
        : originalTagName

    const attrs = processAttributes(originalTagName, opening.getAttributes(), platform)
    const children = node
      .getJsxChildren()
      .map((child) => processJsxNode(child, platform))
      .join('')
    return `<${tagName}${attrs}>${children}</${tagName}>`
  }

  if (node.isKind(SyntaxKind.JsxSelfClosingElement)) {
    const originalTagName = node.getTagNameNode().getText()
    const tagName =
      platform === 'wxml'
        ? originalTagName === 'img'
          ? 'image'
          : originalTagName.toLowerCase()
        : originalTagName

    const attrs = processAttributes(originalTagName, node.getAttributes(), platform)
    return `<${tagName}${attrs} />`
  }

  if (node.isKind(SyntaxKind.JsxFragment)) {
    return node
      .getJsxChildren()
      .map((child) => processJsxNode(child, platform))
      .join('')
  }

  return ''
}

function processComponent(filePath: string, project: Project, htmlDir?: string) {
  const sourceFile = project.addSourceFileAtPath(filePath)
  const baseName = path.basename(filePath, '.tsx')

  // Extract Data context (navigationLinks)
  const navLinksDecl = sourceFile.getVariableDeclaration('navigationLinks')
  let navLinksCode = ''
  if (navLinksDecl) {
    const initializer = navLinksDecl.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression)
    if (initializer) {
      navLinksCode = `const navigationLinks = ${initializer.getText()};`
    }
  }

  // Extract JSX returning block
  let vueTemplate = ''
  let htmlTemplate = ''
  let wxmlTemplate = ''

  const defaultExport = sourceFile.getDefaultExportSymbol()
  let hooksCode = ''
  let hasVueRef = false

  if (defaultExport) {
    const dec = defaultExport.getDeclarations()[0]
    if (dec && dec.isKind(SyntaxKind.FunctionDeclaration)) {
      
      // Extract hooks (useState -> ref)
      const statements = dec.getStatements()
      for (const stmt of statements) {
        if (stmt.isKind(SyntaxKind.VariableStatement)) {
          const varDeclNode = stmt.getDeclarationList().getDeclarations()[0]
          const initializer = varDeclNode.getInitializer()
          if (initializer && initializer.isKind(SyntaxKind.CallExpression)) {
            const callExpr = initializer.getExpression()
            if (callExpr.getText() === 'useState' || callExpr.getText() === 'React.useState') {
              hasVueRef = true
              let defaultVal = initializer.getArguments()[0]?.getText() || 'undefined'
              let stateName = 'state'
              const nameNode = varDeclNode.getNameNode()
              
              if (nameNode.isKind(SyntaxKind.ArrayBindingPattern)) {
                stateName = nameNode.getElements()[0]?.getText() || 'state'
              }
              
              const typeArgs = initializer.getTypeArguments()
              let typeDef = ''
              if (typeArgs.length > 0) {
                 typeDef = `<${typeArgs[0].getText()}>`
              }
              hooksCode += `const ${stateName} = ref${typeDef}(${defaultVal});\n`
            }
          }
        }
      }

      const returnStmt = dec.getStatementByKind(SyntaxKind.ReturnStatement)
      if (returnStmt) {
        const expr = returnStmt.getExpression()
        if (expr?.isKind(SyntaxKind.ParenthesizedExpression)) {
          const jsxExpr = expr.getExpression()
          vueTemplate = processJsxNode(jsxExpr, 'vue')
          htmlTemplate = processJsxNode(jsxExpr, 'html')
          wxmlTemplate = processJsxNode(jsxExpr, 'wxml')
        } else if (
          expr &&
          (expr.isKind(SyntaxKind.JsxElement) || expr.isKind(SyntaxKind.JsxFragment))
        ) {
          vueTemplate = processJsxNode(expr, 'vue')
          htmlTemplate = processJsxNode(expr, 'html')
          wxmlTemplate = processJsxNode(expr, 'wxml')
        }
      }
    }
  }

  // Extract original source imports to resolve dynamically
  const sourceImports = sourceFile.getImportDeclarations().map((imp) => {
    return {
      module: imp.getModuleSpecifierValue(),
      named: imp.getNamedImports().map((n) => n.getName()),
      default: imp.getDefaultImport()?.getText(),
    }
  })

  // Find all used tags to auto-generate imports (just in case)
  const importsToAdd = new Set<string>()
  const matchTags = vueTemplate.match(/<([A-Z][a-zA-Z0-9]*)/g)
  if (matchTags) {
    matchTags.forEach((t) => importsToAdd.add(t.substring(1)))
  }

  const componentDirRef = path.basename(path.dirname(filePath))
  const resolvedImports = resolveVueImports(
    Array.from(importsToAdd),
    sourceImports,
    componentDirRef
  )

  const vueRefImport = hasVueRef ? `import { ref } from 'vue';\n` : ''

  const generatedVue = `<script setup lang="ts">
${vueRefImport}${resolvedImports}
${navLinksCode}
${hooksCode}
</script>

<template>
  ${vueTemplate.trim()}
</template>
`

  const componentDir = path.dirname(filePath)
  const outputPathVue = path.join(componentDir, `${baseName}.vue`)
  fs.writeFileSync(outputPathVue, generatedVue, 'utf-8')

  const generatedHtml = `<template>\n  ${htmlTemplate.trim()}\n</template>`
  const outputPathHtml = htmlDir
    ? path.join(htmlDir, `${baseName}.html`)
    : path.join(componentDir, `${baseName}.html`)
  fs.writeFileSync(outputPathHtml, generatedHtml, 'utf-8')

  const generatedWxml = `<view>\n  ${wxmlTemplate.trim()}\n</view>`
  const outputPathWxml = path.join(componentDir, `${baseName}.wxml`)
  fs.writeFileSync(outputPathWxml, generatedWxml, 'utf-8')

  // Format with Prettier locally to the file
  try {
    execSync(`npx prettier --write ${outputPathVue} ${outputPathHtml}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
  } catch (e) {
    console.error('Failed to run prettier', e)
  }

  console.log(`✅ Generated and formatted platforms for ${baseName}`)
}

function processDirectory(dir: string, project: Project, htmlDir?: string) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      processDirectory(filePath, project, htmlDir)
    } else if (file.endsWith('.tsx') && !file.includes('-generated')) {
      console.log(`\nProcessing ${filePath}...`)
      try {
        processComponent(filePath, project, htmlDir)
      } catch (e) {
        console.error(`Error processing ${file}:`, e)
      }
    }
  }
}

export const generatePlatforms = new Command()
  .name('generate-platforms')
  .description('Generate Vue, HTML, and WXML files from React AST')
  .argument('[paths...]', 'The file or directory paths to process (space separated)')
  .option('--html-dir <path>', 'Optional specific path for HTMl output')
  .action((paths: string[], opts: { htmlDir?: string }) => {
    let htmlDirOverride: string | undefined
    if (opts.htmlDir) {
      htmlDirOverride = path.resolve(process.cwd(), opts.htmlDir)
    }

    if (!paths || paths.length === 0) {
      console.log('No paths provided to generate.')
      process.exit(1)
    }

    const project = new Project()
    console.log(`Processing AST on ${paths.length} target(s)...`)

    for (const p of paths) {
      const targetDir = path.resolve(process.cwd(), p)
      if (fs.existsSync(targetDir)) {
        if (fs.statSync(targetDir).isDirectory()) {
          processDirectory(targetDir, project, htmlDirOverride)
        } else {
          processComponent(targetDir, project, htmlDirOverride)
        }
      } else {
        console.error(`❌ Path not found: ${targetDir}`)
      }
    }
    
    console.log('\n✅ All requested platforms generated successfully.')
  })
