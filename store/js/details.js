document.addEventListener('DOMContentLoaded', function() {
    // Thumbnail Image Switcher
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function() {
        // Remove active class from all thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Update main image
        if(mainImage) {
          mainImage.src = this.src.replace('-thumb', '-large');
          mainImage.alt = this.alt;
        }
      });
    });
    
    // Size Selection
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all size buttons
        sizeButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
      });
    });
    
    // Quantity Selector
    const minusBtn = document.querySelector('.qty-btn:first-child');
    const plusBtn = document.querySelector('.qty-btn:last-child');
    const quantityDisplay = document.querySelector('.quantity');
    
    let quantity = 1;
    
    if(minusBtn && plusBtn && quantityDisplay) {
      minusBtn.addEventListener('click', function() {
        if(quantity > 1) {
          quantity--;
          quantityDisplay.textContent = quantity;
        }
      });
      
      plusBtn.addEventListener('click', function() {
        quantity++;
        quantityDisplay.textContent = quantity;
      });
    }
    
    // Add to Cart Animation
    const cartBtn = document.querySelector('.cart-btn');
    if(cartBtn) {
      cartBtn.addEventListener('click', function() {
        const size = document.querySelector('.size-btn.active')?.textContent || 'M';
        
        // Change button appearance
        this.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
        this.style.backgroundColor = '#4CAF50';
        
        // Show confirmation
        setTimeout(() => {
          alert(`Added ${quantity} ${size} size item(s) to cart!`);
        }, 300);
        
        // Reset button after 2 seconds
        setTimeout(() => {
          this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
          this.style.backgroundColor = '#30382F';
        }, 2000);
      });
    }
  });