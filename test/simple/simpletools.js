/*! simpletools by DXkite 2018-08-26 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _util = require('../util');

var Dom = function Dom(selecter, context) {
    return new Dom.constructor(selecter, context);
};

Dom.constructor = function (selecter, context) {
    if (typeof selecter === 'string') {
        this.elements = (context || document).querySelectorAll(selecter);
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

Dom.extend = function (methods) {
    for (var name in methods) {
        this[name] = methods[name];
    }
};

Dom.extend({
    element: function element(tag, attr, css) {
        var element = document.createElement(tag);
        Dom(element).attr(attr).css(css);
        return element;
    }
});

Dom.method = Dom.constructor.prototype;
Dom.method.extend = Dom.extend;
// 属性方法
Dom.method.extend({
    attr: function attr(attrs) {
        this.each(function () {
            if (attrs) {
                for (var name in attrs) {
                    this.setAttribute(name, attrs[name]);
                }
            }
        });
        return this;
    },
    css: function css(cssObj) {
        this.each(function () {
            if (cssObj) {
                for (var name in cssObj) {
                    this.style[_util.util.cssfix(name)] = cssObj[name];
                }
            }
        });
        return this;
    },
    addClass: function addClass(add) {
        this.each(function () {
            this.class += ' ' + add;
        });
        return this;
    },
    removeClass: function removeClass(remove) {
        this.each(function () {
            var reg = new RegExp('/\\s+?' + remove + '/');
            this.class.replace(reg, '');
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
        var captrue = (typeof useCaptrue === 'undefined' ? 'undefined' : _typeof(useCaptrue)) === undefined ? true : useCaptrue;
        this.each(function () {
            this.addEventListener(type, listener, captrue);
        });
        return this;
    }
});

module.exports = Dom;

},{"../util":8}],2:[function(require,module,exports){
'use strict';

var _Dom = require('./Dom');

var _Dom2 = _interopRequireDefault(_Dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.dxui = window.dxui || {}; // 简单Dom操作

window.dxui.dom = _Dom2.default;

},{"./Dom":1}],3:[function(require,module,exports){
'use strict';

require('./template/index');

require('./dom/index');

require('./toast/index');

// 导入HTML模板工具

// 简单Dom操作
window.dxui.version = '1.0';
// Toast 功能

},{"./dom/index":2,"./template/index":5,"./toast/index":7}],4:[function(require,module,exports){
'use strict';

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

function renderTpl(selector, glovalue) {
    var nodes = document.querySelectorAll(selector);
    // console.log(nodes);
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
        node.innerHTML = render(selector, source, code, value, config.strict);
    });
};

/**
 * 渲染模板代码
 * 
 * @param {any} name
 * @param {any} source
 * @param {any} compiled_code
 * @param {any} value
 * @returns
 */
