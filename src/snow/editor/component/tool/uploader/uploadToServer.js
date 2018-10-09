import config from '../../../config'

/**
 * 上传文件至服务器
 * @param {SnowEditor} editor 编辑器
 * @param {File} file 上传的文件
 */
export default function uploadToServer(editor, file) {
    return new Promise((resolve, reject) => {
        const hasAdapter = config.upload && config.upload.adapter && config.upload.adapter.server;
        const hasUploader = config.upload && config.upload.uploader;
        if (hasUploader) {

        } else {
            editor.alert('未定义文件上传函数');
        }
    });
}