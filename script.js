// --- Initial Page Setup ---
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// --- Get ALL DOM Elements ---
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-links .nav-link');
const navbar = document.getElementById('navbar');
const countdownDigitsEl = document.querySelector('.countdown-digits');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownTitleEl = document.querySelector('.countdown-title');
const presentationSection = document.getElementById('presentation');
const featuresSection = document.getElementById('features');
const registerSection = document.getElementById('register');
const faqSection = document.getElementById('faq');
const partnersSection = document.getElementById('partners');
const contactSection = document.getElementById('contact');
const preloaderOverlay = document.getElementById('preloader-overlay');
const mainSiteContent = document.getElementById('main-site-content');
const bodyEl = document.body;
// Pop-up related elements will be fetched inside DOMContentLoaded

// --- State Variables ---
// (No state variables needed here for now)

// --- Preloader Logic ---
window.addEventListener('load', () => {
    const preloaderFadeOutDuration = 500; // Match CSS transition duration

    if (preloaderOverlay && mainSiteContent) {
        preloaderOverlay.classList.add('hidden');
        setTimeout(() => {
            mainSiteContent.classList.add('visible');
            bodyEl.style.overflow = 'auto';
            // Optional: remove preloader completely after transition
            // preloaderOverlay.style.display = 'none';
            // preloaderOverlay.remove();
        }, preloaderFadeOutDuration);
    } else {
        if(mainSiteContent) mainSiteContent.classList.add('visible');
        bodyEl.style.overflow = 'auto';
        console.error("Preloader overlay or main site content wrapper not found!");
    }
});

// --- Function to close mobile menu ---
function closeMenu() {
    if (navMenu && menuToggle && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
}

// --- Mobile Menu Toggle ---
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// --- Close mobile menu on nav link click ---
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// --- Close mobile menu on outside click ---
document.addEventListener('click', (event) => {
    if (navMenu && navMenu.classList.contains('active')) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle ? menuToggle.contains(event.target) : false;
        if (!isClickInsideNav && !isClickOnToggle) {
            closeMenu();
        }
    }
});

// --- Countdown Timer Logic ---
const competitionDate = new Date('April 20, 2025 23:59:59').getTime();
const countdownInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = competitionDate - now;

    if (!countdownDigitsEl || !daysEl || !hoursEl || !minutesEl || !secondsEl) {
         console.error("Countdown elements not found.");
         clearInterval(countdownInterval);
         return;
    }
    if (distance < 0) {
        clearInterval(countdownInterval);
        if (countdownTitleEl) countdownTitleEl.textContent = 'Registration Closed';
        countdownDigitsEl.innerHTML = "<div class='countdown-ended-message'>Check back for results!</div>";
        if(daysEl) daysEl.textContent = '00';
        if(hoursEl) hoursEl.textContent = '00';
        if(minutesEl) minutesEl.textContent = '00';
        if(secondsEl) secondsEl.textContent = '00';
        return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl && daysEl.textContent !== days.toString().padStart(2, '0')) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl && hoursEl.textContent !== hours.toString().padStart(2, '0')) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl && minutesEl.textContent !== minutes.toString().padStart(2, '0')) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl && secondsEl.textContent !== seconds.toString().padStart(2, '0')) secondsEl.textContent = seconds.toString().padStart(2, '0');
}, 1000);

// --- Navbar Style Change on Scroll ---
const scrollThreshold = 550;
function handleNavbarScrollStyle() {
    if (!navbar) return;
    const scrolled = window.scrollY > scrollThreshold;
    navbar.classList.toggle('scrolled', scrolled);
    if (navMenu) {
        navMenu.classList.toggle('scrolled', scrolled);
    }
}
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleNavbarScrollStyle, 50);
}, { passive: true });
handleNavbarScrollStyle();

// --- Intersection Observer for Section Animations ---
const sectionObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
};
const sectionObserverOptions = { root: null, threshold: 0.15 };
const sectionObserver = new IntersectionObserver(sectionObserverCallback, sectionObserverOptions);
const sectionsToObserve = [
    presentationSection, featuresSection, registerSection,
    faqSection, partnersSection, contactSection
].filter(section => section instanceof HTMLElement);

if (sectionsToObserve.length > 0) {
    sectionsToObserve.forEach(section => sectionObserver.observe(section));
} else {
    console.warn("No sections found to observe for animations.");
}


// --- DOMContentLoaded Event Listener (for FAQ and Pop-up) ---
document.addEventListener('DOMContentLoaded', () => {

    // --- FAQ Accordion Logic ---
    const faqContainer = document.getElementById('faq');
    if (faqContainer) {
        const faqItems = faqContainer.querySelectorAll('.faq-item');
        if (faqItems.length > 0) {
            faqItems.forEach(item => {
                const questionButton = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                const answerContent = answer ? answer.querySelector('.faq-answer-content') : null;
                const icon = item.querySelector('.faq-icon');

                if (!questionButton || !answer || !answerContent || !icon) {
                    console.warn("FAQ item missing required elements:", item);
                    return;
                }

                const isOpen = item.classList.contains('active');
                questionButton.setAttribute('aria-expanded', isOpen.toString());
                answer.setAttribute('aria-hidden', (!isOpen).toString());
                answer.style.maxHeight = isOpen ? (answerContent.scrollHeight + 40) + "px" : '0';
                icon.classList.toggle('rotated', isOpen);

                questionButton.addEventListener('click', () => {
                    const currentlyActive = item.classList.contains('active');

                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            const otherButton = otherItem.querySelector('.faq-question');
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            const otherIcon = otherItem.querySelector('.faq-icon');
                            if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
                            if (otherAnswer) {
                                otherAnswer.setAttribute('aria-hidden', 'true');
                                otherAnswer.style.maxHeight = '0';
                            }
                            if (otherIcon) otherIcon.classList.remove('rotated');
                        }
                    });

                    item.classList.toggle('active');
                    const isActiveNow = item.classList.contains('active');

                    questionButton.setAttribute('aria-expanded', isActiveNow.toString());
                    answer.setAttribute('aria-hidden', (!isActiveNow).toString());
                    answer.style.maxHeight = isActiveNow ? (answerContent.scrollHeight + 40) + "px" : '0';
                    icon.classList.toggle('rotated', isActiveNow);
                });
            });
        } else {
            console.warn("No '.faq-item' elements found within #faq.");
        }
    } else {
        console.warn("FAQ container ('#faq') not found.");
    }

 

}); // --- End DOMContentLoaded ---
