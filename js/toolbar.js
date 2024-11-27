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
            case 'tool1':
                console.log("Tool 1 activated");
                break;
            case 'tool2':
                console.log("Tool 2 activated");
                break;
            case 'tool3':
                console.log("Tool 3 activated");
                break;
            case 'tool4':
                console.log("Tool 3 activated");
                break;
            case 'tool5':
                console.log("Tool 3 activated");
                break;
            case 'tool6':
                console.log("Tool 3 activated");
                break;
            case 'tool7':
                console.log("Tool 3 activated");
                break;
            case 'tool8':
                console.log("Tool 3 activated");
                break;
            case 'tool9':
                console.log("Tool 3 activated");
                break;
            case 'toggle-sidebar':
                // 获取sidebar和按钮
                const sidebar = document.querySelector('.side-bar');
                sidebar.classList.toggle('hidden');
                break;
            case 'toggle-radarbar':
                // 获取sidebar和按钮
                const radarbar = document.querySelector('.radar-display');
                radarbar.classList.toggle('hidden');
                break;
            default:
                console.log("Unknown tool action");
        }
    }
}
