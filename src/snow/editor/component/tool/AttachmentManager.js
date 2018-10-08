import RangeComponent from '../Range'
import Layer from '../../../poplayer/PopLayer'
import $ from '../../../dom/DomElement'

/**
 * 表情处理
 */
class AttachmentManager extends RangeComponent {

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