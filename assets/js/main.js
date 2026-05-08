/*=============== ADD BLUR TO HEADER ===============*/
const blurHeader = () => {
  const header = document.getElementById("header");
  // Change 'this.scrollY' to 'window.scrollY'
  window.scrollY >= 50
    ? header.classList.add("blur-header")
    : header.classList.remove("blur-header");
};
window.addEventListener("scroll", blurHeader);

/*=============== COPY TO CLIPBOARD ===============*/
function copyEmail(element) {
  // Look for email text inside the clicked element or the global card
  const emailSpan =
    element.querySelector(".email-address") ||
    document.querySelector(".contact__card .email-address");
  const emailText = emailSpan.innerText;

  navigator.clipboard
    .writeText(emailText)
    .then(() => {
      // Create the "Copied" popup
      const notification = document.createElement("div");
      notification.className = "copy-notification";
      notification.innerHTML = `<i class="ri-checkbox-circle-line"></i> Copied`;
      document.body.appendChild(notification);

      // Visual feedback for the icon
      const icon = element.querySelector("i");
      const originalClass = icon.className;
      icon.className = "ri-checkbox-circle-line";

      setTimeout(() => {
        notification.remove();
        icon.className = originalClass;
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
  const scrollUp = document.getElementById("scroll-up");
  // Change 'this.scrollY' to 'window.scrollY'
  window.scrollY >= 350
    ? scrollUp.classList.add("show-scroll")
    : scrollUp.classList.remove("show-scroll");
};
window.addEventListener("scroll", scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      // We calculate the trigger point at roughly 1/3 down the screen
      sectionTop = current.offsetTop - 150,
      sectionId = current.getAttribute("id"),
      sectionsClass = document.querySelector(
        ".nav__menu a[href*=" + sectionId + "]",
      );

    if (sectionsClass) {
      // If the current scroll position is within the boundaries of this section
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        sectionsClass.classList.add("active-link");
      } else {
        sectionsClass.classList.remove("active-link");
      }
    }
  });

  // SPECIAL CASE: If we are at the very bottom of the page,
  // force the 'Contact' link to be active.
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
    const navLinks = document.querySelectorAll(".nav__link");
    navLinks.forEach((l) => l.classList.remove("active-link"));
    const contactLink = document.querySelector('.nav__menu a[href*="contact"]');
    if (contactLink) contactLink.classList.add("active-link");
  }
};
window.addEventListener("scroll", scrollActive);

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 1000,
  delay: 200,
});

sr.reveal(
  `.home__data, .home__social, .contact__container, .footer__container`,
);
sr.reveal(`.home__handle`, { origin: "bottom" });
sr.reveal(`.about__img, .skills__content`, { origin: "left" });
sr.reveal(`.about__data, .services__card`, { origin: "right" });
sr.reveal(`.projects__card`, { interval: 100 });
