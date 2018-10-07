import RangeComponent from '../Range'

class EmotionComponent extends RangeComponent {

    get name() {
        return 'emotion';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(range, event) {
        if (!this.editor.selectionIsEmpty) {
            console.log('clear selectionText',this.editor.selectionText);
            this.editor.exec('clear', range);
        }
        this.editor.exec('insertHTML','<span>😀</span>');
    }
}

export default EmotionComponent