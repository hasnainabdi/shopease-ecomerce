document.addEventListener('DOMContentLoaded', function() {
    // ===== TESTIMONIAL SLIDER =====
    const testimonials = document.querySelectorAll('.testimonial');
    const controls = document.querySelectorAll('.testimonial-control');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
      testimonials.forEach(testimonial => testimonial.classList.remove('active'));
      controls.forEach(control => control.classList.remove('active'));
      
      testimonials[index].classList.add('active');
      controls[index].classList.add('active');
      currentTestimonial = index;
    }
    
    controls.forEach((control, index) => {
      control.addEventListener('click', () => showTestimonial(index));
    });
    
    // Auto-rotate testimonials
    setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(currentTestimonial);
    }, 5000);
    
    // ===== ANIMATE FEATURE CARDS ON SCROLL =====
    const featureCards = document.querySelectorAll('.feature-card');
    
    function checkScroll() {
      featureCards.forEach((card, index) => {
        const cardPosition = card.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if(cardPosition < screenPosition) {
          setTimeout(() => {
            card.classList.add('animated');
          }, index * 200);
        }
      });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Run once on load
    
    // ===== CART COUNTER =====
    function updateCartCounter() {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      document.querySelector('.cart-counter').textContent = totalItems;
    }
    
    updateCartCounter();
    
    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input').value;
      alert(`Thank you for subscribing with ${email}! You'll receive our next newsletter soon.`);
      this.reset();
    });
  });
