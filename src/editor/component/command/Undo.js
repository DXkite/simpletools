import Component from '../Component'
class UndoCommandComponent extends Component {

    get name() {
        return 'undo';
    }

    get view() {
        return '<div title="' + this.name + '">Undo</div>';
    }

    onClick(event) {
        this.editor.exec('undo');
    }
}

export default UndoCommandComponent