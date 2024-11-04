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
  const tabs = document.querySelectorAll(".navbar a");
  const sections = document.querySelectorAll(".section");

  function setActiveTab() {
    let index = sections.length;

    while (--index && window.scrollX + 50 < sections[index].offsetLeft) {}

    tabs.forEach((tab) => tab.classList.remove("active"));
    if (index >= 0) {
      tabs[index].classList.add("active");
    }
  }

  window.addEventListener("scroll", setActiveTab);

  // Smooth scrolling for navigation links
  tabs.forEach((tab) => {
    tab.addEventListener("click", function (event) {
      event.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
        inline: "start",
      });
    });
  });
});

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
document.addEventListener("DOMContentLoaded", () => {
  const workSection = document.getElementById("workSection");
  const workExperiences = document.querySelector(".work-experiences");
  const experienceCards = document.querySelectorAll(".experience-card");
  let currentIndex = 0;

  workSection.addEventListener("wheel", (event) => {
    event.preventDefault(); // Prevent default vertical scroll

    // Check scroll direction
    if (event.deltaY > 0 && currentIndex < experienceCards.length - 1) {
      // Scroll to the next experience horizontally
      currentIndex += 1;
      workExperiences.scrollTo({
        left: currentIndex * window.innerWidth,
        behavior: "smooth",
      });
    } else if (event.deltaY < 0 && currentIndex > 0) {
      // Scroll to the previous experience horizontally
      currentIndex -= 1;
      workExperiences.scrollTo({
        left: currentIndex * window.innerWidth,
        behavior: "smooth",
      });
    }
  });
});
