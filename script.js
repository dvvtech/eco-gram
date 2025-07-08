// Загрузка данных из JSON файла
async function loadProducts() {
    try {
        const response = await fetch('data/vkusvill/forHair.json');
        if (!response.ok) {
            throw new Error('Не удалось загрузить данные');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return [];
    }
}

// Инициализация приложения
async function initApp() {
    const products = await loadProducts();
    if (products.length > 0) {
        renderCategories(products);
        setupEventListeners(products);
    } else {
        console.error('Нет данных о товарах');
    }
}

// Отображение категорий
function renderCategories(products) {
    const categoriesGrid = document.getElementById('categories-grid');
    const categories = [...new Set(products.map(product => product.Type))];
    
    categoriesGrid.innerHTML = categories.map(category => {
        const categoryProducts = products.filter(p => p.Type === category);
        const randomProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
        
        return `
            <a href="#" class="category-card" onclick="showCategory('${category}')">
                <div class="category-img">
                    <img src="${randomProduct.ImageUrl}" alt="${category}">
                </div>
                <div class="category-info">
                    <h3>${category}</h3>
                    <p>${categoryProducts.length} товаров</p>
                </div>
            </a>
        `;
    }).join('');
}

// Отображение товаров с сортировкой по оценке
function renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    // Сортируем товары по оценке (Score) в порядке убывания
    const sortedProducts = [...products].sort((a, b) => b.Score - a.Score);
    
    productsGrid.innerHTML = sortedProducts.map(product => `
        <div class="product-card fade-in" onclick="showProductDetail(${product.Id})">
            ${product.Score >= 8 ? '<div class="product-badge">Топ продаж</div>' : ''}
            <div class="product-img">
                <img src="${product.ImageUrl}" alt="${product.Title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.Title}</h3>
                <div class="product-price">${product.Price} ₽</div>
                <div class="product-rating">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(product.Score / 2))}${'☆'.repeat(5 - Math.floor(product.Score / 2))}
                    </div>
                    <div class="rating-value">${product.Score}/10</div>
                </div>
                <div class="product-description">${product.Comment}</div>
                <div class="product-actions">
                    <a href="${product.ProductUrl}" class="btn btn-primary btn-sm" target="_blank">Купить</a>
                    <a href="#" class="btn btn-sm">Подробнее</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Настройка обработчиков событий
function setupEventListeners(products) {
    // Фильтрация товаров
    document.querySelectorAll('.filters input').forEach(input => {
        input.addEventListener('change', () => filterProducts(products));
    });
    
    // Обработка сортировки
    document.querySelectorAll('input[name="sort"]').forEach(radio => {
        radio.addEventListener('change', () => filterProducts(products));
    });
}

// Фильтрация и сортировка товаров
function filterProducts(products) {
    const category = document.getElementById('current-category').textContent;
    let filteredProducts = products.filter(p => p.Type === category);
    
    // Убедимся, что radio-кнопка выбрана (если нет, выбираем по умолчанию)
    const sortRadios = document.getElementsByName('sort');
    let selectedSort = 'score-desc';
    
    for (const radio of sortRadios) {
        if (radio.checked) {
            selectedSort = radio.value;
            break;
        }
    }
    
    // Если ничего не выбрано, выбираем сортировку по оценке по умолчанию
    if (!selectedSort) {
        selectedSort = 'score-desc';
        sortRadios[0].checked = true;
    }
    
    // Применяем сортировку
    switch(selectedSort) {
        case 'score-desc':
            filteredProducts.sort((a, b) => b.Score - a.Score);
            break;
        case 'score-asc':
            filteredProducts.sort((a, b) => a.Score - b.Score);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price));
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price));
            break;
        default:
            filteredProducts.sort((a, b) => b.Score - a.Score);
    }
    
    renderProducts(filteredProducts);
}

// Отображение товаров
function renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card fade-in" onclick="showProductDetail(${product.Id})">
            ${product.Score >= 8 ? '<div class="product-badge">Топ продаж</div>' : ''}
            <div class="product-img">
                <img src="${product.ImageUrl}" alt="${product.Title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.Title}</h3>
                <div class="product-price">${product.Price} ₽</div>
                <div class="product-rating">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(product.Score / 2))}${'☆'.repeat(5 - Math.floor(product.Score / 2))}
                    </div>
                    <div class="rating-value">${product.Score}/10</div>
                </div>
                <div class="product-description">${product.Comment}</div>
                <div class="product-actions">
                    <a href="${product.ProductUrl}" class="btn btn-primary btn-sm" target="_blank">Купить</a>
                    <a href="#" class="btn btn-sm">Подробнее</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Показать детали товара
function showProductDetail(productId) {
    const product = products.find(p => p.Id === productId);
    if (!product) return;
    
    document.getElementById('detail-title').textContent = product.Title;
    document.getElementById('detail-price').textContent = `${product.Price} ₽`;
    document.getElementById('detail-rating').innerHTML = `
        ${'★'.repeat(Math.floor(product.Score / 2))}${'☆'.repeat(5 - Math.floor(product.Score / 2))}
        <span style="margin-left: 5px;">${product.Score}/10</span>
    `;
    document.getElementById('detail-description').textContent = product.Comment;
    
    // Обновленный блок для отображения состава с комментарием
    const ingredientsHTML = `
        <h4>Полный состав:</h4>
        <div class="ingredients-text">${product.Ingredients}</div>
        <div class="ingredients-comment">
            <h4>Комментарий к составу:</h4>
            <p>${product.Comment}</p>
        </div>
    `;
    document.getElementById('detail-ingredients').innerHTML = ingredientsHTML;
    
    document.getElementById('detail-image').src = product.ImageUrl;
    document.getElementById('detail-image').alt = product.Title;
    document.getElementById('detail-link').href = product.ProductUrl;
    document.getElementById('detail-product-name').textContent = product.Title;
    document.getElementById('detail-category-link').textContent = product.Type;
    document.getElementById('detail-category-link').setAttribute('onclick', `showCategory('${product.Type}')`);
    
    document.getElementById('products-container').classList.remove('active');
    document.getElementById('product-detail').classList.add('active');
}

// Показать товары категории
function showCategory(category) {
    const filteredProducts = products.filter(p => p.Type === category);
    document.getElementById('current-category').textContent = category;
    document.getElementById('products-container').classList.add('active');
    document.getElementById('product-detail').classList.remove('active');
    
    // Устанавливаем сортировку по умолчанию
    document.querySelector('input[value="score-desc"]').checked = true;
    
    filterProducts(products); // Применяем фильтрацию и сортировку
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Показать главную страницу
function showHomePage() {
    document.getElementById('products-container').classList.remove('active');
    document.getElementById('product-detail').classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Показать страницу товаров (из детальной страницы)
function showProductsPage() {
    document.getElementById('products-container').classList.add('active');
    document.getElementById('product-detail').classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Глобальная переменная для хранения товаров
let products = [];

// Запуск приложения после загрузки страницы
document.addEventListener('DOMContentLoaded', async () => {
    products = await loadProducts();
    if (products.length > 0) {
        renderCategories(products);
        setupEventListeners(products);
    }
});