import RangeComponent from '../RangeComponent'

class BoldStyleComponent extends RangeComponent {

    get name() {
        return 'bold';
    }

    get view() {
        return '<i class="iconfont se-icon-'+this.name+'"></i>';
    }

    onRangeAction(event, range) {
        this.editor.exec('bold');
    }
}

export default BoldStyleComponent