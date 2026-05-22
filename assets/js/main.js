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
  if (!portfolioData) {
    console.error("Portfolio data not loaded");
    return;
  }

  navigator.clipboard
    .writeText(portfolioData.personal.email)
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
sr.reveal(`.skills__badges`, { origin: "left", duration: 800 });
sr.reveal(`.about__cards`, { origin: "left", duration: 800 });
sr.reveal(`.about__data`, { origin: "right", duration: 800 });
sr.reveal(`.education__card`, { interval: 100, delay: 100 });
sr.reveal(`.certificates__card`, { interval: 100, delay: 100 });

/* ==================== CERTIFICATE MODAL ==================== */
const modal = document.getElementById("certModal");
const modalImage = document.getElementById("modalImage");
const modalVerifyContainer = document.getElementById("modalVerifyContainer");
const modalClose = document.querySelector(".modal__close");

function openCertificateModal(imgSrc, verifyLink) {
  modalImage.src = imgSrc;
  modalVerifyContainer.innerHTML = "";

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

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

/* ==================== FORMSPREE CONTACT FORM ==================== */
window.formspree =
  window.formspree ||
  function () {
    (formspree.q = formspree.q || []).push(arguments);
  };
formspree("initForm", {
  formElement: "#contact-form",
  formId: "mgodgvqe",
});

/* ==================== RENDER FUNCTIONS FOR DYNAMIC CONTENT ==================== */

function renderHomeSection(data) {
  const homeData = document.querySelector(".home__data");
  if (!homeData) return;

  homeData.innerHTML = `
    <span class="home__greeting">${data.personal.greeting}</span>
    <h1 class="home__name">${data.personal.name}</h1>
    <h3 class="home__education">${data.personal.role}</h3>

    <div class="home__buttons">
      <a
        href="${data.personal.cvUrl}"
        class="button"
        download="${data.personal.cvFileName}"
        >Download CV</a
      >
      <a href="#contact" class="button button--ghost">Contact Me</a>
    </div>
  `;
}

function renderAboutSection(data) {
  const aboutDescription = document.querySelector(".about__description");
  if (aboutDescription) {
    aboutDescription.textContent = data.about.description;
  }
}

function renderEducationSection(data) {
  const container = document.getElementById("education-container");
  if (!container) return;

  container.innerHTML = "";
  data.education.forEach((edu) => {
    const card = document.createElement("div");
    card.className = "education__card";
    card.innerHTML = `
      <div class="education__icon">
        <i class="ri-graduation-cap-line"></i>
      </div>
      <h3 class="education__title">${edu.degree}</h3>
      <div class="education__year${edu.isOngoing ? " education__year--ongoing" : ""}">
        ${edu.years}
      </div>
      <div class="education__program">
        ${edu.program}
      </div>
      <p class="education__description">
        ${edu.description}
      </p>
    `;
    container.appendChild(card);
  });
}

function renderCertificatesSection(data) {
  const container = document.getElementById("certificates-container");
  if (!container) return;

  container.innerHTML = "";
  data.certificates.forEach((cert) => {
    const card = document.createElement("div");
    card.className = "certificates__card";
    card.setAttribute("data-verify-link", cert.verifyLink);
    card.innerHTML = `
      <img
        src="${cert.image}"
        alt="${cert.title}"
        class="certificates__img"
      />
      <h3 class="certificates__title">${cert.title}</h3>
      <p class="certificates__description">
        ${cert.description}
      </p>
    `;

    const img = card.querySelector(".certificates__img");
    if (img) {
      card.style.cursor = "pointer";
      card.addEventListener("click", (e) => {
        if (e.target.closest(".modal__verify-btn")) return;
        openCertificateModal(img.src, cert.verifyLink);
      });
    }

    container.appendChild(card);
  });
}

function renderContactSection(data) {
  const emailAddress = document.querySelector(".email-address");
  if (emailAddress) {
    emailAddress.textContent = data.personal.email;
  }
}

/* ==================== INITIALIZE APP ==================== */
async function initializeApp() {
  const data = await loadPortfolioData();
  if (!data) {
    console.error("Failed to load portfolio data");
    return;
  }

  renderHomeSection(data);
  renderAboutSection(data);
  renderEducationSection(data);
  renderCertificatesSection(data);
  renderContactSection(data);

  updateLearningDuration();
  await updateGitHubRepoCount();
  await fetchAndDisplayTechStack();
  await fetchAndDisplayProjects();
}

document.addEventListener("DOMContentLoaded", initializeApp);
