/**
 * 获取拖入的文件（图片或者附件）
 * @param {Event} event 拖拽事件
 */
export default function getDropFiles(event) {
    return  event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files : null;
}