/**
 * Welcome 2026 - Personal Website
 * Enhanced interactive features with navbar, goal tracking, and theme toggle
 */

(function() {
    'use strict';

    // ===================================
    // Navbar Functionality
    // ===================================

    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const navbarToggle = document.getElementById('navbar-toggle');
        const navbarMenu = document.getElementById('navbar-menu');
        const navLinks = document.querySelectorAll('.navbar-link');

        // Sticky navbar with scroll effect
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateNavbar() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateNavbar);
                ticking = true;
            }
            updateActiveSection();
        });

        // Mobile menu toggle
        if (navbarToggle) {
            navbarToggle.addEventListener('click', function() {
                navbarToggle.classList.toggle('active');
                navbarMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navbarToggle.classList.remove('active');
                    navbarMenu.classList.remove('active');
                });
            });
        }

        // Active section highlighting
        function updateActiveSection() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.navbar-link[href="#${sectionId}"]`);

                if (navLink && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            });
        }

        // Smooth scroll for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 70;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // ===================================
    // Goal Tracking System
    // ===================================

    function initGoalTracking() {
        const goalCards = document.querySelectorAll('.goal-card');
        const STORAGE_KEY = 'hamida_2026_goals';

        // Load saved goals from localStorage
        function loadGoals() {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    return JSON.parse(saved);
                }
            } catch (e) {
                console.warn('Could not load goals from localStorage');
            }
            return {};
        }

        // Save goals to localStorage
        function saveGoals(goals) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
            } catch (e) {
                console.warn('Could not save goals to localStorage');
            }
        }

        // Initialize goals state
        let goalsState = loadGoals();

        // Restore completed goals on page load
        goalCards.forEach(card => {
            const goalId = card.getAttribute('data-goal-id');
            if (goalsState[goalId]) {
                card.classList.add('completed');
            }
        });

        // Update progress indicator
        function updateProgress() {
            const totalGoals = goalCards.length;
            const completedGoals = Object.keys(goalsState).filter(id => goalsState[id]).length;
            const percentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

            const completedCountEl = document.getElementById('completed-count');
            const totalCountEl = document.getElementById('total-count');
            const progressPercentageEl = document.getElementById('progress-percentage');
            const progressFillEl = document.getElementById('progress-fill');

            if (completedCountEl) completedCountEl.textContent = completedGoals;
            if (totalCountEl) totalCountEl.textContent = totalGoals;
            if (progressPercentageEl) progressPercentageEl.textContent = `${percentage}%`;
            if (progressFillEl) {
                progressFillEl.style.width = `${percentage}%`;
            }
        }

        // Handle goal checkbox clicks
        goalCards.forEach(card => {
            const checkbox = card.querySelector('.goal-checkbox');
            const goalId = card.getAttribute('data-goal-id');

            if (checkbox) {
                checkbox.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    const isCompleted = card.classList.contains('completed');
                    
                    // Toggle completed state
                    if (isCompleted) {
                        card.classList.remove('completed');
                        goalsState[goalId] = false;
                    } else {
                        card.classList.add('completed');
                        goalsState[goalId] = true;
                        
                        // Add subtle animation
                        card.style.transform = 'scale(1.02)';
                        setTimeout(() => {
                            card.style.transform = '';
                        }, 200);
                    }

                    // Save to localStorage
                    saveGoals(goalsState);
                    
                    // Update progress
                    updateProgress();
                });
            }
        });

        // Initial progress update
        updateProgress();
    }

    // ===================================
    // Theme Toggle
    // ===================================

    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const THEME_KEY = 'hamida_2026_theme';
        const LIGHT_THEME = 'light';
        const DARK_THEME = 'dark';

        // Load saved theme
        function loadTheme() {
            try {
                const saved = localStorage.getItem(THEME_KEY);
                return saved || DARK_THEME;
            } catch (e) {
                return DARK_THEME;
            }
        }

        // Save theme
        function saveTheme(theme) {
            try {
                localStorage.setItem(THEME_KEY, theme);
            } catch (e) {
                console.warn('Could not save theme to localStorage');
            }
        }

        // Apply theme
        function applyTheme(theme) {
            if (theme === LIGHT_THEME) {
                document.body.classList.add('light-theme');
                if (themeToggle) themeToggle.textContent = '☀️';
            } else {
                document.body.classList.remove('light-theme');
                if (themeToggle) themeToggle.textContent = '🌙';
            }
        }

        // Initialize theme
        const currentTheme = loadTheme();
        applyTheme(currentTheme);

        // Toggle theme on button click
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const isLight = document.body.classList.contains('light-theme');
                const newTheme = isLight ? DARK_THEME : LIGHT_THEME;
                applyTheme(newTheme);
                saveTheme(newTheme);
            });
        }
    }

    // ===================================
    // Scroll Animations (Enhanced)
    // ===================================

    function initScrollAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ===================================
    // Scroll Indicator
    // ===================================

    function initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;

        let ticking = false;

        function updateScrollIndicator() {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollIndicator);
                ticking = true;
            }
        });
    }

    // ===================================
    // Parallax Effect
    // ===================================

    function initParallax() {
        const heroBackground = document.querySelector('.hero-background');
        if (!heroBackground) return;

        let ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * 0.3;
                    
                    if (scrolled < window.innerHeight) {
                        heroBackground.style.transform = `translateY(${rate}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ===================================
    // Initialize All Features
    // ===================================

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initNavbar();
                initGoalTracking();
                initThemeToggle();
                initScrollAnimations();
                initScrollIndicator();
                initParallax();
            });
        } else {
            initNavbar();
            initGoalTracking();
            initThemeToggle();
            initScrollAnimations();
            initScrollIndicator();
            initParallax();
        }
    }

    // Start initialization
    init();

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Re-check scroll animations if needed
            initScrollAnimations();
        }, 250);
    });

})();
