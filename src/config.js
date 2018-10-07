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
        // 撤销与重做
        'undo',
        'redo'
    ],
    emotions: [
        {
            name: '默认',
            type: 'text',
            content: '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐'.split(/\s/),
        },
        {
            name: '颜文字',
            type: 'text',
            content: [],
        },
    ]
}

export default config