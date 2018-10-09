/*! snow-editor by dxkite 2018-10-09 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _config = require('./snow/editor/config');

var _config2 = _interopRequireDefault(_config);

var _SnowEditor = require('./snow/editor/SnowEditor');

var _SnowEditor2 = _interopRequireDefault(_SnowEditor);

var _Bold = require('./snow/editor/component/style/Bold');

var _Bold2 = _interopRequireDefault(_Bold);

var _Italic = require('./snow/editor/component/style/Italic');

var _Italic2 = _interopRequireDefault(_Italic);

var _Underline = require('./snow/editor/component/style/Underline');

var _Underline2 = _interopRequireDefault(_Underline);

var _Redo = require('./snow/editor/component/command/Redo');

var _Redo2 = _interopRequireDefault(_Redo);

var _Undo = require('./snow/editor/component/command/Undo');

var _Undo2 = _interopRequireDefault(_Undo);

var _Right = require('./snow/editor/component/layout/Right');

var _Right2 = _interopRequireDefault(_Right);

var _Left = require('./snow/editor/component/layout/Left');

var _Left2 = _interopRequireDefault(_Left);

var _Center = require('./snow/editor/component/layout/Center');

var _Center2 = _interopRequireDefault(_Center);

var _Emotion = require('./snow/editor/component/tool/Emotion');

var _Emotion2 = _interopRequireDefault(_Emotion);

var _AttachmentManager = require('./snow/editor/component/tool/AttachmentManager');

var _AttachmentManager2 = _interopRequireDefault(_AttachmentManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.SnowEditor = _SnowEditor2.default;

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
_SnowEditor2.default.registerComponent(_AttachmentManager2.default);

},{"./snow/editor/SnowEditor":4,"./snow/editor/component/command/Redo":8,"./snow/editor/component/command/Undo":9,"./snow/editor/component/layout/Center":10,"./snow/editor/component/layout/Left":11,"./snow/editor/component/layout/Right":12,"./snow/editor/component/style/Bold":13,"./snow/editor/component/style/Italic":14,"./snow/editor/component/style/Underline":15,"./snow/editor/component/tool/AttachmentManager":16,"./snow/editor/component/tool/Emotion":17,"./snow/editor/config":23}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    popLayerLevel: 9000,
    toastLayerLevel: 10000
};

exports.default = config;

},{}],3:[function(require,module,exports){
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
    } else {
        this.elements = [selecter];
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
                    if (/^on/.test(name)) {
                        var type = name.replace(/^on(.+)$/, '$1');
                        if (/[A-Z]/.test(type[0])) {
                            type = type[0].toLowerCase() + type.substr(1);
                        }
                        eventOn(this, type, attrs[name]);
                    } else {
                        this.setAttribute(name, attrs[name]);
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
            var get = this.getAttribute('class');
            if (get) {
                this.setAttribute('class', get + ' ' + add);
            } else {
                this.setAttribute('class', add);
            }
        });
        return this;
    },
    removeClass: function removeClass(remove) {
        this.each(function () {
            var get = this.getAttribute('class');
            var oldClass = get.split(/\s+/);
            var newClass = oldClass.filter(function (element) {
                return element !== remove;
            });
            this.setAttribute('class', newClass.join(' '));
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
    }
});

exports.default = DomElement;

},{"../util/fixCssPrefix":26,"../util/isArray":32}],4:[function(require,module,exports){
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
            onStateChange.call(editor);
            editor.fire('focus');
        },
        onclick: function onclick() {
            editor._foucs = true;
            onStateChange.call(editor);
            editor.fire('click');
        },
        onkeyup: function onkeyup() {
            editor.fire('contentChange', editor.content, editor.range);
        },
        onblur: function onblur() {
            editor._foucs = false;
            onStateChange.call(editor);
            editor.fire('blur');
        }
    }, {
        'min-height': editor.config['height']
    }, element.innerHTML);
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
            document.execCommand('insertHTML', null, value);
        } else {
            this.alert('no range can insert');
        }
    }
};

function _exec(name, value) {
    // console.log('_exec', name);
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
        this.id = editorCounter++;
        this.$ = _DomElement2.default;
        this.attachment = new Array();
        createEditorView(this);
        createToolBar(this);
    }

    _createClass(SnowEditor, [{
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
            var selection = window.getSelection();
            if (selection.rangeCount > 0) {
                return selection.getRangeAt(0);
            }
        },
        set: function set(range) {
            if (range) {
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
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

},{"../dom/DomElement":3,"../toast/Toast":25,"../util/printf":34,"./config":23}],5:[function(require,module,exports){
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
        key: "isImage",
        value: function isImage() {
            return (/^image\//.test(this.file.type)
            );
        }
    }, {
        key: "upload",
        value: function upload() {}
    }, {
        key: "lcoal",
        get: function get() {
            return this.data.lcoal || true;
        }
    }, {
        key: "html",
        get: function get() {
            var data = this.data;
            if (this.isImage) {
                return "<img title=\"" + data.name + "\" alt=\"" + data.name + "\" src=\"" + data.link + "\">";
            } else {
                return "<a title=\"" + data.name + "\" herf=\"" + data.link + "\">" + data.name + "</a>";
            }
        }
    }]);

    return Attachment;
}();

exports.default = Attachment;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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
                var range = this.onRangeAction(this.editor.range, event) || this.editor.range;
                this.editor.range = range;
            }
        }
    }]);

    return RangeComponent;
}(_Component3.default);

exports.default = RangeComponent;

},{"./Component":6}],8:[function(require,module,exports){
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

},{"../Component":6}],9:[function(require,module,exports){
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

},{"../Component":6}],10:[function(require,module,exports){
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

},{"../Range":7}],11:[function(require,module,exports){
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

},{"../Range":7}],12:[function(require,module,exports){
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

},{"../Range":7}],13:[function(require,module,exports){
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

},{"../Range":7}],14:[function(require,module,exports){
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

},{"../Range":7}],15:[function(require,module,exports){
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

},{"../Range":7}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

var _PopLayer = require('../../../poplayer/PopLayer');

var _PopLayer2 = _interopRequireDefault(_PopLayer);

var _DomElement = require('../../../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _getDropFiles2 = require('../../../util/getDropFiles');

var _getDropFiles3 = _interopRequireDefault(_getDropFiles2);

var _getPasteFiles2 = require('../../../util/getPasteFiles');

var _getPasteFiles3 = _interopRequireDefault(_getPasteFiles2);

var _isChildOf2 = require('../../../util/isChildOf');

var _isChildOf3 = _interopRequireDefault(_isChildOf2);

var _Attahment = require('../Attahment');

var _Attahment2 = _interopRequireDefault(_Attahment);

var _uploader = require('./uploader');

var _uploader2 = _interopRequireDefault(_uploader);

var _getSize = require('../../../util/getSize');

var _getSize2 = _interopRequireDefault(_getSize);

var _SnowEditor = require('../../../editor/SnowEditor');

var _SnowEditor2 = _interopRequireDefault(_SnowEditor);

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
        var file = files[i].getAsFile();
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
        editor.attachment.push(attachment);
    });
}

function showDropFilePanel() {
    hideDropFilePanel.call(this);
    var editor = this;
    var size = (0, _getSize2.default)(this.$content);
    var shade = n('div', {
        id: 'snow-' + this.id + '-drop',
        ondrop: function ondrop(event) {
            event.preventDefault();
            editor.dropEnter = false;
            hideDropFilePanel.call(editor);
            getDropFiles(event).forEach(function (attachment) {
                attachmentHandler(editor, attachment);
            });
        }
    }, {
        position: 'fixed',
        backgroundColor: 'rgba(0,0,0,0.3)',
        textAlign: 'center',
        lineHeight: size.height + 'px',
        top: size.top + 'px',
        left: size.left + 'px',
        height: size.height + 'px',
        width: size.width + 'px',
        color: '#fff',
        fointSize: '2em'
    }, _('拖入文件'));
    this.$content.parentNode.appendChild(shade);
    this.dropElement = shade;
    window.getSelection().removeAllRanges();
    editor.range = null;
}

function hideDropFilePanel() {
    if (this.dropElement) {
        this.$content.parentNode.removeChild(this.dropElement);
        this.dropElement = null;
    }
}

/**
 * 附件处理
 */

