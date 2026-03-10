const experiences = [
  {
    logo: './static/abbott-logo.png',
    alt: 'Abbott Laboratories',
    company: 'Abbott Laboratories',
    position: 'Software Engineer in Test',
    location: 'Alameda, CA, USA',
    duration: 'May 2023 – Aug 2023',
    skills: ['Java', 'Python', 'Appium', 'Cucumber', 'Gherkin', 'CI/CD', 'Selenium', 'Bitbucket'],
    points: [
      'Developed software to automate user actions on Android and iOS apps for Abbott\'s CGM products, contributing to a <strong>20% reduction in software defects</strong> and a <strong>9% improvement in user experience</strong>.',
      'Collaborated with cross-functional teams — developers, product managers, and QA engineers — to align on requirements, software design, and production rollouts within project timelines.',
      'Built automation code in <strong>Java</strong> and <strong>Gherkin</strong> and created extensive documentation enabling the broader team to extend the software.',
    ],
  },
  {
    logo: './static/technowin_it_infra_pvt_ltd_logo.jpeg',
    alt: 'TechnoWin IT Infra',
    company: 'TechnoWin IT Infra Pvt Ltd',
    position: 'Software Developer',
    location: 'Mumbai, India',
    duration: 'Oct 2021 – May 2022',
    skills: ['.NET', 'C#', 'React', 'Laravel', 'PHP', 'MySQL', 'Azure', 'Spring Boot'],
    points: [
      'Spearheaded full-cycle development, testing, go-to-market, and after-sales support of web apps for government and educational institutions at an early-stage startup.',
      'Developed full-stack software and managed deployments to production for platforms with <strong>5,000+ users</strong>, using <strong>React</strong>, <strong>.NET</strong>, and <strong>Laravel</strong>.',
      'Provided ongoing technical support and resolved customer issues across all shipped products.',
    ],
  },
];

export function initExperience() {
  const track = document.getElementById('experience-track');
  if (!track) return;

  experiences.forEach(exp => {
    const card = document.createElement('div');
    card.className = 'exp-card';
    card.innerHTML = `
      <div class="exp-card-header">
        <img src="${exp.logo}" alt="${exp.alt}" class="exp-logo" loading="lazy" />
        <div class="exp-meta">
          <h3 class="exp-company">${exp.company}</h3>
          <p class="exp-role">${exp.position}</p>
          <div class="exp-loc-time">
            <span>${exp.location}</span>
            <span class="exp-duration">${exp.duration}</span>
          </div>
        </div>
      </div>
      <ul class="exp-points">
        ${exp.points.map(p => `<li>${p}</li>`).join('')}
      </ul>
      <div class="exp-skills">
        ${exp.skills.map(s => `<span class="exp-skill-tag">${s}</span>`).join('')}
      </div>
    `;
    track.appendChild(card);
  });

  window.addEventListener('scroll', updateHorizontalScroll, { passive: true });
  updateHorizontalScroll();
}

function updateHorizontalScroll() {
  const parent = document.getElementById('experience');
  const track  = document.getElementById('experience-track');
  if (!parent || !track) return;

  // On mobile we disable the effect via CSS (transform: none !important)
  if (window.innerWidth <= 768) return;

  const offsetTop   = parent.offsetTop;
  const totalHeight = parent.offsetHeight - window.innerHeight;
  if (totalHeight <= 0) return;

  const progress = Math.max(0, Math.min(1, (window.scrollY - offsetTop) / totalHeight));
  track.style.transform = `translate3d(${-progress * 100}vw, 0, 0)`;
}
