import RangeComponent from '../RangeComponent'

class LeftLayoutComponent extends RangeComponent {

    get name() {
        return 'left';
    }

    get view() {
        return '<div title="' + this.name + '">Left</div>';
    }

    onRangeAction(event, range) {
        this.editor.exec('justifyleft');
    }
}

export default LeftLayoutComponent