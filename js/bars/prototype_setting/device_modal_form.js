const dropdown = document.querySelector('.dropdown');
const options = document.querySelectorAll('.dropdown input[type="checkbox"]');
const selectedValues = document.querySelector('.selected-values');

// 下拉框显示逻辑
dropdown.addEventListener('click', function() {
    const menu = document.querySelector('.options');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
});

// 频段下拉框显示
options.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        let values = [];
        options.forEach(function(opt) {
            if (opt.checked) {
                values.push(opt.value);
            }
        });
        selectedValues.textContent = values.join(', ') || '请选择';
    });
});

function updateSelectedValues() {
    const selectedValuesContainer = document.querySelector('.dropdown .selected .selected-values');
    const selectedBandLabels = Array.from(document.querySelectorAll('.dropdown .options input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.closest('label').textContent.trim());
    selectedValuesContainer.textContent = selectedBandLabels.join(' ');
}

// 属性设置保存按钮响应

