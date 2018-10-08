import config from '../config'
import getSize from '../util/getSize'
import $ from '../dom/DomElement'

const defaultZIndexLevel = config.popLayerLevel || 99999;
const n = $.element;
const STR = {
    layerId: 'snow-layer-shade'
}
let layerCounter = 0;

function getBody() {
    return document.getElementsByTagName('body')[0];
}

function displayInWindow(windowSize, elemSize) {
    const shade = this.config.shade || true;
    const hideInShadeClick = this.config.shadeClickHide || true;
    const layer = this;

    if (shade) {
        var shadeEle = document.getElementById(STR.layerId);
        if (shadeEle === null && shade) {
            var style = window.getComputedStyle(this.$element);
            var shadeEle = n('div', {
                id: STR.layerId,
                onclick: () => {
                    if (hideInShadeClick) {
                        layer.hide();
                        $(shadeEle).css({ display: 'none' });
                    }
                }
            },
                {
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: style.zIndex - 10,
                    backgroundColor: 'rgba(0,0,0,0.4)'
                }
            );
            getBody().appendChild(shadeEle);
            this.$shadeElem = shadeEle;
        }

        $(this.$element).css({
            left: elemSize.width >= windowSize.width ? '0px' : (windowSize.width / 2 - elemSize.width / 2) + 'px',
            top: elemSize.height >= windowSize.height ? windowSize.height + 'px' : (windowSize.height / 2 - elemSize.height / 2) + 'px',
            overflow: 'auto',
            maxHeight: '100%',
            maxWidth: '100%',
            display: 'block'
        });
    }
}

function displayInParent(size) {
    $(this.$element).css({ 'left': size.left + 'px', 'top': (size.top + size.height) + 'px', 'display': 'block' });
}

function judgeDisplay() {

    if (!document.getElementById(this.id)) {
        getBody().appendChild(this.$element);
    }

    const size = getSize(this.$parent);
    const eleSize = getSize(this.$element);
    const windowSize = getSize(null);

    if (size.left + eleSize.width > windowSize.width) {
        displayInWindow.call(this, windowSize, eleSize);
    } else {
        displayInParent.call(this, size);
    }
}



/**
 * 自动弹出层
 * 检测内容的大小，选择下拉弹出或者浮动弹窗
 */
class PopLayer {

    constructor(element, parent, config) {
        this.$parent = parent || window;
        this.config = config || { shade: true };
        this.id = layerCounter++;
        this.$element = n('div', {
            id: 'pop-layer-' + this.id,
        }, {
                display: 'block',
                position: 'fixed',
                zIndex: defaultZIndexLevel,
            }, element);
    }

    show() {
        if (this.inited) {
            if (this.$shadeElem) {
                $(this.$shadeElem).css({ 'display': 'block' });
            }
            $(this.$element).css({ 'display': 'block' });
        }
        else {
            judgeDisplay.call(this);
            this.inited = true;
        }
    }

    hide() {
        $(this.$element).css({ 'display': 'none' });
        if (this.$shadeElem) {
            $(this.$shadeElem).css({ 'display': 'none' });
        }
    }
}


export default PopLayer;