var AttachmentManager = function (_RangeComponent) {
    _inherits(AttachmentManager, _RangeComponent);

    function AttachmentManager(editor) {
        _classCallCheck(this, AttachmentManager);

        var _this = _possibleConstructorReturn(this, (AttachmentManager.__proto__ || Object.getPrototypeOf(AttachmentManager)).call(this, editor));

        editor.dropEnter = false;

        (0, _DomElement2.default)(editor.$content).on('paste', function (event) {
            getPasteImage(event).forEach(function (attachment) {
                attachmentHandler(editor, attachment);
            });
        });

        (0, _DomElement2.default)(window).on('dragenter', function (event) {
            event.preventDefault();
            if (editor.dropEnter === false) {
                showDropFilePanel.call(editor);
                editor.dropEnter = true;
            }
        });

        (0, _DomElement2.default)(window).on('drop', function (event) {
            // console.log('window', event.type, _getDropFiles(event));
            event.preventDefault();
            hideDropFilePanel.call(editor);
        });

        (0, _DomElement2.default)(window).on('dragover', function (event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            if (editor.dropEnter === false) {
                showDropFilePanel.call(editor);
                editor.dropEnter = true;
            }
        });

        (0, _DomElement2.default)(window).on('dragleave', function (event) {
            event.preventDefault();
            if (event.screenX === 0 && event.screenY === 0) {
                // console.log('window', event.type);
                hideDropFilePanel.call(editor);
                editor.dropEnter = false;
            }
        });
        return _this;
    }

    _createClass(AttachmentManager, [{
        key: 'init',
        value: function init(node) {
            var ele = _DomElement2.default.element('div', {}, { 'width': '10em', 'display': 'flex', 'flex-wrap': 'wrap' }, '<b>Attachment</b>');
            this.layer = new _PopLayer2.default(ele, node);
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {}
    }, {
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
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
}(_Range2.default);

exports.default = AttachmentManager;

},{"../../../dom/DomElement":3,"../../../editor/SnowEditor":4,"../../../poplayer/PopLayer":24,"../../../util/getDropFiles":27,"../../../util/getPasteFiles":28,"../../../util/getSize":30,"../../../util/isChildOf":33,"../Attahment":5,"../Range":7,"./uploader":20}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Range = require('../Range');

var _Range2 = _interopRequireDefault(_Range);

var _PopLayer = require('../../../poplayer/PopLayer');

var _PopLayer2 = _interopRequireDefault(_PopLayer);

var _DomElement = require('../../../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _Text = require('./emotion/Text');

var _Text2 = _interopRequireDefault(_Text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 表情处理
 */
var EmotionComponent = function (_RangeComponent) {
    _inherits(EmotionComponent, _RangeComponent);

    function EmotionComponent() {
        _classCallCheck(this, EmotionComponent);

        return _possibleConstructorReturn(this, (EmotionComponent.__proto__ || Object.getPrototypeOf(EmotionComponent)).apply(this, arguments));
    }

    _createClass(EmotionComponent, [{
        key: 'init',
        value: function init(node) {
            var childs = new Array();

            var that = this;
            this.editor.config.emotions.forEach(function (element) {
                var emotion = null;
                if (element.type === 'text') {
                    emotion = new _Text2.default(element);
                }
                if (emotion) {
                    emotion.content.forEach(function (emotionObj) {
                        var item = _DomElement2.default.element('span', {
                            class: 'snow-tool-emotions-item',
                            title: emotionObj.title,
                            onclick: function onclick() {
                                editor.exec('insertHTML', emotionObj.html);
                                that.layer.hide();
                            }
                        }, {}, emotionObj.view);
                        childs.push(item);
                    });
                }
            });
            var ele = _DomElement2.default.element('div', {}, { 'width': '10em', 'display': 'flex', 'flex-wrap': 'wrap' }, childs);
            this.layer = new _PopLayer2.default(ele, node);
        }
    }, {
        key: 'onStatusChange',
        value: function onStatusChange() {
            if (this.editor.range) {
                this._active = true;
                this.editor.$(this.node).removeClass('disable');
            } else {
                this._active = false;
                this.editor.$(this.node).addClass('disable');
            }
        }
    }, {
        key: 'onRangeAction',
        value: function onRangeAction(range, event) {
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
}(_Range2.default);

exports.default = EmotionComponent;

},{"../../../dom/DomElement":3,"../../../poplayer/PopLayer":24,"../Range":7,"./emotion/Text":19}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{"./Object":18}],20:[function(require,module,exports){
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

},{"../../../config":23,"./uploadToLocal":21,"./uploadToServer":22}],21:[function(require,module,exports){
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
                resolve(_config2.default.upload.adapter.local.resovle(result));
            } else {
                resovle(result);
            }
        });
    });
}

},{"../../../config":23}],22:[function(require,module,exports){
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
        var hasUploader = _config2.default.upload && _config2.default.upload.uploader;
        if (hasUploader) {} else {
            editor.alert('未定义文件上传函数');
        }
    });
}

},{"../../../config":23}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * 基础默认配置
 */
