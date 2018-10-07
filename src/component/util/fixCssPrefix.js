const cssPrefix = function () {
    var styles = window.getComputedStyle(document.documentElement, '');
    var core = (
        Array.prototype.slice
            .call(styles)
            .join('')
            .match(/-(moz|webkit|ms|)-/) || (styles.OLink === '' && ['', 'o'])
    )[1];
    return '-' + core + '-';
}();

/**
 * 转换CSS前缀
 * @param {String} name 
 */
export default function fixCssPrefix(name) {
    name = name.trim();
    name = typeof document.documentElement.style[name] === 'undefined' ? cssPrefix + name : name;
    return name;
}