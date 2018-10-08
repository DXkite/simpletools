import getWindowSize from './getWindowSize'

export default function getSize(elem) {
    if (elem instanceof Element) {
        return elem.getBoundingClientRect();
    } else {

        const { width, height } = getWindowSize();
        let elementRect = {
            width,
            height,
            left: 0,
            top: 0,
        };
        return elementRect;
    }
}