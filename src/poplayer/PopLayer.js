import getSize from '../util/getSize'
import $ from '../dom/DomElement'
import getPlatform from '../util/getPlatform'
import pointInBox from '../util/pointInBox'
import hover from '../util/onMouseHover'
import timeLimit from '../util/timeLimitCallback'
import getConfig from '../util/getConfig';

const defaultConfig = getConfig('poplayer');
const defaultZIndexLevel = defaultConfig.layerLevel || 9000;

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
    if (showElement === null) {
        return;
    }
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
            animation: getAnimtion(this.direction, defaultDirection, 'Out') + ' ease ' + animationTime + 's forwards'
        });
    }
    if (this.showShade) {
        $(this.showShade).css({ animation: STR.fadeOut + ' ease ' + animationTime + 's forwards' });
    }
    setTimeout(() => {
        this.clear();
    }, timeout);
}

function showElement(defaultDirection, posOfParent, posOfWindow, posOfPop, calcPosOfParent) {
    const showElem = this.showElement;
    const initDisplayInWindow = function (showElem) {
        const shade = this.config.shade || true;
        const hideInShadeClick = this.config.shadeClickHide || true;
        const layerPop = this.config.pop || getPlatform() === 'pc';
        const layer = this;
        const animationTime = this.animationTime;
        if (shade) {

            var style = window.getComputedStyle(showElem);
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
            $(showElem).css(posOfPop).css({
                animation: getAnimtion(this.direction, defaultDirection, 'In') + ' ease ' + animationTime + 's forwards',
            });
            this.showState = STR.windowPop;
        } else {
            $(showElem).css(posOfWindow).css({
                animation: getAnimtion(this.direction, defaultDirection, 'In') + ' ease ' + animationTime + 's forwards',
            });
            this.showState = STR.windowSide;
        }
    }


    const initDisplayAfterParent = function (showElem) {
        const animationTime = this.animationTime;
        this.showState = STR.parentSide;
        this.showShade = null;
        $(showElem).css(posOfParent).css({
            animation: getAnimtion(this.direction, defaultDirection, 'In') + ' ease ' + animationTime + 's forwards',
        });
        $(window).on('resize scroll', timeLimit(function (event) {
            const pos = calcPosOfParent();
            $(showElem).css(pos);
        }).run);
    }

    const size = getSize(this.$parent);
    const elemSize = getSize(showElem);
    const windowSize = getSize(null);
    if (this.config.display == 'parent') {
        initDisplayAfterParent.call(this, showElem, size);
    } else if (this.config.display == 'window') {
        initDisplayInWindow.call(this, showElem, windowSize, elemSize);
    } else {
        if (size.left + elemSize.width > windowSize.width) {
            initDisplayInWindow.call(this, showElem, windowSize, elemSize);
        } else {
            initDisplayAfterParent.call(this, showElem, size);
        }
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
        const calcPosOfParent = () => {
            const ps = getSize(this.$parent);
            return {
                left: ps.left + 'px',
                top: (ps.top + ps.height) + 'px',
            };
        };
        showElement.call(this, 'Bottom', posOfParent, posOfWindow, posOfPop, calcPosOfParent);
    }
}

const hideController = {
    outerBottom: function () {
        hideElement.call(this, 'Bottom');
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
        this.config = Object.assign(config || {}, defaultConfig);
        this.id = layerCounter++;
        this.direction = this.config.direction;
        this.position = 'outerBottom';
        this.showElement = null;
        this.showShade = null;
        this.showed = false;
        this.clickOutListener = null;
    }

    set content(element) {
        this.$element = element;
    }

    get content() {
        return this.$element;
    }

    /**
     * 显示弹出层
     */
    show() {
        this.clear();
        const showElement = n('div', { id: 'pop-layer-' + this.id, }, { display: 'block', position: 'fixed', zIndex: defaultZIndexLevel, }, this.$element);
        getBody().appendChild(showElement);
        this.showElement = showElement;
        const size = getSize(this.$parent);
        const elemSize = getSize(this.$element);
        const windowSize = getSize(null);

        showController[this.position].call(this, elemSize, size, windowSize);
        $(this.showElement).css({ 'display': 'block' });
        this.showed = true;

        if (this.clickOutListener) {
            $(window).off('click', this.clickOutListener);
            this.clickOutListener = null;
        }

        hover(this.showElement, null, () => {
            if (this.clickOutListener == null) {
                this.clickOutListener = (event) => {
                    const x = event.pageX || event.clientX || event.x;
                    const y = event.pageY || event.clientY || event.y;
                    const box = getSize(this.showElement);
                    const point = { x: x, y: y };
                    // 获取正常的事件
                    if (event.isTrusted && !pointInBox(point, box) && this.showed) {
                        this.hide();
                    }
                };
                $(window).on('click', this.clickOutListener);
            }
        });
        if (this.showShade) {
            $(this.showShade).css({ 'display': 'block' });
        }
    }

    /**
     * 清理显示内容
     */
    clear() {
        this.showed = false;
        const body = getBody();
        if (this.showElement) {
            body.removeChild(this.showElement);
            this.showElement = null;
        }
        if (this.showShade) {
            body.removeChild(this.showShade);
            this.showShade = null;
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
        this.showed = false;
    }
}

export default PopLayer;
