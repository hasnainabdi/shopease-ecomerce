document.addEventListener('DOMContentLoaded', function() {
    // Sample product data
    const products = [
      { id: 1, name: "Men's Wear", category: "men", price: 24.99, originalPrice: 34.99, rating: 4.5, image: "assests/men-wear.png" },
      { id: 2, name: "Women's Wear", category: "women", price: 49.99, originalPrice: 59.99, rating: 4.2, image: "assests/women-wear.png" },
      { id: 3, name: "Accessories", category: "accessories", price: 79.99, rating: 4.7, image: "assests/accessories.png" },
      { id: 4, name: "Winter Jacket", category: "outerwear", price: 89.99, originalPrice: 129.99, rating: 4.8, image: "assests/winter-jacket.png" },
      { id: 5, name: "Smart Watch", category: "accessories", price: 199.99, rating: 4.9, image: "assests/smart-watch.png" },
      { id: 6, name: "Wireless Earbuds", category: "electronics", price: 129.99, originalPrice: 149.99, rating: 4.6, image: "assests/wireless-earbuds.png" },
      { id: 7, name: "Formal Shirt", category: "men", price: 39.99, originalPrice: 49.99, rating: 4.3, image: "assests/formal-shirt.png" },
      { id: 8, name: "Summer Dress", category: "women", price: 59.99, originalPrice: 79.99, rating: 4.5, image: "assests/summer-dress.png" }
    ];

    // DOM Elements
    const productGrid = document.getElementById('product-grid');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const paginationContainer = document.getElementById('pagination');
    const cartCounter = document.querySelector('.cart-counter');
    
    // Pagination variables
    const productsPerPage = 4;
    let currentPage = 1;
    let filteredProducts = [...products];

    // Initialize page
    renderProducts();
    setupPagination();
    updateCartCounter();

    // Event listeners
    categoryFilter.addEventListener('change', function() {
      currentPage = 1;
      applyFilters();
    });

    sortFilter.addEventListener('change', function() {
      applyFilters();
    });

    // Main functions
    function applyFilters() {
      // Get filter values
      const category = categoryFilter.value;
      const sortBy = sortFilter.value;
      
      // Filter by category
      filteredProducts = category === 'all' 
        ? [...products] 
        : products.filter(product => product.category === category);
      
      // Sort products
      switch(sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        default:
          // Default sorting (newest first)
          filteredProducts.sort((a, b) => b.id - a.id);
      }
      
      renderProducts();
      setupPagination();
    }

    function renderProducts() {
      // Calculate pagination
      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const productsToShow = filteredProducts.slice(startIndex, endIndex);
      
      // Clear existing products
      productGrid.innerHTML = '';
      
      // Render products
      if(productsToShow.length === 0) {
        productGrid.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
        return;
      }
      
      productsToShow.forEach(product => {
        const discount = product.originalPrice 
          ? Math.round((1 - product.price / product.originalPrice) * 100)
          : 0;
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
          <div class="product-image">
            ${discount > 0 ? `<span class="badge">${discount}% OFF</span>` : ''}
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-category">
              <i class="fas fa-tag"></i> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </p>
            <div class="price-container">
              <div>
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <div class="rating">
                <i class="fas fa-star"></i> ${product.rating}
              </div>
            </div>
            <div class="product-actions">
              <a href="product-details.html?id=${product.id}" class="view-btn">
                <i class="fas fa-eye"></i> View
              </a>
              <button class="cart-btn" data-id="${product.id}">
                <i class="fas fa-shopping-cart"></i> Add
              </button>
            </div>
          </div>
        `;
        productGrid.appendChild(productCard);
      });
      
      // Reattach event listeners to new buttons
      attachCartEvents();
    }

    function setupPagination() {
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
      
      // Clear existing pagination
      paginationContainer.innerHTML = '';
      
      // Previous button
      const prevButton = document.createElement('button');
      prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener('click', () => {
        if(currentPage > 1) {
          currentPage--;
          renderProducts();
          setupPagination();
        }
      });
      paginationContainer.appendChild(prevButton);
      
      // Page numbers
      for(let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = currentPage === i ? 'active' : '';
        pageButton.addEventListener('click', () => {
          currentPage = i;
          renderProducts();
          setupPagination();
        });
        paginationContainer.appendChild(pageButton);
      }
      
      // Next button
      const nextButton = document.createElement('button');
      nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
      nextButton.disabled = currentPage === totalPages;
      nextButton.addEventListener('click', () => {
        if(currentPage < totalPages) {
          currentPage++;
          renderProducts();
          setupPagination();
        }
      });
      paginationContainer.appendChild(nextButton);
      
      // Page info
      const pageInfo = document.createElement('span');
      pageInfo.className = 'page-info';
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
      paginationContainer.appendChild(pageInfo);
    }

    function attachCartEvents() {
      document.querySelectorAll('.cart-btn').forEach(button => {
        button.addEventListener('click', function() {
          const productId = parseInt(this.getAttribute('data-id'));
          const product = products.find(p => p.id === productId);
          
          if(product) {
            addToCart(product);
          }
        });
      });
    }

    function addToCart(product) {
      let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cartItems.find(item => item.id === product.id);
      
      if(existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      updateCartCounter();
      
      // Visual feedback
      const button = document.querySelector(`.cart-btn[data-id="${product.id}"]`);
      button.innerHTML = '<i class="fas fa-check"></i> Added';
      button.style.backgroundColor = '#4CAF50';
      
      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add';
        button.style.backgroundColor = '#30382F';
      }, 2000);
    }

    function updateCartCounter() {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      
      if(totalItems > 0) {
        cartCounter.textContent = totalItems;
        cartCounter.style.display = 'flex';
      } else {
        cartCounter.style.display = 'none';
      }
    }
  });