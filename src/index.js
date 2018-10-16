import './snow/tab/index'
import './snow/upload/index'

import config from './snow/editor/config'
import SnowEditor from './snow/editor/SnowEditor'

import BoldStyleComponent from './snow/editor/component/style/Bold'
import ItalicStyleComponent from './snow/editor/component/style/Italic'
import UnderlineStyleComponent from './snow/editor/component/style/Underline'
import RedoCommandComponent from'./snow/editor/component/command/Redo'
import UndoCommandComponent from'./snow/editor/component/command/Undo'
import RightLayoutComponent from './snow/editor/component/layout/Right'
import LeftLayoutComponent from './snow/editor/component/layout/Left'
import CenterLayoutComponent from './snow/editor/component/layout/Center'
import EmotionComponent from './snow/editor/component/tool/Emotion'
import ImageComponent from './snow/editor/component/tool/Image'
import LinkComponent from './snow/editor/component/tool/Link'
import AttachmentManager from './snow/editor/component/tool/AttachmentManager'


window.SnowEditor = SnowEditor

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