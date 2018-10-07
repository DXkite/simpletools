

import RangeComponent from '../Range'

class ItalicStyleComponent extends RangeComponent {

    get name() {
        return 'italic';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(range, event) {
        this.editor.exec('italic');
    }
    onStatusChange() {
        if (document.queryCommandState('italic')) {
            this._active = true;
            this.editor.$(this.node).addClass('active');
        } else {
            this._active = false;
            this.editor.$(this.node).removeClass('active');
        }
    }
}

export default ItalicStyleComponent