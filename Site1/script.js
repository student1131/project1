document.addEventListener("DOMContentLoaded", function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                nav.classList.remove('active');
            }
        });
    });

    const menuItems = [
        {
            name: "Bruschetta",
            description: "Toasted bread topped with tomatoes, garlic, and fresh basil",
            price: "$8.99",
            category: "starters",
            image: "images/bruschetta.jpg"
        },
        {
            name: "Caesar Salad",
            description: "Romaine lettuce, croutons, parmesan cheese with Caesar dressing",
            price: "$10.99",
            category: "starters",
            image: "images/caesar-salad.jpg"
        },
        {
            name: "Grilled Salmon",
            description: "Fresh salmon fillet with lemon butter sauce and seasonal vegetables",
            price: "$22.99",
            category: "mains",
            image: "images/salmon.jpg"
        },
        {
            name: "Filet Mignon",
            description: "8oz tender beef filet with mashed potatoes and asparagus",
            price: "$29.99",
            category: "mains",
            image: "images/filet-mignon.jpg"
        },
        {
            name: "Tiramisu",
            description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
            price: "$7.99",
            category: "desserts",
            image: "images/tiramisu.jpg"
        },
        {
            name: "Chocolate Lava Cake",
            description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
            price: "$8.99",
            category: "desserts",
            image: "images/lava-cake.jpg"
        },
        {
            name: "House Wine",
            description: "Glass of our signature red or white wine",
            price: "$7.99",
            category: "drinks",
            image: "images/wine.jpg"
        },
        {
            name: "Craft Beer",
            description: "Selection of local craft beers",
            price: "$6.99",
            category: "drinks",
            image: "images/beer.jpg"
        }
    ];

    const menuContainer = document.getElementById('menu-items-container');
    const categoryButtons = document.querySelectorAll('.category-btn');

    function renderMenuItems(category = 'all') {
        menuContainer.innerHTML = '';
        
        const filteredItems = category === 'all' 
            ? menuItems 
            : menuItems.filter(item => item.category === category);
        
        filteredItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="menu-item-content">
                    <h3>${item.name}</h3>
                    <p class="menu-item-price">${item.price}</p>
                    <p>${item.description}</p>
                </div>
            `;
            menuContainer.appendChild(menuItem);
        });
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            renderMenuItems(category);
        });
    });

    renderMenuItems();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const nameInput = this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[name="email"]');
            const messageInput = this.querySelector('textarea[name="message"]');
            
            let isValid = true;
            
            if (nameInput.value.trim() === '') {
                isValid = false;
                nameInput.classList.add('error');
            } else {
                nameInput.classList.remove('error');
            }
            
            if (!emailInput.value.includes('@')) {
                isValid = false;
                emailInput.classList.add('error');
            } else {
                emailInput.classList.remove('error');
            }
            
            if (messageInput.value.trim() === '') {
                isValid = false;
                messageInput.classList.add('error');
            } else {
                messageInput.classList.remove('error');
            }
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields correctly.');
            }
        });
    }

    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            
        });
    }

    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}