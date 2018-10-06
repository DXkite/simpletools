

import RangeComponent from '../RangeComponent'

class ItalicStyleComponent extends RangeComponent {

    get name() {
        return 'italic';
    }

    get view() {
        return '<i class="iconfont snow-icon-'+this.name+'"></i>';
    }

    onRangeAction(event, range) {
        this.editor.exec('italic');
    }
}

export default ItalicStyleComponent