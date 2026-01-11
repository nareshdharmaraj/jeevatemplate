// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle i');
  if (icon) {
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

updateThemeIcon(currentTheme);

// Scroll-Aware Header
const header = document.querySelector('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Navbar is now static at top
  header.style.transform = 'translateY(0)';
  lastScrollY = window.scrollY;
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navTools = document.querySelector('.nav-tools');

if (mobileMenuBtn && navLinks) {
  const moveNavToolsForMobile = () => {
    if (window.innerWidth <= 900 && navTools && !navLinks.contains(navTools)) {
      navLinks.appendChild(navTools);
    } else if (window.innerWidth > 900 && navTools && navLinks.contains(navTools)) {
      const navContainer = document.querySelector('.nav-container');
      if (navContainer) {
        navContainer.appendChild(navTools);
      }
    }
  };

  moveNavToolsForMobile();
  window.addEventListener('resize', moveNavToolsForMobile);

  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        navLinks.classList.remove('active');
      }
    });
  });
}

// Tech Grid Background Animation
const techGrids = document.querySelectorAll('.tech-grid');
techGrids.forEach(grid => {
  grid.style.backgroundImage = `
    repeating-linear-gradient(0deg, transparent, transparent 40px, var(--border) 40px, var(--border) 41px),
    repeating-linear-gradient(90deg, transparent, transparent 40px, var(--border) 40px, var(--border) 41px)
  `;
});

// Animated Backgrounds (Particles) Initialization
function initAnimatedBackgrounds() {
  const targets = document.querySelectorAll('.mega-hero, .hero-section, .animated-bg-trigger');
  targets.forEach(target => {
    if (target.querySelector('.animated-bg')) return;

    const bg = document.createElement('div');
    bg.className = 'animated-bg';

    // Add 10 particles
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      // Randomize position slightly for better distribution
      p.style.left = (i * 10 + Math.random() * 5) + '%';
      p.style.animationDelay = (Math.random() * 5) + 's';
      bg.appendChild(p);
    }

    // Add gradient wave
    const wave = document.createElement('div');
    wave.className = 'gradient-wave';
    bg.appendChild(wave);

    // Add geometric lines
    const geoLines = document.createElement('div');
    geoLines.className = 'geo-lines';
    for (let i = 0; i < 4; i++) {
      const line = document.createElement('div');
      line.className = 'geo-line';
      geoLines.appendChild(line);
    }
    bg.appendChild(geoLines);

    // Ensure parent is relative
    if (getComputedStyle(target).position === 'static') {
      target.style.position = 'relative';
    }

    target.prepend(bg);
  });
}

// Run immediately and on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimatedBackgrounds);
} else {
  initAnimatedBackgrounds();
}

// Reveal Animations Logic
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// RTL Toggle Management
const rtlToggle = document.getElementById('rtl-toggle');
const currentDir = localStorage.getItem('dir') || 'ltr';

document.documentElement.setAttribute('dir', currentDir);

if (rtlToggle) {
  rtlToggle.addEventListener('click', () => {
    let dir = document.documentElement.getAttribute('dir');
    let newDir = dir === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem('dir', newDir);
  });
}

// Chart Initialization
function initDashboardChart() {
  const ctx = document.getElementById('loadChart');
  if (!ctx) return;

  // Check if Chart is defined
  if (typeof Chart === 'undefined') return;

  // Detect Theme for Colors
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '23:59'],
      datasets: [{
        label: 'Efficiency',
        data: [45, 52, 68, 74, 58, 62, 95, 82, 74, 88, 92, 65, 50],
        backgroundColor: (context) => {
          const index = context.dataIndex;
          // Highlight 12:00 (Index 6)
          if (index === 6) {
            return isDark ? '#60a5fa' : '#2563eb'; // Blue in both, but brighter in dark
          }
          // Highlight 20:00 (Index 10)
          if (index === 10) {
            return '#3b82f6';
          }
          return isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(37, 99, 235, 0.2)';
        },
        borderColor: (context) => {
          const index = context.dataIndex;
          if (index === 6 || index === 10) return 'transparent';
          return isDark ? '#60a5fa' : '#2563eb';
        },
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          titleColor: isDark ? '#f1f5f9' : '#0f172a',
          bodyColor: isDark ? '#94a3b8' : '#475569',
          borderColor: isDark ? '#334155' : '#e2e8f0',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          bodyFont: {
            family: "'Inter', sans-serif"
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor,
            drawBorder: false
          },
          ticks: {
            color: textColor,
            font: {
              family: "'Inter', sans-serif",
              size: 11
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: textColor,
            font: {
              family: "'Inter', sans-serif",
              size: 11
            }
          }
        }
      },
      animation: {
        duration: 2500,
        easing: 'easeOutQuart',
        onComplete: (animation) => {
          // Add a subtle bounce or pulse effect here if needed
        }
      }
    }
  });

  // Simple Theme Listener to update chart
  // Note: Full reactivity requires destroying/recreating or plugin, but this is a quick fix
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        const newIsDark = document.documentElement.getAttribute('data-theme') === 'dark';
        chart.data.datasets[0].backgroundColor = (context) => {
          const index = context.dataIndex;
          if (index === 6) return newIsDark ? '#ffffff' : '#020617';
          if (index === 10) return '#3b82f6';
          return '#93c5fd';
        };
        chart.options.scales.x.ticks.color = newIsDark ? '#94a3b8' : '#475569';
        chart.update();
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initDashboardChart();
    initCounters();
  });
} else {
  initDashboardChart();
  initCounters();
}

// Animated Stat Counters
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const speed = 200; // lower = faster

  const startCounter = (counter) => {
    const updateCount = () => {
      const targetStr = counter.getAttribute('data-target');
      const target = parseFloat(targetStr);
      const isNegative = target < 0;
      const absTarget = Math.abs(target);
      const currentText = counter.innerText.replace(',', '').replace('-', '');
      const count = parseFloat(currentText) || 0;

      const inc = absTarget / speed;

      if (count < absTarget) {
        let nextCount = count + inc;
        let formattedCount;

        if (absTarget % 1 !== 0) {
          formattedCount = nextCount.toFixed(1);
        } else {
          formattedCount = Math.ceil(nextCount);
        }

        counter.innerText = (isNegative ? '-' : '') + formattedCount;
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = targetStr;
      }
    };
    updateCount();
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => counterObserver.observe(counter));
}
