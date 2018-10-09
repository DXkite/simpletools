/**
 * 获取粘贴的文件（图片或者附件）
 * @param {Event} event 拖拽事件
 */
export default function getPasteFiles(event) {
    return event.clipboardData && event.clipboardData.files ? event.clipboardData.files : null;
}