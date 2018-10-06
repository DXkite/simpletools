import RangeComponent from '../RangeComponent'

class CenterLayoutComponent extends RangeComponent {

    get name() {
        return 'center';
    }

    get view() {
        return '<div title="' + this.name + '">Center</div>';
    }

    onRangeAction(event, range) {
        this.editor.exec('justifycenter');
    }
}

export default CenterLayoutComponent