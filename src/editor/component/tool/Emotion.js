import RangeComponent from '../Range'

class EmotionComponent extends RangeComponent {

    get name() {
        return 'emotion';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(range, event) {
        console.log('emotion',range);
        range.deleteContents();
        var node = document.createElement('span');
        node.innerText = '😀';
        range.insertNode(node);
        range.collapse();
        this.editor.range = range;
    }
}

export default EmotionComponent