let batchAdded = false; // 标记是否已添加批号列
let columnNames = []; // 当前表格的列名
const maxRows = 32; // 默认表格最大行数


function parseXML() {

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
    
        if (!columnNames.length) {
            alert('未找到任何参数');
            return;
        }
    
        tableHeader.innerHTML = columnNames.map(name => `<th>${name}</th>`).join('');
        tableBody.innerHTML = Array.from({ length: 5 }, (_, index) => {
            const rowData = columnNames.map(() => `数据${index + 1}`);
            return `<tr>${rowData.map(data => `<td>${data}</td>`).join('')}</tr>`;
        }).join('');
    
        batchCheckbox.checked = false;
        toggleBatchColumn();
    };
    reader.readAsText(file);

       // 发送 POST 请求
    // axios异步请求刷新
    axios.post('http://127.0.0.1:8081/api/radars/receiveData', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

function toggleBatchColumn() {
    const batchCheckbox = document.getElementById('batchCheckbox');
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');

    const batchHeaderId = 'batchHeader';
    const batchCellId = 'batchCell';

    if (batchCheckbox.checked) {
        if (!document.getElementById(batchHeaderId)) {
            const batchHeader = document.createElement('th');
            batchHeader.id = batchHeaderId;
            batchHeader.textContent = '批号';
            tableHeader.insertBefore(batchHeader, tableHeader.firstChild);
        }

        const rows = tableBody.getElementsByTagName('tr');
        for (const row of rows) {
            if (!row.querySelector(`#${batchCellId}`)) {
                const batchCell = document.createElement('td');
                batchCell.id = batchCellId;
                batchCell.textContent = 'Batch001';
                row.insertBefore(batchCell, row.firstChild);
            }
        }
    } else {
        const batchHeader = document.getElementById(batchHeaderId);
        if (batchHeader) {
            tableHeader.removeChild(batchHeader);
        }

        const rows = tableBody.getElementsByTagName('tr');
        for (const row of rows) {
            const batchCell = row.querySelector(`#${batchCellId}`);
            if (batchCell) {
                row.removeChild(batchCell);
            }
        }
    }
}



function startReceivingData() {

}

function parsePacket(data, headerSize, structSize) {
    const tableBody = document.getElementById('tableBody');
    const accumulate = document.getElementById('accumulateCheckbox').checked;

    // 假设数据包是 Base64 编码的字符串（根据实际情况解析）
    const buffer = new Uint8Array(atob(data).split('').map(c => c.charCodeAt(0)));

    // 跳过包头大小
    const payload = buffer.slice(headerSize);

    // 按结构体大小解析
    for (let i = 0; i < payload.length; i += structSize) {
        const rowData = columnNames.map((_, idx) => payload[i + idx] || 'N/A'); // 简单解析，每列一个字节

        if (accumulate) {
            // 数据积累模式：直接追加行
            const row = document.createElement('tr');
            row.innerHTML = rowData.map(value => `<td>${value}</td>`).join('');
            tableBody.appendChild(row);
        } else {
            // 滚动覆盖模式
            if (tableBody.rows.length >= maxRows) {
                tableBody.deleteRow(0); // 删除首行
            }
            const row = document.createElement('tr');
            row.innerHTML = rowData.map(value => `<td>${value}</td>`).join('');
            tableBody.appendChild(row);
        }
    }
}
