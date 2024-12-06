// toolbar.js
class Toolbar {
    constructor() {
        this.toolbarElement = document.querySelector(".tool-bar");
        this.initializeToolbar();
    }

    initializeToolbar() {
        // 初始化工具栏按钮
        document.querySelectorAll('.tool-bar button').forEach(button => {
            button.addEventListener('click', (e) => {
                const toolAction = e.target.getAttribute('data-action');
                this.handleToolAction(toolAction);
            });
        });
    }

    // 根据按钮的 data-action 执行不同的操作
    handleToolAction(action) {
        switch (action) {
            case 'start':
                console.log("态势启动");
                break;
            case 'stop':
                console.log("态势停止");
                break;
            case 'refresh':
                console.log("态势复原");
                break;
            case 'generate':
                console.log("态势代码生成");
                break;
            case 'delete':
                console.log("组件删除");
                break;
            case 'reset':
                console.log("中心复位");
                break;
            case 'center':
                console.log("设置态势中心");
                break;
            case 'match':
                console.log("匹配连接");
                break;
            case 'evaluate':
                console.log("评估");
                break;
            case 'toggle-full':
                // 获取sidebar和按钮
                document.querySelector('.side-bar').classList.toggle('hidden');
                document.querySelector('.radar-display').classList.toggle('hidden');
                break;
            case 'toggle-sidebar':
                // 获取sidebar和按钮
                document.querySelector('.side-bar').classList.toggle('hidden');
                break;
            case 'toggle-radarbar':
                // 获取sidebar和按钮
                document.querySelector('.radar-display').classList.toggle('hidden');
                break;
            case 'setting':
                console.log("样机设置");
                openModal();
                break;
            default:
                console.log("Unknown tool action", action);
        }
    }
}
