import RangeComponent from '../Range'

class UnderlineStyleComponent extends RangeComponent {

    get name() {
        return 'underline';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(range, event) {
        this.editor.exec('underline');
    }
}

export default UnderlineStyleComponent