import Component from '../Component'
import Layer from '../../../poplayer/PopLayer'
import $ from '../../../dom/DomElement'

const n = $.element;

 
class LinkComponent extends Component {

    constructor(editor) {
        super(editor);
        const input = n('input', { class: 'snow-input-text snow-link-input', placeholder: '链接地址', type: 'text' });
        const title = n('input', { class: 'snow-input-text snow-link-input', placeholder: '连接说明', type: 'text' });
        this.input = n('div', { class: 'snow-link-inputs' }, {}, [
            title,
            input,
            n('div', { class: 'snow-link-button' }, null, n('div', {
                class: 'snow-btn snow-btn-sm', onclick: () => {
                    const href = $(input).val();
                    const name = $(title).val() || href;
                    if (href) {
                        const html = `<a title="${name}" href="${href}">${name}</a>`;
                        this.editor.exec('insertHTML', html);
                    }
                    this.layer.hide();
                }
            }, null, '插入')),
        ]);
    }

    init(node) {
        this.content = n('div', { class: 'snow-link-menu' }, {}, this.input );
        this.layer = new Layer(this.content, node);
    }

    get name() {
        return 'link';
    }

    get view() {
        return '<i class="iconfont snow-icon-' + this.name + '"></i>';
    }

    onStatusChange() {

    }

    onClick(event) {
        this.layer.show();
    }
}

export default LinkComponent;