import Component from '../Component'
import Layer from '../../../poplayer/PopLayer'
import $ from '../../../dom/DomElement'
const n = $.element;

/**
 * 图片处理
 */
class ImageComponent extends Component {

    constructor(editor) {
        super(editor);

      
    }

    init(node) {
        this.content = n('div', { class: 'snow-emotions-menu' }, {});
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