let exp = null;
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
export default function printf(format, ...args) {

    return format.replace(exp, function (target, name) {
        if (args.length === 1 && args[0] instanceof Object) {
            return args[0][name] || target;
        } else {
            return args[name] || target;
        }
    });
}