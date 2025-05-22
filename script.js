// Typewriter Effect Class
class AutoTypewriter {
    constructor(element, words, options = {}) {
        this.element = element;
        this.words = words;
        this.typeSpeed = options.typeSpeed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.delayBetweenWords = options.delayBetweenWords || 500;
        this.delayBeforeDelete = options.delayBeforeDelete || 2000;
        
        this.currentWordIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        
        this.start();
    }
    
    start() {
        this.type();
    }
    
    type() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            this.currentText = this.currentText.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = currentWord.substring(0, this.currentText.length + 1);
        }
        
        this.element.textContent = this.currentText;
        
        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        typeSpeed += Math.random() * 50;
        
        if (!this.isDeleting && this.currentText === currentWord) {
            typeSpeed = this.delayBeforeDelete;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
            typeSpeed = this.delayBetweenWords;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Scroll Animation Observer
class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );
        
        this.init();
    }
    
    init() {
        // Elements to animate on scroll
        const animateElements = document.querySelectorAll(
            '.skill-item, .timeline-item, .contact-info, .contact-form, .fade-in'
        );
        
        animateElements.forEach(element => {
            this.observer.observe(element);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for skill bars
                if (entry.target.classList.contains('skill-item')) {
                    this.animateSkillBar(entry.target);
                }
                
                // Unobserve after animation to improve performance
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    animateSkillBar(skillItem) {
        const progressBar = skillItem.querySelector('.skill-progress');
        const targetWidth = progressBar.getAttribute('data-width');
        
        setTimeout(() => {
            progressBar.style.width = targetWidth;
        }, 300);
    }
}

// Smooth Scrolling for Navigation
class SmoothScroller {
    constructor() {
        this.init();
    }
    
    init() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        const logo = document.querySelector('.logo');
        
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });
        
        logo.addEventListener('click', this.scrollToTop.bind(this));
        
        // Update active nav on scroll
        window.addEventListener('scroll', this.updateActiveNav.bind(this));
    }
    
    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    scrollToTop(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        const headerHeight = document.querySelector('header').offsetHeight;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active class
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Header Background on Scroll
class HeaderController {
    constructor() {
        this.header = document.querySelector('header');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }
    
    handleScroll() {
        if (window.scrollY > 100) {
            this.header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            this.header.style.backdropFilter = 'blur(20px)';
        } else {
            this.header.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            this.header.style.backdropFilter = 'blur(10px)';
        }
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form form');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const name = this.form.querySelector('input[type="text"]').value;
        const email = this.form.querySelector('input[type="email"]').value;
        const message = this.form.querySelector('textarea').value;
        
        // Basic validation
        if (!name || !email || !message) {
            this.showMessage('Please fill in all fields.', 'error');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
        this.form.reset();
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 0.5rem;
            font-size: 1.4rem;
            text-align: center;
            ${type === 'success' ? 
                'background-color: rgba(34, 197, 94, 0.2); color: #22c55e; border: 1px solid #22c55e;' : 
                'background-color: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444;'
            }
        `;
        
        this.form.appendChild(messageDiv);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Particle Background Effect (Optional Enhancement)
class ParticleBackground {
    constructor() {
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }
    
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.1;
        `;
        document.body.appendChild(canvas);
        return canvas;
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }
    
    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = '#b74b4b';
            this.ctx.fill();
        });
        
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Loading Animation
class LoadingController {
    constructor() {
        this.init();
    }
    
    init() {
        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        `;
        
        loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 3px solid #333;
                    border-top: 3px solid #b74b4b;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <p style="color: white; font-size: 1.6rem;">Loading...</p>
            </div>
        `;
        
        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loadingOverlay);
        
        // Remove loading overlay when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 500);
            }, 1000);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Typewriter
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const words = [
                'Computer Security (UG)',
                'CTF Player',
                'Web Developer', 
                'Backend Developer',
                'Full Stack Developer',
                
        ];
        
        new AutoTypewriter(typewriterElement, words, {
            typeSpeed: 100,
            deleteSpeed: 50,
            delayBeforeDelete: 2000,
            delayBetweenWords: 500
        });
    }
    
    // Initialize all other components
    new ScrollAnimator();
    new SmoothScroller();
    new HeaderController();
    new ContactForm();
    new LoadingController();
    
    // Initialize particle background (optional - remove if performance issues)
    // Uncomment the next line to enable particle background
    // new ParticleBackground();
});

// Utility Functions
const Utils = {
    // Debounce function for performance optimization
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};