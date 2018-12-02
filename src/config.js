(function () {
    /**
     * UI相配置
     */
    var config = {
        poplayer: { level: 9000, shade: true, display: 'auto', forceSize: false },
        toast: { layerLevel: 10000 },
        editor: {
            height: '10rem',
            editable: true,
            toolbar: [
                // 基本控制
                'bold',
                'italic',
                'underline',
                // 布局控制
                'align-left',
                'align-center',
                'align-right',
                // 表情
                'emotion',
                'image',
                'link',
                'attachment',
                // 撤销与重做
                'undo',
                'redo'
            ],
            /**
             * 表情
             */
            emotions: [
                {
                    name: 'Emoji',
                    type: 'text',
                    content: '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐 😭'.split(/\s/),
                }
            ],

            upload: {
                // 适配器
                adapter: {
                    // base64 适配器
                    local: {
                        resolve: uploaded => uploaded,
                        reject: error => error
                    },
                    // ajax 适配器
                    server: {
                        resolve: uploaded => uploaded,
                        reject: error => error
                    }
                },
                // 使用默认 (base64)
                uploader: null,
                // 上传配置
                config: null,
            },
        }
    }
    window.SNOW_CONFIG = config;
})();

