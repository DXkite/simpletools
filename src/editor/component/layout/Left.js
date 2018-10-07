import RangeComponent from '../Range'

class LeftLayoutComponent extends RangeComponent {

    get name() {
        return 'align-left';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(range, event) {
        this.editor.exec('justifyleft');
    }
}

export default LeftLayoutComponent