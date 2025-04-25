document.addEventListener('DOMContentLoaded', function() {
  const messageForm = document.getElementById('messageForm');
  const cartCounter = document.querySelector('.cart-counter');

  // Update cart counter
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if(totalItems > 0) {
    cartCounter.textContent = totalItems;
    cartCounter.style.display = 'flex';
  } else {
    cartCounter.style.display = 'none';
  }

  // Handle form submission
  messageForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
      date: new Date().toISOString()
    };

    // Save message to localStorage
    const messages = JSON.parse(localStorage.getItem('contact_messages')) || [];
    messages.push(formData);
    localStorage.setItem('contact_messages', JSON.stringify(messages));

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      Thank you for your message! We'll get back to you soon.
    `;
    document.body.appendChild(successMessage);

    // Show the message
    successMessage.style.display = 'block';

    // Remove the message after 3 seconds
    setTimeout(() => {
      successMessage.style.opacity = '0';
      setTimeout(() => {
        successMessage.remove();
      }, 300);
    }, 3000);

    // Reset form
    messageForm.reset();
  });
});
