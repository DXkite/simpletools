/* --------------- 全局函数 ------------------ */
var util = {};

util.is_function = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
}
util.is_array = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
util.is_object = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
util.is_string = function (obj) {
    return typeof obj === 'string';
}
util.get_root_path = function () {
    var scripts = document.getElementsByTagName("script");
    var _self_path = scripts[scripts.length - 1].getAttribute("src");
    return _self_path.substring(0, _self_path.lastIndexOf("/"));
}
// 分发事件
util.dipatch_event = function (obj, name, value, canBubbleArg, cancelAbleArg) {
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
util.object_copy = function (arrays) {
    var object = {};
    for (var i = 0; i < arguments.length; i++) {
        for (var index in arguments[i]) {
            object[index] = arguments[i][index];
        }
    }
    return object;
}


// 前缀支持
util.get_css_perfix = function () {
    var styles = window.getComputedStyle(document.documentElement, '');
    var core = (
        Array.prototype.slice
            .call(styles)
            .join('')
            .match(/-(moz|webkit|ms|)-/) || (styles.OLink === '' && ['', 'o'])
    )[1];
    return '-' + core + '-';
}

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
}

util.cssfix = add_css_prefix;

export default util