function render(name, source, compiled_code, value, strict) {
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
function compile(id, config) {
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

/* -----------------  外部函数 public ---------------------------*/

var Template = function Template(name, config) {
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
};

Template.prototype.config = function (config) {
    for (var index in config) {
        this[index] = config[index];
    }
    return this;
};

Template.prototype.assign = function (name, value) {
    this.value[name] = _objectCopy(this.value[name], value);
    return this;
};

Template.prototype.value = function (value) {
    this.value = _objectCopy(this.value, value);
    return this;
};

Template.prototype.compile = function (id) {
    var config = _objectCopy(this, compile(id, this));
    return new Template(config);
};

Template.prototype.render = function (value) {
    // 未编译
    if (!(this.source && this.code)) {
        var val = compile(this.id, this);
        this.config(val);
    }
    return render(this.id, this.source, this.code, value, this.strict);
};

module.exports = { Template: Template, renderTpl: renderTpl };

},{}],5:[function(require,module,exports){
'use strict';

var _Template = require('./Template');

// 模板导入
window.dxtpl = new _Template.Template();
window.Template = _Template.Template;
window.renderTpl = _Template.renderTpl;

},{"./Template":4}],6:[function(require,module,exports){
'use strict';

var _Dom = require('../dom/Dom');

var _Dom2 = _interopRequireDefault(_Dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 常量
var TOAST_PARENT_ID = 'Toast-Parent';
var TOAST_SHOW_ID = 'Toast-Show';
var TOAST_DEFAULT_STYLE = 'toast';
var TOAST_POP_LEVEL = 10000;

var Toast = function Toast(text, time, style) {
    return new Toast.create(text, time, style);
};

// Toast队列
Toast.Queue = new Array();
// 构造函数
Toast.create = function (message, time, style) {
    Toast.Parent = document.getElementById(TOAST_PARENT_ID);

    if (!Toast.Parent) {
        Toast.Parent = _Dom2.default.element('div', { id: TOAST_PARENT_ID }, { pointerEvents: 'none' });
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
    var toastdiv = _Dom2.default.element('div', {
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
        (0, _Dom2.default)(toastdiv).css({
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

    (0, _Dom2.default)(toastdiv).css({
        position: 'fixed',
        opacity: 1,
        zIndex: TOAST_POP_LEVEL,
        pointerEvents: 'none',
        transition: 'opacity 0.1s ease-in'
    });
    setTimeout(close, timeout);
};

module.exports = Toast;

},{"../dom/Dom":1}],7:[function(require,module,exports){
'use strict';

var _Toast = require('./Toast');

var _Toast2 = _interopRequireDefault(_Toast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.dxui = window.dxui || {}; // Toast 功能

window.dxui.Toast = _Toast2.default;

},{"./Toast":6}],8:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* --------------- 全局函数 ------------------ */
var util = {};

util.is_function = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
};
util.is_array = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
util.is_object = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};
util.is_string = function (obj) {
    return typeof obj === 'string';
};
util.get_root_path = function () {
    var scripts = document.getElementsByTagName("script");
    var _self_path = scripts[scripts.length - 1].getAttribute("src");
    return _self_path.substring(0, _self_path.lastIndexOf("/"));
};
// 分发事件
util.dipatch_event = function (obj, name, value, canBubbleArg, cancelAbleArg) {
    var event = document.createEvent(str_cache[0]);
    var canBubble = (typeof canBubbleArg === 'undefined' ? 'undefined' : _typeof(canBubbleArg)) === undefined ? true : canBubbleArg;
    var cancelAbl = (typeof cancelAbleArg === 'undefined' ? 'undefined' : _typeof(cancelAbleArg)) === undefined ? true : cancelAbleArg;
    event.initCustomEvent(name, canBubble, cancelAbl, value);
    obj.dispatchEvent(event);
    if (obj['on' + name] && is_function(obj['on' + name])) {
        obj['on' + name].call(obj, event);
    }
    return event;
};

/**
 * 复制合并对象
 * 
 * @param {Object|string} arrays
 * @returns
 */
util.object_copy = function (arrays) {
    var object = {};
    for (var i = 0; i < arguments.length; i++) {
        for (var index in arguments[i]) {
            object[index] = arguments[i][index];
        }
    }
    return object;
};

// 前缀支持
util.get_css_perfix = function () {
    var styles = window.getComputedStyle(document.documentElement, '');
    var core = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms|)-/) || styles.OLink === '' && ['', 'o'])[1];
    return '-' + core + '-';
};

util.css_perfix = util.get_css_perfix();

/**
 * 添加CSS前缀（如果存在前缀）
 * 
 * @param {string} name
 * @returns 
 */
function add_css_prefix(name) {
    name = name.trim();
    name = typeof document.documentElement.style[name] === 'undefined' ? util.css_perfix + name : name;
    return name;
}

/**
 * 将驼峰式CSS转化成CSS文件用的CSS命名
 * 
 * @param {string} name
 * @returns
 */
util.cssname = function (name) {
    name = add_css_prefix(name);
    name = name.replace(/[A-Z]/, function (name) {
        return '-' + name.toLowerCase();
    });
    return name;
};

util.cssfix = add_css_prefix;

module.exports = { util: util };

},{}]},{},[3]);
