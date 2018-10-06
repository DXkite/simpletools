import RangeComponent from '../RangeComponent'

class RightLayoutComponent extends RangeComponent {

    get name() {
        return 'right';
    }

    get view() {
        return '<i class="iconfont se-icon-align-'+this.name+'"></i>';
    }

    onRangeAction(event, range) {
        this.editor.exec('justifyright');
    }
}

export default RightLayoutComponent