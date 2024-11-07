// document.addEventListener("DOMContentLoaded", () => {
//   const tabs = document.querySelectorAll(".navbar a");
//   const content = document.getElementById("content");

//   tabs.forEach((tab) => {
//     tab.addEventListener("click", (event) => {
//       event.preventDefault();

//       // Remove active class from all tabs
//       tabs.forEach((t) => t.classList.remove("active"));

//       // Set active class to the clicked tab
//       tab.classList.add("active");

//       // Update content based on tab clicked
//       switch (tab.id) {
//         case "aboutMe":
//           content.innerHTML = `
//                         <h1>About Me</h1>
//                         <p>Welcome to my personal website! This section contains information about me, my experience, and my background.</p>
//                     `;
//           break;
//         case "work":
//           content.innerHTML = `
//                         <h1>Work</h1>
//                         <p>This section contains information about my work experience and professional journey.</p>
//                     `;
//           break;
//         case "projects":
//           content.innerHTML = `
//                         <h1>Projects</h1>
//                         <p>Here you can explore the projects I've worked on, including both personal and professional endeavors.</p>
//                     `;
//           break;
//         case "knowMore":
//           content.innerHTML = `
//                         <h1>Know More</h1>
//                         <p>For more details about my background, hobbies, and interests, feel free to explore this section.</p>
//                     `;
//           break;
//         default:
//           break;
//       }
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const text =
    "passionate SDE with 3 years of <b>hands-on experience</b> in <b>full-stack development</b>, specializing in <b>Java</b>, <b>Python</b>, <b>.NET</b>, <b>React</b>, and <b>SQL databases</b> to build <b>robust</b>, <b>scalable solutions</b>.<br><br>Also having expertise in <b> software testing </b>" +
    "leveraging tools such as <b>Appium, Cucumber, and Selenium</b>  to create automated testing solutions that ensure high reliability and performance." +
    "<br><br><b>Holding a Master’s in Computer Science</b>, I am committed to delivering <b>high-quality</b>, <b>innovative solutions</b> while continuously improving development and testing processes within the <b>tech industry</b>. I am open to relocation for the right opportunity.";

  const animatedText = document.getElementById("animatedText");
  let index = 0;
  const speed = 50;

  function typeText() {
    if (index < text.length) {
      if (text.slice(index, index + 4) === "<br>") {
        animatedText.innerHTML += "<br>";
        index += 4;
      } else if (text.slice(index, index + 3) === "<b>") {
        const endBold = text.indexOf("</b>", index);
        animatedText.innerHTML += `<b>${text.slice(index + 3, endBold)}</b>`;
        index = endBold + 4;
      } else {
        animatedText.innerHTML += text.charAt(index);
        index++;
      }
      setTimeout(typeText, speed);
    }
  }

  typeText();
});

/* Work Section*/

// Data for experience cards
const experiences = [
  {
    logo: "./static/abbott-logo.png",
    alt: "Abbott Laboratories Logo",
    company: "Abbott Laboratories",
    position: "Software Engineering Intern",
    location: "Alameda, CA",
    duration: "MAY 2023 - AUG 2023",
    skills: [
      "Scripting",
      "UI Automation",
      "Debugging",
      "Java",
      "Python",
      "Appium",
      "Bitbucket",
      "CI/CD/CT",
      "Cucumber",
      "Gherkin",
    ],
    description: `
      ● Developed software to automate user actions on Android and iOS app for Abbott’s CGM (glucose monitoring) products.<br><br>
      Contributed to a <strong>20% reduction in software defects</strong> and a <strong>9% increase in user experience</strong>.<br><br>
      ● Collaborated with XFN teams, including developers, product managers, and quality assurance engineers, to identify requirements,<br><br>
      discuss and align on software design, and to rollout changes into production within project timelines.<br><br>
      ● Developed software in <strong>Java</strong> and <strong>Gherkin</strong> to interface with the native app.
      Created extensive documentation to ensure the rest of the team could use and extend the software.
    `,
  },
  {
    logo: "./static/technowin_it_infra_pvt_ltd_logo.jpeg",
    alt: "TechnoWin IT Infra Pvt Ltd Logo",
    company: "TechnoWin IT Infra Pvt Ltd",
    position: "Software Developer",
    location: "Mumbai, Maharashtra, India",
    duration: "OCT 2021 – MAY 2022",
    skills: [
      "Laravel",
      ".NET",
      "C#",
      "Java",
      "React.js",
      "JavaScript",
      "Ajax",
      "PHP",
      "MySQL",
      "Azure",
      "HTML5",
      "CSS",
      "MVC",
      "Spring Boot",
    ],
    description: `
      ● As a Software Engineer in an early-stage startup, I spearheaded development, testing, go-to-market, and after-sales support of web apps and solutions for government and educational institutions.<br><br>
      ● Developed Full Stack software, managed software deployment to production, and handled database deployments for websites and apps with <strong>5000+ users</strong>. Products were built with <strong>React</strong>, <strong>.NET</strong>, <strong>PHP</strong>, and <strong>Laravel</strong>.<br><br>
      ● Provided technical support and triaged issues for customers for all the software built.
    `,
  },
];

