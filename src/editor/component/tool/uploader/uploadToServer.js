import config from '../../../config'

/**
 * 上传文件至服务器
 * @param {SnowEditor} editor 编辑器
 * @param {File} file 上传的文件
 */
export default function uploadToServer(editor, file) {
    return new Promise((resolve, reject) => {
        const hasAdapter = config.upload && config.upload.adapter && config.upload.adapter.server;
        const uploader = config.upload && config.upload.uploader;
        if (uploader) {
            if (hasAdapter) {
                uploader(file, (data) => {
                    resolve(config.upload.adapter.server.resolve(data));
                }, (data) => {
                    reject(config.upload.adapter.server.reject(data));
                });
            }
            else {
                uploader(file, resolve, reject);
            }
        } else {
            editor.alert('未定义文件上传函数');
        }
    });
}