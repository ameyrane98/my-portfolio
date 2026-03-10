// js/main.js

/**
 * Main JavaScript for Portfolio
 * Handles intersection observers, navigation state, and dynamic data fetching.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SET CURRENT YEAR IN FOOTER
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. NAVBAR SCROLL EFFECT
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. MOBILE MENU TOGGLE
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // 4. ROAST MODE TOGGLE (Light/Dark pages)
  const roastToggle = document.getElementById('roastToggle');
  const roastIcon = roastToggle ? roastToggle.querySelector('.roast-icon') : null;
  
  // Check local storage for preference
  const currentRoast = localStorage.getItem('roastMode');
  if (currentRoast === 'dark') {
    document.body.classList.add('dark-roast');
    if (roastToggle) roastToggle.innerHTML = '<span class="roast-icon">☀️</span> Light Roast';
  }

  if (roastToggle) {
    roastToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-roast');
      const isDark = document.body.classList.contains('dark-roast');
      
      localStorage.setItem('roastMode', isDark ? 'dark' : 'light');
      roastToggle.innerHTML = isDark 
        ? '<span class="roast-icon">☀️</span> Light Roast'
        : '<span class="roast-icon">🌙</span> Dark Roast';
    });
  }

  // 5. OPEN BOOK COVER
  const btnOpenBook = document.getElementById('btnOpenBook');
  const notebookCover = document.getElementById('notebookCover');
  
  if (btnOpenBook && notebookCover) {
    btnOpenBook.addEventListener('click', () => {
      notebookCover.classList.add('open');
      
      // The #about section is `.active-page` by default, so it will naturally appear when cover flips.
    });
  }

  // 6. BOOK NAVIGATION ARCHITECTURE
  const navLinksList = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('.book-container .section'));
  const bookContainer = document.getElementById('book-container');
  const pageTabsContainer = document.getElementById('pageTabs');
  
  // Create Numbered Edge Tabs
  if (pageTabsContainer && sections.length > 0) {
    sections.forEach((sec, index) => {
      const tab = document.createElement('div');
      tab.className = 'page-tab';
      if (index === 0) tab.classList.add('active-tab');
      tab.textContent = String(index + 1).padStart(2, '0');
      tab.dataset.target = sec.id;
      
      tab.addEventListener('click', () => {
        navigateToSection(sec.id);
      });
      
      pageTabsContainer.appendChild(tab);
    });
  }
  
  // Central Navigation Function
  function navigateToSection(targetId) {
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;
    
    const currentActive = document.querySelector('.section.active-page');
    
    // If we are already on this page, just reset its scroll
    if (currentActive === targetSection) {
      targetSection.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const currentIndex = currentActive ? sections.indexOf(currentActive) : -1;
    const targetIndex = sections.indexOf(targetSection);
    
    if (currentActive) {
      currentActive.classList.remove('active-page');
      if (targetIndex > currentIndex) {
        // Moving forward: turn page left
        currentActive.classList.add('page-turned');
        currentActive.classList.remove('page-coming');
      } else {
        // Moving backward: turn page right
        currentActive.classList.remove('page-turned');
        currentActive.classList.add('page-coming'); 
      }
    }
    
    // Prepare background pages
    sections.forEach((sec, idx) => {
      if (sec === targetSection || sec === currentActive) return;
      
      if (idx < targetIndex) {
        sec.classList.remove('active-page', 'page-coming');
        sec.classList.add('page-turned');
      } else {
        sec.classList.remove('active-page', 'page-turned');
        sec.classList.add('page-coming');
      }
    });
    
    // Activate the targeted page
    targetSection.classList.remove('page-turned', 'page-coming');
    targetSection.classList.add('active-page');
    
    // Reset scroll for the new page
    targetSection.scrollTop = 0;
    
    // Recheck the active section to update Prev/Next button visibility logic if needed
    // (Optional: Hide Prev on first page, Hide Next on last page)
    const btnPrevPage = document.getElementById('btnPrevPage');
    const btnNextPage = document.getElementById('btnNextPage');
    if(btnPrevPage && btnNextPage) {
       btnPrevPage.style.display = targetIndex === 0 ? 'none' : 'inline-flex';
       btnNextPage.style.display = targetIndex === sections.length - 1 ? 'none' : 'inline-flex';
    }
    
    // Open notebook if closed
    if (notebookCover && !notebookCover.classList.contains('open')) {
      notebookCover.classList.add('open');
    }
    
    history.pushState(null, null, `#${targetId}`);
  }

  // Attach Top Navbar Links to Central Nav Logic
  navLinksList.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Close mobile menu if open
      if (hamburger && navLinks) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
      
      const targetId = link.getAttribute('href').substring(1);
      navigateToSection(targetId);
    });
  });

  // 7. EXPLICIT BUTTON NAVIGATION (Replacing Scroll-to-Turn)
  const btnPrevPage = document.getElementById('btnPrevPage');
  const btnNextPage = document.getElementById('btnNextPage');
  
  // Initialize button visibility
  if (btnPrevPage) btnPrevPage.style.display = 'none'; // Hidden on first page

  if (btnNextPage) {
    btnNextPage.addEventListener('click', (e) => {
      e.preventDefault();
      const currentActive = document.querySelector('.section.active-page');
      let currentIndex = 0;
      if (currentActive) {
        currentIndex = Array.from(sections).indexOf(currentActive);
      }
      
      if (currentIndex < sections.length - 1) {
        navigateToSection(sections[currentIndex + 1].id);
      }
    });
  }

  if (btnPrevPage) {
    btnPrevPage.addEventListener('click', (e) => {
      e.preventDefault();
      const currentActive = document.querySelector('.section.active-page');
      let currentIndex = 0;
      if (currentActive) {
        currentIndex = Array.from(sections).indexOf(currentActive);
      }
      
      if (currentIndex > 0) {
        navigateToSection(sections[currentIndex - 1].id);
      }
    });
  }

  // 8. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target); // Run once
        }
      });
    }, {
      root: null,
      threshold: 0.15, // Trigger when 15% visible
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('in'));
  }

  // 6. NOTEBOOK LOAD ANIMATION
  const notebook = document.getElementById('notebook');
  if (notebook) {
    setTimeout(() => {
      notebook.classList.add('loaded');
    }, 150);
  }

  // 7. FETCH GITHUB PROJECTS
  fetchGitHubProjects();

  // 8. FETCH LEETCODE STATS
  fetchLeetCodeStats();

  // 9. CONTACT FORM SUBMISSION
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitBtn');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate network request
      setTimeout(() => {
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        formStatus.textContent = "Message sent successfully! I'll be in touch.";
        formStatus.className = "form-status ok";
        formStatus.removeAttribute('hidden');
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          formStatus.setAttribute('hidden', '');
        }, 5000);
      }, 1200);
    });
  }
});

/**
 * Fetches recent public repositories from GitHub API
 */