var config = {
    height: '10rem',
    editable: true,
    toolbar: [
    // 基本控制
    'bold', 'italic', 'underline',
    // 布局控制
    'align-left', 'align-center', 'align-right',
    // 表情
    'emotion', 'attachment',
    // 撤销与重做
    'undo', 'redo'],
    emotions: [{
        name: 'Emoji',
        type: 'text',
        content: '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐 😭'.split(/\s/)
    }],

    upload: {
        // 适配器
        adapter: {
            // base64 适配器
            local: {
                resovle: function resovle(uploaded) {
                    return uploaded;
                },
                reject: function reject(error) {
                    return error;
                }
            },
            // ajax 适配器
            server: {
                resovle: function resovle(uploaded) {
                    return uploaded;
                },
                reject: function reject(error) {
                    return error;
                }
            }
        },
        // 使用默认 (base64)
        uploader: null,
        // 上传配置
        config: null
    }
};

exports.default = config;

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _getSize = require('../util/getSize');

var _getSize2 = _interopRequireDefault(_getSize);

var _DomElement = require('../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _getPlatform = require('../util/getPlatform');

var _getPlatform2 = _interopRequireDefault(_getPlatform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultZIndexLevel = _config2.default.popLayerLevel || 9000;
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
            animation: STR.fadeOut + ' ease ' + animationTime + 's forwards'
        });
    }
    if (this.showShade) {
        (0, _DomElement2.default)(this.showShade).css({ animation: STR.fadeOut + ' ease ' + animationTime + 's forwards' });
    }
    setTimeout(function () {
        _this.clear();
    }, timeout);
}

