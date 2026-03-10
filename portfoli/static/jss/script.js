// mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// navbar shadow on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('shadow-lg');
  } else {
    navbar.classList.remove('shadow-lg');
  }
});

/* 3D tilt effect for the photo */
(function() {
  const wrapper = document.querySelector('[data-tilt]');
  if (!wrapper) return;
  const frame = wrapper.querySelector('.photo-3d-frame');

  const maxTilt = 12; // degrees
  const ease = 0.12;
  let w = wrapper.clientWidth, h = wrapper.clientHeight;
  let currentX = 0, currentY = 0, targetX = 0, targetY = 0;

  function onMove(e) {
    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX ?? (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY ?? (e.touches && e.touches[0].clientY)) - rect.top;
    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;
    targetX = py * maxTilt * -1; // invert
    targetY = px * maxTilt;
  }

  function update() {
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    frame.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg) translateZ(0px)`;
    requestAnimationFrame(update);
  }

  wrapper.addEventListener('mousemove', onMove);
  wrapper.addEventListener('touchmove', onMove, {passive:true});
  wrapper.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });
  wrapper.addEventListener('touchend', () => { targetX = 0; targetY = 0; });

  update();
})();

/* simple reveal-on-scroll for sections */
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('section, .project-card, .skill-card').forEach(el => {
    el.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-700');
    observer.observe(el);
  });
})();

/* CSS utility for reveal set via JS */
(function() {
  const style = document.createElement('style');
  style.innerHTML = `
    .reveal-in { opacity: 1 !important; transform: translateY(0px) !important; }
    .translate-y-6 { transform: translateY(1.5rem); }
    .opacity-0 { opacity: 0; }
  `;
  document.head.appendChild(style);
})();

/* Dynamic responsiveness adjustments */
(function() {
  function adjustResponsiveness() {
    const width = window.innerWidth;
    const root = document.documentElement;

    // Adjust hero font size
    if (width < 640) {
      root.style.setProperty('--hero-font-size', '2rem');
    } else if (width < 1024) {
      root.style.setProperty('--hero-font-size', '2.5rem');
    } else {
      root.style.setProperty('--hero-font-size', '3rem');
    }

    // Adjust photo frame size
    const photoWrapper = document.querySelector('.photo-3d-wrapper');
    if (photoWrapper) {
      if (width < 640) {
        photoWrapper.style.maxWidth = '80vw';
      } else {
        photoWrapper.style.maxWidth = '40vw';
      }
    }

    // Adjust grid gaps for better mobile spacing
    const grids = document.querySelectorAll('.grid');
    grids.forEach(grid => {
      if (width < 640) {
        grid.style.gap = '1rem';
      } else {
        grid.style.gap = '1.5rem';
      }
    });
  }

  window.addEventListener('resize', adjustResponsiveness);
  adjustResponsiveness(); // Initial call
})();

/* Back to top button */
(function() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
        backToTopBtn.style.opacity = '1';
      } else {
        backToTopBtn.style.opacity = '0';
        setTimeout(() => {
          if (window.scrollY <= 300) backToTopBtn.style.display = 'none';
        }, 300);
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
