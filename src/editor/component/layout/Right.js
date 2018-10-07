import RangeComponent from '../Range'

class RightLayoutComponent extends RangeComponent {

    get name() {
        return 'align-right';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(range, event) {
        this.editor.exec('justifyright');
    }
}

export default RightLayoutComponent