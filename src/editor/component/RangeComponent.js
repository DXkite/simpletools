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
        this.onRangeAction(event, this.editor.getRange());
    }
}

export default RangeComponent