import RangeComponent from '../RangeComponent'

class CenterLayoutComponent extends RangeComponent {

    get name() {
        return 'center';
    }

    get view() {
        return '<i class="iconfont se-icon-align-'+this.name+'"></i>';
    }

    onRangeAction(event, range) {
        this.editor.exec('justifycenter');
    }
}

export default CenterLayoutComponent