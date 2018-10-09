/**
 * 格式化输出
 * @param {String} format 格式化字符串
 * @param  {...any} args 
 */
export default function printf(format, ...args) {
    return format.replace(/(?<!\$)\$(\d+|\w+?\b)/g, function (target, name) {
        if (args.length === 1 && args[0] instanceof Object) {
            return args[0][name] || target;
        } else {
            return args[name] || target;
        }
    });
}