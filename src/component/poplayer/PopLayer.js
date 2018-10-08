import config from '../config'
import getSize from '../util/getSize'
import $ from '../dom/DomElement'
import getPlatform from '../util/getPlatform'

const defaultZIndexLevel = config.popLayerLevel|| 9000;
const n = $.element;
const STR = {
    layerId: 'snow-layer-shade',
    parentSide: 'parentSide',
    windowPop: 'windowPop',
    windowSide: 'windowSide',
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut',
}

let layerCounter = 0;


function getBody() {
    return document.getElementsByTagName('body')[0];
}

function hideElement(defaultDirection) {
    const animationTime = this.animationTime;
    const timeout = animationTime * 1000;
    const showElement = this.showElement;
    if (this.showState === STR.windowSide) {
        $(showElement).css({
            animation: getAnimtion(this.direction, defaultDirection, 'Out') + ' ease ' + animationTime + 's forwards'
        });
    } else if (this.showState === STR.parentSide) {
        $(showElement).css({
            animation: getAnimtion(this.direction, defaultDirection, 'Out') + ' ease ' + animationTime + 's forwards'
        });
    } else if (this.showState === STR.windowPop) {
        $(showElement).css({
            animation: STR.fadeOut + ' ease ' + animationTime + 's forwards'
        });
    }
    if (this.showShade) {
        $(this.showShade).css({ animation: STR.fadeOut + ' ease ' + animationTime + 's forwards' });
    }
    setTimeout(() => {
        getBody().removeChild(showElement);
        if (this.showShade) {
            getBody().removeChild(this.showShade);
        }
    }, timeout);
}

function showElement(defaultDirection, posOfParent, posOfWindow, posOfPop) {

    const initDisplayInWindow = function (showElement) {
        const shade = this.config.shade || true;
        const hideInShadeClick = this.config.shadeClickHide || true;
        const layerPop = this.config.pop || getPlatform() === 'pc';
        const layer = this;
        const animationTime = this.animationTime;
        if (shade) {
            var style = window.getComputedStyle(showElement);
            this.showShade = n('div', {
                id: STR.layerId,
                onclick: () => {
                    if (hideInShadeClick) {
                        layer.hide();
                        $(layer.showShade).css({ display: 'none' });
                    }
                }
            },
                {
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: style.zIndex - 10,
                    animation: STR.fadeIn + ' ease ' + animationTime + 's forwards',
                    backgroundColor: 'rgba(0,0,0,0.4)'
                }
            );
            getBody().appendChild(this.showShade);
        }

        if (layerPop) {
            $(showElement).css(posOfPop).css({
                animation: STR.fadeIn + ' ease ' + animationTime + 's forwards',
            });
            this.showState = STR.windowPop;
        } else {
            $(showElement).css(posOfWindow).css({
                animation: getAnimtion(this.direction, defaultDirection, 'In') + ' ease ' + animationTime + 's forwards',
            });
            this.showState = STR.windowSide;
        }
    }


    const initDisplayAfterParent = function (showElement) {
        const animationTime = this.animationTime;
        this.showState = STR.parentSide;
        this.showShade = null;
        $(showElement).css(posOfParent).css({
            animation: getAnimtion(this.direction, defaultDirection, 'In') + ' ease ' + animationTime + 's forwards',
        });
    }

    const showElement = n('div', { id: 'pop-layer-' + this.id, }, { display: 'block', position: 'fixed', zIndex: defaultZIndexLevel, }, this.$element);
    getBody().appendChild(showElement);
    this.showElement = showElement;
    const size = getSize(this.$parent);
    const eleSize = getSize(showElement);
    const windowSize = getSize(null);
    if (size.left + eleSize.width > windowSize.width) {
        initDisplayInWindow.call(this, showElement, windowSize, eleSize);
    } else {
        initDisplayAfterParent.call(this, showElement, size);
    }
}

const showController = {
    outerBottom: function (elemSize, parentSize, windowSize) {
        const posOfParent = {
            left: parentSize.left + 'px',
            top: (parentSize.top + parentSize.height) + 'px',
        };
        const posOfWindow = {
            left: '0px',
            top: elemSize.height >= windowSize.height ? (windowSize.height * 0.8) + 'px' : null,
            bottom: '0px',
            overflow: 'auto',
            maxHeight: '80%',
            maxWidth: '100%',
            width: '100%',
        };
        const posOfPop = {
            left: elemSize.width >= windowSize.width ? '0px' : (windowSize.width / 2 - elemSize.width / 2) + 'px',
            top: elemSize.height >= windowSize.height ? windowSize.height + 'px' : (windowSize.height / 2 - elemSize.height / 2) + 'px',
            overflow: 'auto',
            maxHeight: '100%',
            maxWidth: '100%',
        };
        showElement.call(this,'Bottom', posOfParent, posOfWindow, posOfPop);
    }
}

const hideController = {
    outerBottom: function () {
        hideElement.call(this,'Bottom');
    }
}

function getAnimtion(name, def, subfix) {
    return 'slide' + (name || def) + subfix;
}


/**
 * 自动弹出层
 * 检测内容的大小，选择下拉弹出或者浮动弹窗
 */
class PopLayer {

    /**
     * 创建一个弹出层
     * 
     * @param {Element} element 显示的元素
     * @param {Element|Window} parent 显示的父元素 
     * @param {Array} config 配置
     */
    constructor(element, parent, config) {
        this.$parent = parent || window;
        this.$element = element;
        this.config = config || { shade: true };
        this.id = layerCounter++;
        this.direction = this.config.direction;
        this.position = 'outerBottom';
    }

    /**
     * 显示
     */
    show() {
        const size = getSize(this.$parent);
        const eleSize = getSize(showElement);
        const windowSize = getSize(null);
        showController[this.position].call(this, eleSize, size, windowSize);
        $(this.showElement).css({ 'display': 'block' });
        if (this.showShade) {
            $(this.showShade).css({ 'display': 'block' });
        }
    }

    /**
     * 获取动画时长
     */
    get animationTime() {
        return this.config.animationTime || .3;
    }

    /**
     * 隐藏
     */
    hide() {
        hideController[this.position].call(this);   
    }
}

export default PopLayer;
