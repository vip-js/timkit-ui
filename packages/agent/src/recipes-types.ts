export interface AgentRecipeFile {
  path: string
  content: string
}

export interface AgentRecipe {
  id: string
  title: string
  description: string
  components: string[]
  frameworks: Array<'react' | 'vue'>
  files: {
    react?: AgentRecipeFile
    vue?: AgentRecipeFile
  }
}
