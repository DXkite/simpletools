import RangeComponent from '../Range'
import Layer from '../../../poplayer/PopLayer'
import $ from '../../../dom/DomElement'
import _getDropFiles from '../../../util/getDropFiles'
import _getPasteFiles from '../../../util/getPasteFiles'
import _isChildOf from '../../../util/isChildOf'
import Attachment from '../Attahment'
import upload from './uploader'
import isChildOf from '../../../util/isChildOf'
import getSize from '../../../util/getSize'
import SnowEditor from '../../../editor/SnowEditor'

const n = $.element;
const _ = SnowEditor._;

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

function showDropFilePanel() {
    hideDropFilePanel.call(this);
    const editor = this;
    const size = getSize(this.$content);
    const shade = n('div',
        {
            id: 'snow-' + this.id + '-drop',
            ondrop: (event) => {
                event.preventDefault();
                editor.dropEnter = false;
                hideDropFilePanel.call(editor);
                getDropFiles(event).forEach(attachment => {
                    attachmentHandler(editor, attachment);
                });
            }
        }, {
            position: 'fixed',
            backgroundColor: 'rgba(0,0,0,0.3)',
            textAlign: 'center',
            lineHeight: size.height + 'px',
            top: size.top + 'px',
            left: size.left + 'px',
            height: size.height + 'px',
            width: size.width + 'px',
            color: '#fff',
            fointSize: '2em',
        }, _('拖入文件'));
    this.$content.parentNode.appendChild(shade);
    this.dropElement = shade;
    window.getSelection().removeAllRanges();
    editor.range = null;
}


function hideDropFilePanel() {
    if (this.dropElement) {
        this.$content.parentNode.removeChild(this.dropElement);
        this.dropElement = null;
    }
}


/**
 * 附件处理
 */
class AttachmentManager extends RangeComponent {

    constructor(editor) {
        super(editor);

        editor.dropEnter = false;

        $(editor.$content).on('paste', event => {
            getPasteImage(event).forEach(attachment => {
                attachmentHandler(editor, attachment);
            })
        });

        $(window).on('dragenter', event => {
            event.preventDefault();
            if (editor.dropEnter === false) {
                showDropFilePanel.call(editor);
                editor.dropEnter = true;
            }
        });

        $(window).on('drop', event => {
            // console.log('window', event.type, _getDropFiles(event));
            event.preventDefault();
            hideDropFilePanel.call(editor);
        });

        $(window).on('dragover', event => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            if (editor.dropEnter === false) {
                showDropFilePanel.call(editor);
                editor.dropEnter = true;
            }
        });

        $(window).on('dragleave', event => {
            event.preventDefault();
            if (event.screenX === 0 && event.screenY === 0) {
                // console.log('window', event.type);
                hideDropFilePanel.call(editor);
                editor.dropEnter = false;
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