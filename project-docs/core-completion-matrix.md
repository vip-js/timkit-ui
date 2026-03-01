# Core 完成度矩阵（props / 事件 / variants / 适配层残留）

说明：
- props：`zag`=Zag 类型直出，`custom`=core 自定义字段，`placeholder`=占位未定义
- 事件：`zag`=Zag 事件模型，`custom`=core 自定义事件字段，`none`=未定义
- variants：`core`=core 统一输出，`adapter`=仍在适配层/局部，`missing`=无统一 variants
- 适配层残留：`low`/`med`/`high`（越高表示适配层仍保留更多样式/行为）

基础交互
- accordion: props=zag, events=zag, variants=core, residue=low
- collapsible: props=zag, events=zag, variants=adapter, residue=med
- tabs: props=zag, events=zag, variants=core, residue=low
- toggle: props=zag, events=zag, variants=core, residue=low
- toggle-group: props=zag, events=zag, variants=core, residue=low
- hover-card: props=zag, events=zag, variants=core, residue=low
- tooltip: props=zag, events=zag, variants=core, residue=low
- popover: props=zag, events=zag, variants=core, residue=low
- navigation-menu: props=placeholder, events=none, variants=core, residue=med
- dropdown-menu: props=zag, events=zag, variants=core, residue=low
- command: props=zag, events=zag, variants=core, residue=low

表单/输入
- button: props=custom, events=custom, variants=core, residue=low
- input: props=custom, events=custom, variants=core, residue=low
- textarea: props=custom, events=custom, variants=core, residue=low
- checkbox: props=zag, events=zag, variants=core, residue=low
- checkbox-tree: props=custom, events=custom, variants=adapter, residue=high
- radio-group: props=zag, events=zag, variants=core, residue=low
- switch: props=zag, events=zag, variants=core, residue=low
- slider: props=zag, events=zag, variants=core, residue=low
- select: props=zag, events=zag, variants=core, residue=low
- select-native: props=custom, events=custom, variants=core, residue=low
- combobox: props=zag, events=zag, variants=core, residue=med
- multiselect: props=custom, events=custom, variants=core, residue=low
- tags-input: props=zag, events=zag, variants=core, residue=low
- datefield: props=custom, events=custom, variants=core, residue=med
- calendar: props=custom, events=custom, variants=core, residue=med
- date-picker: props=custom, events=custom, variants=core, residue=med
- calendar-date-picker: props=placeholder, events=none, variants=missing, residue=high
- fieldset: props=placeholder, events=none, variants=missing, residue=high
- label: props=custom, events=none, variants=core, residue=low

弹层/对话
- dialog: props=zag, events=zag, variants=core, residue=low
- alert-dialog: props=zag, events=zag, variants=core, residue=low
- sheet: props=zag, events=zag, variants=core, residue=low
- toast: props=zag, events=zag, variants=core, residue=low
- tooltip: props=zag, events=zag, variants=core, residue=low

展示/信息
- alert: props=custom, events=none, variants=core, residue=low
- banner: props=placeholder, events=none, variants=core, residue=med
- notification: props=placeholder, events=none, variants=core, residue=med
- avatar: props=zag, events=zag, variants=core, residue=low
- badge: props=custom, events=none, variants=core, residue=low
- breadcrumb: props=placeholder, events=none, variants=core, residue=med
- card: props=placeholder, events=none, variants=core, residue=med
- table: props=placeholder, events=none, variants=core, residue=med
- progress: props=zag, events=zag, variants=core, residue=low
- pagination: props=placeholder, events=none, variants=core, residue=med
- separator: props=custom, events=none, variants=core, residue=low
- timeline: props=custom, events=custom, variants=core, residue=low
- stepper: props=custom, events=custom, variants=core, residue=low
- tree: props=custom, events=custom, variants=core, residue=med
- scroll-area: props=custom, events=none, variants=core, residue=low
- resizable: props=placeholder, events=none, variants=core, residue=med

媒体/文件
- file-upload: props=custom, events=custom, variants=missing, residue=high
- image-cropper: props=placeholder, events=none, variants=core, residue=med

业务扩展
- event-calendar: props=custom, events=custom, variants=missing, residue=high
- navbar: props=placeholder, events=none, variants=core, residue=med
