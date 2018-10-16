import Component from '../Component'
import Layer from '../../../poplayer/PopLayer'
import $ from '../../../dom/DomElement'
import Tab from '../../../tab/Tab'

const n = $.element;

/**
 * 图片处理
 */
class ImageComponent extends Component {

    constructor(editor) {
        super(editor);


    }

    init(node) {

        this.tab = new Tab({ target: { btns: ['上传图片', '网络图片'], views: ['上传一张图片','使用网络图片'] }, current: 0, small: true });
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