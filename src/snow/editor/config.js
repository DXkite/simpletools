/**
 * 基础默认配置
 */
const config = {
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
        'attachment',
        // 撤销与重做
        'undo',
        'redo'
    ],
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
                resovle: uploaded => uploaded,
                reject: error => error
            },
            // ajax 适配器
            server: {
                resovle: uploaded => uploaded,
                reject: error => error
            }
        },
        // 使用默认 (base64)
        uploader: null,
        // 上传配置
        config: null,
    },
}

export default config