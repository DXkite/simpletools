import Component from '../Component'
class RedoCommandComponent extends Component {

    get name() {
        return 'redo';
    }

    get view() {
        return '<div title="' + this.name + '"> Redo</div>';
    }

    onClick(event) {
        this.editor.exec('redo');
    }
}

export default RedoCommandComponent