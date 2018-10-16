import $ from '../dom/DomElement'


const n = $.element;

const defaultConfig = {
    target: '#snow-upload', // 对象选择器
    accept: null,
    selector: {
        title: '.snow-upload-title',
        file: 'input[type=file]',
    },
    class: {
        title: 'snow-upload-title',
        titleSmall: 'snow-upload-sm',
        file: 'snow-upload-file',
    }
}

function getChilds() {
    const config = this.config;
    this.file = $(config.selector.file, this.target)[0];
    this.title = $(config.selector.title, this.target)[0];
}

function buildChilds() {
    const config = this.config;
    const sm = config.small || false;
    const accept = config.accept;
    this.title = n('div', { class: sm ? config.class.title + ' ' + config.class.titleSmall : config.class.title }, null, '上传文件');
    this.file = n('input', { class: config.class.file, hidden: true, type: 'file', accept: accept });
    this.target = n('div', null, null, [this.file, this.title]);
}

function binderEvent() {
    const title = this.title;
    const file = this.file;
    const upload = this.config.upload;

    $(title).on('click', (e) => {
        file.click();
    });

    $(file).on('change', () => {
        if (upload) {
            upload.call(this, file.files);
        }
        else {
            console.error('uploader is invalid for config.upload');
        }
    });
}

/**
 * 创建文件上传按钮
 */
class UploadButton {

    /**
     * 创建对象
     * @param {Object} config 
     */
    constructor(config) {
        this.config = {};
        this.config = Object.assign(this.config, defaultConfig, config);
        if (config.target) {
            this.target = $(config.target)[0];
            getChilds.call(this);
        }
        else {
            buildChilds.call(this);
        }
        binderEvent.call(this);
    }
}

export default UploadButton;