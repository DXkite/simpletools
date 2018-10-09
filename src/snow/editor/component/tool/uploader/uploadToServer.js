import config from '../../../config'

//将文件在本地转换为 Base64
export default function uploadToLocal(file) {
    return new Promise((resolve, reject) => {
        const hasAdapter = config.upload && config.upload.adapter && config.upload.adapter.server;
        const hasUploader = config.upload && config.upload.uploader;
        if (hasAdapter) {

        } else {
            
        }
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.addEventListener('load', function () {
            const result = { name: file.name, link: reader.result };

            if (hasAdapter) {
                resolve(config.upload.adapter.local.resovle(result));
            } else {
                resovle(result);
            }
        });
    });
}