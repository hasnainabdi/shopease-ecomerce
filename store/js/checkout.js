document.addEventListener('DOMContentLoaded', function() {
  const checkoutItems = document.getElementById('checkout-items');
  const subtotalElement = document.getElementById('checkout-subtotal');
  const taxElement = document.getElementById('checkout-tax');
  const totalElement = document.getElementById('checkout-total');
  const shippingForm = document.getElementById('shipping-form');
  const cartCounter = document.querySelector('.cart-counter');

  // Load cart items
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Update cart counter
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if(totalItems > 0) {
    cartCounter.textContent = totalItems;
    cartCounter.style.display = 'flex';
  } else {
    cartCounter.style.display = 'none';
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Update summary amounts
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  totalElement.textContent = `$${total.toFixed(2)}`;

  // Render cart items
  cartItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'checkout-item';
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="quantity">Quantity: ${item.quantity}</p>
        <p class="price">$${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    `;
    checkoutItems.appendChild(itemElement);
  });

  // Handle payment method selection
  const paymentMethodInputs = document.querySelectorAll('input[name="payment"]');
  const cardDetails = document.getElementById('card-details');
  const cardInputs = cardDetails.querySelectorAll('input');

  paymentMethodInputs.forEach(input => {
    input.addEventListener('change', function() {
      if (this.value === 'online') {
        cardDetails.style.display = 'block';
        cardInputs.forEach(input => input.required = true);
      } else {
        cardDetails.style.display = 'none';
        cardInputs.forEach(input => input.required = false);
      }
    });
  });

  // Format card number input
  const cardInput = document.getElementById('card-number');
  cardInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
  });

  // Format expiry date input
  const expiryInput = document.getElementById('expiry');
  expiryInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
  });

  // Format CVV input
  const cvvInput = document.getElementById('cvv');
  cvvInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
  });

  // Handle form submission
  shippingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
      fullname: document.getElementById('fullname').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      postal: document.getElementById('postal').value,
      cardNumber: document.getElementById('card-number').value,
      expiry: document.getElementById('expiry').value,
      cvv: document.getElementById('cvv').value
    };

    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // Validate card details if online payment is selected
    if (paymentMethod === 'online') {
      // Validate card number (simple check)
      if (formData.cardNumber.length !== 16) {
        alert('Please enter a valid 16-digit card number');
        return;
      }

      // Validate expiry date format
      if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
        alert('Please enter a valid expiry date (MM/YY)');
        return;
      }

      // Validate CVV
      if (formData.cvv.length !== 3) {
        alert('Please enter a valid 3-digit CVV');
        return;
      }
    }

    // Create order object
    const order = {
      id: Date.now(),
      items: cartItems,
      total: total,
      shipping: formData,
      paymentMethod: paymentMethod,
      date: new Date().toISOString()
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem('cart');

    // Show success message
    alert('Order placed successfully! Thank you for shopping with us.');

    // Redirect to home page
    window.location.href = 'index.html';
  });
});
