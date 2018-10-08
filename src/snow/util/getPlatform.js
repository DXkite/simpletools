 
export default function () {
    var agent = navigator.userAgent;
    if (agent.match(/(Mobile|Android|Linux|iPhone|iPad)/i)) {
        if (agent.match(/(Android|Linux)/i)) {
            return 'android';
        } else {
            return 'ios';
        }
    } else {
        return 'pc';
    }
}