
function getSize(axis, body, html) {
    return Math.max(
        body[`offset${axis}`],
        body[`scroll${axis}`],
        html[`client${axis}`],
        html[`offset${axis}`],
        html[`scroll${axis}`],
    );
}

export default function getWindowSizes() {
    const body = window.document.body;
    const html = window.document.documentElement;
    return {
        height: getSize('Height', body, html),
        width: getSize('Width', body, html),
    };
}