// Function to append experience cards to the scroll_section container
function appendExperienceCards() {
  const container = document.querySelector(".scroll_section");
  experiences.forEach((exp) => {
    const card = document.createElement("div");
    card.classList.add("work-card");

    card.innerHTML = `
       
      <h3>
        <img src="${exp.logo}" alt="${exp.alt}" class="company-logo" />
        ${exp.company}, <span>${exp.position}</span>, ${exp.location} <span style="font-size: 1rem; text-align: right;"><strong>${exp.duration}</strong></span>
      </h3>
    
      <p>${exp.description}</p>
    `;
    container.appendChild(card);
  });
}

// Initialize cards on page load
appendExperienceCards();

// Horizontal Scroll Effect
window.addEventListener("scroll", () => {
  const stickySection = document.querySelector(".sticky");
  if (stickySection) {
    transform(stickySection);
  }
});

// function transform(section) {
//   const offsetTop = section.parentElement.offsetTop;
//   const scrollSection = section.querySelector(".scroll_section");

//   // Calculate total scroll height for the sticky section
//   const totalScrollableHeight =
//     section.parentElement.offsetHeight - window.innerHeight;

//   // Calculate the percentage of vertical scroll within the sticky section
//   let scrollProgress = (window.scrollY - offsetTop) / totalScrollableHeight;

//   // Clamp scrollProgress between 0 and 1
//   scrollProgress = Math.max(0, Math.min(scrollProgress, 1));

//   // Apply horizontal scroll effect based on scrollProgress
//   const maxHorizontalScroll = (experiences.length - 1) * 100; // 100vw per card
//   scrollSection.style.transform = `translate3d(${
//     -scrollProgress * maxHorizontalScroll
//   }vw, 0, 0)`;
// }

function transform(section) {
  const offsetTop = section.parentElement.offsetTop;
  const scrollSection = section.querySelector(".scroll_section");

  // Calculate total scroll height within sticky_parent for the two cards
  const totalScrollableHeight =
    section.parentElement.offsetHeight - window.innerHeight;

  // Calculate the scroll progress as a percentage within the sticky section
  let scrollProgress = (window.scrollY - offsetTop) / totalScrollableHeight;

  // Clamp scrollProgress between 0 and 1
  scrollProgress = Math.max(0, Math.min(scrollProgress, 1));

  // Apply horizontal scroll effect (move by 100vw total for two 50vw cards)
  scrollSection.style.transform = `translate3d(${
    -scrollProgress * 100
  }vw, 0, 0)`;
}

//Adjust height of sticky parent
// document.addEventListener("DOMContentLoaded", () => {
//   const scrollSection = document.querySelector(".scroll_section");
//   const stickyParent = document.querySelector(".sticky_parent");

//   // Calculate height based on number of cards
//   const cardCount = scrollSection.childElementCount;
//   const viewportHeight = window.innerHeight;

//   // Set sticky_parent height to match horizontal scroll length
//   stickyParent.style.height = `${viewportHeight * cardCount}px`;
// });
