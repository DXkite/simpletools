import config from '../../../config'

/**
 * 将文件在本地转换为 Base64
 * @param {SnowEditor} editor 编辑器
 * @param {File} file 上传的文件
 */
export default function uploadToLocal(editor, file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.addEventListener('load', function () {
            const result = { local: true, name: file.name, link: reader.result };
            const hasAdapter = config.upload && config.upload.adapter && config.upload.adapter.local && config.upload.adapter.local.resovle;
            if (hasAdapter) {
                resolve(config.upload.adapter.local.resolve(result));
            } else {
                resolve(result);
            }
        });
    });
}