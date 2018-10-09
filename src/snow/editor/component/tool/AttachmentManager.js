import RangeComponent from '../Range'
import Layer from '../../../poplayer/PopLayer'
import $ from '../../../dom/DomElement'
import _getDropFiles from '../../../util/getDropFiles'
import _getPasteFiles from '../../../util/getPasteFiles'
import Attachment from '../Attahment'
import upload from './uploader'

function getPasteImage(event) {
    const files = _getPasteFiles(event);
    const images = new Array;
    for (var i = 0; i < files.length; i++) {
        const file = files[i].getAsFile()
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
        editor.attachment.push(attachment);
    });
}

/**
 * 附件处理
 */
class AttachmentManager extends RangeComponent {

    constructor(editor) {
        super(editor);
        $(editor.$content).on('paste', event => {
            getPasteImage(event).forEach(attachment => {
                attachmentHandler(editor, attachment);
            })
        });
        $(window).on('drop', event => {
            event.preventDefault();
            if (event.target === editor.$content) {
                getDropFiles(event).forEach(attachment => {
                    attachmentHandler(editor, attachment);
                })
            }
        });
    }

    init(node) {
        const ele = $.element('div', {}, { 'width': '10em', 'display': 'flex', 'flex-wrap': 'wrap' }, '<b>Attachment</b>');
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

    onRangeAction(range, event) {
        this.layer.show();
    }
}

export default AttachmentManager;