document.addEventListener('DOMContentLoaded', function() {
    // Get cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const cartCounter = document.querySelector('.cart-counter');
    
    // Render cart items
    function renderCart() {
      if(cartItems.length === 0) {
        cartContainer.innerHTML = `
          <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet</p>
            <a href="products.html" class="continue-shopping">Continue Shopping</a>
          </div>
        `;
        cartSummary.style.display = 'none';
        cartCounter.textContent = '0';
        return;
      }
      
      // Clear existing items
      cartContainer.innerHTML = '';
      
      // Add each item to cart
      cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="item-details">
            <h3>${item.name}</h3>
            <p>Size: M</p>
            <p class="item-price">$${item.price.toFixed(2)}</p>
          </div>
          <div class="item-actions">
            <div class="quantity-control">
              <button class="quantity-btn minus" data-index="${index}">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn plus" data-index="${index}">+</button>
            </div>
            <button class="remove-btn" data-index="${index}">
              <i class="fas fa-trash"></i> Remove
            </button>
          </div>
        `;
        cartContainer.appendChild(cartItem);
      });
      
      // Show summary
      cartSummary.style.display = 'block';
      updateSummary();
      updateCartCounter();
      
      // Add event listeners to new buttons
      addCartEventListeners();
    }
    
    // Update cart summary
    function updateSummary() {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;
      
      document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
      document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
      document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }
    
    // Update cart counter
    function updateCartCounter() {
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      cartCounter.textContent = totalItems;
    }
    
    // Add event listeners to cart buttons
    function addCartEventListeners() {
      // Quantity buttons
      document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          if(this.classList.contains('plus')) {
            cartItems[index].quantity += 1;
          } else if(this.classList.contains('minus')) {
            if(cartItems[index].quantity > 1) {
              cartItems[index].quantity -= 1;
            } else {
              cartItems.splice(index, 1);
            }
          }
          
          localStorage.setItem('cart', JSON.stringify(cartItems));
          renderCart();
        });
      });
      
      // Remove buttons
      document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          cartItems.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(cartItems));
          renderCart();
        });
      });
    }
    
    // Checkout button
    document.querySelector('.checkout-btn')?.addEventListener('click', function() {
      alert('Proceeding to checkout! In a real app, this would redirect to payment page.');
    });
    
    // Initial render
    renderCart();
  });