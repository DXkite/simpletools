import RangeComponent from '../Range'

class CenterLayoutComponent extends RangeComponent {

    get name() {
        return 'align-center';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(range, event) {
        this.editor.exec('justifycenter');
    }
}

export default CenterLayoutComponent