#!/usr/bin/env bash

# Vue 组件批量移动脚本

BACKUP_DIR="packages/vue/src/components-backup"
TARGET_DIR="packages/vue/src/components"

echo "🔄 批量移动所有 Vue 组件文件..."
echo ""

# 从备份目录复制所有文件到目标分类目录
cd "$BACKUP_DIR" || exit

# 遍历所有 .vue 和 .ts 文件
find . -maxdepth 1 \( -name "*.vue" -o -name "*.ts" \) | while read -r file; do
  filename=$(basename "$file")
  base="${filename%.*}"
  
  # 跳过特殊文件
  if [[ "$base" == "index" || "$base" == "primitive" || "$base" == "slot" || "$base" == "sonner" || "$base" == "toaster" ]]; then
    echo "  ⏭️  跳过: $filename"
    continue
  fi
  
  # 提取组件名称（去掉子组件后缀）
  component_name=""
  
  # 尝试匹配已知组件
  for comp in accordion alert alert-dialog avatar badge banner breadcrumb button calendar calendar-rac card checkbox checkbox-tree collapsible combobox command cropper date-picker datefield datefield-rac dialog dropdown-menu hover-card input label multiselect navbar navigation-menu notification pagination popover progress radio-group resizable scroll-area scroll-bar select select-native separator sheet slider stepper switch table tabs tags-input textarea timeline toast toggle toggle-group tooltip tree; do
    if [[ "$base" == "$comp" || "$base" == "$comp-"* ]]; then
      component_name="$comp"
      break
    fi
  done
  
  if [ -z "$component_name" ]; then
    echo "  ⚠️  未识别: $filename"
    continue
  fi
  
  # 确定分类
  category=""
  case "$component_name" in
    button|checkbox|input|label|radio-group|select|select-native|slider|switch|tags-input|textarea|toggle|toggle-group)
      category="form" ;;
    accordion|card|collapsible|resizable|scroll-area|scroll-bar|separator|sheet)
      category="layout" ;;
    breadcrumb|dropdown-menu|navigation-menu|pagination|tabs)
      category="navigation" ;;
    alert|alert-dialog|dialog|progress|toast|tooltip)
      category="feedback" ;;
    avatar|badge|banner|calendar|calendar-rac|table|timeline|notification|navbar)
      category="data-display" ;;
    hover-card|popover|command)
      category="overlay" ;;
    checkbox-tree|combobox|cropper|date-picker|datefield|datefield-rac|multiselect|stepper|tree)
      category="advanced" ;;
    *)
      echo "  ⚠️  未分类: $filename ($component_name)"
      continue ;;
  esac
  
  # 创建目标目录并复制文件
  target_dir="../../$TARGET_DIR/$category/$component_name"
  mkdir -p "$target_dir"
  
  if [ ! -f "$target_dir/$filename" ]; then
    cp "$file" "$target_dir/"
    echo "  ✓ $category/$component_name/$filename"
  fi
done

echo ""
echo "✅ 批量移动完成！"
