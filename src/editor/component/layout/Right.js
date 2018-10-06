import RangeComponent from '../RangeComponent'

class RightLayoutComponent extends RangeComponent {

    get name() {
        return 'right';
    }

    get view() {
        return '<div title="' + this.name + '">Right</div>';
    }

    onRangeAction(event, range) {
        this.editor.exec('justifyright');
    }
}

export default RightLayoutComponent