/*! snow by dxkite 2018-12-02 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _isArray = require('../util/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _fixCssPrefix = require('../util/fixCssPrefix');

var _fixCssPrefix2 = _interopRequireDefault(_fixCssPrefix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DomElement = function DomElement(selecter, context) {
    return new DomElement.constructor(selecter, context);
};

DomElement.constructor = function (selecter, context) {
    if (typeof selecter === 'string') {
        this.elements = (context || document).querySelectorAll(selecter);
    } else if (selecter instanceof DomElement) {
        return selecter;
    } else if (selecter instanceof Element) {
        this.elements = [selecter];
    } else if (selecter instanceof Array) {
        this.elements = selecter;
    } else if (selecter instanceof Object) {
        this.elements = [selecter];
    } else {
        console.error('DomElement:selector is invalid value:', selecter);
        return this;
    }
    this.context = context;
    this.length = this.elements.length;
    for (var i = 0; i < this.length; i++) {
        this[i] = this.elements[i];
    }
    return this;
};

DomElement.extend = function (methods) {
    for (var name in methods) {
        this[name] = methods[name];
    }
};

function createElementFromString(html) {
    var ele = document.createElement('div');
    ele.innerHTML = html;
    return ele.firstChild;
}

DomElement.extend({
    element: function element(tag, attr, css, childs) {
        var element = tag.indexOf('<') === -1 ? document.createElement(tag) : createElementFromString(tag);
        DomElement(element).attr(attr).css(css);
        if ((0, _isArray2.default)(childs)) {
            for (var name in childs) {
                element.appendChild(childs[name]);
            }
        } else if (childs instanceof Element) {
            element.appendChild(childs);
        } else if (childs !== undefined) {
            element.innerHTML = childs;
        }
        return element;
    }
});

function eventOn(element, type, callback, useCaptrue) {
    var captrue = useCaptrue === undefined ? false : useCaptrue;
    if ('addEventListener' in window) {
        element.addEventListener(type, callback, captrue);
    } else {
        element.attachEvent('on' + type, callback);
    }
}

function eventOff(element, type, callback, useCaptrue) {
    var captrue = useCaptrue === undefined ? false : useCaptrue;
    if ('removeEventListener' in window) {
        element.removeEventListener(type, callback, captrue);
    } else {
        element.detachEvent('on' + type, callback);
    }
}

DomElement.method = DomElement.constructor.prototype;
DomElement.method.extend = DomElement.extend;
// 属性方法
DomElement.method.extend({
    attr: function attr(attrs) {
        this.each(function () {
            if (attrs) {
                for (var name in attrs) {
                    if (attrs[name]) {
                        if (/^on/.test(name)) {
                            var type = name.replace(/^on(.+)$/, '$1');
                            if (/[A-Z]/.test(type[0])) {
                                type = type[0].toLowerCase() + type.substr(1);
                            }
                            eventOn(this, type, attrs[name]);
                        } else {
                            this.setAttribute(name, attrs[name]);
                        }
                    } else {
                        this.removeAttribute(name);
                    }
                }
            }
        });
        return this;
    },
    css: function css(cssObj) {
        this.each(function () {
            if (cssObj) {
                for (var name in cssObj) {
                    this.style[(0, _fixCssPrefix2.default)(name)] = cssObj[name];
                }
            }
        });
        return this;
    },
    addClass: function addClass(add) {
        this.each(function () {
            if (add) {
                var get = this.getAttribute('class');
                if (get) {
                    if (!get.match(new RegExp(add))) {
                        this.setAttribute('class', get + ' ' + add);
                    }
                } else {
                    this.setAttribute('class', add);
                }
            }
        });
        return this;
    },
    removeClass: function removeClass(remove) {
        this.each(function () {
            var get = this.getAttribute('class');
            if (get) {
                var oldClass = get.split(/\s+/);
                var newClass = oldClass.filter(function (element) {
                    return element !== remove;
                });
                if (newClass.length > 0) {
                    this.setAttribute('class', newClass.join(' '));
                } else {
                    this.removeAttribute('class');
                }
            }
        });
        return this;
    },
    each: function each(callback) {
        for (var i = 0; i < this.length; i++) {
            callback.call(this[i], this[i], i);
        }
        return this;
    },
    on: function on(type, listener, useCaptrue) {
        var _this = this;

        type.split(/\s+/).forEach(function (subtype) {
            _this.each(function () {
                eventOn(this, subtype, listener, useCaptrue);
            });
        });
        return this;
    },
    off: function off(type, listener, useCaptrue) {
        var _this2 = this;

        type.split(/\s+/).forEach(function (subtype) {
            _this2.each(function () {
                eventOff(this, subtype, listener, useCaptrue);
            });
        });
        return this;
    },
    find: function find(selecter) {
        return DomElement(selecter, this[0]);
    },
    val: function val() {
        return this[0].value;
    }
});

exports.default = DomElement;

},{"../util/fixCssPrefix":37,"../util/isArray":45}],2:[function(require,module,exports){
'use strict';

var _DomElement = require('./DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.snow = window.snow || {};
window.snow.DomElement = _DomElement2.default;

},{"./DomElement":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DomElement = require('../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _printf = require('../util/printf');

var _printf2 = _interopRequireDefault(_printf);

var _Toast = require('../toast/Toast');

var _Toast2 = _interopRequireDefault(_Toast);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _isChildOf2 = require('../util/isChildOf');

var _isChildOf3 = _interopRequireDefault(_isChildOf2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfig = _config2.default;
var components = new Array();
var editorCounter = 0;

var n = _DomElement2.default.element;

function onStateChange() {
    this.fire('stateChange');
    if (this.components) {
        this.components.forEach(function (element) {
            element.onStatusChange.call(element);
        });
    }
}

function createEditorView(editor) {
    var element = editor.$element;
    editor.$toolbar = n('div', {
        class: 'snow-toolbar'
    });
    editor.$content = n('div', {
        class: 'snow-content',
        contenteditable: editor.config.editable || true,
        onfocus: function onfocus() {
            editor._foucs = true;
            // editor.range = editor.range;
            // console.log(editor._range);
            onStateChange.call(editor);
            editor.fire('focus');
        },
        onclick: function onclick() {
            editor._foucs = true;
            // editor.range = editor.range || editor._range;
            onStateChange.call(editor);
            editor.fire('click');
        },
        onkeyup: function onkeyup() {
            editor.fire('contentChange', editor.content, editor.range);
        },
        onblur: function onblur() {
            editor._foucs = false;
            editor.range = editor.getCurrentRange();
            // console.log(editor.range);
            onStateChange.call(editor);
            editor.fire('blur');
        }
    }, {
        'min-height': editor.config['height']
    }, element.innerHTML);
    (0, _DomElement2.default)(element).attr({ class: 'snow-editor-container' });
    element.innerText = '';
    element.appendChild(editor.$toolbar);
    element.appendChild(editor.$content);
}

function createToolBar(editor) {
    editor.components = new Map();

    var in_array = function in_array(obj, array) {
        for (var index in array) {
            if (array[index] == obj) {
                return true;
            }
        }
        return false;
    };

    if (editor.config.toolbar) {
        var toolbar = editor.config.toolbar;
        components.forEach(function (Comp) {
            var comp = new Comp(editor);
            if (in_array(comp.name, toolbar)) {
                var node = n('div', {
                    class: 'snow-tool-item',
                    name: comp.name,
                    onclick: function onclick(e) {
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
        });
    }
}

var commands = {
    insertHTML: function insertHTML(value) {
        if (this.range) {
            this.setCurrentRange(this.range);
            document.execCommand('insertHTML', null, value);
        } else {
            this.setCurrentRange(this.createDefaultRange());
            document.execCommand('insertHTML', null, '<div>' + value + '</div>');
        }
    }
};

function _exec(name, value) {
    if (commands[name]) {
        commands[name].apply(this, value);
    } else {
        document.execCommand(name, null, value[0]);
    }
}

var SnowEditor = function () {
    function SnowEditor(config) {
        _classCallCheck(this, SnowEditor);

        this.config = Object.assign(config, defaultConfig);
        this.$element = document.querySelector(config.target);
        this.listener = {};
        this._foucs = false;
        this._range = false;
        this.id = editorCounter++;
        this.$ = _DomElement2.default;
        this.attachment = new Map();
        createEditorView(this);
        createToolBar(this);
    }

    _createClass(SnowEditor, [{
        key: 'createDefaultRange',
        value: function createDefaultRange() {
            var defaultRange = document.createRange();
            defaultRange.setStart(this.$content, this.$content.childNodes.length);
            return defaultRange;
        }
    }, {
        key: 'getCurrentRange',
        value: function getCurrentRange() {
            var selection = window.getSelection();
            if (selection.rangeCount > 0) {
                // console.log(selection.rangeCount);
                var range = selection.getRangeAt(0);
                if ((0, _isChildOf3.default)(range.commonAncestorContainer, this.$element)) {
                    return range;
                }
            }
        }
    }, {
        key: 'setCurrentRange',
        value: function setCurrentRange(range) {
            if (range) {
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }, {
        key: 'addAttachment',
        value: function addAttachment(attachment) {
            this.attachment.set(attachment.name, attachment);
        }
    }, {
        key: 'on',
        value: function on(name, callback) {
            var listener = this.listener[name] || new Array();
            listener.push(callback);
            this.listener[name] = listener;
        }
    }, {
        key: 'off',
        value: function off(name, callback) {
            if (this.listener[name]) {
                for (var index in this.listener[name]) {
                    if (this.listener[name][index] === callback) {
                        this.listener[name].splice(index, 2, this.listener[name][index + 1]);
                    }
                }
            }
        }
    }, {
        key: 'fire',
        value: function fire(name) {
            var _this = this;

            for (var _len = arguments.length, arg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                arg[_key - 1] = arguments[_key];
            }

            if (this.listener[name]) {
                this.listener[name].forEach(function (element) {
                    element.apply(_this, arg);
                });
            }
        }
    }, {
        key: 'exec',
        value: function exec(name) {
            for (var _len2 = arguments.length, value = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                value[_key2 - 1] = arguments[_key2];
            }

            _exec.call(this, name, value);
        }
    }, {
        key: 'alert',
        value: function alert(message) {
            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
            }

            (0, _Toast2.default)(SnowEditor._.apply(SnowEditor, [message].concat(args)));
        }
    }, {
        key: 'name',
        get: function get() {
            return this.config.target;
        }
    }, {
        key: 'content',
        get: function get() {
            return this.$content.innerHTML;
        },
        set: function set(html) {
            this.$content.innerHTML = html;
        }
    }, {
        key: 'selectionText',
        get: function get() {
            var val = this.range;
            return val ? val.toString() : null;
        }
    }, {
        key: 'selectionElement',
        get: function get() {
            var val = this.range;
            return val ? val.commonAncestorContainer : null;
        }
    }, {
        key: 'selectionIsEmpty',
        get: function get() {
            var range = this.range;
            if (range && range.startContainer) {
                if (range.startContainer === range.endContainer) {
                    if (range.startOffset === range.endOffset) {
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        key: 'range',
        get: function get() {
            return this._range;
        },
        set: function set(range) {
            this._range = range;
        }
    }, {
        key: 'editable',
        set: function set(editable) {
            this.$content.setAttribute('contenteditable', editable);
        },
        get: function get() {
            return this.$content.getAttribute('contenteditable') == 'true';
        }
    }], [{
        key: 'applyDefaultConfig',
        value: function applyDefaultConfig(config) {
            defaultConfig = config;
        }
    }, {
        key: 'registerComponent',
        value: function registerComponent(component) {
            components.push(component);
        }
    }, {
        key: '_',
        value: function _(str) {
            var langs = defaultConfig.language && defaultConfig.language.str || [];
            var local = defaultConfig.language && defaultConfig.language.local || 'zh-CN';
            var output = langs[local] || str;

            for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                args[_key4 - 1] = arguments[_key4];
            }

            return _printf2.default.apply(undefined, [output].concat(args));
        }
    }]);

    return SnowEditor;
}();

exports.default = SnowEditor;

},{"../dom/DomElement":1,"../toast/Toast":33,"../util/isChildOf":46,"../util/printf":49,"./config":24}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Attachment = function () {
    function Attachment(file, name) {
        _classCallCheck(this, Attachment);

        this.name = name;
        this.file = file;
        this.data = null;
    }

    _createClass(Attachment, [{
        key: "upload",
        value: function upload() {}
    }, {
        key: "isImage",
        get: function get() {
            return (/^image\//.test(this.file.type)
            );
        }
    }, {
        key: "local",
        get: function get() {
            return this.data.local || true;
        }
    }, {
        key: "html",
        get: function get() {
            var data = this.data;
            if (this.isImage) {
                return "<img title=\"" + data.name + "\" attachment-id=\"" + data.name + "\" alt=\"" + data.name + "\" src=\"" + data.link + "\">";
            } else {
                return "<a title=\"" + data.name + "\" attachment-id=\"" + data.name + "\" href=\"" + data.link + "\">" + data.name + "</a>";
            }
        }
    }]);

    return Attachment;
}();

exports.default = Attachment;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {
    function Component(editor) {
        _classCallCheck(this, Component);

        this.editor = editor;
    }

    _createClass(Component, [{
        key: 'init',
        value: function init(node) {}
    }, {
        key: 'onClick',
        value: function onClick(event) {}
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {}
    }, {
        key: 'name',
        get: function get() {
            return 'Component';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<div title="Component">Component</div>';
        }
    }, {
        key: 'node',
        set: function set(ele) {
            this.$element = ele;
        },
        get: function get() {
            return this.$element;
        }
    }]);

    return Component;
}();

exports.default = Component;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RangeComponent = function (_Component) {
    _inherits(RangeComponent, _Component);

    _createClass(RangeComponent, [{
        key: 'name',
        get: function get() {
            return 'RangeComponent';
        }
    }]);

    function RangeComponent(editor) {
        _classCallCheck(this, RangeComponent);

        return _possibleConstructorReturn(this, (RangeComponent.__proto__ || Object.getPrototypeOf(RangeComponent)).call(this, editor));
    }

    _createClass(RangeComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range) {
            console.log(range);
        }
    }, {
        key: 'onClick',
        value: function onClick(event) {
            if (this.editor.range) {
                this.onRangeAction(this.editor.range, event);
            }
        }
    }]);

    return RangeComponent;
}(_Component3.default);

exports.default = RangeComponent;

},{"./Component":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RedoCommandComponent = function (_Component) {
    _inherits(RedoCommandComponent, _Component);

    function RedoCommandComponent() {
        _classCallCheck(this, RedoCommandComponent);

        return _possibleConstructorReturn(this, (RedoCommandComponent.__proto__ || Object.getPrototypeOf(RedoCommandComponent)).apply(this, arguments));
    }

    _createClass(RedoCommandComponent, [{
        key: 'onClick',
        value: function onClick(event) {
            this.editor.exec('redo');
        }
    }, {
        key: 'name',
        get: function get() {
            return 'redo';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return RedoCommandComponent;
}(_Component3.default);

exports.default = RedoCommandComponent;

},{"../Component":5}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UndoCommandComponent = function (_Component) {
    _inherits(UndoCommandComponent, _Component);

    function UndoCommandComponent() {
        _classCallCheck(this, UndoCommandComponent);

        return _possibleConstructorReturn(this, (UndoCommandComponent.__proto__ || Object.getPrototypeOf(UndoCommandComponent)).apply(this, arguments));
    }

    _createClass(UndoCommandComponent, [{
        key: 'onClick',
        value: function onClick(event) {
            this.editor.exec('undo');
        }
    }, {
        key: 'name',
        get: function get() {
            return 'undo';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return UndoCommandComponent;
}(_Component3.default);

exports.default = UndoCommandComponent;

},{"../Component":5}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CenterLayoutComponent = function (_RangeComponent) {
    _inherits(CenterLayoutComponent, _RangeComponent);

    function CenterLayoutComponent() {
        _classCallCheck(this, CenterLayoutComponent);

        return _possibleConstructorReturn(this, (CenterLayoutComponent.__proto__ || Object.getPrototypeOf(CenterLayoutComponent)).apply(this, arguments));
    }

    _createClass(CenterLayoutComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
            this.editor.exec('justifycenter');
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (document.queryCommandState('justifycenter')) {
                this._active = true;
                this.editor.$(this.node).addClass('active');
            } else {
                this._active = false;
                this.editor.$(this.node).removeClass('active');
            }
        }
    }, {
        key: 'name',
        get: function get() {
            return 'align-center';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return CenterLayoutComponent;
}(_Range2.default);

exports.default = CenterLayoutComponent;

},{"../Range":6}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LeftLayoutComponent = function (_RangeComponent) {
    _inherits(LeftLayoutComponent, _RangeComponent);

    function LeftLayoutComponent() {
        _classCallCheck(this, LeftLayoutComponent);

        return _possibleConstructorReturn(this, (LeftLayoutComponent.__proto__ || Object.getPrototypeOf(LeftLayoutComponent)).apply(this, arguments));
    }

    _createClass(LeftLayoutComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
            this.editor.exec('justifyleft');
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (document.queryCommandState('justifyleft')) {
                this._active = true;
                this.editor.$(this.node).addClass('active');
            } else {
                this._active = false;
                this.editor.$(this.node).removeClass('active');
            }
        }
    }, {
        key: 'name',
        get: function get() {
            return 'align-left';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return LeftLayoutComponent;
}(_Range2.default);

exports.default = LeftLayoutComponent;

},{"../Range":6}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RightLayoutComponent = function (_RangeComponent) {
    _inherits(RightLayoutComponent, _RangeComponent);

    function RightLayoutComponent() {
        _classCallCheck(this, RightLayoutComponent);

        return _possibleConstructorReturn(this, (RightLayoutComponent.__proto__ || Object.getPrototypeOf(RightLayoutComponent)).apply(this, arguments));
    }

    _createClass(RightLayoutComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
            this.editor.exec('justifyright');
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (document.queryCommandState('justifyright')) {
                this._active = true;
                this.editor.$(this.node).addClass('active');
            } else {
                this._active = false;
                this.editor.$(this.node).removeClass('active');
            }
        }
    }, {
        key: 'name',
        get: function get() {
            return 'align-right';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return RightLayoutComponent;
}(_Range2.default);

exports.default = RightLayoutComponent;

},{"../Range":6}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BoldStyleComponent = function (_RangeComponent) {
    _inherits(BoldStyleComponent, _RangeComponent);

    function BoldStyleComponent() {
        _classCallCheck(this, BoldStyleComponent);

        return _possibleConstructorReturn(this, (BoldStyleComponent.__proto__ || Object.getPrototypeOf(BoldStyleComponent)).apply(this, arguments));
    }

    _createClass(BoldStyleComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
            this.editor.exec('bold');
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (document.queryCommandState('bold')) {
                this._active = true;
                this.editor.$(this.node).addClass('active');
            } else {
                this._active = false;
                this.editor.$(this.node).removeClass('active');
            }
        }
    }, {
        key: 'name',
        get: function get() {
            return 'bold';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return BoldStyleComponent;
}(_Range2.default);

exports.default = BoldStyleComponent;

},{"../Range":6}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ItalicStyleComponent = function (_RangeComponent) {
    _inherits(ItalicStyleComponent, _RangeComponent);

    function ItalicStyleComponent() {
        _classCallCheck(this, ItalicStyleComponent);

        return _possibleConstructorReturn(this, (ItalicStyleComponent.__proto__ || Object.getPrototypeOf(ItalicStyleComponent)).apply(this, arguments));
    }

    _createClass(ItalicStyleComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
            this.editor.exec('italic');
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (document.queryCommandState('italic')) {
                this._active = true;
                this.editor.$(this.node).addClass('active');
            } else {
                this._active = false;
                this.editor.$(this.node).removeClass('active');
            }
        }
    }, {
        key: 'name',
        get: function get() {
            return 'italic';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return ItalicStyleComponent;
}(_Range2.default);

exports.default = ItalicStyleComponent;

},{"../Range":6}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UnderlineStyleComponent = function (_RangeComponent) {
    _inherits(UnderlineStyleComponent, _RangeComponent);

    function UnderlineStyleComponent() {
        _classCallCheck(this, UnderlineStyleComponent);

        return _possibleConstructorReturn(this, (UnderlineStyleComponent.__proto__ || Object.getPrototypeOf(UnderlineStyleComponent)).apply(this, arguments));
    }

    _createClass(UnderlineStyleComponent, [{
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
            this.editor.exec('underline');
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (document.queryCommandState('underline')) {
                this._active = true;
                this.editor.$(this.node).addClass('active');
            } else {
                this._active = false;
                this.editor.$(this.node).removeClass('active');
            }
        }
    }, {
        key: 'name',
        get: function get() {
            return 'underline';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return UnderlineStyleComponent;
}(_Range2.default);

exports.default = UnderlineStyleComponent;

},{"../Range":6}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

var _PopLayer = require('../../../poplayer/PopLayer');

var _PopLayer2 = _interopRequireDefault(_PopLayer);

var _DomElement = require('../../../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _getDropFiles2 = require('../../../util/getDropFiles');

var _getDropFiles3 = _interopRequireDefault(_getDropFiles2);

var _getPasteFiles2 = require('../../../util/getPasteFiles');

var _getPasteFiles3 = _interopRequireDefault(_getPasteFiles2);

var _Attahment = require('../Attahment');

var _Attahment2 = _interopRequireDefault(_Attahment);

var _uploader = require('./uploader');

var _uploader2 = _interopRequireDefault(_uploader);

var _getSize = require('../../../util/getSize');

var _getSize2 = _interopRequireDefault(_getSize);

var _SnowEditor = require('../../../editor/SnowEditor');

var _SnowEditor2 = _interopRequireDefault(_SnowEditor);

var _Tab = require('../../../tab/Tab');

var _Tab2 = _interopRequireDefault(_Tab);

var _UploadButton = require('../../../upload/UploadButton');

var _UploadButton2 = _interopRequireDefault(_UploadButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var n = _DomElement2.default.element;
var _ = _SnowEditor2.default._;

function getPasteImage(event) {
    var files = (0, _getPasteFiles3.default)(event);
    var images = new Array();
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (/^image\//.test(file.type)) {
            var attachment = new _Attahment2.default(file, file.name);
            images.push(attachment);
        }
    }
    return images;
}

function getDropFiles(event) {
    var files = (0, _getDropFiles3.default)(event);
    var drop = new Array();
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var attachment = new _Attahment2.default(file, file.name);
        drop.push(attachment);
    }
    return drop;
}

function attachmentHandler(editor, attachment) {
    (0, _uploader2.default)(editor, attachment.file).then(function (data) {
        attachment.data = data;
        editor.exec('insertHTML', attachment.html);
        editor.addAttachment(attachment);
    });
}

function menuElement(editor, attachment) {
    var layer = this.layer;
    return n('div', {
        title: attachment.name,
        class: 'snow-attachment-item',
        onclick: function onclick() {
            editor.exec('insertHTML', attachment.html);
            layer.hide();
        }
    }, null, [n('i', {
        class: 'iconfont snow-icon-' + (attachment.isImage ? 'image' : 'attachment')
    }), n('span', null, null, attachment.name)]);
}

function getAttachmentList(editor) {
    var _this = this;

    var attahments = editor.attachment;
    var childs = new Array();
    if (attahments.size <= 0) {
        childs.push(n('div', { class: 'snow-attachment-item' }, null, '暂无文件'));
    } else {
        attahments.forEach(function (attach) {
            childs.push(menuElement.call(_this, editor, attach));
        });
    }
    return childs;
}

/**
 * 附件处理
 */

