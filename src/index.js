import config from './config'
import SnowEditor from './editor/SnowEditor'

import BoldStyleComponent from './editor/component/style/Bold'
import ItalicStyleComponent from './editor/component/style/Italic'
import UnderlineStyleComponent from './editor/component/style/Underline'
import RedoCommandComponent from'./editor/component/command/Redo'
import UndoCommandComponent from'./editor/component/command/Undo'
import RightLayoutComponent from './editor/component/layout/Right'
import LeftLayoutComponent from './editor/component/layout/Left'
import CenterLayoutComponent from './editor/component/layout/Center'
import EmotionComponent from './editor/component/tool/Emotion'

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
