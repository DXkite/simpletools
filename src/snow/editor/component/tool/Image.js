import Component from '../Component'
import Layer from '../../../poplayer/PopLayer'
import $ from '../../../dom/DomElement'
/**
 * 图片处理
 */
class ImageComponent extends Component {

    constructor(editor) {
        super(editor);

      
    }

    init(node) {
       
    }

    get name() {
        return 'image';
    }

    get view() {
        return '<i class="iconfont snow-icon-' + this.name + '"></i>';
    }

    onStatusChange() {

    }

    onClick(event) {
    
    }
}

export default ImageComponent;