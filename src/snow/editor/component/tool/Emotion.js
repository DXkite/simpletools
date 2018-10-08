import RangeComponent from '../Range'
import Layer from '../../../poplayer/PopLayer'
import $ from '../../../dom/DomElement'
import TextEmotions from './emotion/Text'


class EmotionComponent extends RangeComponent {
    init(node) {
        var childs = new Array;

        const that = this;
        this.editor.config.emotions.forEach(element => {
            var emotion = null;
            if (element.type === 'text') {
                emotion = new TextEmotions(element);
            }
            if (emotion) {
                emotion.content.forEach(emotionObj => {
                    const item = $.element('span', {
                        class: 'snow-tool-emotions-item',
                        title: emotionObj.title,
                        onclick: function () {
                            editor.exec('insertHTML', emotionObj.html);
                            that.layer.hide();
                        }
                    }, {}, emotionObj.view);
                    childs.push(item);
                });
            }
        });
        const ele = $.element('div', {}, { 'width': '10em', 'display': 'flex', 'flex-wrap': 'wrap' }, childs);
        this.layer = new Layer(ele, node);
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

    onRangeAction(range, event) {
        this.layer.show();
    }
}

export default EmotionComponent