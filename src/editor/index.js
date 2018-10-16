import '../tab/index'
import '../upload/index'

import config from './config'
import SnowEditor from './SnowEditor'

import BoldStyleComponent from './component/style/Bold'
import ItalicStyleComponent from './component/style/Italic'
import UnderlineStyleComponent from './component/style/Underline'
import RedoCommandComponent from'./component/command/Redo'
import UndoCommandComponent from'./component/command/Undo'
import RightLayoutComponent from './component/layout/Right'
import LeftLayoutComponent from './component/layout/Left'
import CenterLayoutComponent from './component/layout/Center'
import EmotionComponent from './component/tool/Emotion'
import ImageComponent from './component/tool/Image'
import LinkComponent from './component/tool/Link'
import AttachmentManager from './component/tool/AttachmentManager'



SnowEditor.applyDefaultConfig(config);

SnowEditor.registerComponent(BoldStyleComponent);
SnowEditor.registerComponent(ItalicStyleComponent);
SnowEditor.registerComponent(UnderlineStyleComponent);

SnowEditor.registerComponent(RightLayoutComponent);
SnowEditor.registerComponent(CenterLayoutComponent);
SnowEditor.registerComponent(LeftLayoutComponent);

SnowEditor.registerComponent(UndoCommandComponent);
SnowEditor.registerComponent(RedoCommandComponent);

SnowEditor.registerComponent(EmotionComponent);
SnowEditor.registerComponent(ImageComponent);
SnowEditor.registerComponent(LinkComponent);
SnowEditor.registerComponent(AttachmentManager);


window.snow = window.snow || {};
window.snow.Editor = SnowEditor
