

import RangeComponent from '../RangeComponent'

class ItalicStyleComponent extends RangeComponent {

    get name() {
        return 'italic';
    }

    get view() {
        return '<div title="' + this.name + '">Italic</div>';
    }

    onRangeAction(event, range) {
        this.editor.exec('italic');
    }
}

export default ItalicStyleComponent