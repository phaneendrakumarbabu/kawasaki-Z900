import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

// 1. Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0, 0);

// 2. GSAP Animations & ScrollTriggers

// Initial Navigation Reveal
const tl = gsap.timeline();
tl.from('.navbar', { y: -100, opacity: 0, duration: 1, ease: 'power3.out' }, 0);

// Expansion Hero Scroll Animation
const expansionTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.expansion-hero',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
    }
});

expansionTl.to('.expansion-media-box', {
    width: '100vw',
    height: '100vh',
    borderRadius: 0,
    ease: 'power2.inOut',
}, 0);

expansionTl.to('.expansion-overlay', {
    backgroundColor: 'rgba(0,0,0,0)',
    ease: 'power2.inOut',
}, 0);

expansionTl.to('.expansion-title-left', {
    x: '-30vw',
    opacity: 0,
    ease: 'power2.inOut',
}, 0);

expansionTl.to('.expansion-title-right', {
    x: '30vw',
    opacity: 0,
    ease: 'power2.inOut',
}, 0);

expansionTl.to('.expansion-subtext', {
    y: 100,
    opacity: 0,
    ease: 'power2.inOut',
}, 0);

// Video Showcase Scroll Animation
gsap.from('.video-wrapper', {
    scrollTrigger: { trigger: '.video-showcase', start: 'top 80%' },
    x: -100, opacity: 0, duration: 1.2, ease: 'power3.out'
});

gsap.from('.showcase-text', {
    scrollTrigger: { trigger: '.video-showcase', start: 'top 80%' },
    x: 100, opacity: 0, duration: 1.2, ease: 'power3.out'
});

// Info Cards Reveal
gsap.from('.info-card', {
    scrollTrigger: { trigger: '.info-section', start: 'top 80%' },
    y: 80, opacity: 0, duration: 1.2, stagger: 0.3, ease: 'power3.out'
});

// Gallery Carousel Logic
const specsData = [
    { id: 1, title: 'Engine Configuration', value: 'Liquid-cooled, 4-stroke In-Line Four', desc: 'The heart of the Z900 delivers raw, emotional power with a quick-revving character.', image: '/images/gallery/engine.png' },
    { id: 2, title: 'Total Displacement', value: '948 cm³', desc: 'A potent 948cc displacement tuned for a strong mid-range hit, making street riding an absolute thrill.', image: '/images/gallery/displacement.png' },
    { id: 3, title: 'Curb Mass', value: '212 kg', desc: 'Lightweight trellis frame contributes to the Z900\'s nimble, confidence-inspiring handling.', image: '/images/gallery/mass.png' },
    { id: 4, title: 'Front Suspension', value: '41 mm inverted fork', desc: 'Provides excellent tracking and feedback, featuring stepless rebound damping and spring preload adjustability.', image: '/images/gallery/front.png' },
    { id: 5, title: 'Rear Suspension', value: 'Horizontal Back-link', desc: 'Ensures optimal performance centralization and features rebound damping and spring preload adjustability.', image: '/images/gallery/rear.png' },
    { id: 6, title: 'Fuel Capacity', value: '17 Litres', desc: 'Generous capacity combined with superb efficiency for long rides without frequent stops.', image: '/images/gallery/fuel.png' },
];

const galleryCarousel = document.querySelector('.gallery-carousel');
const galleryDotsContainer = document.getElementById('gallery-dots');
const btnPrev = document.getElementById('gallery-prev');
const btnNext = document.getElementById('gallery-next');

if (galleryCarousel) {
    // Generate Cards
    specsData.forEach((spec, i) => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.innerHTML = `
            <img src="${spec.image}" alt="${spec.title}" class="gallery-card-img">
            <div class="gallery-card-overlay">
                <div class="gallery-card-title">${spec.title}</div>
                <div class="gallery-card-value">${spec.value}</div>
                <div class="gallery-card-desc">${spec.desc}</div>
            </div>
        `;
        galleryCarousel.appendChild(card);

        const dot = document.createElement('div');
        dot.className = i === 0 ? 'gallery-dot active' : 'gallery-dot';
        dot.addEventListener('click', () => {
            const scrollPos = card.offsetLeft - galleryCarousel.offsetLeft;
            galleryCarousel.scrollTo({ left: scrollPos, behavior: 'smooth' });
        });
        galleryDotsContainer.appendChild(dot);
    });

    const updateControls = () => {
        const scrollLeft = galleryCarousel.scrollLeft;
        const scrollWidth = galleryCarousel.scrollWidth;
        const clientWidth = galleryCarousel.clientWidth;

        btnPrev.disabled = scrollLeft <= 0;
        btnNext.disabled = scrollLeft + clientWidth >= scrollWidth - 10; // 10px buffer

        // Update dots based on scroll position
        const cards = document.querySelectorAll('.gallery-card');
        let activeIndex = 0;
        let minDistance = Infinity;

        cards.forEach((card, index) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const scrollCenter = scrollLeft + galleryCarousel.clientWidth / 2;
            const distance = Math.abs(cardCenter - scrollCenter);

            if (distance < minDistance) {
                minDistance = distance;
                activeIndex = index;
            }
        });

        document.querySelectorAll('.gallery-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    };

    galleryCarousel.addEventListener('scroll', updateControls, { passive: true });

    // Initial State Check
    setTimeout(updateControls, 100);

    // Button Events
    btnPrev.addEventListener('click', () => {
        const cardWidth = document.querySelector('.gallery-card').offsetWidth + 24; // offset + gap
        galleryCarousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });

    btnNext.addEventListener('click', () => {
        const cardWidth = document.querySelector('.gallery-card').offsetWidth + 24;
        galleryCarousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
}

// Number Counters
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        onEnter: () => {
            gsap.to(counter, {
                innerHTML: counter.getAttribute('data-target'),
                duration: 2,
                ease: 'power2.out',
                snap: { innerHTML: 0.1 },
                stagger: 0.1
            });
        }
    });
});

// Footer Animation
gsap.utils.toArray('.footer-anim').forEach((element, index) => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: '.animated-footer',
            start: 'top 95%',
            once: true
        },
        y: 8,
        opacity: 0,
        filter: 'blur(4px)',
        duration: 0.8,
        delay: 0.1 + (index * 0.1),
        ease: 'power2.out'
    });
});

gsap.from('.badge', {
    scrollTrigger: { trigger: '.badges-section', start: 'top 90%' },
    y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out'
});

gsap.from('.testimonial-content', {
    scrollTrigger: { trigger: '.testimonial-section', start: 'top 80%' },
    y: 100, opacity: 0, duration: 1, ease: 'power3.out'
});

gsap.from('.social-card', {
    scrollTrigger: { trigger: '.community-section', start: 'top 80%' },
    y: 80, opacity: 0, duration: 1, stagger: 0.3, ease: 'power3.out'
});

// Particles.js initialized if loaded
if (window.particlesJS) {
    window.particlesJS('particles-js', {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: "#66FF00" },
            shape: { type: "circle" },
            opacity: { value: 0.3, random: true },
            size: { value: 2, random: true },
            line_linked: { enable: true, distance: 100, color: "#66FF00", opacity: 0.1, width: 1 },
            move: { enable: true, speed: 1.5, direction: "top", out_mode: "out" }
        },
        interactivity: {
            events: { onhover: { enable: true, mode: "bubble" }, onclick: { enable: true, mode: "repulse" } },
            modes: { bubble: { distance: 200, size: 4, duration: 2, opacity: 0.8, speed: 3 } }
        },
        retina_detect: true
    });
}
