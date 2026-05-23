/* ==================== BLUR HEADER ==================== */
const blurHeader = () => {
  const header = document.getElementById("header");
  if (!header) return;
  window.scrollY >= 50
    ? header.classList.add("blur-header")
    : header.classList.remove("blur-header");
};
window.addEventListener("scroll", blurHeader);

/* ==================== SCROLL UP ==================== */
const scrollUp = () => {
  const scrollUp = document.getElementById("scroll-up");
  if (!scrollUp) return;
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
      `.nav__menu a[href*="${sectionId}"]`,
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

if (modalClose) {
  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

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
      const originalClass = icon ? icon.className : null;
      if (icon) icon.className = "ri-checkbox-circle-line";

      setTimeout(() => {
        notification.remove();
        if (icon && originalClass) icon.className = originalClass;
      }, 2000);
    })
    .catch((err) => console.error("Failed to copy: ", err));
}

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

/* ==================== PROJECTS PAGINATION ==================== */
let allProjects = [];
let currentPage = 1;
const projectsPerPage = 4;
let projectsRevealed = false;

function initializeProjectsPagination(projects) {
  allProjects = projects;
  currentPage = 1;
  renderProjectsPage(false);

  const prevBtn = document.getElementById("projects-prev");
  const nextBtn = document.getElementById("projects-next");

  if (prevBtn) {
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderProjectsPage();
      }
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      const totalPages = Math.ceil(allProjects.length / projectsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderProjectsPage();
      }
    };
  }
}

function renderProjectsPage(animate = true) {
  const container = document.getElementById("projects-container");
  const prevBtn = document.getElementById("projects-prev");
  const nextBtn = document.getElementById("projects-next");
  const pageIndicator = document.getElementById("projects-page-indicator");

  if (!container) return;

  const totalPages = Math.ceil(allProjects.length / projectsPerPage);
  const start = (currentPage - 1) * projectsPerPage;
  const end = start + projectsPerPage;
  const projectsToShow = allProjects.slice(start, end);

  if (!animate) {
    rebuildCards(projectsToShow, container);
    updatePaginationButtons(
      prevBtn,
      nextBtn,
      pageIndicator,
      currentPage,
      totalPages,
    );
    return;
  }

  container.classList.add("fade-out");
  setTimeout(() => {
    rebuildCards(projectsToShow, container);
    updatePaginationButtons(
      prevBtn,
      nextBtn,
      pageIndicator,
      currentPage,
      totalPages,
    );
    container.classList.remove("fade-out");
    container.classList.add("fade-in");
    setTimeout(() => {
      container.classList.remove("fade-in");
    }, 300);
  }, 300);
}

function adjustTitleFontSize(titleElement) {
  const lineHeight = parseFloat(getComputedStyle(titleElement).lineHeight);
  const maxHeight = lineHeight * 2;
  let fontSize = 1.0;

  titleElement.style.fontSize = fontSize + "rem";

  if (titleElement.scrollHeight <= maxHeight) return;

  while (titleElement.scrollHeight > maxHeight && fontSize > 0.7) {
    fontSize -= 0.05;
    titleElement.style.fontSize = fontSize + "rem";
  }
}

function rebuildCards(projects, container) {
  if (!portfolioData || !portfolioData.github) return;

  container.innerHTML = "";
  projects.forEach((repo) => {
    const card = document.createElement("div");
    card.className = "projects__card";

    const fallbackUrl = `https://opengraph.githubassets.com/1/${portfolioData.github.username}/${repo.name}`;
    const img = document.createElement("img");
    img.src = repo.previewImage || fallbackUrl;
    img.alt = repo.name;
    img.className = "projects__img";
    img.onerror = function () {
      if (this.src !== fallbackUrl) this.src = fallbackUrl;
    };

    const titleEl = document.createElement("h3");
    titleEl.className = "projects__title";
    titleEl.textContent = repo.name.replace(/-/g, " ");

    const link = document.createElement("a");
    link.href = repo.html_url;
    link.className = "projects__button";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.appendChild(document.createTextNode("View Project "));
    const icon = document.createElement("i");
    icon.className = "ri-arrow-right-line";
    link.appendChild(icon);

    card.appendChild(img);
    card.appendChild(titleEl);
    card.appendChild(link);

    adjustTitleFontSize(titleEl);
    container.appendChild(card);
  });

  if (!projectsRevealed && typeof sr !== "undefined") {
    sr.reveal(`.projects__card`, { interval: 100, delay: 100 });
    projectsRevealed = true;
  }
}

function updatePaginationButtons(prevBtn, nextBtn, pageIndicator, page, total) {
  if (pageIndicator) pageIndicator.textContent = `Page ${page} / ${total}`;
  if (prevBtn) prevBtn.disabled = page === 1;
  if (nextBtn) nextBtn.disabled = page === total;
}
