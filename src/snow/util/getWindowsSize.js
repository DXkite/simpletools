
function getAxisSize(axis, body, html) {
    const max = screen[axis.toLowerCase()];
    const array =
        [
            body[`offset${axis}`],
            body[`scroll${axis}`],
            html[`client${axis}`],
            html[`offset${axis}`],
            html[`scroll${axis}`],
        ].filter(item => {
            return item < max;
        });
    return Math.max(...array);
}

export default function getWindowsSize() {
    const body = window.document.body;
    const html = window.document.documentElement;
    return {
        height: getAxisSize('Height', body, html),
        width: getAxisSize('Width', body, html),
    };
}
