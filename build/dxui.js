// 初始化
var dxui = dxui || {
    version: '1.0.0'
};
/** DOM 辅助 */
(function (dxui) {
    var DxDOM = function (selecter, context) {
        return new DxDOM.methods.constructor(selecter, context);
    }

    DxDOM.methods = DxDOM.prototype;

    DxDOM.methods.constructor = function (selecter, context) {
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


    DxDOM.methods.extend = function (methods) {
        for (var name in methods) {
            this[name] = methods[name];
        }
    };

    DxDOM.prototype.constructor.prototype = DxDOM.methods;

    DxDOM.methods.extend({
        createElement: function (tag, attr, css) {
            var element = document.createElement(tag);
            DxDOM(element).setAttr(attr).setCss(css);
            return element;
        },
        setAttr: function (attrs) {
            this.each(function () {
                if (attrs) {
                    for (var name in attrs) {
                        this.setAttribute(name, attrs[name]);
                    }
                }
            });
            return this;
        },
        setCss: function (cssObj) {
            this.each(function () {
                if (cssObj) {
                    for (var name in cssObj) {
                        this.style[dxui.cssfix(name)] = cssObj[name];
                    }
                }
            });
            return this;
        },
        addClass: function (add) {
            this.each(function () {
                this.class += ' ' + add;
            });
            return this;
        },
        removeClass: function (remove) {
            this.each(function () {
                var reg = new RegExp('/\\s+?' + remove + '/');
                this.class.replace(reg, '');
            });
            return this;
        },
        each: function (callback) {
            for (var i = 0; i < this.length; i++) {
                callback.call(this[i], this[i], i);
            }
            return this;
        },
        on: function (type, listener, useCaptrue) {
            var captrue = typeof useCaptrue === undefined ? true : useCaptrue;
            this.each(function () {
                this.addEventListener(type, listener, useCaptrue);
            });
            return this;
        },
    });

    dxui.dom = DxDOM;
})(dxui);
(function (dxui) {
    "use strict";
    /* --------------- 全局函数 ------------------ */
    dxui.is_function = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    }
    dxui.is_array = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    dxui.is_object = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    dxui.is_string = function (obj) {
        return typeof obj === 'string';
    }
    dxui.get_root_path = function () {
            var scripts = document.getElementsByTagName("script");
            var _self_path = scripts[scripts.length - 1].getAttribute("src");
            return _self_path.substring(0, _self_path.lastIndexOf("/"));
        }
        // 分发事件
    dxui.dipatch_event = function (obj, name, value, canBubbleArg, cancelAbleArg) {
        var event = document.createEvent(str_cache[0]);
        var canBubble = typeof canBubbleArg === undefined ? true : canBubbleArg;
        var cancelAbl = typeof cancelAbleArg === undefined ? true : cancelAbleArg;
        event.initCustomEvent(name, canBubble, cancelAbl, value);
        obj.dispatchEvent(event);
        if (obj['on' + name] && is_function(obj['on' + name])) {
            obj['on' + name].call(obj, event);
        }
        return event;
    }

    /**
     * 复制合并对象
     * 
     * @param {Object|string} arrays
     * @returns
     */
    dxui.object_copy = function (arrays) {
        var object = {};
        for (var i = 0; i < arguments.length; i++) {
            for (var index in arguments[i]) {
                object[index] = arguments[i][index];
            }
        }
        return object;
    }


    // 前缀支持
    dxui.get_css_perfix = function () {
        var styles = window.getComputedStyle(document.documentElement, '');
        var core = (
            Array.prototype.slice
            .call(styles)
            .join('')
            .match(/-(moz|webkit|ms|)-/) || (styles.OLink === '' && ['', 'o'])
        )[1];
        return '-' + core + '-';
    }
    dxui.css_perfix = dxui.get_css_perfix();

    /**
     * 添加CSS前缀（如果存在前缀）
     * 
     * @param {string} name
     * @returns 
     */
    function add_css_prefix(name) {
        name = name.trim();
        name = typeof document.documentElement.style[name] === 'undefined' ?  dxui.css_perfix + name : name;
        return name;
    }

    /**
     * 将驼峰式CSS转化成CSS文件用的CSS命名
     * 
     * @param {string} name
     * @returns
     */
    dxui.cssname = function css_name(name) {
        name = add_css_prefix(name);
        name = name.replace(/[A-Z]/, function (name) {
            return '-' + name.toLowerCase();
        });
        return name;
    }
    dxui.cssfix = add_css_prefix;
    window.dxui = dxui;
})(dxui);
(function (dxui) {
    /**
     * 创建可移动层
     * 
     * @param {Element} layer 移动层
     * @param {Element} controller 控制移动的层
     * @returns
     */
    dxui.moveable=function moveable(layer, controller) {
        var _controller = controller || layer;
        var _self = layer;
        // 调整层可以移动
        _self.style.position = 'fixed';
        var _move_layer = function (event) {
                // 阻止拖动页面（手机端）
                event.preventDefault();
                var eventMove = 'mousemove',
                    eventEnd = 'mouseup';
                // 手机触屏事件会成多点触控
                if (event.touches) {
                    event = event.touches[0];
                    eventMove = 'touchmove';
                    eventEnd = 'touchend';
                }
                var rect = _controller.getBoundingClientRect();
                var x = event.clientX - rect.left;
                var y = event.clientY - rect.top;
                // 拖拽
                var doc = document;
                if (_self.setCapture) {
                    _self.setCapture();
                } else if (window.captureEvents) {
                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }

                // 移动
                var winmove = function (e) {
                    if (e.touches) {
                        e = e.touches[0];
                    }
                    var px = e.pageX || (e.clientX + document.body.scrollLeft - document.body.clientLeft);
                    var py = e.pageY || (e.clientY + document.body.scrollTop - document.body.clientTop);

                    var dx = px - x;
                    var dy = py - y;
                    _self.style.left = dx + 'px';
                    _self.style.top = dy + 'px';
                };
                // 停止
                var winend = function (e) {
                    if (_self.releaseCapture) {
                        _self.releaseCapture();
                    } else if (window.releaseEvents) {
                        window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                    }
                    doc.removeEventListener(eventMove, winmove);
                    doc.removeEventListener(eventEnd, winend);
                };
                doc.addEventListener(eventMove, winmove);
                doc.addEventListener(eventEnd, winend);
            }
            // 监听起始事件
        _controller.addEventListener('mousedown', _move_layer);
        _controller.addEventListener('touchstart', _move_layer);
        return _self;
    }
})(dxui);
(function(dxui) {
    // 可独立的模板
    "use strict";
    var dxtpl = {};
    //  缓存查找节点可能会耗时较多 
    var defaults = {
        cache: true,    // 是否开启缓存
        tags: ['{', '}'], //控制标签
        compress: true,
        use_strict: true,
    };
    // 关键字
    var keywords = 'if,else,each,include,while,for';
    var keyword_preg = '^\\s*((?:\/)?(?:' + keywords.split(',').join('|') + '))(.*)';

    var tagstart = defaults.tags[0];
    var tagend = defaults.tags[1];
    var cache = defaults.cache;
    var compress = defaults.compress;
    var use_strict = defaults.use_strict;

    dxtpl.config = function(config) {
        cache = (typeof config.cache !== undefined) ? config.cache : defaults.cache;
        compress = (typeof config.compress !== undefined) ? config.compress : defaults.compress;
        if (config.tags && config.tags.length === 2) {
            tagstart = config.tags[0];
            tagend = config.tags[1]
        }
    }
    
    // @artTemplate:https://github.com/aui/artTemplate
    var is_new_engine = ''.trim;
    var replaces = is_new_engine
        ? ["$_tpl_=''", "$_tpl_+=", ";", "$_tpl_"]
        : ["$_tpl_=[]", "$_tpl_.push(", ");", "$_tpl_.join('')"];

    var escape = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    };
    var statment_test = function(test, code) {
        try {
            new Function(test);
        } catch (e) {
            return 'throw ' + e.name + '(' + _string(e.message) + ');{';
        }
        return code;
    }

    var parsers = {
        html: function(html) {
            // console.log('HTML:', html);
            var out = '';
            if (html.match(/(?!^)\n/)) {
                _each(html.split('\n'), function(html) {
                    if (html) {
                        // 压缩多余空白与注释
                        if (compress) {
                            html = html.replace(/\s+/g, ' ').replace(/<!--.*?-->/g, '');
                        }
                        if (html) {
                            out += replaces[1] + _string(html) + replaces[2];
                            out += '\n';
                        }
                    }
                });
            } else if (html) {
                out += replaces[1] + _string(html) + replaces[2];
            }
            return out;
        },
        code: function(code) {
            var match;
            // console.log(new RegExp(keyword_preg));
            if (match = code.match(new RegExp(keyword_preg))) {
                // console.log(code,':',match);
                var command = match[1];
                var param = match[2];

                switch (command) {
                    case 'include': // 编译时包含
                        param = param.trim().split(' ');
                        if (param.length === 1) {
                            param.push("$_unit.value");
                        }
                        param = param.join(',');
                        return replaces[1] + '$_unit._include(' + param + ')' + replaces[2];
                    case 'if':
                        return statment_test('if(' + param + '){}', 'if (' + param + ') {');
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
                        return statment_test('while(' + param + '){}', 'while (' + param + ') {');
                    case 'for':
                        return statment_test('for(' + param + '){}', 'for (' + param + ') {');
                    case 'each':
                        var match = param.match(/(\w+)\s+(?:(?:as(?:\s+(\w+)))?(?:(?:\s+=>)?\s+(\w+))?)?/);
                        if (match) {
                            var value = match[1];
                            var each_param;
                            if (match[2]) {
                                if (match[3]) {
                                    each_param = match[3] + ',' + match[2];
                                }
                                else {
                                    each_param = match[2];
                                }
                            }
                            else {
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
                return replaces[1] + '$_unit._echo(' + match[1] + ')' + replaces[2];
            }
            // 转义输出
            else {
                return replaces[1] + '$_unit._escape(' + code + ')' + replaces[2];
            }
        }
    }


    var escape_callback = function(s) {
        return escape[s];
    };
    var _echo = function(value) {
        return new String(value);
    }
    var _escape = function(content) {
        return _echo(content).replace(/&(?![\w#]+;)|[<>"']/g, escape_callback);
    };

    var _each = function(value, callback) {
        if (is_array(value)) {
            _arrayEach(value, callback);
        }
        else {
            for (var index in value) {
                callback.call(value[index], value[index], index);
            }
        }
    }
    var _arrayEach = function(value, callback) {
        for (var index = 0; index < value.length; ++index) {
            callback.call(value[index], value[index], index);
        }
    }

    var _include = function(id, value) {
        if (document.getElementById(id)) {
            try {
                var tmp = new template(id, value);
                if (tmp instanceof String) {
                    return tmp;
                }
                return '[Error Template ' + id + ']';
            } catch (e) {
                throw e;
            }
        }
        else
            throw Error('No Template ' + id);
    }

    // 字符串转义
    function _string(code) {
        return "'" + code
            // 单引号与反斜杠转义
            .replace(/('|\\)/g, '\\$1')
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n') + "'";
    }

    function is_array(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    var reportError = function(name, content, line, e) {
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
                }
                else {
                    console.log(i + '|' + codes[i - 1]);
                }
            }

        }
        else {
            console.log(content);
            console.log('%c' + report + e.message + '\t\t@' + name + ':' + line, 'color:red;');
        }
        console.groupEnd(report);
    }
    var compile = function(text, parsers) {
        var tpl = '';
        // console.log('code',text);
        text = text.replace(/^\n/, '');
        // console.log(tagstart);
        _each(text.split(tagstart), function(value, index) {
            // console.log('split',value);
            var split = value.split(tagend);
            if (split.length === 1) {
                tpl += parsers.html(split[0]);
            }
            else {
                tpl += parsers.code(split[0]);
                tpl += parsers.html(split[1]);
            }
        });
        return tpl;
    }

    var link = function(source, value) {
        var ext = [];
        ext.push('var $_unit=this,' + replaces[0]);
        for (var index in value) {
            ext.push(index + '=this.value.' + index);
        }
        var link_str = '';
        if (use_strict) {
            link_str = '"use strict";';
        }
        link_str += ext.join(',');
        link_str += ';';
        link_str += source + 'return new String(' + replaces[3] + ');';
        return link_str;
    }

    var render = function(name, source, compiled_code, value) {
        // console.time('render ' + name);
        var runcode = link(compiled_code, value);
        // console.log(runcode);
        var caller = { _each: _each, _echo: _echo, _escape: _escape, _include: _include, value: value };
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
            }
            else {
                var name = name || 'anonymous';
                // For Edge
                var match = new String(e.stack).match(/Function code:(\d+):\d+/);
                if (match) {
                    console.error('DxTPL:Compile Error@' + name + ' Line ' + match[1]);
                }
                else {
                    console.error('DxTPL:Compile Error@' + name);
                }
            }

        }
        // console.timeEnd('render ' + name);
        return html;
    }
    var template_Cache;
    var get_cache = function(name) {
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
            tpl_cache.innerText = compile(document.getElementById(name).innerHTML, parsers);
            cache_parent.appendChild(tpl_cache);
        }
        // console.timeEnd('getcache:' + name);
        return tpl_cache.innerText;
    }

    var selftpl = function(selector, valueset) {
        var nodes = document.querySelectorAll(selector);
        // console.log(nodes);
        _arrayEach(nodes, function(node, index) {
            var source = node.innerHTML;
            var value;
            if (node.dataset.tplInit) {
                try {
                    var json = new Function('return ' + node.dataset.tplInit + ';');
                    value = json();
                } catch (e) {
                    reportError(selector + '[' + index + ']', null, 0, new Error('Unsupport json'));
                }
            }
            value=dxui.object_copy(value,valueset);
            var code = compile(source, parsers);
            node.innerHTML = render(selector, source, code, value);
        });
    }
    var template = function(id, value) {
        if (typeof id !== 'string') throw Error('Unsupport Template ID');
        var tpl = document.getElementById(id);
        var code;
        var source = tpl.innerHTML;
        // console.log(source);
        if (cache) {
            code = get_cache(id);
        }
        else {
            code = compile(source, parsers);
            // console.log('compiled:',code);
        }

        if (value) {
            return render(id, source, code, value);
        }
        else {
            return {

                config: dxtpl.config,
                display: function(value) {
                    return render(id, source, code, value);
                }
            }
        }
    }


    dxtpl.compile = function(content) {
        return {
            display: function(value) {
                return render(null, content,compile(content, parsers),value);
            }
        }
    }
    dxtpl.template = template;
    dxtpl.selftpl = selftpl;
    window.dxtpl=dxtpl;
})(dxui);



/* HTML5 视频播放器 */