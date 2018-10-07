import Component from '../Component'
class UndoCommandComponent extends Component {

    get name() {
        return 'undo';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onClick(event) {
        console.log(document.queryCommandState('undo'));
        this.editor.exec('undo');
        console.log(document.queryCommandState('undo'));
    }
}

export default UndoCommandComponent