function showElement(defaultDirection, posOfParent, posOfWindow, posOfPop) {
    this.clear();
    var initDisplayInWindow = function initDisplayInWindow(showElement) {
        var shade = this.config.shade || true;
        var hideInShadeClick = this.config.shadeClickHide || true;
        var layerPop = this.config.pop || (0, _getPlatform2.default)() === 'pc';
        var layer = this;
        var animationTime = this.animationTime;
        if (shade) {
            var style = window.getComputedStyle(showElement);
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
            (0, _DomElement2.default)(showElement).css(posOfPop).css({
                animation: STR.fadeIn + ' ease ' + animationTime + 's forwards'
            });
            this.showState = STR.windowPop;
        } else {
            (0, _DomElement2.default)(showElement).css(posOfWindow).css({
                animation: getAnimtion(this.direction, defaultDirection, 'In') + ' ease ' + animationTime + 's forwards'
            });
            this.showState = STR.windowSide;
        }
    };

    var initDisplayAfterParent = function initDisplayAfterParent(showElement) {
        var animationTime = this.animationTime;
        this.showState = STR.parentSide;
        this.showShade = null;
        (0, _DomElement2.default)(showElement).css(posOfParent).css({
            animation: getAnimtion(this.direction, defaultDirection, 'In') + ' ease ' + animationTime + 's forwards'
        });
    };

    var showElement = n('div', { id: 'pop-layer-' + this.id }, { display: 'block', position: 'fixed', zIndex: defaultZIndexLevel }, this.$element);
    getBody().appendChild(showElement);
    this.showElement = showElement;
    var size = (0, _getSize2.default)(this.$parent);
    var eleSize = (0, _getSize2.default)(showElement);
    var windowSize = (0, _getSize2.default)(null);
    if (size.left + eleSize.width > windowSize.width) {
        initDisplayInWindow.call(this, showElement, windowSize, eleSize);
    } else {
        initDisplayAfterParent.call(this, showElement, size);
    }
}

