import RangeComponent from '../Range'

class BoldStyleComponent extends RangeComponent {
    
    get name() {
        return 'bold';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(range, event) {
        this.editor.exec('bold');
    }

    onStatusChange() {
        if (document.queryCommandState('bold')) {
            this._active = true;
            this.editor.$(this.node).addClass('active');
        } else {
            this._active = false;
            this.editor.$(this.node).removeClass('active');
        }
    }
}

export default BoldStyleComponent