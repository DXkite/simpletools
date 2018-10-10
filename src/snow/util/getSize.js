import getWindowsSize from './getWindowsSize'

export default function getSize(elem) {
    if (elem instanceof Element) {
        return elem.getBoundingClientRect();
    } else /*if (elem instanceof Window)*/ {
        const { width, height } = getWindowsSize();
       
        let elementRect = {
            width,
            height,
            left: 0,
            top: 0,
        };
        return elementRect;
    }
}