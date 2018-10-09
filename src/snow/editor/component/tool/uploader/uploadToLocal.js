import config from '../../../config'

//将文件在本地转换为 Base64
export default function uploadToLocal(file) {
    return new Promise((resolve,reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.addEventListener('load', function () {
            const result = { name: file.name, link: reader.result };
            const hasAdapter = config.upload && config.upload.adapter && config.upload.adapter.local && config.upload.adapter.local.resovle;
            if (hasAdapter) {
                resolve(config.upload.adapter.local.resovle(result));
            } else {
                resovle(result);
            }
        });
    });
}