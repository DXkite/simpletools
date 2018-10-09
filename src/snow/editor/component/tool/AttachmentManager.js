import RangeComponent from '../Range'
import Layer from '../../../poplayer/PopLayer'
import $ from '../../../dom/DomElement'
import _getDropFiles from '../../../util/getDropFiles'
import _getPasteFiles from '../../../util/getPasteFiles'
import Attachment from '../Attahment'

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
    const images = new Array;
    for (var i = 0; i < files.length; i++) {
        const file = files[i]
        const attachment = new Attachment(file, file.name);
        images.push(attachment);
    }
    return images;
}

/**
 * 附件处理
 */
class AttachmentManager extends RangeComponent {

    constructor(editor) {
        super(editor);
        $(editor.$content).on('paste', event => {
            console.log('paste file', getPasteImage(event));
        });
        $(window).on('drop', event => {
            event.preventDefault();
            if (event.target === editor.$content) {
                console.log('drop file', getDropFiles(event)[0]);
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