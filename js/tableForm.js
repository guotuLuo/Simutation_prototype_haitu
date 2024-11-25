let columnNames = [];
const maxRows = 32;
// 用于跟踪当前的接收状态
let isReceiving = false;
// const ws = new WebSocketManager('ws://127.0.0.1:8082/websocket'); // 初始化 WebSocket

document.getElementById('parseButton').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput');
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    const batchCheckbox = document.getElementById('batchCheckbox');

    if (!fileInput.files.length) {
        alert('请选择一个 XML 文件');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);


    const reader = new FileReader();

    // 注册 onload 事件
    reader.onload = function () {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(reader.result, "text/xml");

        const parameterNode = xmlDoc.getElementsByTagName("Parameter")[0];
        if (!parameterNode) {
            alert('XML 格式错误，未找到 <Parameter> 节点');
            return;
        }

        const parameters = parameterNode.getElementsByTagName("*");
        const columnNames = Array.from(parameters).map(param => param.getAttribute('name'));
        const types = Array.from(parameters).map(param => param.getAttribute('type'));
        let blockSize = 0;
        types.map(block => {
            if(block === "unsigned short" || block === "short"){
                blockSize = blockSize + 2;
            }else if(block === "unsigned int"){
                blockSize = blockSize + 4;
            }else if(block === "unsigned long long"){
                blockSize = blockSize + 8;
            }
        })
        document.getElementById("structSize").textContent = blockSize; // 设置新的值
        if (!columnNames.length) {
            alert('未找到任何参数');
            return;
        }

        tableHeader.innerHTML = columnNames.map(name => `<th>${name}</th>`).join('');
        toggleBatchColumn();
    };
    reader.readAsText(file);

    // 发送 POST 请求
    // axios异步请求刷新
    axios.post('http://127.0.0.1:8081/api/radars/uploadData', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
});





// 开始/停止接收数据的切换逻辑
function toggleReceivingData() {
    const toggleButton = document.getElementById('toggleButton');

    if (isReceiving) {
        // 当前状态是正在接收，调用停止函数
        stopReceivingData();
        toggleButton.textContent = "开始接收数据";
    } else {
        // 当前状态是未接收，调用开始函数
        startReceivingData();
        toggleButton.textContent = "停止接收数据";
    }

    // 切换接收状态
    isReceiving = !isReceiving;
}

function startReceivingData(){
    axios.post('http://127.0.0.1:8081/api/radars/receiveData', {
        isBatchValid: document.getElementById('batchCheckbox').checked,
        isDataStore: document.getElementById('accumulateCheckbox').checked,
        headSize: parseInt(document.getElementById('headerSize').value, 10),
        structSize: parseInt(document.getElementById('structSize').textContent, 10)
    });

    const ws = new WebSocketManager('ws://127.0.0.1:8082/websocket');

    // 连接 WebSocket
    ws.connect(
        (message) => {
            // 处理 WebSocket 消息
            const messageBox = document.getElementById('messageBox');
            const newMessage = document.createElement('div');
            newMessage.textContent = message;
            // messageBox.appendChild(newMessage);
            const messageJson = JSON.parse(message)
            messageJson.forEach((jsonData) => {
                updateTableFromWebSocketData(jsonData); // 遍历每个对象并更新表格
            });
        },
        () => console.log('WebSocket opened'),
        () => console.log('WebSocket closed'),
        (error) => console.error('WebSocket error', error)
    );

    // 页面卸载时关闭 WebSocket
    window.onbeforeunload = () => {
        ws.close();
    };
}

function stopReceivingData() {
    // 如果 WebSocketManager 存在实例，关闭连接
    if (ws && ws.isConnected()) {
        ws.close();
        console.log('WebSocket connection closed.');
    } else {
        console.log('No active WebSocket connection.');
    }

    // 通知后端停止发送数据
    axios.post('http://127.0.0.1:8081/api/radars/refuseData')
        .then(() => console.log('Stop receiving data request sent to the server.'))
        .catch((error) => console.error('Error sending stop request', error));
}

function toggleBatchColumn() {
    const batchCheckbox = document.getElementById('batchCheckbox');
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');

    const batchHeaderId = 'batchHeader'; // 动态生成的表头 ID
    const batchCellClass = 'batchCell'; // 动态生成的单元格 class

    // 动态检查或创建表头
    let batchHeader = document.getElementById(batchHeaderId);

    if (batchCheckbox.checked) {
        // 显示 BatchID 列
        if (!batchHeader) {
            // 动态创建 BatchID 表头
            batchHeader = document.createElement('th');
            batchHeader.id = batchHeaderId;
            batchHeader.textContent = 'batchId';
            tableHeader.insertBefore(batchHeader, tableHeader.firstChild);
        } else {
            // 如果表头已经存在但被隐藏，显示它
            batchHeader.style.display = '';
        }

        // 遍历表格中的所有行，显示 BatchID 单元格
        const rows = tableBody.getElementsByTagName('tr');
        for (const row of rows) {
            let batchCell = row.querySelector(`.${batchCellClass}`);
            if (!batchCell) {
                // 如果单元格不存在，则动态创建
                batchCell = document.createElement('td');
                batchCell.className = batchCellClass;
                batchCell.textContent = ''; // 可根据需要初始化内容
                row.insertBefore(batchCell, row.firstChild);
            } else {
                // 恢复单元格显示
                batchCell.style.display = '';
            }
        }
    } else {
        // 隐藏 BatchID 列
        const rows = tableBody.getElementsByTagName('tr');
        for (const row of rows) {
            const batchCell = row.querySelector(`.${batchCellClass}`);
            if (batchCell) {
                batchCell.style.display = 'none'; // 隐藏单元格
            }
        }

        // 隐藏 BatchID 表头
        if (batchHeader) {
            batchHeader.style.display = 'none'; // 隐藏表头
        }
    }
}

// 通过 WebSocket 返回的数据填充表格
/**
 * 累计更新：每次接收到数据都新增一行，表格长度持续增长。
 * 非累计更新：表格限制为 32 行，新数据滚动覆盖旧数据。
 * */
function updateTableFromWebSocketData(jsonData) {
    const tableBody = document.getElementById('tableBody');
    const tableHeader = document.getElementById('tableHeader');
    const headers = tableHeader.getElementsByTagName('th');
    const batchCheckbox = document.getElementById('batchCheckbox'); // 获取复选框

    const headerMap = {};
    for (let i = 0; i < headers.length; i++) {
        headerMap[headers[i].textContent.trim()] = i;
    }

    // 创建新行
    const newRow = document.createElement('tr');
    for (let i = 0; i < headers.length; i++) {
        const fieldName = headers[i].textContent.trim();
        const cell = document.createElement('td');
        if(fieldName === "batchId"){
            cell.className = "batchCell";
        }
        // 判断是否有对应的字段名
        if (jsonData.hasOwnProperty(fieldName)) {
            cell.textContent = String(jsonData[fieldName]);
        } else {
            cell.textContent = '-'; // 缺失数据时用占位符
        }

        // 如果表头列被隐藏，同步隐藏单元格
        if (headers[i].style.display === 'none') {
            cell.style.display = 'none';
        }

        // 如果复选框未选中，隐藏 BatchID 列
        if (fieldName === 'batchId' && !batchCheckbox.checked) {
            cell.style.display = 'none'; // 隐藏 BatchID 列的单元格
        }

        newRow.appendChild(cell);
    }

    tableBody.appendChild(newRow);
}
