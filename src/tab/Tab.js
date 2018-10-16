import $ from '../dom/DomElement'

const n = $.element;

const defaultConfig = {
    target: '#snow-tab', // 对象选择器
    selector: {
        title: '.snow-tab-title',
        titleItem: '.snow-tab-title > li',
        content: '.snow-tab-content',
        contentItem: '.snow-tab-item',
    },
    class: {
        title: 'snow-tab-title',
        titleSmall: 'snow-tab-sm',
        titleItem: null,
        content: 'snow-tab-content',
        contentItem: 'snow-tab-item',
    },
    classOnShow: {
        title: 'snow-tab-current',
        content: 'snow-tab-show',
    }
}

/**
 * target -> get dom -> bind event -> render -> show
 */


function eventBinder() {
    const $btns = this.$btns.elements;
    const $views = this.$views.elements;
    const onshow = this.onshow;
    const onhidden = this.onhidden;
    const config = this.config;
    if (config.current >= 0) {
        this.current = config.current;
        $($views[this.current]).addClass(config.classOnShow.content);
        $($btns[this.current]).addClass(config.classOnShow.title);
    }
    $btns.forEach((btn, index) => {
        $(btn).on('click', () => {
            const current = this.current || 0;
            $($views[current]).removeClass(config.classOnShow.content);
            $($views[index]).addClass(config.classOnShow.content);
            $(btn).addClass(config.classOnShow.title);
            $($btns[current]).removeClass(config.classOnShow.title);
            this.current = index;
            if (onshow instanceof Function) {
                onshow.call(this, index);
            }
            if (onhidden instanceof Function) {
                onhidden.call(this, current);
            }
        });
    });
}

function getTargetChilds() {
    const target = this.config.target;
    this.target = $(target)[0];
    this.$btns = $(this.target).find(this.config.selector.titleItem);
    this.$views = $(this.target).find(this.config.selector.contentItem);
}


function buildTabViews() {
    const config = this.config;
    const btns = config.target.btns;
    const views = config.target.views;
    const vBtns = new Array;
    const vViews = new Array;
    const sm = config.small || false;

    btns.forEach(ele => {
        if (ele instanceof String) {
            ele = document.createTextNode(ele);
        }
        const btn = n('li', { class: config.class.titleItem }, {}, ele);
        vBtns.push(btn);
    });

    views.forEach(ele => {
        if (ele instanceof String) {
            ele = document.createTextNode(ele);
        }
        const view = n('div', { class: config.class.contentItem }, {}, ele);
        vViews.push(view);
    });

    const btnsParent = n('ul', { class: sm ? config.class.title + ' ' + config.class.titleSmall : config.class.title }, {}, vBtns);
    const viewsParent = n('div', { class: config.class.content }, {}, vViews);

    this.target = n('div', {}, {}, [btnsParent, viewsParent]);
    this.$btns = $(vBtns);
    this.$views = $(vViews);
}

/**
 *  Tab 控制器
 *  button某个按钮选中，则contents的对应ID的display为block
 */
class Tab {

    /**
     * 创建对象
     * @param {Object} config 
     */
    constructor(config) {
        this.config = Object.assign(defaultConfig, config);
        if (config.target instanceof Object) {
            buildTabViews.call(this);
        } else {
            getTargetChilds.call(this);
        }
        eventBinder.call(this);
    }
}
export default Tab;