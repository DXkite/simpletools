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

    onStatusChange() {
        if (document.queryCommandState('underline')) {
            this._active = true;
            this.editor.$(this.node).addClass('active');
        } else {
            this._active = false;
            this.editor.$(this.node).removeClass('active');
        }
    }
}

export default UnderlineStyleComponent