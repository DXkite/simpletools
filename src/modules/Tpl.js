;!(function(window) {
    // 可独立的模板
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
    var _objectCopy = function (arrays) {
        var object = {};
        for (var i = 0; i < arguments.length; i++) {
            for (var index in arguments[i]) {
                object[index] = arguments[i][index];
            }
        }
        return object;
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
            value=_objectCopy(value,valueset);
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
})(window)