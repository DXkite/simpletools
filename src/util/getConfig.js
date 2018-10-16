import getRootPath from './getRootPath'

export default function getConfig(name) {
    if (name) {
        return window.SNOW_CONFIG[name];
    }
    return window.SNOW_CONFIG;
}