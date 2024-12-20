class OpenDialog{
    constructor(){

    }

    initializeOpenDialog(){
        const overlay = document.getElementById("overlay");
        const dialog = document.getElementById("startupDialog");
        const storageType = document.getElementById("storageType");
        const recentProjects = document.getElementById("recentProjects");
        const newProjectButton = document.getElementById("newProjectButton");
        const openProjectButton = document.getElementById("openProjectButton");
        const closeDialogButton = document.getElementById("closeDialogButton");


        // 模拟存储方式的项目数据
        const projects = {
            local: [
                "C:/Users/user/Documents/project1.dpsp",
                "C:/Users/user/Desktop/project2.dpsp",
            ],
            cloud: [
                "Cloud Drive: Project A",
                "Cloud Drive: Project B",
            ],
        };

        // 显示弹窗和遮罩层
        overlay.style.display = "block";
        dialog.style.display = "block";

        // 更新最近项目列表
        function updateRecentProjects(storage) {
            recentProjects.innerHTML = ""; // 清空项目列表
            const projectList = projects[storage] || [];

            projectList.forEach((project) => {
                const item = document.createElement("div");
                item.classList.add("project-item");
                item.textContent = project;
                recentProjects.appendChild(item);
            });
        }

        // 初始化项目列表
        updateRecentProjects(storageType.value);

        // 存储方式切换时更新项目列表
        storageType.addEventListener("change", (event) => {
            updateRecentProjects(event.target.value);
        });

        // 新建项目按钮跳转
        newProjectButton.addEventListener("click", () => {
            window.location.href = "new_project_page.html"; // 替换为新建项目的页面路径
        });

        // 打开项目按钮跳转
        openProjectButton.addEventListener("click", () => {
            window.location.href = "open_project_page.html"; // 替换为打开项目的页面路径
        });

        // 关闭按钮点击事件
        closeDialogButton.addEventListener("click", () => {
            dialog.style.display = "none"; // 隐藏模态框
            overlay.style.display = "none";
            // window.close(); // 关闭当前标签页
        });
    }
}


