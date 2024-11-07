// 动态生成目标点的坐标
function generateRandomPosition() {
    const radarRadius = 150; // 雷达的半径
    const angle = Math.random() * Math.PI * 2; // 随机角度
    const distance = Math.random() * radarRadius; // 随机距离

    const x = Math.cos(angle) * distance + radarRadius; // X坐标
    const y = Math.sin(angle) * distance + radarRadius; // Y坐标

    return { x, y };
}

// 动态设置目标位置
function setTargetPosition(targetId) {
    const target = document.getElementById(targetId);
    const position = generateRandomPosition();

    // 设置目标的位置
    target.style.left = `${position.x}px`;
    target.style.top = `${position.y}px`;
}

// 每隔一段时间更新目标位置
setInterval(() => {
    setTargetPosition('target1');
    setTargetPosition('target2');
    setTargetPosition('target3');
}, 2000);
