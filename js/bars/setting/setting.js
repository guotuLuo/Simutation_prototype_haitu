const modal = document.querySelector(".modal");
const modalHeader = document.querySelector('.modal__header');
const closeModalBtn = document.querySelector(".btn-close");
// const overlay = document.querySelector(".overlay");


const openModal = function () {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    // overlay.classList.add("open");
    // overlay.setAttribute("aria-hidden", "false");

    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
};

const closeModal = function () {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    // overlay.classList.remove("open");
    // overlay.setAttribute("aria-hidden", "true");

    // 恢复背景滚动
    document.body.style.overflow = '';
};

closeModalBtn.addEventListener("click", closeModal);
// overlay.addEventListener("click", closeModal);

// 监听按下Escape键关闭模态框
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
    }
});


// 用来存储鼠标相对于模态框的位置和拖动状态
let offsetX = 0, offsetY = 0, isDragging = false;

// 当鼠标按下时，记录初始位置并启用拖动, 尽在拖动modal__header时才能移动
modalHeader.addEventListener('mousedown', (e) => {
    isDragging = true;

    // 获取模态框的当前位置
    const rect = modal.getBoundingClientRect();

    // 计算鼠标按下时相对于模态框左上角的偏移
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // 设置鼠标指针为抓取手型（拖动时的指针）
    modal.style.cursor = 'grabbing';

    // 禁用鼠标默认拖拽行为（如选中文本）
    e.preventDefault();
});

// 当鼠标移动时，更新模态框的位置
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        // 计算新的模态框位置
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;

        // 更新 left 和 top，保留 transform 居中效果
        modal.style.left = `${newLeft}px`;
        modal.style.top = `${newTop}px`;

        // 阻止鼠标事件冒泡，避免干扰其他事件
        e.preventDefault();
    }
});

// 当鼠标松开时，停止拖动
document.addEventListener('mouseup', () => {
    isDragging = false;

    // 恢复鼠标指针样式
    modal.style.cursor = 'default';  // 恢复为普通指针
});


