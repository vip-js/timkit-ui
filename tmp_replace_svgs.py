import os
import re

COMPONENTS_DIR = '/Users/jiawei01.mao/sine/timkit-ui/apps/docs/registry/default/components'
DIRS_TO_PROCESS = ['image-cropper', 'navbar', 'notification', 'pagination', 'popover']

svg_regex = re.compile(r'<svg.*?>.*?</svg>', re.DOTALL)
component_regex = re.compile(r'<([A-Z][a-zA-Z0-9]*Icon)[^>]*>')
import_regex = re.compile(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"]')

for dir_name in DIRS_TO_PROCESS:
    dir_path = os.path.join(COMPONENTS_DIR, dir_name)
    if not os.path.exists(dir_path):
        continue
    
    for filename in os.listdir(dir_path):
        if filename.endswith('.vue'):
            vue_path = os.path.join(dir_path, filename)
            tsx_path = os.path.join(dir_path, filename.replace('.vue', '.tsx'))
            
            if not os.path.exists(tsx_path):
                continue
                
            with open(vue_path, 'r', encoding='utf-8') as f:
                vue_content = f.read()
                
            if '<svg' not in vue_content:
                continue
                
            with open(tsx_path, 'r', encoding='utf-8') as f:
                tsx_content = f.read()
                
            # Find imported icons
            lucide_imports = []
            import_matches = import_regex.finditer(tsx_content)
            for match in import_matches:
                icons = [i.strip() for i in match.group(1).split(',')]
                lucide_imports.extend(icons)
            
            # Find all icon usages in tsx in order
            tsx_icons_in_order = []
            for match in component_regex.finditer(tsx_content):
                icon_name = match.group(1)
                if icon_name.endswith('Icon') and icon_name != 'RiRemixIcon':
                    tsx_icons_in_order.append(icon_name)
                    
            # Find all SVGs in vue in order
            vue_svgs_in_order = list(svg_regex.finditer(vue_content))
            
            print(f"File: {filename}")
            print(f"TSX Icons ({len(tsx_icons_in_order)}): {tsx_icons_in_order}")
            print(f"Vue SVGs ({len(vue_svgs_in_order)})")
            
            if len(tsx_icons_in_order) >= len(vue_svgs_in_order) and len(vue_svgs_in_order) > 0:
                # Naive replacement
                new_vue_content = vue_content
                icons_to_import = set()
                
                # Careful replacement from end to start to not mess up indices
                # wait, since we just replace the exact match, it might be tricky if svgs are identical but we need different icons.
                # Better to replace by index!
                
                # We need to replace match by match.
                # Let's split by svg_regex and interleave.
                
                parts = svg_regex.split(vue_content)
                if len(parts) - 1 == len(vue_svgs_in_order):
                    result = []
                    # Filter out purely structural <svg> if any? Usually in these demos all svgs are icons.
                    # Wait, sometimes there are extra icons in React or conditional rendering.
                    # Let's just do a 1-to-1 if lengths match, else skip.
                    if len(tsx_icons_in_order) == len(vue_svgs_in_order):
                        print(f" MATCH! Replacing {len(vue_svgs_in_order)} icons.")
                        for i in range(len(vue_svgs_in_order)):
                            result.append(parts[i])
                            
                            icon_name = tsx_icons_in_order[i]
                            icons_to_import.add(icon_name)
                            
                            # extract class from svg
                            svg = vue_svgs_in_order[i].group(0)
                            class_match = re.search(r'class="([^"]+)"', svg)
                            class_str = f' class="{class_match.group(1)}"' if class_match else ''
                            
                            result.append(f'<{icon_name}{class_str} />')
                        
                        result.append(parts[-1])
                        new_vue_content = "".join(result)
                        
                        # Add script setup if not exists, or add imports
                        if '<script setup lang="ts">' in new_vue_content:
                            import_stmt = f"import {{ {', '.join(sorted(icons_to_import))} }} from 'lucide-vue-next'\n"
                            # insert after <script setup lang="ts">\n
                            new_vue_content = new_vue_content.replace('<script setup lang="ts">\n', f'<script setup lang="ts">\n{import_stmt}', 1)
                        else:
                            import_stmt = f"<script setup lang=\"ts\">\nimport {{ {', '.join(sorted(icons_to_import))} }} from 'lucide-vue-next'\n</script>\n"
                            new_vue_content = import_stmt + new_vue_content
                            
                        with open(vue_path, 'w', encoding='utf-8') as f:
                            f.write(new_vue_content)
                    else:
                        print(f" MISMATCH! TSX: {len(tsx_icons_in_order)} vs Vue: {len(vue_svgs_in_order)}")
            else:
                 print(f" MISMATCH or 0 SVGs")
            print("---")
