import config from '../config'
import $ from '../dom/DomElement'

const defaultZIndexLevel = config.popLayerLevel || 99999;
const n = $.element;

let layerCounter = 0;

function getParentBox() {

}

/**
 * 自动弹出层
 * 检测内容的大小，选择下拉弹出或者浮动弹窗
 */
class PopLayer {

    constructor(element, parent) {
        this.$parent = parent | window;
        this.id = layerCounter++;
        this.$element = n('div', {id: 'pop-layer-' + this.id}, {
            display: 'block',
            position: 'fixed',
            zIndex: defaultZIndexLevel,
        }, element);
    }

    show() {
        if (document.getElementById(this.id)) {
            $(this.$element).css({ 'display': 'block' });
        } else {
            document.getElementsByTagName('body')[0].appendChild(this.$element);
        }
    }

    hide() {
        $(this.$element).css({ 'display': 'none' });
    }
}

export default PopLayer;
