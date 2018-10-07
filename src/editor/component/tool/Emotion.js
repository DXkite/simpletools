import RangeComponent from '../Range'

class EmotionComponent extends RangeComponent {

    get name() {
        return 'emotion';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(range, event) {
        this.editor.exec('insertHTML','<span>😀</span>');
    }
}

export default EmotionComponent