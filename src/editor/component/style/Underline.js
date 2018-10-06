import RangeComponent from '../RangeComponent'

class UnderlineStyleComponent extends RangeComponent {

    get name() {
        return 'underline';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(event, range) {
        this.editor.exec('underline');
    }
}

export default UnderlineStyleComponent