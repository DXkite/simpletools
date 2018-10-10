import Component from '../Component'
import Layer from '../../../poplayer/PopLayer'
import $ from '../../../dom/DomElement'
import _getDropFiles from '../../../util/getDropFiles'
import _getPasteFiles from '../../../util/getPasteFiles'
import Attachment from '../Attahment'
import upload from './uploader'
import getSize from '../../../util/getSize'
import SnowEditor from '../../../editor/SnowEditor'

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
    attahments.forEach(attach => {
        childs.push(menuElement.call(this, editor, attach));
    })
    const ele = $.element('div', { class: 'snow-attachment-menu' }, null, childs.length <= 0 ? '<div class="snow-attachment-item">' + _('没有附件') + '</div>' : childs);
    return ele;
}

/**
 * 附件处理
 */
class AttachmentManager extends Component {

    constructor(editor) {
        super(editor);

        editor.dropEnter = false;

        $(editor.$content).on('paste', event => {
            editor.fire('paste',event);
            getPasteImage(event).forEach(attachment => {
                attachmentHandler(editor, attachment);
            })
        });

        $(window).on('dragenter', event => {
            event.preventDefault();
            if (editor.dropEnter === false) {
                editor.dropEnter = true;
                editor.fire('dragenter',event);
            }
        });

        $(window).on('drop', event => {
            event.preventDefault();
            editor.dropEnter = false;
            editor.fire('drop',event);
            getDropFiles(event).forEach(attachment => {
                attachmentHandler(editor, attachment);
            });
        });

        $(window).on('dragover', event => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            if (editor.dropEnter === false) {
                editor.dropEnter = true;
                editor.fire('dragenter',event);
            }
        });

        $(window).on('dragleave', event => {
            event.preventDefault();
            if (event.screenX === 0 && event.screenY === 0) {
                editor.dropEnter = false;
                editor.fire('dragleave',event);
            }
        });
    }

    init(node) {
        this.layer = new Layer(getAttachmentList.call(this, this.editor), node);
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
        this.layer.content = getAttachmentList.call(this, this.editor);
        this.layer.show();
    }
}

export default AttachmentManager;