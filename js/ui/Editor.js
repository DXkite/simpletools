(function (dxui) {
    var $ = dxui.dom;
    var Editor = function (node) {
        this.m_node = node;
        var self = this;
        this.buildRichUI();
        // 丢失焦点获取最后编辑的光标位置
        $(this.m_content).on('blur', function () {
            self.m_selection = window.getSelection();
            self.setRange(self.m_selection.getRangeAt(0))
        });
    }

    Editor.prototype = {
        getRange: function () {
            if (this.m_range) {
                return this.m_range;
            }
            var range = document.createRange();
            var node = null;
            if (this.m_content.firstChild) {
                node = this.m_content.firstChild;
            } else {
                node = $.element('p');
                this.m_content.appendChild(node);
            }
            range.selectNode(node);
            return range;
        },
        setRange: function (range) {
            this.m_range = range.cloneRange();
        },
        insertNode: function (element) {
            var range = this.getRange();
            range.insertNode(element);
        },
        buildRichUI: function () {
            var self = this;
            this.m_controls = $.element('div', {
                class: 'editor-controls'
            });
            this.m_content = $.element('div', {
                contenteditable: 'true',
                class: 'editor-content'
            });

            this.m_node.appendChild(this.m_controls);
            this.m_node.appendChild(this.m_content);
            
            
            var insertHTML = $.element('a', {
                href: '#'
            }, {
                cursor: 'pointer'
            });

            insertHTML.innerHTML = 'Html';
            this.m_controls.appendChild(insertHTML);

            $(insertHTML).on('click', function () {
                var value = prompt('url:');
                var newNode = $.element('div');
                newNode.innerHTML = value;
                self.insertNode(newNode);
            });
        }
    };


    dxui.Editor = Editor;
})(dxui);