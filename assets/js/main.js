/* ==================== RENDER FUNCTIONS ==================== */

function renderHomePortrait(data) {
  const portrait = document.getElementById("home-portrait");
  if (portrait && data.personal.portrait) {
    portrait.src = data.personal.portrait;
    portrait.alt = data.personal.name;
  }
}

function renderHomeSocial(data) {
  const container = document.getElementById("home-social");
  if (!container) return;

  container.innerHTML = `
    <a
      href="${data.personal.github}"
      target="_blank"
      class="home__social-link"
      rel="noopener noreferrer"
    >
      <i class="ri-github-fill"></i>
    </a>
    <a
      href="${data.personal.linkedin}"
      target="_blank"
      class="home__social-link"
      rel="noopener noreferrer"
    >
      <i class="ri-linkedin-box-fill"></i>
    </a>
    <button
      class="home__social-link"
      onclick="copyEmail(this)"
      title="Copy Email"
    >
      <i class="ri-mail-line"></i>
    </button>
  `;
}

function renderFooter(data) {
  const footerTitle = document.getElementById("footer-title");
  const footerName = document.getElementById("footer-name");
  const footerSocial = document.getElementById("footer-social");

  if (footerTitle) {
    footerTitle.textContent = data.personal.name.split(" ")[0];
  }

  if (footerName) {
    footerName.textContent = data.personal.name;
  }

  if (footerSocial) {
    footerSocial.innerHTML = `
      <a
        href="${data.personal.github}"
        class="footer__social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="ri-github-line"></i>
      </a>
      <a
        href="${data.personal.linkedin}"
        class="footer__social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="ri-linkedin-box-line"></i>
      </a>
      <button
        class="footer__social-link"
        onclick="copyEmail(this)"
        title="Click to Copy"
      >
        <i class="ri-mail-line"></i>
      </button>
    `;
  }
}

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

function updateLearningDuration(data) {
  if (!data || !data.about) return;

  const startDate = new Date(data.about.learningStartDate);
  const today = new Date();

  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  const durationElement = document.getElementById("learning-duration");
  if (durationElement) {
    let durationText = "";
    if (years > 0) {
      durationText += `${years} Year${years > 1 ? "s" : ""}`;
      if (months > 0)
        durationText += `, ${months} Month${months > 1 ? "s" : ""}`;
    } else if (months > 0) {
      durationText += `${months} Month${months > 1 ? "s" : ""}`;
    } else {
      durationText = "Just Started";
    }
    durationElement.textContent = durationText;
  }
}

async function renderGitHubRepoCount() {
  const repoElement = document.getElementById("repo-count");
  if (!repoElement) return;

  repoElement.textContent = "...";
  const repoCount = await fetchGitHubRepoCount();

  if (repoCount !== null) {
    repoElement.textContent = repoCount + "+";
  } else {
    repoElement.textContent = "?";
  }
}

async function renderTechStack() {
  const badgesContainer = document.querySelector(".skills__badges");
  if (!badgesContainer) return;

  badgesContainer.classList.add("loading");
  badgesContainer.innerHTML = "";

  const badgeUrls = await fetchTechStack();

  if (!badgeUrls) {
    badgesContainer.innerHTML =
      "<p>Could not load tech stack. Please try again later.</p>";
    badgesContainer.classList.remove("loading");
    return;
  }

  badgeUrls.forEach((url) => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Tech Stack Badge";
    img.loading = "lazy";
    badgesContainer.appendChild(img);
  });

  badgesContainer.classList.remove("loading");
}

async function renderProjects() {
  const container = document.getElementById("projects-container");
  const pageIndicator = document.getElementById("projects-page-indicator");

  if (!container) return;

  container.innerHTML =
    '<div class="loading-projects">Loading projects from GitHub...</div>';

  const projects = await fetchGitHubProjects();

  if (!projects || projects.length === 0) {
    container.innerHTML =
      '<div class="loading-projects">No AI/ML projects found. Check back soon!</div>';
    if (pageIndicator) pageIndicator.textContent = "Page 0 / 0";
    return;
  }

  initializeProjectsPagination(projects);
}

/* ==================== INITIALIZE APP ==================== */
async function initializeApp() {
  const data = await loadPortfolioData();
  if (!data) {
    console.error("Failed to load portfolio data");
    return;
  }

  renderHomeSection(data);
  renderHomePortrait(data);
  renderHomeSocial(data);
  renderAboutSection(data);
  renderEducationSection(data);
  renderCertificatesSection(data);
  renderContactSection(data);
  renderFooter(data);

  updateLearningDuration(data);
  await renderGitHubRepoCount();
  await renderTechStack();
  await renderProjects();
}

document.addEventListener("DOMContentLoaded", initializeApp);

