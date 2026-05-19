// ============================================
// Smooth Scrolling Navigation
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            document.querySelector('.nav-links').classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        }
    });
});

// ============================================
// Mobile Menu Toggle
// ============================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ============================================
// Navbar Scroll Effect
// ============================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// Scroll Animations - Fade In Elements
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('.project-card, .education-card, .timeline-item, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ============================================
// Active Section Highlight in Navigation
// ============================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.style.color = '';
            });
            
            // Add active class to current link
            if (navLink) {
                navLink.style.color = 'var(--primary-color)';
                navLink.style.fontWeight = 'bold';
            }
        }
    });
});

// ============================================
// Skill Progress Animation
// ============================================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.getElementById('skills');
    
    if (!skillsSection) return;
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    bar.offsetHeight; // Trigger reflow
                    bar.style.width = width;
                    bar.classList.add('animated');
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillsObserver.observe(skillsSection);
}

animateSkillBars();

// ============================================
// Contact Form Handling
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Option 1: Using Formspree (Recommended - Free)
            // Sign up at https://formspree.io
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showNotification('Error sending message. Please try again.', 'error');
            }
        } catch (error) {
            console.log('Error:', error);
            // Fallback: Direct mailto
            showNotification('Please use the email link to contact me directly.', 'info');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ============================================
// Project Modal (Optional - for detailed views)
// ============================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    const viewDetailsBtn = card.querySelector('.btn-small');
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectTitle = card.querySelector('h3').textContent;
            showProjectModal(projectTitle);
        });
    }
});

function showProjectModal(projectTitle) {
    // Simple alert - you can expand this with a modal
    console.log(`Project: ${projectTitle}`);
    // Optional: Create a detailed modal here
}

// ============================================
// Dark/Light Mode Toggle (Optional)
// ============================================
function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (!darkModeToggle) return;

    // Check for saved preference
    const prefersDark = localStorage.getItem('darkMode') === 'true';
    if (prefersDark) {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
    });
}

initDarkMode();

// ============================================
// Lazy Loading Images
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ============================================
// Counter Animation (Optional - for stats)
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const increment = target / 30; // Animation steps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 30);
    });
}

// Call on scroll to section with counters
window.addEventListener('scroll', () => {
    const statsSection = document.querySelector('[data-count]');
    if (statsSection && !statsSection.classList.contains('counted')) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            animateCounters();
            statsSection.classList.add('counted');
        }
    }
});

// ============================================
// Utility Functions
// ============================================

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    });
}

// Scroll to top button
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

createScrollToTopButton();

// ============================================
// Console Message
// ============================================
console.log('%cWelcome to my portfolio! 🎉', 'font-size: 20px; color: #2563eb; font-weight: bold;');
console.log('%cFeel free to explore my projects and connect with me!', 'font-size: 14px; color: #6b7280;');

// ============================================
// Initialize on Page Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded successfully');
    
    // Add any initialization code here
    animateSkillBars();
});

