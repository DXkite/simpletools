import RangeComponent from '../RangeComponent'

class UnderlineStyleComponent extends RangeComponent {

    get name() {
        return 'underline';
    }

    get view() {
        return '<div title="' + this.name + '">Underline</div>';
    }

    onRangeAction(event, range) {
        this.editor.exec('underline');
    }
}

export default UnderlineStyleComponent