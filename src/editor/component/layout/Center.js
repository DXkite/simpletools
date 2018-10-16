import RangeComponent from '../Range'

class CenterLayoutComponent extends RangeComponent {

    get name() {
        return 'align-center';
    }

    get view() {
        return '<i class="iconfont snow-icon-' + this.name + '"></i>';
    }

    onRangeAction(range, event) {
        this.editor.exec('justifycenter');
    }

    onStatusChange() {
        if (document.queryCommandState('justifycenter')) {
            this._active = true;
            this.editor.$(this.node).addClass('active');
        } else {
            this._active = false;
            this.editor.$(this.node).removeClass('active');
        }
    }
}

export default CenterLayoutComponent