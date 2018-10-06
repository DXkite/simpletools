import RangeComponent from '../RangeComponent'

class BoldStyleComponent extends RangeComponent {

    get name() {
        return 'bold';
    }

    get view() {
        return '<div title="' + this.name + '">Bold</div>';
    }

    onRangeAction(event, range) {
        this.editor.exec('bold');
    }
}

export default BoldStyleComponent