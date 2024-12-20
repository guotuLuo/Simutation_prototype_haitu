class Envi{
    constructor() {

    }
    initEnvi(){
        // 获取并转换输入值
        this.threadNum = 1;
        this.timeScalar = 2000;
        this.timeClkRate = 1000;
        this.clutterGrade = 1;
        this.clutterType = 0;
        this.clutterModel = 0;
        this.sscRoot = null;
        const center = window.app.mapController.getMap().getCenter();
        this.simulationCenter = '(' + center.lat + ',' + center.lng + ')';

        this.instanceNumber = window.app.componentManager.instanceNumber;
        this.refresh = 100;
        this.IP = "127.0.0.1";

        // 页面加载时添加事件监听器
        document.getElementById("enviSaveButton").addEventListener("click", this.saveProperties);
        document.getElementById("page2Btn").addEventListener("click", this.updateProperties);
    }
    saveProperties() {
        // 获取并转换输入值
        this.threadNum = parseInt(document.getElementById("threadNum").value, 10);
        this.timeScalar = parseInt(document.getElementById("timeScalar").value, 10);
        this.timeClkRate = parseInt(document.getElementById("timeClkRate").value, 10);
        this.clutterGrade = parseInt(document.getElementById("clutterGrade").value, 10);
        this.clutterType = parseInt(document.getElementById("dropDownClutterType").value, 10);
        this.clutterModel = parseInt(document.getElementById("dropDownClutterModel").value, 10);
        this.simulationCenter = document.getElementById("simulationCenter").textContent;
        this.instanceNumber = parseInt(document.getElementById("instanceNumber").textContent, 10);
        this.refresh = parseInt(document.getElementById("refresh").value, 10);
        this.IP = document.getElementById("IP").value;
    }

    updateProperties(){
        const center = window.app.mapController.getMap().getCenter();
        this.simulationCenter = '(' + center.lat.toFixed(5) + ',' + center.lng.toFixed(5) + ')';
        this.instanceNumber = window.app.componentManager.instanceNumber;
        document.getElementById("simulationCenter").textContent = this.simulationCenter;
        document.getElementById("instanceNumber").textContent = this.instanceNumber;
    }
}