import RangeComponent from '../Range'

class RightLayoutComponent extends RangeComponent {

    get name() {
        return 'align-right';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(range, event) {
        this.editor.exec('justifyright');
    }

    onStatusChange() {
        if (document.queryCommandState('justifyright')) {
            this._active = true;
            this.editor.$(this.node).addClass('active');
        } else {
            this._active = false;
            this.editor.$(this.node).removeClass('active');
        }
    }
}

export default RightLayoutComponent