import Dom from '../dom/DomElement'

let defaultConfig = null;
let components = new Array;
let editorCounter = 0;

const n = Dom.element;

function onStateChange() {
    this.fire('stateChange');
    if (this.components) {
        this.components.forEach(element => {
            element.onStatusChange.call(element);
        });
    }
}

function createEditorView(editor) {
    let element = editor.$element;
    editor.$toolbar = n('div', {
        class: 'snow-toolbar'
    });
    editor.$content = n('div', {
        class: 'snow-content',
        contenteditable: editor.config.editable || true,
        onfocus: function () {
            editor._foucs = true;
            onStateChange.call(editor);
            editor.fire('focus');
        },
        onclick: function () {
            editor._foucs = true;
            onStateChange.call(editor);
            editor.fire('click');
        },
        onkeyup: function () {
            editor.fire('contentChange', editor.content, editor.range);
        },
        onblur: function () {
            editor._foucs = false;
            onStateChange.call(editor);
            editor.fire('blur');
        },
    }, {
            'min-height': editor.config['height']
        },
        element.innerHTML);
    element.innerText = '';
    element.appendChild(editor.$toolbar);
    element.appendChild(editor.$content);
}

function createToolBar(editor) {
    editor.components = new Map;

    var in_array = function (obj, array) {
        for (var index in array) {
            if (array[index] == obj) {
                return true;
            }
        }
        return false;
    }

    if (editor.config.toolbar) {
        const toolbar = editor.config.toolbar;
        components.forEach(function (Comp) {
            let comp = new Comp(editor);
            if (in_array(comp.name, toolbar)) {
                let node = n('div', {
                    class: 'snow-tool-item',
                    name: comp.name,
                    onclick: function (e) {
                        comp.onClick.call(comp, e, this);
                    }
                }, {}, comp.view);
                comp.node = node;
                comp.init.call(comp, node);
                editor.components.set(comp.name, comp);
            }
        });
        toolbar.forEach(function (name) {
            var comp = editor.components.get(name);
            editor.$toolbar.appendChild(comp.node);
        })
    }
}

const commands = {
    // for browser
};


function _exec(name, value) {
    // console.log('_exec', name);
    if (commands[name]) {
        commands[name].apply(this, value);
    } else {
        document.execCommand(name, null, value[0]);
    }
}


class SnowEditor {

    constructor(config) {
        this.config = Object.assign(config, defaultConfig);
        this.$element = document.querySelector(config.target);
        this.listener = {};
        this._foucs = false;
        this.id = editorCounter++;
        this.$ = Dom;
        createEditorView(this);
        createToolBar(this);
    }

    static applyDefaultConfig(config) {
        defaultConfig = config;
    }

    static registerComponent(component) {
        components.push(component);
    }

    get name() {
        return this.config.target;
    }

    get content() {
        return this.$content.innerHTML;
    }

    set content(html) {
        this.$content.innerHTML = html;
    }

    get selectionText() {
        let val = this.range;
        return val ? val.toString() : null;
    }

    get selectionElement() {
        let val = this.range;
        return val ? val.commonAncestorContainer : null;
    }

    get selectionIsEmpty() {
        const range = this.range;
        if (range && range.startContainer) {
            if (range.startContainer === range.endContainer) {
                if (range.startOffset === range.endOffset) {
                    return true
                }
            }
        }
        return false
    }

    get range() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            return selection.getRangeAt(0);
        }
    }

    set range(range) {
        if (range) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    set editable(editable) {
        this.$content.setAttribute('contenteditable', editable);
    }

    get editable() {
        return this.$content.getAttribute('contenteditable') == 'true';
    }

    on(name, callback) {
        let listener = this.listener[name] || new Array;
        listener.push(callback);
        this.listener[name] = listener;
    }

    off(name, callback) {
        if (this.listener[name]) {
            for (var index in this.listener[name]) {
                if (this.listener[name][index] === callback) {
                    this.listener[name].splice(index, 2, this.listener[name][index + 1]);
                }
            }
        }
    }

    fire(name, ...arg) {
        if (this.listener[name]) {
            this.listener[name].forEach(element => {
                element.apply(this, arg);
            });
        }
    }

    exec(name, ...value) {
        _exec.call(this, name, value);
    }
}

export default SnowEditor