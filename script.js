// Загрузка данных из JSON файла
async function loadProducts() {
    try {
        const response = await fetch('products.json');
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

// Настройка обработчиков событий
function setupEventListeners(products) {
    // Фильтрация товаров
    document.querySelectorAll('.filters input').forEach(input => {
        input.addEventListener('change', () => filterProducts(products));
    });
}

// Фильтрация товаров
function filterProducts(products) {
    const category = document.getElementById('current-category').textContent;
    const filteredProducts = products.filter(p => p.Type === category);
    
    // Применение фильтров
    // Здесь можно добавить логику фильтрации по цене, рейтингу и т.д.
    
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
    document.getElementById('detail-ingredients').textContent = product.Ingredients;
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
    renderProducts(filteredProducts);
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