var showController = {
    outerBottom: function outerBottom(elemSize, parentSize, windowSize) {
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
        showElement.call(this, 'Bottom', posOfParent, posOfWindow, posOfPop);
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
    }

    /**
     * 显示弹出层
     */


    _createClass(PopLayer, [{
        key: 'show',
        value: function show() {
            var size = (0, _getSize2.default)(this.$parent);
            var eleSize = (0, _getSize2.default)(this.$element);
            var windowSize = (0, _getSize2.default)(null);
            showController[this.position].call(this, eleSize, size, windowSize);
            (0, _DomElement2.default)(this.showElement).css({ 'display': 'block' });
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

},{"../config":2,"../dom/DomElement":3,"../util/getPlatform":29,"../util/getSize":30}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _DomElement = require('../dom/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 常量
var TOAST_PARENT_ID = 'Toast-Parent';
var TOAST_SHOW_ID = 'Toast-Show';
var TOAST_DEFAULT_STYLE = 'toast';
var TOAST_POP_LEVEL = _config2.default.toastLayerLevel || 10000;

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

},{"../config":2,"../dom/DomElement":3}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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
  return event.clipboardData && event.clipboardData.items ? event.clipboardData.items : null;
}

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getSize;

var _getWindowSize2 = require('./getWindowSize');

var _getWindowSize3 = _interopRequireDefault(_getWindowSize2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSize(elem) {
    if (elem instanceof Element) {
        return elem.getBoundingClientRect();
    } else {
        var _getWindowSize = (0, _getWindowSize3.default)(),
            width = _getWindowSize.width,
            height = _getWindowSize.height;

        var elementRect = {
            width: width,
            height: height,
            left: 0,
            top: 0
        };
        return elementRect;
    }
}

},{"./getWindowSize":31}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getWindowSizes;

function getSize(axis, body, html) {
    return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis]);
}

function getWindowSizes() {
    var body = window.document.body;
    var html = window.document.documentElement;
    return {
        height: getSize('Height', body, html),
        width: getSize('Width', body, html)
    };
}

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isChildOf;
function isChildOf(elem, parent) {
    while (elem && elem != parent) {
        elem = elem.parentNode;
    }
    return elem === parent;
}

},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = printf;
/**
 * 格式化输出
 * @param {String} format 格式化字符串
 * @param  {...any} args 
 */
function printf(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return format.replace(/(?<!\$)\$(\d+|\w+?\b)/g, function (target, name) {
        if (args.length === 1 && args[0] instanceof Object) {
            return args[0][name] || target;
        } else {
            return args[name] || target;
        }
    });
}

},{}]},{},[1]);
