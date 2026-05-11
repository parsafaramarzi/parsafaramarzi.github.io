/* ==================== BLUR HEADER ==================== */
const blurHeader = () => {
  const header = document.getElementById("header");
  window.scrollY >= 50
    ? header.classList.add("blur-header")
    : header.classList.remove("blur-header");
};
window.addEventListener("scroll", blurHeader);

/* ==================== COPY TO CLIPBOARD ==================== */
function copyEmail(element) {
  const emailSpan =
    element.querySelector(".email-address") ||
    document.querySelector(".contact__card .email-address");
  const emailText = emailSpan.innerText;

  navigator.clipboard
    .writeText(emailText)
    .then(() => {
      const notification = document.createElement("div");
      notification.className = "copy-notification";
      notification.innerHTML = `<i class="ri-checkbox-circle-line"></i> Copied`;
      document.body.appendChild(notification);

      const icon = element.querySelector("i");
      const originalClass = icon.className;
      icon.className = "ri-checkbox-circle-line";

      setTimeout(() => {
        notification.remove();
        icon.className = originalClass;
      }, 2000);
    })
    .catch((err) => console.error("Failed to copy: ", err));
}

/* ==================== SCROLL UP ==================== */
const scrollUp = () => {
  const scrollUp = document.getElementById("scroll-up");
  window.scrollY >= 350
    ? scrollUp.classList.add("show-scroll")
    : scrollUp.classList.remove("show-scroll");
};
window.addEventListener("scroll", scrollUp);

/* ==================== SCROLL ACTIVE LINK ==================== */
const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 150;
    const sectionId = current.getAttribute("id");
    const sectionsClass = document.querySelector(
      `.nav__menu a[href*=${sectionId}]`,
    );

    if (sectionsClass) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        sectionsClass.classList.add("active-link");
      } else {
        sectionsClass.classList.remove("active-link");
      }
    }
  });

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
    const navLinks = document.querySelectorAll(".nav__link");
    navLinks.forEach((l) => l.classList.remove("active-link"));
    const contactLink = document.querySelector('.nav__menu a[href*="contact"]');
    if (contactLink) contactLink.classList.add("active-link");
  }
};
window.addEventListener("scroll", scrollActive);

/* ==================== SCROLL REVEAL ANIMATION ==================== */
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
sr.reveal(`.skills__content`, { origin: "left", duration: 800 });
sr.reveal(`.about__img-wrapper`, { origin: "left", duration: 800 });
sr.reveal(`.about__data`, { origin: "right", duration: 800 });
sr.reveal(`.projects__card`, { interval: 100, delay: 100 });

/* ==================== CERTIFICATE MODAL ==================== */
const modal = document.getElementById("certModal");
const modalImage = document.getElementById("modalImage");
const modalVerifyContainer = document.getElementById("modalVerifyContainer");
const modalClose = document.querySelector(".modal__close");

// Function to open modal with image and optional verify link
function openCertificateModal(imgSrc, verifyLink) {
  modalImage.src = imgSrc;
  modalVerifyContainer.innerHTML = ""; // Clear previous button

  if (verifyLink && verifyLink.trim() !== "") {
    const verifyBtn = document.createElement("a");
    verifyBtn.href = verifyLink;
    verifyBtn.target = "_blank";
    verifyBtn.rel = "noopener noreferrer";
    verifyBtn.className = "modal__verify-btn";
    verifyBtn.textContent = "Verify Certificate";
    modalVerifyContainer.appendChild(verifyBtn);
  }

  modal.style.display = "flex";
}

// Close modal when clicking on the close button or outside the content
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Attach click handlers to all certificate cards
document.querySelectorAll(".certificates__card").forEach((card) => {
  const img = card.querySelector(".certificates__img");
  const verifyLink = card.getAttribute("data-verify-link") || "";
  if (img) {
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
      // Prevent opening modal if the click was on the button inside (if any)
      if (e.target.closest(".modal__verify-btn")) return;
      openCertificateModal(img.src, verifyLink);
    });
  }
});
