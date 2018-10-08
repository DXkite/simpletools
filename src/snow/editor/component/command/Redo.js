import Component from '../Component'
class RedoCommandComponent extends Component {

    get name() {
        return 'redo';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onClick(event) {
        this.editor.exec('redo');
    }
}

export default RedoCommandComponent