var AttachmentManager = function (_Component) {
    _inherits(AttachmentManager, _Component);

    function AttachmentManager(editor) {
        _classCallCheck(this, AttachmentManager);

        var _this2 = _possibleConstructorReturn(this, (AttachmentManager.__proto__ || Object.getPrototypeOf(AttachmentManager)).call(this, editor));

        editor.dropEnter = false;

        (0, _DomElement2.default)(editor.$content).on('paste', function (event) {
            editor.fire('paste', event);
            getPasteImage(event).forEach(function (attachment) {
                attachmentHandler(editor, attachment);
            });
        });

        (0, _DomElement2.default)(editor.$content).on('dragenter', function (event) {
            event = event || window.event;
            event.preventDefault();
            event.stopPropagation();
            console.log(event.type);
            if (editor.dropEnter === false) {
                editor.dropEnter = true;
                editor.fire('dragenter', event);
            }
        });

        (0, _DomElement2.default)(editor.$content).on('drop', function (event) {
            event = event || window.event;
            event.preventDefault();
            event.stopPropagation();
            console.log(event.type);
            editor.dropEnter = false;
            // editor.fire('drop',event);
            getDropFiles(event).forEach(function (attachment) {
                attachmentHandler(editor, attachment);
            });
        });

        (0, _DomElement2.default)(editor.$content).on('dragover', function (event) {
            event = event || window.event;
            event.preventDefault();
            event.stopPropagation();
            // console.log(event.type);
            event.dataTransfer.dropEffect = 'copy';
            if (editor.dropEnter === false) {
                editor.dropEnter = true;
                editor.fire('dragenter', event);
            }
        });

        (0, _DomElement2.default)(editor.$content).on('dragleave', function (event) {
            event = event || window.event;
            event.preventDefault();
            event.stopPropagation();
            // console.log(event.type);
            if (event.screenX === 0 && event.screenY === 0) {
                editor.dropEnter = false;
                editor.fire('dragleave', event);
            }
        });

        _this2.upload = new _UploadButton2.default({
            small: true,
            upload: function upload(files) {
                var _loop = function _loop() {
                    var file = files[i];
                    var attachment = new _Attahment2.default(file, file.name);
                    (0, _uploader2.default)(editor, attachment.file).then(function (data) {
                        attachment.data = data;
                        editor.addAttachment(attachment);
                    });
                    _this2.layer.hide();
                };

                for (var i = 0; i < files.length; i++) {
                    _loop();
                }
            }
        });
        return _this2;
    }

    _createClass(AttachmentManager, [{
        key: 'init',
        value: function init(node) {
            this.tab = new _Tab2.default({ target: { btns: ['文件列表', '上传文件'], views: [getAttachmentList.call(this, this.editor), this.upload.target] }, current: 0, small: true });
            var ele = _DomElement2.default.element('div', { class: 'snow-attachment-menu' }, null, this.tab.target);
            this.layer = new _PopLayer2.default(ele, node);
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {}
    }, {
        key: 'onClick',
        value: function onClick(event) {
            this.tab = new _Tab2.default({ target: { btns: ['文件列表', '上传文件'], views: [getAttachmentList.call(this, this.editor), this.upload.target] }, current: 0, small: true });
            this.layer.content = _DomElement2.default.element('div', { class: 'snow-attachment-menu' }, null, this.tab.target);
            this.layer.show();
        }
    }, {
        key: 'name',
        get: function get() {
            return 'attachment';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return AttachmentManager;
}(_Component3.default);

exports.default = AttachmentManager;

},{"../../../dom/DomElement":1,"../../../editor/SnowEditor":3,"../../../poplayer/PopLayer":27,"../../../tab/Tab":29,"../../../upload/UploadButton":35,"../../../util/getDropFiles":39,"../../../util/getPasteFiles":40,"../../../util/getSize":43,"../Attahment":4,"../Component":5,"./uploader":21}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

var _PopLayer = require('../../../poplayer/PopLayer');

var _PopLayer2 = _interopRequireDefault(_PopLayer);

var _DomElement = require('../../../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _Text = require('./emotion/Text');

var _Text2 = _interopRequireDefault(_Text);

var _Tab = require('../../../tab/Tab');

var _Tab2 = _interopRequireDefault(_Tab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var n = _DomElement2.default.element;

/**
 * 表情处理
 */

var EmotionComponent = function (_Component) {
    _inherits(EmotionComponent, _Component);

    function EmotionComponent() {
        _classCallCheck(this, EmotionComponent);

        return _possibleConstructorReturn(this, (EmotionComponent.__proto__ || Object.getPrototypeOf(EmotionComponent)).apply(this, arguments));
    }

    _createClass(EmotionComponent, [{
        key: 'init',
        value: function init(node) {
            var buttons = new Array();
            var views = new Array();
            var that = this;
            this.editor.config.emotions.forEach(function (element) {
                var emotion = null;
                var childs = new Array();
                if (element.type === 'text') {
                    emotion = new _Text2.default(element);
                }
                if (emotion) {
                    emotion.content.forEach(function (emotionObj) {
                        var item = _DomElement2.default.element('span', {
                            class: 'snow-tool-emotions-item',
                            onclick: function onclick() {
                                editor.exec('insertHTML', emotionObj.html);
                                that.layer.hide();
                            }
                        }, {}, emotionObj.view);
                        childs.push(item);
                    });
                }
                var view = n('div', { class: 'snow-emotions-tab-view' }, {}, childs);
                buttons.push(element.name);
                views.push(view);
            });

            this.tab = new _Tab2.default({ target: { btns: buttons, views: views }, current: 0, small: true });
            this.content = n('div', { class: 'snow-emotions-menu' }, {}, this.tab.target);
            this.layer = new _PopLayer2.default(this.content, node);
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {}
    }, {
        key: 'onClick',
        value: function onClick(event) {
            this.layer.show();
        }
    }, {
        key: 'name',
        get: function get() {
            return 'emotion';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return EmotionComponent;
}(_Component3.default);

exports.default = EmotionComponent;

},{"../../../dom/DomElement":1,"../../../poplayer/PopLayer":27,"../../../tab/Tab":29,"../Component":5,"./emotion/Text":20}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

var _PopLayer = require('../../../poplayer/PopLayer');

var _PopLayer2 = _interopRequireDefault(_PopLayer);

var _DomElement = require('../../../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _Tab = require('../../../tab/Tab');

var _Tab2 = _interopRequireDefault(_Tab);

var _UploadButton = require('../../../upload/UploadButton');

var _UploadButton2 = _interopRequireDefault(_UploadButton);

var _Attahment = require('../Attahment');

var _Attahment2 = _interopRequireDefault(_Attahment);

var _uploader = require('./uploader');

var _uploader2 = _interopRequireDefault(_uploader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var n = _DomElement2.default.element;

/**
 * 图片处理
 */

var ImageComponent = function (_Component) {
    _inherits(ImageComponent, _Component);

    function ImageComponent(editor) {
        _classCallCheck(this, ImageComponent);

        var _this = _possibleConstructorReturn(this, (ImageComponent.__proto__ || Object.getPrototypeOf(ImageComponent)).call(this, editor));

        _this.upload = new _UploadButton2.default({
            small: true,
            accept: 'image/*',
            upload: function upload(files) {
                var _loop = function _loop() {
                    var file = files[i];
                    var attachment = new _Attahment2.default(file, file.name);
                    (0, _uploader2.default)(editor, attachment.file).then(function (data) {
                        attachment.data = data;
                        editor.addAttachment(attachment);
                        if (attachment.isImage) {
                            editor.exec('insertHTML', attachment.html);
                        }
                    });
                    _this.layer.hide();
                };

                for (var i = 0; i < files.length; i++) {
                    _loop();
                }
            }
        });
        var input = n('input', { class: 'snow-input-text snow-image-input', placeholder: '请输入图片地址', type: 'text' });
        var title = n('input', { class: 'snow-input-text snow-image-input', placeholder: '图片说明', type: 'text' });
        _this.input = n('div', { class: 'snow-image-inputs' }, {}, [title, input, n('div', { class: 'snow-image-button' }, null, n('div', {
            class: 'snow-btn snow-btn-sm', onclick: function onclick() {
                var src = (0, _DomElement2.default)(input).val();
                var alt = (0, _DomElement2.default)(title).val() || src;
                if (src) {
                    editor.exec('insertHTML', '<img title="' + alt + '"  alt="' + alt + '" src="' + src + '"/>');
                }
                _this.layer.hide();
            }
        }, null, '插入'))]);
        return _this;
    }

    _createClass(ImageComponent, [{
        key: 'init',
        value: function init(node) {
            this.tab = new _Tab2.default({ target: { btns: ['插入图片', '网络图片'], views: [n('div', { class: 'snow-image-inputs' }, {}, this.upload.target), this.input] }, current: 0, small: true });
            this.content = n('div', { class: 'snow-image-menu' }, {}, this.tab.target);
            this.layer = new _PopLayer2.default(this.content, node);
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {}
    }, {
        key: 'onClick',
        value: function onClick(event) {
            this.layer.show();
        }
    }, {
        key: 'name',
        get: function get() {
            return 'image';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return ImageComponent;
}(_Component3.default);

exports.default = ImageComponent;

},{"../../../dom/DomElement":1,"../../../poplayer/PopLayer":27,"../../../tab/Tab":29,"../../../upload/UploadButton":35,"../Attahment":4,"../Component":5,"./uploader":21}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

var _PopLayer = require('../../../poplayer/PopLayer');

var _PopLayer2 = _interopRequireDefault(_PopLayer);

var _DomElement = require('../../../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var n = _DomElement2.default.element;

var LinkComponent = function (_Component) {
    _inherits(LinkComponent, _Component);

    function LinkComponent(editor) {
        _classCallCheck(this, LinkComponent);

        var _this = _possibleConstructorReturn(this, (LinkComponent.__proto__ || Object.getPrototypeOf(LinkComponent)).call(this, editor));

        var input = n('input', { class: 'snow-input-text snow-link-input', placeholder: '链接地址', type: 'text' });
        var title = n('input', { class: 'snow-input-text snow-link-input', placeholder: '连接说明', type: 'text' });
        _this.input = n('div', { class: 'snow-link-inputs' }, {}, [title, input, n('div', { class: 'snow-link-button' }, null, n('div', {
            class: 'snow-btn snow-btn-sm', onclick: function onclick() {
                var href = (0, _DomElement2.default)(input).val();
                var name = (0, _DomElement2.default)(title).val() || href;
                if (href) {
                    var html = '<a title="' + name + '" href="' + href + '">' + name + '</a>';
                    _this.editor.exec('insertHTML', html);
                }
                _this.layer.hide();
            }
        }, null, '插入'))]);
        return _this;
    }

    _createClass(LinkComponent, [{
        key: 'init',
        value: function init(node) {
            this.content = n('div', { class: 'snow-link-menu' }, {}, this.input);
            this.layer = new _PopLayer2.default(this.content, node);
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {}
    }, {
        key: 'onClick',
        value: function onClick(event) {
            this.layer.show();
        }
    }, {
        key: 'name',
        get: function get() {
            return 'link';
        }
    }, {
        key: 'view',
        get: function get() {
            return '<i class="iconfont snow-icon-' + this.name + '"></i>';
        }
    }]);

    return LinkComponent;
}(_Component3.default);

exports.default = LinkComponent;

},{"../../../dom/DomElement":1,"../../../poplayer/PopLayer":27,"../Component":5}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EmotionObj = function EmotionObj(title, html, view) {
    _classCallCheck(this, EmotionObj);

    this.html = html;
    this.view = view;
    this.title = title;
};

exports.default = EmotionObj;

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Object = require('./Object');

var _Object2 = _interopRequireDefault(_Object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextEmotions = function () {
    function TextEmotions(data) {
        _classCallCheck(this, TextEmotions);

        var content = new Array();
        data.content.forEach(function (element) {
            content.push(new _Object2.default(element, element, element));
        });
        this._content = content;
    }

    _createClass(TextEmotions, [{
        key: 'content',
        get: function get() {
            return this._content;
        }
    }]);

    return TextEmotions;
}();

exports.default = TextEmotions;

},{"./Object":19}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = uploader;

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

var _uploadToLocal = require('./uploadToLocal');

var _uploadToLocal2 = _interopRequireDefault(_uploadToLocal);

var _uploadToServer = require('./uploadToServer');

var _uploadToServer2 = _interopRequireDefault(_uploadToServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 文件上传接口
 * 
 * @param {SnowEditor} editor 编辑器
 * @param {File} file 上传的文件
 */
function uploader(editor, file) {
    var hasUploader = _config2.default.upload && _config2.default.upload.uploader;
    if (hasUploader) {
        return (0, _uploadToServer2.default)(editor, file);
    } else {
        return (0, _uploadToLocal2.default)(editor, file);
    }
}

},{"../../../config":24,"./uploadToLocal":22,"./uploadToServer":23}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = uploadToLocal;

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 将文件在本地转换为 Base64
 * @param {SnowEditor} editor 编辑器
 * @param {File} file 上传的文件
 */
function uploadToLocal(editor, file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', function () {
            var result = { local: true, name: file.name, link: reader.result };
            var hasAdapter = _config2.default.upload && _config2.default.upload.adapter && _config2.default.upload.adapter.local && _config2.default.upload.adapter.local.resovle;
            if (hasAdapter) {
                resolve(_config2.default.upload.adapter.local.resolve(result));
            } else {
                resolve(result);
            }
        });
    });
}

},{"../../../config":24}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = uploadToServer;

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 上传文件至服务器
 * @param {SnowEditor} editor 编辑器
 * @param {File} file 上传的文件
 */
function uploadToServer(editor, file) {
    return new Promise(function (resolve, reject) {
        var hasAdapter = _config2.default.upload && _config2.default.upload.adapter && _config2.default.upload.adapter.server;
        var uploader = _config2.default.upload && _config2.default.upload.uploader;
        if (uploader) {
            if (hasAdapter) {
                uploader(file, function (data) {
                    resolve(_config2.default.upload.adapter.server.resolve(data));
                }, function (data) {
                    reject(_config2.default.upload.adapter.server.reject(data));
                });
            } else {
                uploader(file, resolve, reject);
            }
        } else {
            editor.alert('未定义文件上传函数');
        }
    });
}

},{"../../../config":24}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getConfig = require("../util/getConfig");

var _getConfig2 = _interopRequireDefault(_getConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 基础默认配置
 */
var config = (0, _getConfig2.default)('editor');
exports.default = config;

},{"../util/getConfig":38}],25:[function(require,module,exports){
'use strict';

require('../tab/index');

require('../upload/index');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _SnowEditor = require('./SnowEditor');

var _SnowEditor2 = _interopRequireDefault(_SnowEditor);

var _Bold = require('./component/style/Bold');

var _Bold2 = _interopRequireDefault(_Bold);

var _Italic = require('./component/style/Italic');

var _Italic2 = _interopRequireDefault(_Italic);

var _Underline = require('./component/style/Underline');

var _Underline2 = _interopRequireDefault(_Underline);

var _Redo = require('./component/command/Redo');

var _Redo2 = _interopRequireDefault(_Redo);

var _Undo = require('./component/command/Undo');

var _Undo2 = _interopRequireDefault(_Undo);

var _Right = require('./component/layout/Right');

var _Right2 = _interopRequireDefault(_Right);

var _Left = require('./component/layout/Left');

var _Left2 = _interopRequireDefault(_Left);

var _Center = require('./component/layout/Center');

var _Center2 = _interopRequireDefault(_Center);

var _Emotion = require('./component/tool/Emotion');

var _Emotion2 = _interopRequireDefault(_Emotion);

var _Image = require('./component/tool/Image');

var _Image2 = _interopRequireDefault(_Image);

var _Link = require('./component/tool/Link');

var _Link2 = _interopRequireDefault(_Link);

var _AttachmentManager = require('./component/tool/AttachmentManager');

var _AttachmentManager2 = _interopRequireDefault(_AttachmentManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_SnowEditor2.default.applyDefaultConfig(_config2.default);

_SnowEditor2.default.registerComponent(_Bold2.default);
_SnowEditor2.default.registerComponent(_Italic2.default);
_SnowEditor2.default.registerComponent(_Underline2.default);

_SnowEditor2.default.registerComponent(_Right2.default);
_SnowEditor2.default.registerComponent(_Center2.default);
_SnowEditor2.default.registerComponent(_Left2.default);

_SnowEditor2.default.registerComponent(_Undo2.default);
_SnowEditor2.default.registerComponent(_Redo2.default);

_SnowEditor2.default.registerComponent(_Emotion2.default);
_SnowEditor2.default.registerComponent(_Image2.default);
_SnowEditor2.default.registerComponent(_Link2.default);
_SnowEditor2.default.registerComponent(_AttachmentManager2.default);

window.snow = window.snow || {};
window.snow.Editor = _SnowEditor2.default;

},{"../tab/index":30,"../upload/index":36,"./SnowEditor":3,"./component/command/Redo":7,"./component/command/Undo":8,"./component/layout/Center":9,"./component/layout/Left":10,"./component/layout/Right":11,"./component/style/Bold":12,"./component/style/Italic":13,"./component/style/Underline":14,"./component/tool/AttachmentManager":15,"./component/tool/Emotion":16,"./component/tool/Image":17,"./component/tool/Link":18,"./config":24}],26:[function(require,module,exports){
'use strict';

require('./dom/index');

require('./editor/index');

require('./poplayer/index');

require('./tab/index');

require('./template/index');

require('./toast/index');

require('./upload/index');

},{"./dom/index":2,"./editor/index":25,"./poplayer/index":28,"./tab/index":30,"./template/index":32,"./toast/index":34,"./upload/index":36}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _getSize = require('../util/getSize');

var _getSize2 = _interopRequireDefault(_getSize);

var _DomElement = require('../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _getPlatform = require('../util/getPlatform');

var _getPlatform2 = _interopRequireDefault(_getPlatform);

var _pointInBox = require('../util/pointInBox');

var _pointInBox2 = _interopRequireDefault(_pointInBox);

var _onMouseHover = require('../util/onMouseHover');

var _onMouseHover2 = _interopRequireDefault(_onMouseHover);

var _timeLimitCallback = require('../util/timeLimitCallback');

var _timeLimitCallback2 = _interopRequireDefault(_timeLimitCallback);

var _getConfig = require('../util/getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = (0, _getConfig2.default)('poplayer');
var defaultZIndexLevel = config.layerLevel || 9000;

var n = _DomElement2.default.element;
var STR = {
    layerId: 'snow-layer-shade',
    parentSide: 'parentSide',
    windowPop: 'windowPop',
    windowSide: 'windowSide',
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut'
};

var layerCounter = 0;

function getBody() {
    return document.getElementsByTagName('body')[0];
}

function hideElement(defaultDirection) {
    var _this = this;

    var animationTime = this.animationTime;
    var timeout = animationTime * 1000;
    var showElement = this.showElement;
    if (showElement === null) {
        return;
    }
    if (this.showState === STR.windowSide) {
        (0, _DomElement2.default)(showElement).css({
            animation: getAnimtion(this.direction, defaultDirection, 'Out') + ' ease ' + animationTime + 's forwards'
        });
    } else if (this.showState === STR.parentSide) {
        (0, _DomElement2.default)(showElement).css({
            animation: getAnimtion(this.direction, defaultDirection, 'Out') + ' ease ' + animationTime + 's forwards'
        });
    } else if (this.showState === STR.windowPop) {
        (0, _DomElement2.default)(showElement).css({
            animation: getAnimtion(this.direction, defaultDirection, 'Out') + ' ease ' + animationTime + 's forwards'
        });
    }
    if (this.showShade) {
        (0, _DomElement2.default)(this.showShade).css({ animation: STR.fadeOut + ' ease ' + animationTime + 's forwards' });
    }
    setTimeout(function () {
        _this.clear();
    }, timeout);
}

function showElement(defaultDirection, posOfParent, posOfWindow, posOfPop, calcPosOfParent) {
    var showElem = this.showElement;
    var initDisplayInWindow = function initDisplayInWindow(showElem) {
        var shade = this.config.shade || true;
        var hideInShadeClick = this.config.shadeClickHide || true;
        var layerPop = this.config.pop || (0, _getPlatform2.default)() === 'pc';
        var layer = this;
        var animationTime = this.animationTime;
        if (shade) {

            var style = window.getComputedStyle(showElem);
            this.showShade = n('div', {
                id: STR.layerId,
                onclick: function onclick() {
                    if (hideInShadeClick) {
                        layer.hide();
                        (0, _DomElement2.default)(layer.showShade).css({ display: 'none' });
                    }
                }
            }, {
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: style.zIndex - 10,
                animation: STR.fadeIn + ' ease ' + animationTime + 's forwards',
                backgroundColor: 'rgba(0,0,0,0.4)'
            });
            getBody().appendChild(this.showShade);
        }

        if (layerPop) {
            (0, _DomElement2.default)(showElem).css(posOfPop).css({
                animation: getAnimtion(this.direction, defaultDirection, 'In') + ' ease ' + animationTime + 's forwards'
            });
            this.showState = STR.windowPop;
        } else {
            (0, _DomElement2.default)(showElem).css(posOfWindow).css({
                animation: getAnimtion(this.direction, defaultDirection, 'In') + ' ease ' + animationTime + 's forwards'
            });
            this.showState = STR.windowSide;
        }
    };

    var initDisplayAfterParent = function initDisplayAfterParent(showElem) {
        var animationTime = this.animationTime;
        this.showState = STR.parentSide;
        this.showShade = null;
        (0, _DomElement2.default)(showElem).css(posOfParent).css({
            animation: getAnimtion(this.direction, defaultDirection, 'In') + ' ease ' + animationTime + 's forwards'
        });
        (0, _DomElement2.default)(window).on('resize scroll', (0, _timeLimitCallback2.default)(function (event) {
            var pos = calcPosOfParent();
            (0, _DomElement2.default)(showElem).css(pos);
        }).run);
    };

    var size = (0, _getSize2.default)(this.$parent);
    var elemSize = (0, _getSize2.default)(showElem);
    var windowSize = (0, _getSize2.default)(null);
    if (size.left + elemSize.width > windowSize.width) {
        initDisplayInWindow.call(this, showElem, windowSize, elemSize);
    } else {
        initDisplayAfterParent.call(this, showElem, size);
    }
}

var showController = {
    outerBottom: function outerBottom(elemSize, parentSize, windowSize) {
        var _this2 = this;

        var posOfParent = {
            left: parentSize.left + 'px',
            top: parentSize.top + parentSize.height + 'px'
        };
        var posOfWindow = {
            left: '0px',
            top: elemSize.height >= windowSize.height ? windowSize.height * 0.8 + 'px' : null,
            bottom: '0px',
            overflow: 'auto',
            maxHeight: '80%',
            maxWidth: '100%',
            width: '100%'
        };
        var posOfPop = {
            left: elemSize.width >= windowSize.width ? '0px' : windowSize.width / 2 - elemSize.width / 2 + 'px',
            top: elemSize.height >= windowSize.height ? windowSize.height + 'px' : windowSize.height / 2 - elemSize.height / 2 + 'px',
            overflow: 'auto',
            maxHeight: '100%',
            maxWidth: '100%'
        };
        var calcPosOfParent = function calcPosOfParent() {
            var ps = (0, _getSize2.default)(_this2.$parent);
            return {
                left: ps.left + 'px',
                top: ps.top + ps.height + 'px'
            };
        };
        showElement.call(this, 'Bottom', posOfParent, posOfWindow, posOfPop, calcPosOfParent);
    }
};

var hideController = {
    outerBottom: function outerBottom() {
        hideElement.call(this, 'Bottom');
    }
};

function getAnimtion(name, def, subfix) {
    return 'slide' + (name || def) + subfix;
}

/**
 * 自动弹出层
 * 检测内容的大小，选择下拉弹出或者浮动弹窗
 */

var PopLayer = function () {

    /**
     * 创建一个弹出层
     * 
     * @param {Element} element 显示的元素
     * @param {Element|Window} parent 显示的父元素 
     * @param {Array} config 配置
     */
    function PopLayer(element, parent, config) {
        _classCallCheck(this, PopLayer);

        this.$parent = parent || window;
        this.$element = element;
        this.config = config || { shade: true };
        this.id = layerCounter++;
        this.direction = this.config.direction;
        this.position = 'outerBottom';
        this.showElement = null;
        this.showShade = null;
        this.showed = false;
        this.clickOutListener = null;
    }

    _createClass(PopLayer, [{
        key: 'show',


        /**
         * 显示弹出层
         */
        value: function show() {
            var _this3 = this;

            this.clear();
            var showElement = n('div', { id: 'pop-layer-' + this.id }, { display: 'block', position: 'fixed', zIndex: defaultZIndexLevel }, this.$element);
            getBody().appendChild(showElement);
            this.showElement = showElement;
            var size = (0, _getSize2.default)(this.$parent);
            var elemSize = (0, _getSize2.default)(this.$element);
            var windowSize = (0, _getSize2.default)(null);

            showController[this.position].call(this, elemSize, size, windowSize);
            (0, _DomElement2.default)(this.showElement).css({ 'display': 'block' });
            this.showed = true;

            if (this.clickOutListener) {
                (0, _DomElement2.default)(window).off('click', this.clickOutListener);
                this.clickOutListener = null;
            }

            (0, _onMouseHover2.default)(this.showElement, null, function () {
                if (_this3.clickOutListener == null) {
                    _this3.clickOutListener = function (event) {
                        var x = event.pageX || event.clientX || event.x;
                        var y = event.pageY || event.clientY || event.y;
                        var box = (0, _getSize2.default)(_this3.showElement);
                        var point = { x: x, y: y };
                        // 获取正常的事件
                        if (event.isTrusted && !(0, _pointInBox2.default)(point, box) && _this3.showed) {
                            _this3.hide();
                        }
                    };
                    (0, _DomElement2.default)(window).on('click', _this3.clickOutListener);
                }
            });
            if (this.showShade) {
                (0, _DomElement2.default)(this.showShade).css({ 'display': 'block' });
            }
        }

        /**
         * 清理显示内容
         */

    }, {
        key: 'clear',
        value: function clear() {
            this.showed = false;
            var body = getBody();
            if (this.showElement) {
                body.removeChild(this.showElement);
                this.showElement = null;
            }
            if (this.showShade) {
                body.removeChild(this.showShade);
                this.showShade = null;
            }
        }
        /**
         * 获取动画时长
         */

    }, {
        key: 'hide',


        /**
         * 隐藏
         */
        value: function hide() {
            hideController[this.position].call(this);
            this.showed = false;
        }
    }, {
        key: 'content',
        set: function set(element) {
            this.$element = element;
        },
        get: function get() {
            return this.$element;
        }
    }, {
        key: 'animationTime',
        get: function get() {
            return this.config.animationTime || .3;
        }
    }]);

    return PopLayer;
}();

exports.default = PopLayer;

},{"../dom/DomElement":1,"../util/getConfig":38,"../util/getPlatform":41,"../util/getSize":43,"../util/onMouseHover":47,"../util/pointInBox":48,"../util/timeLimitCallback":50}],28:[function(require,module,exports){
'use strict';

var _PopLayer = require('./PopLayer');

var _PopLayer2 = _interopRequireDefault(_PopLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.snow = window.snow || {};
window.snow.PopLayer = _PopLayer2.default;

},{"./PopLayer":27}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _DomElement = require('../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var n = _DomElement2.default.element;

var defaultConfig = {
    target: '#snow-tab', // 对象选择器
    selector: {
        title: '.snow-tab-title',
        titleItem: '.snow-tab-title > li',
        content: '.snow-tab-content',
        contentItem: '.snow-tab-item'
    },
    class: {
        title: 'snow-tab-title',
        titleSmall: 'snow-tab-sm',
        titleItem: null,
        content: 'snow-tab-content',
        contentItem: 'snow-tab-item'
    },
    classOnShow: {
        title: 'snow-tab-current',
        content: 'snow-tab-show'
    }

    /**
     * target -> get dom -> bind event -> render -> show
     */

};function eventBinder() {
    var _this = this;

    var $btns = this.$btns.elements;
    var $views = this.$views.elements;
    var onshow = this.onshow;
    var onhidden = this.onhidden;
    var config = this.config;
    if (config.current >= 0) {
        this.current = config.current;
        (0, _DomElement2.default)($views[this.current]).addClass(config.classOnShow.content);
        (0, _DomElement2.default)($btns[this.current]).addClass(config.classOnShow.title);
    }
    $btns.forEach(function (btn, index) {
        (0, _DomElement2.default)(btn).on('click', function () {
            var current = _this.current || 0;
            (0, _DomElement2.default)($views[current]).removeClass(config.classOnShow.content);
            (0, _DomElement2.default)($views[index]).addClass(config.classOnShow.content);
            (0, _DomElement2.default)(btn).addClass(config.classOnShow.title);
            (0, _DomElement2.default)($btns[current]).removeClass(config.classOnShow.title);
            _this.current = index;
            if (onshow instanceof Function) {
                onshow.call(_this, index);
            }
            if (onhidden instanceof Function) {
                onhidden.call(_this, current);
            }
        });
    });
}

function getTargetChilds() {
    var target = this.config.target;
    this.target = (0, _DomElement2.default)(target)[0];
    this.$btns = (0, _DomElement2.default)(this.target).find(this.config.selector.titleItem);
    this.$views = (0, _DomElement2.default)(this.target).find(this.config.selector.contentItem);
}

function buildTabViews() {
    var config = this.config;
    var btns = config.target.btns;
    var views = config.target.views;
    var vBtns = new Array();
    var vViews = new Array();
    var sm = config.small || false;

    btns.forEach(function (ele) {
        if (ele instanceof String) {
            ele = document.createTextNode(ele);
        }
        var btn = n('li', { class: config.class.titleItem }, {}, ele);
        vBtns.push(btn);
    });

    views.forEach(function (ele) {
        if (ele instanceof String) {
            ele = document.createTextNode(ele);
        }
        var view = n('div', { class: config.class.contentItem }, {}, ele);
        vViews.push(view);
    });

    var btnsParent = n('ul', { class: sm ? config.class.title + ' ' + config.class.titleSmall : config.class.title }, {}, vBtns);
    var viewsParent = n('div', { class: config.class.content }, {}, vViews);

    this.target = n('div', {}, {}, [btnsParent, viewsParent]);
    this.$btns = (0, _DomElement2.default)(vBtns);
    this.$views = (0, _DomElement2.default)(vViews);
}

/**
 *  Tab 控制器
 *  button某个按钮选中，则contents的对应ID的display为block
 */

var Tab =

/**
 * 创建对象
 * @param {Object} config 
 */
function Tab(config) {
    _classCallCheck(this, Tab);

    this.config = Object.assign(defaultConfig, config);
    if (config.target instanceof Object) {
        buildTabViews.call(this);
    } else {
        getTargetChilds.call(this);
    }
    eventBinder.call(this);
};

exports.default = Tab;

},{"../dom/DomElement":1}],30:[function(require,module,exports){
'use strict';

var _Tab = require('./Tab');

var _Tab2 = _interopRequireDefault(_Tab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.snow = window.snow || {};
window.snow.Tab = _Tab2.default;

},{"./Tab":29}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//  缓存查找节点可能会耗时较多 
var default_config = {
    cache: true, // 是否开启缓存
    tagstart: '{',
    tagend: '}', //控制标签
    compress: true,
    strict: true
};

// 关键字
var KEYWORD = 'if,else,each,include,while,for';
var KEYWORD_PREG = '^\\s*((?:\/)?(?:' + KEYWORD.split(',').join('|') + '))(.*)';

// @artTemplate:https://github.com/aui/artTemplate
var ENGINE = ''.trim ? ["$_tpl_=''", "$_tpl_+=", ";", "$_tpl_"] : ["$_tpl_=[]", "$_tpl_.push(", ");", "$_tpl_.join('')"];

var escape = {
    "<": "&#60;",
    ">": "&#62;",
    '"': "&#34;",
    "'": "&#39;",
    "&": "&#38;"
};

/*  --------------------  静态内部函数 protected ------------------------*/

/**
 * 测试模板语句的可行性
 * 
 * @param {any} test
 * @param {any} code
 * @returns
 */
function statmentTest(test, code) {
    try {
        new Function(test);
    } catch (e) {
        return 'throw ' + e.name + '(' + _string(e.message) + ');{';
    }
    return code;
}

/**
 * 处理HTML部分
 * 
 * @param {any} html
 * @param {any} compress 是否压缩
 * @returns
 */
function parserHTML(html, compress) {
    // console.log('HTML:', html);
    var out = '';
    if (html.match(/(?!^)\n/)) {
        _each(html.split('\n'), function (html) {
            if (html) {
                // 压缩多余空白与注释
                if (compress) {
                    html = html.replace(/\s+/g, ' ').replace(/<!--.*?-->/g, '');
                }
                if (html) {
                    out += ENGINE[1] + _string(html) + ENGINE[2];
                    out += '\n';
                }
            }
        });
    } else if (html) {
        out += ENGINE[1] + _string(html) + ENGINE[2];
    }
    return out;
}

/**
 * 处理代码
 * 
 * @param {any} code
 * @returns
 */
function parserCode(code) {
    var match;
    // console.log(new RegExp(KEYWORD_PREG));
    if (match = code.match(new RegExp(KEYWORD_PREG))) {
        // console.log(code,':',match);
        var command = match[1];
        var param = match[2];

        switch (command) {
            case 'include':
                // 编译时包含
                param = param.trim().split(' ');
                if (param.length === 1) {
                    param.push("$_unit.value");
                }
                param = param.join(',');
                return ENGINE[1] + '$_unit._include(' + param + ')' + ENGINE[2];
            case 'if':
                return statmentTest('if(' + param + '){}', 'if (' + param + ') {');
            case 'else':
                // console.log(param,param.match(/^\s*if\s+(.*)/));
                if (match = param.match(/^\s*if\s+(.*)/)) {
                    return '} else if (' + match[1] + '){';
                }
                return '}else{';
            case '/if':
            case '/while':
            case '/for':
                return '}';
            case 'while':
                return statmentTest('while(' + param + '){}', 'while (' + param + ') {');
            case 'for':
                return statmentTest('for(' + param + '){}', 'for (' + param + ') {');
            case 'each':
                var match = param.match(/\s*(.+?)\s+(?:(?:as(?:\s+(\w+)))?(?:\s*:\s*(\w+))?)?/);
                if (match) {
                    var value = match[1];
                    var each_param;
                    if (match[2]) {
                        if (match[3]) {
                            each_param = match[3] + ',' + match[2];
                        } else {
                            each_param = match[2];
                        }
                    } else {
                        each_param = 'value,index';
                    }
                    return '$_unit._each(' + value + ',function(' + each_param + '){';
                }
                return 'throw SyntaxError("Null Each Value");$_unit._each(null,function(){';
            case '/each':
                return '});';
        }
    }
    // 非转义
    else if (match = code.match(/^!.*$/)) {
            return ENGINE[1] + '$_unit._echo(' + match[1] + ')' + ENGINE[2];
        }
        // 转义输出
        else {
                return ENGINE[1] + '$_unit._escape(' + code + ')' + ENGINE[2];
            }
}

var _echo = function _echo(value) {
    return new String(value);
};

var _escape = function _escape(content) {
    return _echo(content).replace(/&(?![\w#]+;)|[<>"']/g, function (s) {
        return escape[s];
    });
};

var _each = function _each(value, callback) {
    if (is_array(value)) {
        _arrayEach(value, callback);
    } else {
        for (var index in value) {
            callback.call(value[index], value[index], index);
        }
    }
};
var _arrayEach = function _arrayEach(value, callback) {
    for (var index = 0; index < value.length; ++index) {
        callback.call(value[index], value[index], index);
    }
};
var _objectCopy = function _objectCopy(arrays) {
    var object = {};
    for (var i = 0; i < arguments.length; i++) {
        for (var index in arguments[i]) {
            object[index] = arguments[i][index];
        }
    }
    return object;
};

var _include = function _include(id, value) {
    return new Template(id).render(value);
};

/**
 * 生成可显示字符串
 * 
 * @param {any} code
 * @returns
 */
function _string(code) {
    return "'" + code
    // 单引号与反斜杠转义
    .replace(/('|\\)/g, '\\$1').replace(/\r/g, '\\r').replace(/\n/g, '\\n') + "'";
}

/**
 * 判断是否是数组
 * 
 * @param {any} obj
 * @returns
 */
function is_array(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

/**
 * 提示代码错误
 * 
 * @param {any} name
 * @param {any} content
 * @param {any} line
 * @param {any} e
 */
function reportError(name, content, line, e) {
    var name = name || 'anonymous';
    var report = 'DxTPL Error:';
    console.group(report);
    if (content) {

        var codes = content.replace(/^\n/, '').split('\n');
        var start = line - 5 > 0 ? line - 5 : 1;
        var end = line + 5 > codes.length ? codes.length : line + 5;
        console.error(e);
        // console.log(codes);
        for (var i = start; i < end; i++) {
            if (i == line) {
                console.log(i + '|%c' + codes[line - 1] + '\t\t%c->\t\t%c' + e.name + ':' + e.message, 'color:red;', 'color:green;', 'color:red;');
            } else {
                console.log(i + '|' + codes[i - 1]);
            }
        }
    } else {
        console.log(content);
        console.log('%c' + report + e.message + '\t\t@' + name + ':' + line, 'color:red;');
    }
    console.groupEnd(report);
}

/**
 * 编译模板
 * 
 * @param {any} text
 * @param {any} config
 * @returns
 */
function compileTemplate(text, config) {
    var tpl = '';
    // console.log('code',text);
    text = text.replace(/^\n/, '');
    // console.log(tagstart);
    _each(text.split(config.tagstart), function (value) {
        // console.log('split',value);
        var split = value.split(config.tagend);
        if (split.length === 1) {
            tpl += parserHTML(split[0], config.compress);
        } else {
            tpl += parserCode(split[0]);
            tpl += parserHTML(split[1]);
        }
    });
    return tpl;
}

/**
 * 给模板压入变量
 * 
 * @param {any} source
 * @param {any} value
 * @param {any} strict
 * @returns
 */
function linkValue(source, value, strict) {
    var use_strict = strict === undefined ? true : strict;
    var ext = [];
    ext.push('var $_unit=this,' + ENGINE[0]);
    for (var index in value) {
        ext.push(index + '=this.value.' + index);
    }
    var link_str = '';
    if (use_strict) {
        link_str = '"use strict";';
    }
    link_str += ext.join(',');
    link_str += ';';
    link_str += source + 'return new String(' + ENGINE[3] + ');';
    return link_str;
}

/**
 * 渲染模板代码
 * 
 * @param {any} name
 * @param {any} source
 * @param {any} compiled_code
 * @param {any} value
 * @returns
 */
function _render(name, source, compiled_code, value, strict) {
    // console.time('render ' + name);
    var runcode = linkValue(compiled_code, value, strict);
    // console.log(runcode);
    var caller = {
        _each: _each,
        _echo: _echo,
        _escape: _escape,
        _include: _include,
        value: value
    };

    var html;
    try {
        var render = new Function(runcode);
        html = render.call(caller);
    } catch (e) {
        // For Chrome
        var match = new String(e.stack).match(/<anonymous>:(\d+):\d+/);
        // console.log(source);
        // console.log(e);
        if (match) {
            var line = match[1] - 1;
            reportError(name, source, line, e);
        } else {
            var name = name || 'anonymous';
            // For Edge
            var match = new String(e.stack).match(/Function code:(\d+):\d+/);
            if (match) {
                console.error('DxTPL:Compile Error@' + name + ' Line ' + match[1]);
            } else {
                console.error('DxTPL:Compile Error@' + name);
            }
        }
    }
    // console.timeEnd('render ' + name);
    return html;
}

function getDOMcache(name, config) {
    // console.time('getcache:' + name);
    var cache_parent = document.getElementById('template_caches');
    if (!cache_parent) {
        cache_parent = document.createElement('div');
        cache_parent.id = 'template_caches';
        cache_parent.style.display = 'none';
        document.body.appendChild(cache_parent);
    }
    var cache_name = 'template_cache_' + name;

    var tpl_cache = document.getElementById('template_cache_' + name);
    if (!tpl_cache) {
        tpl_cache = document.createElement('div');
        tpl_cache.id = cache_name;
        tpl_cache.innerText = compileTemplate(document.getElementById(name).innerHTML, config || default_config);
        cache_parent.appendChild(tpl_cache);
    }
    // console.timeEnd('getcache:' + name);
    return tpl_cache.innerText;
}

/* ----  编译DOM对象 ----*/
function _compile(id, config) {
    var tplId = id || config.id;
    var anonymous = false;
    if (typeof tplId !== 'string') throw Error('Unsupport Template ID');
    var tpl = document.getElementById(tplId);
    if (tpl) {
        // 获取源码
        config.source = tpl.innerHTML;
    } else {
        // 无法获取，将ID作为源码解析
        config.source = tplId;
        config.id = 'anonymous';
        anonymous = true;
    }
    if (config.code) {
        // 代码已经编译
    } else if (config.cache && !anonymous) {
        config.code = getDOMcache(tplId, config);
    } else {
        config.code = compileTemplate(config.source, config);
    }
    return config;
}

var Template = function () {
    function Template(name, config) {
        _classCallCheck(this, Template);

        this.version = '1.0.43';
        var conf = default_config;
        if (typeof name === 'string') {
            // 适配对象
            conf = _objectCopy(conf, config);
            conf.id = name;
        } else {
            // 适配对象
            conf = _objectCopy(conf, name);
        }
        this.config(conf);
    }

    _createClass(Template, [{
        key: 'config',
        value: function config(_config) {
            for (var index in _config) {
                this[index] = _config[index];
            }
            return this;
        }
    }, {
        key: 'assign',
        value: function assign(name, value) {
            this.value[name] = _objectCopy(this.value[name], value);
            return this;
        }
    }, {
        key: 'value',
        value: function value(_value) {
            this.value = _objectCopy(this.value, _value);
            return this;
        }
    }, {
        key: 'compile',
        value: function compile(id) {
            var config = _objectCopy(this, _compile(id, this));
            return new Template(config);
        }
    }, {
        key: 'render',
        value: function render(value) {
            // 未编译
            if (!(this.source && this.code)) {
                var val = _compile(this.id, this);
                this.config(val);
            }
            return _render(this.id, this.source, this.code, value, this.strict);
        }
    }], [{
        key: 'renderFor',
        value: function renderFor(selector, glovalue) {
            var nodes = document.querySelectorAll(selector);
            _arrayEach(nodes, function (node, index) {
                var source = node.innerHTML;
                var value;
                var config = default_config;

                if (node.dataset.init) {
                    try {
                        var json = new Function('return ' + node.dataset.init + ';');
                        value = json();
                    } catch (e) {
                        reportError(selector + '[' + index + ']', null, 0, new Error('Unsupport json'));
                    }
                }
                if (node.dataset.config) {
                    try {
                        var json = new Function('return ' + node.dataset.config + ';');
                        var conf = json();
                        config = _objectCopy(config, conf);
                    } catch (e) {
                        reportError(selector + '[' + index + ']', null, 0, new Error('Unsupport json'));
                    }
                }

                value = _objectCopy(value, glovalue);
                var code = compileTemplate(source, config);
                node.innerHTML = _render(selector, source, code, value, config.strict);
            });
        }
    }]);

    return Template;
}();

exports.default = Template;

},{}],32:[function(require,module,exports){
'use strict';

var _Template = require('./Template');

var _Template2 = _interopRequireDefault(_Template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.snow = window.snow || {};
window.snow.Template = _Template2.default;

},{"./Template":31}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _DomElement = require('../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _getConfig = require('../util/getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = (0, _getConfig2.default)('toast');

// 常量
var TOAST_PARENT_ID = 'Toast-Parent';
var TOAST_SHOW_ID = 'Toast-Show';
var TOAST_DEFAULT_STYLE = 'toast';
var TOAST_POP_LEVEL = config.layerLevel || 10000;

var Toast = function Toast(text, time, style) {
    return new Toast.create(text, time, style);
};

// Toast队列
Toast.Queue = new Array();
// 构造函数
Toast.create = function (message, time, style) {
    Toast.Parent = document.getElementById(TOAST_PARENT_ID);

    if (!Toast.Parent) {
        Toast.Parent = _DomElement2.default.element('div', { id: TOAST_PARENT_ID }, { pointerEvents: 'none' });
        document.body.appendChild(Toast.Parent);
    }
    Toast.Queue.push({
        message: message,
        timeout: time,
        style: style ? TOAST_DEFAULT_STYLE + '-' + style : TOAST_DEFAULT_STYLE
    });
    Toast.show();
};

Toast.show = function () {
    // 一个时刻只能显示一个Toast
    if (document.getElementById(TOAST_SHOW_ID)) return;
    var show = Toast.Queue.shift();
    var toastdiv = _DomElement2.default.element('div', {
        id: TOAST_SHOW_ID,
        class: show.style
    });
    toastdiv.innerHTML = show.message;
    Toast.Parent.appendChild(toastdiv);
    var width = Toast.Parent.scrollWidth || window.innerWidth;
    var margin = width / 2 - toastdiv.scrollWidth / 2;
    var bottom = window.innerHeight - toastdiv.scrollHeight * 2;
    toastdiv.style.marginLeft = margin + 'px';
    toastdiv.style.top = bottom + 'px';
    var timeout = show.timeout || 2000;
    var close = function close() {
        (0, _DomElement2.default)(toastdiv).css({
            transition: 'opacity 0.3s ease-out',
            opacity: 0
        });

        setTimeout(function () {
            Toast.Parent.removeChild(toastdiv);
            if (Toast.Queue.length) {
                Toast.show();
            }
        }, 300);
    };

    (0, _DomElement2.default)(toastdiv).css({
        position: 'fixed',
        opacity: 1,
        zIndex: TOAST_POP_LEVEL,
        pointerEvents: 'none',
        transition: 'opacity 0.1s ease-in'
    });
    setTimeout(close, timeout);
};

exports.default = Toast;

},{"../dom/DomElement":1,"../util/getConfig":38}],34:[function(require,module,exports){
'use strict';

var _Toast = require('./Toast');

var _Toast2 = _interopRequireDefault(_Toast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.snow = window.snow || {};
window.snow.Toast = _Toast2.default;
window.toast = _Toast2.default;

},{"./Toast":33}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _DomElement = require('../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var n = _DomElement2.default.element;

var defaultConfig = {
    target: '#snow-upload', // 对象选择器
    accept: null,
    selector: {
        title: '.snow-upload-title',
        file: 'input[type=file]'
    },
    class: {
        title: 'snow-upload-title',
        titleSmall: 'snow-upload-sm',
        file: 'snow-upload-file'
    }
};

function getChilds() {
    var config = this.config;
    this.file = (0, _DomElement2.default)(config.selector.file, this.target)[0];
    this.title = (0, _DomElement2.default)(config.selector.title, this.target)[0];
}

function buildChilds() {
    var config = this.config;
    var sm = config.small || false;
    var accept = config.accept;
    this.title = n('div', { class: sm ? config.class.title + ' ' + config.class.titleSmall : config.class.title }, null, '上传文件');
    this.file = n('input', { class: config.class.file, hidden: true, type: 'file', accept: accept });
    this.target = n('div', null, null, [this.file, this.title]);
}

function binderEvent() {
    var _this = this;

    var title = this.title;
    var file = this.file;
    var upload = this.config.upload;

    (0, _DomElement2.default)(title).on('click', function (e) {
        file.click();
    });

    (0, _DomElement2.default)(file).on('change', function () {
        if (upload) {
            upload.call(_this, file.files);
        } else {
            console.error('uploader is invalid for config.upload');
        }
    });
}

/**
 * 创建文件上传按钮
 */

var UploadButton =

/**
 * 创建对象
 * @param {Object} config 
 */
function UploadButton(config) {
    _classCallCheck(this, UploadButton);

    this.config = {};
    this.config = Object.assign(this.config, defaultConfig, config);
    if (config.target) {
        this.target = (0, _DomElement2.default)(config.target)[0];
        getChilds.call(this);
    } else {
        buildChilds.call(this);
    }
    binderEvent.call(this);
};

exports.default = UploadButton;

},{"../dom/DomElement":1}],36:[function(require,module,exports){
'use strict';

var _UploadButton = require('./UploadButton');

var _UploadButton2 = _interopRequireDefault(_UploadButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.snow = window.snow || {};
window.snow.UploadButton = _UploadButton2.default;

},{"./UploadButton":35}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = fixCssPrefix;
var cssPrefix = function () {
    var styles = window.getComputedStyle(document.documentElement, '');
    var core = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms|)-/) || styles.OLink === '' && ['', 'o'])[1];
    return '-' + core + '-';
}();

/**
 * 转换CSS前缀
 * @param {String} name 
 */
function fixCssPrefix(name) {
    name = name.trim();
    name = typeof document.documentElement.style[name] === 'undefined' ? cssPrefix + name : name;
    return name;
}

},{}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getConfig;

var _getRootPath = require('./getRootPath');

var _getRootPath2 = _interopRequireDefault(_getRootPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getConfig(name) {
    if (name) {
        return window.SNOW_CONFIG[name];
    }
    return window.SNOW_CONFIG;
}

},{"./getRootPath":42}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDropFiles;
/**
 * 获取拖入的文件（图片或者附件）
 * @param {Event} event 拖拽事件
 */
function getDropFiles(event) {
  return event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files : null;
}

},{}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPasteFiles;
/**
 * 获取粘贴的文件（图片或者附件）
 * @param {Event} event 拖拽事件
 */
function getPasteFiles(event) {
  return event.clipboardData && event.clipboardData.files ? event.clipboardData.files : null;
}

},{}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var agent = navigator.userAgent;
    if (agent.match(/(Mobile|Android|Linux|iPhone|iPad)/i)) {
        if (agent.match(/(Android|Linux)/i)) {
            return 'android';
        } else {
            return 'ios';
        }
    } else {
        return 'pc';
    }
};

},{}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getRootPath;
function getRootPath() {
    var scripts = document.getElementsByTagName("script");
    var _self_path = scripts[scripts.length - 1].getAttribute("src");
    return _self_path.substring(0, _self_path.lastIndexOf("/"));
}

},{}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getSize;

var _getWindowsSize2 = require('./getWindowsSize');

var _getWindowsSize3 = _interopRequireDefault(_getWindowsSize2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSize(elem) {
    if (elem instanceof Element) {
        return elem.getBoundingClientRect();
    } else /*if (elem instanceof Window)*/{
            var _getWindowsSize = (0, _getWindowsSize3.default)(),
                width = _getWindowsSize.width,
                height = _getWindowsSize.height;

            var elementRect = {
                width: width,
                height: height,
                left: 0,
                top: 0
            };
            return elementRect;
        }
}

},{"./getWindowsSize":44}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getWindowsSize;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getAxisSize(axis, body, html) {
    var max = screen[axis.toLowerCase()];
    var array = [body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis]].filter(function (item) {
        return item < max;
    });
    return Math.max.apply(Math, _toConsumableArray(array));
}

function getWindowsSize() {
    var body = window.document.body;
    var html = window.document.documentElement;
    return {
        height: getAxisSize('Height', body, html),
        width: getAxisSize('Width', body, html)
    };
}

},{}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isArray;
/**
 * 判断对象是否为数组
 * @param {Object} obj 
 */
function isArray(obj) {
  return obj instanceof Array;
}

},{}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isChildOf;
/**
 * 判断elem节点是否是parent的子节点
 * @param {Element} elem 子节点
 * @param {Element} parent 父节点
 */
function isChildOf(elem, parent) {
    while (elem && elem != parent) {
        elem = elem.parentNode;
    }
    return elem === parent;
}

},{}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = onMouseHover;

var _getSize = require('./getSize');

var _getSize2 = _interopRequireDefault(_getSize);

var _pointInBox = require('./pointInBox');

var _pointInBox2 = _interopRequireDefault(_pointInBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 检测鼠标是否覆盖某对象（含子元素）
 * @param {Element} target 目标
 * @param {Function} hover 覆盖回调
 * @param {Function} outer 未覆盖回调
 * @param {Integer} time 节流时间
 */
function onMouseHover(target, hover, outer, time) {
    var time = time | 10;
    var lastTime = new Date().getTime();
    window.addEventListener('mousemove', function (event) {
        event.hoverTarget = target;
        var curTime = new Date().getTime();
        if (curTime - lastTime >= time) {
            var box = (0, _getSize2.default)(target);
            var x = event.pageX || event.clientX || event.x;
            var y = event.pageY || event.clientY || event.y;
            if ((0, _pointInBox2.default)({ x: x, y: y }, box)) {
                event.hoverAction = 'hover';
                hover && hover(event);
            } else {
                event.hoverAction = 'outer';
                outer && outer(event);
            }
            lastTime = curTime;
        }
    });
}

},{"./getSize":43,"./pointInBox":48}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = pointInBox;
/**
 * 判断点在矩形内
 * @param {Object} point 点，包含 x,y
 * @param {Rect} box 矩形，top,left,width,height
 */
function pointInBox(point, box) {
    var bottom = box.top + box.height;
    var right = box.left + box.width;
    if (point.y >= box.top && point.y <= bottom && point.x >= box.left && point.x <= right) {
        return true;
    }
    return false;
}

},{}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = printf;
var exp = null;
try {
    // firefox make this error
    exp = new RegExp('(?<!\\$)\\$(\\d+|\\w+?\\b)', 'g');
} catch (error) {
    exp = new RegExp('\\$(\\d+|\\w+?\\b)', 'g');
}

/**
 * 格式化输出字符
 * 
 * @param {String} format 格式化字符串
 * @param  {...any} args 
 */
function printf(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return format.replace(exp, function (target, name) {
        if (args.length === 1 && args[0] instanceof Object) {
            return args[0][name] || target;
        } else {
            return args[name] || target;
        }
    });
}

},{}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = timeLimitCallback;
/**
 * 基于时间的节流
 * @param {callback} callback 回调函数
 * @param {Object} target 回调对象
 * @param {Integer} time 节流时间
 */
function timeLimitCallback(callback, target, time) {
    var time = time | 10;
    var lastTime = new Date().getTime();
    return {
        run: function run() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var curTime = new Date().getTime();
            if (curTime - lastTime >= time) {
                callback.apply(target || callback, args);
                lastTime = curTime;
            }
        }
    };
}

},{}]},{},[26]);
