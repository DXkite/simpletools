import Component from '../Component'
class RedoCommandComponent extends Component {

    get name() {
        return 'redo';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onClick(event) {
        console.log(document.queryCommandState('redo'));
        this.editor.exec('redo');
        console.log(document.queryCommandState('redo'));
    }
}

export default RedoCommandComponent