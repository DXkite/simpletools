

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
}

export default ItalicStyleComponent