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
        this.$element = n('div', {}, {
            position: 'fixed',
            zIndex : defaultZIndexLevel,
        }, element);
        this.$parent = parent | window;
        
    }

    show() {
    }
    
    hide() {

    }
}

export default PopLayer;
