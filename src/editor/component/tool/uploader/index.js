import config from '../../../config'
import localAdapter from './uploadToLocal'
import serverAdapter from './uploadToServer'
/**
 * 文件上传接口
 * 
 * @param {SnowEditor} editor 编辑器
 * @param {File} file 上传的文件
 */
export default function uploader(editor, file) {
    const hasUploader = config.upload && config.upload.uploader;
    if (hasUploader) {
        return serverAdapter(editor, file);
    } else {
        return localAdapter(editor, file);
    }
}