import RangeComponent from '../Range'

class BoldStyleComponent extends RangeComponent {

    get name() {
        return 'bold';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(range, event) {
        this.editor.exec('bold');
    }
}

export default BoldStyleComponent