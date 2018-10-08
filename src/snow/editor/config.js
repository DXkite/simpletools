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
    ]
}

export default config