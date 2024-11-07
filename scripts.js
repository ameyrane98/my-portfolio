document.addEventListener("DOMContentLoaded", () => {
  const text =
    "passionate engineer with <b>hands-on experience</b> in <b>full-stack development</b>, specializing in <b>Java</b>, <b>Python</b>, <b>.NET</b>, <b>React</b>, and <b>SQL</b> to deliver <b>robust</b>, <b>scalable solutions</b>. Skilled in <b>software testing</b> with tools like <b>Appium</b>, <b>Cucumber</b>, and <b>Selenium</b> for <b>high-quality</b>, automated testing. Holding a <b>Master’s in Computer Science</b>, I am committed to <b>innovation</b> and <b>process improvement</b> in the tech industry and am open to <b>relocation</b> for the right opportunity.";

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
      ● Developed software to automate user actions on Android and iOS app for Abbott’s CGM (glucose monitoring) products.<br><span style="padding-right: 1%;"></span>Contributed to a <strong>20% reduction in software defects</strong> and a <strong>9% increase in user experience</strong>.<br><br>
      ● Collaborated with XFN teams, including developers, product managers, and quality assurance engineers, to identify requirements,<br><span style="padding-right: 1%;"></span>discuss and align on software design, and to rollout changes into production within project timelines.<br><br>
      ● Developed software in <strong>Java</strong> and <strong>Gherkin</strong> to interface with the native app.
      Created extensive documentation to ensure the rest of the team could<br><span style="padding-right: 1%;"></span> use and extend the software.
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
      ● Developed Full Stack software, managed software deployment to production, and handled database deployments for websites and apps with <br><span style="padding-right: 1%;"></span><strong>5000+users</strong>. Products were built with <strong>React</strong>, <strong>.NET</strong>, <strong>PHP</strong>, and <strong>Laravel</strong>.<br><br>
      ● Provided technical support and resolved issues for customers for all the software built.
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
        ${exp.company}, <span>${exp.position}</span>, ${exp.location} <span style="font-size: 0.8rem; text-align: right;"><strong>${exp.duration}</strong></span>
      </h3>
      <br>
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

// Handle hCaptcha submission before form submission

document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // replace with your actual access key
    // Prevent the default form submission

    const form = event.target;
    const submitButton = document.getElementById("submitButton");
    const successMessage = document.getElementById("successMessage");

    // Ensure hCaptcha is completed
    // const hCaptchaResponse = hcaptcha.getResponse();
    // if (hCaptchaResponse === "") {
    //   alert("Please complete the hCaptcha.");
    //   return;
    // }

    submitButton.disabled = true; // Disable the submit button to prevent multiple submissions
    const formData = new FormData(form);

    // Send the form data to Web3Forms
    fetch(form.action, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        // Check if response is okay

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        if (result.success) {
          successMessage.style.display = "block"; // Show success message
          form.reset(); // Reset the form fields
          // hcaptcha.reset(); // Reset hCaptcha
        } else {
          alert("There was a problem submitting your form. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("There was an error submitting the form.");
      })
      .finally(() => {
        submitButton.disabled = false; // Re-enable the submit button
      });
  });

document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navbar .nav-link");
  const workSection = document.getElementById("workSection");

  function changeActiveLink() {
    let currentSection = "";

    // Check each section to see if it's in view
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        currentSection = section.getAttribute("id");
      }
    });

    // Special handling for Work section with horizontal scrolling
    if (workSection) {
      const workRect = workSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // Check if the Work section is partially visible horizontally and vertically
      if (
        workRect.top < windowHeight &&
        workRect.bottom >= 0 &&
        workRect.left < windowWidth &&
        workRect.right > 0
      ) {
        currentSection = "workSection";
      }
    }

    // Update active class on navbar links
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(currentSection)) {
        link.classList.add("active");
      }
    });
  }

  // Add scroll event listener to trigger active link change on scroll
  window.addEventListener("scroll", changeActiveLink);
  window.addEventListener("resize", changeActiveLink);
});
