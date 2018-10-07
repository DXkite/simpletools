import RangeComponent from '../Range'

class LeftLayoutComponent extends RangeComponent {

    get name() {
        return 'align-left';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(range, event) {
        this.editor.exec('justifyleft');
    }
    
    onStatusChange() {
        if (document.queryCommandState('justifyleft')) {
            this._active = true;
            this.editor.$(this.node).addClass('active');
        } else {
            this._active = false;
            this.editor.$(this.node).removeClass('active');
        }
    }
}

export default LeftLayoutComponent