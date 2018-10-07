import Component from './Component'

class RangeComponent extends Component {

    get name() {
        return 'RangeComponent'
    }

    constructor(editor) {
        super(editor);
    }

    onRangeAction(range) {
        console.log(range);
    }

    onClick(event) {
        if (this.editor.range) {
            this.onRangeAction(this.editor.range, event);
        }
    }
}

export default RangeComponent