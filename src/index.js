import { Template, renderTpl } from './template/index'
// 模板导入
window.dxtpl = new Template();
window.Template = Template;
window.renderTpl = renderTpl;

window.dxui = { version: '1.0' };

// 简单Dom操作
import { Dom } from './dom/index'
window.dxui.dom = Dom

// Toast 功能
import { Toast } from './toast/index'
window.dxui.Toast = Toast;
