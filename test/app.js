// Data for work cards
const workCards = [
  {
    title: "Software Engineering Intern",
    description:
      "Worked on automation and user actions for Android and iOS at Abbott Laboratories.",
  },
  {
    title: "Full-Stack Developer",
    description:
      "Built applications with React, .NET, and Laravel at TechnoWin IT Infra Pvt Ltd.",
  },
  {
    title: "Project Lead",
    description:
      "Managed project deployments for government and educational institutions.",
  },
  {
    title: "Freelance Developer",
    description:
      "Delivered full-stack solutions and provided technical support.",
  },
];

// Append work cards to .scroll_section
const scrollSection = document.querySelector(".scroll_section");
workCards.forEach((work) => {
  const card = document.createElement("div");
  card.className = "work-card";
  card.innerHTML = `<h3>${work.title}</h3><p>${work.description}</p>`;
  scrollSection.appendChild(card);
});

// Horizontal Scroll Effect
window.addEventListener("scroll", () => {
  const stickySection = document.querySelector(".sticky");
  transform(stickySection);
});

function transform(section) {
  const offsetTop = section.parentElement.offsetTop;
  const scrollSection = section.querySelector(".scroll_section");

  let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100;
  percentage = Math.min(Math.max(percentage, 0), 100); // Clamp percentage between 0 and 100
  scrollSection.style.transform = `translate3d(${-percentage * 3}vw, 0, 0)`; // Adjust multiplier for scroll speed
}
