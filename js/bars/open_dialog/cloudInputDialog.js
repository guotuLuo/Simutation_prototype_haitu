class CloudInputDialog{
    constructor(){

    }

    initializeCloudInputDialog(){
        const closeDialogButton = document.getElementById("closeCloudInputButton");
        const overlay = document.getElementById("overlay");
        const dialog = document.getElementById("cloudInputDialog");
        dialog.style.display = "none"; // 隐藏模态框
        // 关闭按钮点击事件
        closeDialogButton.addEventListener("click", () => {
            dialog.style.display = "none"; // 隐藏模态框
            overlay.style.display = "none";
            // window.close(); // 关闭当前标签页
        });
    }
    
    openCloudInputDialog(){
        const overlay = document.getElementById("overlay");
        const dialog = document.getElementById("cloudInputDialog");
        this.cloudProjects = document.getElementById("cloudProjects");
        this.cloudProjects.innerHTML = ""; // 清空项目列表
        this.projectsList = [];
        // 显示弹窗和遮罩层
        overlay.style.display = "block";
        dialog.style.display = "block";
        axios.post('http://127.0.0.1:8081/api/project/queryIds')
            .then(response => {
                console.log(response.data.data);
                // 假设返回的数据结构包含项目信息和 XML 字符串
                response.data.data.forEach(project => {
                    const item = document.createElement("div");
                    item.classList.add("project-item");
                    item.textContent = project;
                    // 添加双击事件监听器
                    item.addEventListener("dblclick", () => {
                        openXMLFromCloud(item.textContent);
                        const closeDialogButton = document.getElementById("closeCloudInputButton");
                        closeDialogButton.click();
                    });
                    this.cloudProjects.appendChild(item);
                })
            })
            .catch(error => {
                console.error('从云端获取 XML id 数据失败:', error);
                alert('获取数据失败，请检查网络或服务器！');
            });
    }
}


