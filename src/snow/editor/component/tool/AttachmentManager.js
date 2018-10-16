import Component from '../Component'
import Layer from '../../../poplayer/PopLayer'
import $ from '../../../dom/DomElement'
import _getDropFiles from '../../../util/getDropFiles'
import _getPasteFiles from '../../../util/getPasteFiles'
import Attachment from '../Attahment'
import upload from './uploader'
import getSize from '../../../util/getSize'
import SnowEditor from '../../../editor/SnowEditor'
import Tab from '../../../tab/Tab'
import UploadButton from '../../../upload/UploadButton'

const n = $.element;
const _ = SnowEditor._;

function getPasteImage(event) {
    const files = _getPasteFiles(event);
    const images = new Array;
    for (var i = 0; i < files.length; i++) {
        const file = files[i]
        if (/^image\//.test(file.type)) {
            const attachment = new Attachment(file, file.name);
            images.push(attachment);
        }
    }
    return images;
}

function getDropFiles(event) {
    const files = _getDropFiles(event);
    const drop = new Array;
    for (var i = 0; i < files.length; i++) {
        const file = files[i]
        const attachment = new Attachment(file, file.name);
        drop.push(attachment);
    }
    return drop;
}

function attachmentHandler(editor, attachment) {
    upload(editor, attachment.file).then(function (data) {
        attachment.data = data;
        editor.exec('insertHTML', attachment.html);
        editor.addAttachment(attachment);
    });
}

function menuElement(editor, attachment) {
    const layer = this.layer;
    return n('div',
        {
            title: attachment.name,
            class: 'snow-attachment-item',
            onclick: () => {
                editor.exec('insertHTML', attachment.html);
                layer.hide();
            }
        },
        null,
        [
            n('i', {
                class: 'iconfont snow-icon-' + (attachment.isImage ? 'image' : 'attachment'),
            }),
            n('span', null, null, attachment.name)
        ]
    );
}

function getAttachmentList(editor) {
    const attahments = editor.attachment;
    const childs = new Array;
    if (attahments.size <= 0) {
        childs.push(n('div', { class: 'snow-attachment-item' }, null, '暂无文件'));
    } else {
        attahments.forEach(attach => {
            childs.push(menuElement.call(this, editor, attach));
        });
    }
    return childs;
}

/**
 * 附件处理
 */
class AttachmentManager extends Component {

    constructor(editor) {
        super(editor);

        editor.dropEnter = false;

        $(editor.$content).on('paste', event => {
            editor.fire('paste', event);
            getPasteImage(event).forEach(attachment => {
                attachmentHandler(editor, attachment);
            })
        });

        $(editor.$content).on('dragenter', event => {
            event = event || window.event;
            event.preventDefault();
            event.stopPropagation();
            console.log(event.type);
            if (editor.dropEnter === false) {
                editor.dropEnter = true;
                editor.fire('dragenter', event);
            }
        });

        $(editor.$content).on('drop', event => {
            event = event || window.event;
            event.preventDefault();
            event.stopPropagation();
            console.log(event.type);
            editor.dropEnter = false;
            // editor.fire('drop',event);
            getDropFiles(event).forEach(attachment => {
                attachmentHandler(editor, attachment);
            });
        });

        $(editor.$content).on('dragover', event => {
            event = event || window.event;
            event.preventDefault();
            event.stopPropagation();
            // console.log(event.type);
            event.dataTransfer.dropEffect = 'copy';
            if (editor.dropEnter === false) {
                editor.dropEnter = true;
                editor.fire('dragenter', event);
            }
        });

        $(editor.$content).on('dragleave', event => {
            event = event || window.event;
            event.preventDefault();
            event.stopPropagation();
            // console.log(event.type);
            if (event.screenX === 0 && event.screenY === 0) {
                editor.dropEnter = false;
                editor.fire('dragleave', event);
            }
        });

        this.upload = new UploadButton({
            small: true,
            upload: (files) => {
                for (var i = 0; i < files.length; i++) {
                    const file = files[i]
                    const attachment = new Attachment(file, file.name);
                    upload(editor, attachment.file).then((data) => {
                        attachment.data = data;
                        editor.addAttachment(attachment);
                    });
                    this.layer.hide();
                }
            }
        });
    }

    init(node) {
        this.tab = new Tab({ target: { btns: ['文件列表', '上传文件'], views: [getAttachmentList.call(this, this.editor), this.upload.target] }, current: 0, small: true });
        const ele = $.element('div', { class: 'snow-attachment-menu' }, null, this.tab.target);
        this.layer = new Layer(ele, node);
    }

    get name() {
        return 'attachment';
    }

    get view() {
        return '<i class="iconfont snow-icon-' + this.name + '"></i>';
    }

    onStatusChange() {

    }

    onClick(event) {
        this.tab = new Tab({ target: { btns: ['文件列表', '上传文件'], views: [getAttachmentList.call(this, this.editor), this.upload.target] }, current: 0, small: true });
        this.layer.content = $.element('div', { class: 'snow-attachment-menu' }, null, this.tab.target);
        this.layer.show();
    }
}

export default AttachmentManager;