import RangeComponent from '../RangeComponent'

class LeftLayoutComponent extends RangeComponent {

    get name() {
        return 'left';
    }

    get view() {
        return '<i class="iconfont se-icon-align-'+this.name+'"></i>';
    }

    onRangeAction(event, range) {
        this.editor.exec('justifyleft');
    }
}

export default LeftLayoutComponent