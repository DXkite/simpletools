import Component from '../Component'
import Layer from '../../../poplayer/PopLayer'
import $ from '../../../dom/DomElement'
import Tab from '../../../tab/Tab'
import UploadButton from '../../../upload/UploadButton'
import Attachment from '../Attahment'
import upload from './uploader'

const n = $.element;

/**
 * 图片处理
 */
class ImageComponent extends Component {

    constructor(editor) {
        super(editor);
        this.upload = new UploadButton({
            small: true,
            accept: 'image/*',
            upload: (files) => {
                for (var i = 0; i < files.length; i++) {
                    const file = files[i]
                    const attachment = new Attachment(file, file.name);
                    upload(editor, attachment.file).then((data) => {
                        attachment.data = data;
                        editor.addAttachment(attachment);
                        if (attachment.isImage) {
                            editor.exec('insertHTML', attachment.html);
                        }
                    });
                    this.layer.hide();
                }
            }
        });
        const input = n('input', { class: 'snow-input-text snow-image-input', placeholder: '请输入图片地址', type: 'text' });
        const title = n('input', { class: 'snow-input-text snow-image-input', placeholder: '图片说明', type: 'text' });
        this.input = n('div', { class: 'snow-image-inputs' }, {}, [
            title,
            input,
            n('div', { class: 'snow-image-button' }, null, n('div', {
                class: 'snow-btn snow-btn-sm', onclick: () => {
                    const src = $(input).val();
                    const alt = $(title).val() || src;
                    if (src) {
                        editor.exec('insertHTML', `<img title="${alt}"  alt="${alt}" src="${src}"/>`);
                    }
                    this.layer.hide();
                }
            }, null, '插入')),
        ]);
    }

    init(node) {
        this.tab = new Tab({ target: { btns: ['插入图片', '网络图片'], views: [ n('div', { class: 'snow-image-inputs' }, {}, this.upload.target ), this.input] }, current: 0, small: true });
        this.content = n('div', { class: 'snow-image-menu' }, {}, this.tab.target);
        this.layer = new Layer(this.content, node);
    }

    get name() {
        return 'image';
    }

    get view() {
        return '<i class="iconfont snow-icon-' + this.name + '"></i>';
    }

    onStatusChange() {

    }

    onClick(event) {
        this.layer.show();
    }
}

export default ImageComponent;