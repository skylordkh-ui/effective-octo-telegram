// --- 1. State Management ---
// Array of mock products with high-quality Unsplash images
const products = [
    { 
        id: 1, 
        name: "Classic Cheeseburger", 
        price: 8.99, 
        category: "Food", 
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 2, 
        name: "Margherita Pizza", 
        price: 12.50, 
        category: "Food", 
        img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 3, 
        name: "Caesar Salad", 
        price: 7.00, 
        category: "Food", 
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 4, 
        name: "Iced Coffee", 
        price: 4.50, 
        category: "Drinks", 
        img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 5, 
        name: "Craft Cola", 
        price: 2.00, 
        category: "Drinks", 
        img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 6, 
        name: "Sparkling Water", 
        price: 1.50, 
        category: "Drinks", 
        img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80" 
    }
];

// The cart array will store items added by the user
let cart = [];
let currentFilter = "All";

// DOM Elements
const productGrid = document.getElementById('product-grid');
const categoryFilters = document.getElementById('category-filters');
const cartItemsContainer = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');

// --- 2. Initialization ---
function init() {
    renderFilters();
    renderProducts();
    updateCartUI();
}

// --- 3. UI Rendering: Products & Filters ---
function renderFilters() {
    const categories = ["All", "Food", "Drinks"];
    categoryFilters.innerHTML = categories.map(cat => `
        <button class="filter-btn ${currentFilter === cat ? 'active' : ''}" 
                onclick="setFilter('${cat}')">
            ${cat}
        </button>
    `).join('');
}

// Expose setFilter globally so inline HTML onclick can use it
window.setFilter = function(category) {
    currentFilter = category;
    renderFilters();
    renderProducts();
}

function renderProducts() {
    // Filter products based on selected category
    const filteredProducts = currentFilter === "All" 
        ? products 
        : products.filter(p => p.category === currentFilter);

    // Map products to HTML cards
    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="addToCart(${product.id})">
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">$${product.price.toFixed(2)}</div>
        </div>
    `).join('');
}

// --- 4. Cart Logic ---
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const existingCartItem = cart.find(item => item.id === productId);

    if (existingCartItem) {
        // If already in cart, increase quantity
        existingCartItem.qty += 1;
    } else {
        // Otherwise, add new item object to cart array
        cart.push({ ...product, qty: 1 });
    }
    
    updateCartUI();
}

window.changeQty = function(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].qty += delta;
        
        // Remove item if quantity drops to 0 or below
        if (cart[itemIndex].qty <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    
    updateCartUI();
}

// --- 5. Updating the Cart UI & Totals ---
function updateCartUI() {
    // Render Cart Items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="empty-cart-msg">Your cart is empty</div>`;
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        cartItemsContainer.innerHTML = cart.map(item => {
            const lineTotal = item.price * item.qty;
            return `
                <div class="cart-item">
                    <div class="item-details">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">@ $${item.price.toFixed(2)}</span>
                    </div>
                    <div class="item-controls">
                        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                    <div class="item-line-total">
                        $${lineTotal.toFixed(2)}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Calculate Totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.10; // 10% tax rate
    const finalTotal = subtotal + tax;

    // Update DOM Totals
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${finalTotal.toFixed(2)}`;
}

// --- 6. Checkout Logic ---
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        // Process mock payment
        alert(`Payment Successful! Total collected: ${totalEl.textContent}`);
        
        // Reset state
        cart = [];
        updateCartUI();
    }
});

// Boot up the application
init();