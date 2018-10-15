import Component from '../Component'
import Layer from '../../../poplayer/PopLayer'
import $ from '../../../dom/DomElement'
import TextEmotions from './emotion/Text'
import Tab from '../../../tab/Tab'
const n = $.element;

/**
 * 表情处理
 */
class EmotionComponent extends Component {
    init(node) {
        const buttons = new Array;
        const views = new Array;
        const that = this;
        this.editor.config.emotions.forEach(element => {
            var emotion = null;
            var childs = new Array;
            if (element.type === 'text') {
                emotion = new TextEmotions(element);
            }
            if (emotion) {
                emotion.content.forEach(emotionObj => {
                    const item = $.element('span', {
                        class: 'snow-tool-emotions-item',
                        onclick: function () {
                            editor.exec('insertHTML', emotionObj.html);
                            that.layer.hide();
                        }
                    }, {}, emotionObj.view);
                    childs.push(item);
                });
            }
            const view = n('div', { class: 'snow-emotions-tab-view' }, {}, childs);
            buttons.push(n('div', {}, {}, element.name));
            views.push(view);
        });

        this.tab = new Tab({ target: { btns: buttons, views: views }, current: 0 });
        this.content = n('div', { class: 'snow-emotions-menu' }, {}, this.tab.target);
        this.layer = new Layer(this.content, node);
    }

    get name() {
        return 'emotion';
    }

    get view() {
        return '<i class="iconfont snow-icon-' + this.name + '"></i>';
    }

    onStatusChange() {
        if (this.editor.range) {
            this._active = true;
            this.editor.$(this.node).removeClass('disable');
        } else {
            this._active = false;
            this.editor.$(this.node).addClass('disable');
        }
    }

    onClick(event) {
        this.layer.show();
    }
}

export default EmotionComponent