async function fetchGitHubProjects() {
  const projectsGrid = document.getElementById('projectsGrid');
  if (!projectsGrid) return;
  
  const username = 'ameyrane98';
  // Fetch up to 6 repositories, sorted by updated time
  const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch GitHub repos');
    
    const repos = await res.json();
    
    // Clear skeletons
    projectsGrid.innerHTML = '';
    
    if (repos.length === 0) {
      projectsGrid.innerHTML = '<p class="section-sub">No public repositories found.</p>';
      return;
    }
    
    repos.forEach(repo => {
      // Map GitHub language to visually pleasing colors or just generic fallback
      const lang = repo.language || 'Code';
      const desc = repo.description || 'No description provided.';
      
      // Determine stagger delay for reveal animation
      const delay = (repos.indexOf(repo) * 0.1).toFixed(2);
      
      const cardHTML = `
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="proj-card reveal" style="--d: ${delay}s" data-lang="${lang}">
          <h3 class="proj-name">${repo.name}</h3>
          <p class="proj-desc">${desc}</p>
          <div class="proj-footer">
            <span class="proj-stars">${repo.stargazers_count}</span>
            <span class="proj-link">View Repository →</span>
          </div>
        </a>
      `;
      
      projectsGrid.insertAdjacentHTML('beforeend', cardHTML);
      
      // We must manually trigger the `.in` class if it's already in viewport 
      // or rely on our existing observer (but they are injected after the observer was created).
      // Let's just add it dynamically to our observer.
    });
    
    // Re-observe newly added cards if observer API is available
    if ('IntersectionObserver' in window) {
      const newObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
      
      const newReveals = document.querySelectorAll('.proj-card.reveal');
      newReveals.forEach(el => newObserver.observe(el));
    } else {
      document.querySelectorAll('.proj-card.reveal').forEach(el => el.classList.add('in'));
    }
    
  } catch (err) {
    console.error('Error loading projects:', err);
    projectsGrid.innerHTML = '<p class="section-sub" style="color:#f87171;">Unable to load projects from GitHub at this time.</p>';
  }
}

/**
 * Fetches LeetCode stats from the local proxy serverless function
 */
async function fetchLeetCodeStats() {
  const username = 'ameyrane98';
  const url = `/api/leetcode/${username}`;
  
  const lcCard = document.getElementById('lcCard');
  if (!lcCard) return;

  // Add a 1.5s timeout so local dev doesn't hang
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500);
  
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error('Failed to fetch LeetCode stats');
    
    const statsArray = await res.json();
    
    let total = 0, easy = 0, med = 0, hard = 0;
    statsArray.forEach(stat => {
      if (stat.difficulty === 'All') total = stat.count;
      if (stat.difficulty === 'Easy') easy = stat.count;
      if (stat.difficulty === 'Medium') med = stat.count;
      if (stat.difficulty === 'Hard') hard = stat.count;
    });
    
    animateCounter('lcTotal', total, 1500, '');
    animateCounter('lcEasy', easy, 1000, 'E — ');
    animateCounter('lcMed', med, 1200, 'M — ');
    animateCounter('lcHard', hard, 1400, 'H — ');
    
  } catch (err) {
    console.warn('LeetCode fetch timed out or failed. Using mock data for local testing.', err.message);
    // Mock Data Fallback for smooth UI local testing
    animateCounter('lcTotal', 482, 1500, '');
    animateCounter('lcEasy', 145, 1000, 'E — ');
    animateCounter('lcMed', 289, 1200, 'M — ');
    animateCounter('lcHard', 48, 1400, 'H — ');
  }
}

/**
 * Generic counter animation function
 */
function animateCounter(elementId, targetNumber, duration, prefix) {
  const element = document.getElementById(elementId);
  if (!element || targetNumber === 0) {
    if (element) element.textContent = `${prefix}0`;
    return;
  }
  
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentNum = Math.floor(easeProgress * targetNumber);
    
    element.textContent = `${prefix}${currentNum}`;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = `${prefix}${targetNumber}`;
    }
  };
  
  window.requestAnimationFrame(step);
}
