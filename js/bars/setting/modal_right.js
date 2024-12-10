const dropdown = document.querySelector('.dropdown');
const options = document.querySelectorAll('.dropdown input[type="checkbox"]');
const selectedValues = document.querySelector('.selected-values');

dropdown.addEventListener('click', function() {
    const menu = document.querySelector('.options');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
});

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