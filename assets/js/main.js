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
sr.reveal(`.skills__badges`, { origin: "left", duration: 800 });
sr.reveal(`.about__img-wrapper`, { origin: "left", duration: 800 });
sr.reveal(`.about__data`, { origin: "right", duration: 800 });
sr.reveal(`.projects__card`, { interval: 100, delay: 100 });
sr.reveal(`.education__card`, { interval: 100, delay: 100 });
sr.reveal(`.certificates__card`, { interval: 100, delay: 100 });

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

// ==================== FORMSPREE CONTACT FORM ====================
window.formspree =
  window.formspree ||
  function () {
    (formspree.q = formspree.q || []).push(arguments);
  };
formspree("initForm", {
  formElement: "#contact-form",
  formId: "mgodgvqe",
});

/* ==================== GITHUB TECH STACK ==================== */
/**
 * Fetches the README.md from GitHub, extracts the tech stack badges,
 * and injects them into the .skills__badges container.
 */
async function fetchAndDisplayTechStack() {
  const badgesContainer = document.querySelector(".skills__badges");
  if (!badgesContainer) return;

  // Show loading state
  badgesContainer.classList.add("loading");
  badgesContainer.innerHTML = "";

  const readmeUrl =
    "https://raw.githubusercontent.com/parsafaramarzi/parsafaramarzi/main/README.md";

  try {
    const response = await fetch(readmeUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const markdown = await response.text();

    // Find the "Tech Stack" section and extract badges
    const techStackSection = markdown.match(
      /# Tech Stack:([\s\S]*?)(?=\n#|\n##|$)/,
    );
    if (!techStackSection) throw new Error("Tech Stack section not found");

    const badgesMarkdown = techStackSection[1];
    const badgeRegex = /!\[.*?\]\((https?:\/\/img\.shields\.io\/[^)]+)\)/g;
    const badgeUrls = [];
    let match;

    while ((match = badgeRegex.exec(badgesMarkdown)) !== null) {
      badgeUrls.push(match[1]);
    }

    if (badgeUrls.length === 0)
      throw new Error("No badges found in Tech Stack section");

    // Clear and populate with new badges
    badgesContainer.innerHTML = "";
    badgeUrls.forEach((url) => {
      const img = document.createElement("img");
      img.src = url;
      img.alt = "Tech Stack Badge";
      img.loading = "lazy";
      badgesContainer.appendChild(img);
    });
  } catch (error) {
    console.error("Error fetching tech stack:", error);
    badgesContainer.innerHTML =
      "<p>Could not load tech stack. Please try again later.</p>";
  } finally {
    badgesContainer.classList.remove("loading");
  }
}

// Fetch tech stack when the page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayTechStack);

/* ==================== DYNAMIC ABOUT SECTION ==================== */
(async function initAboutSection() {
  // --- 1. Calculate Learning Duration (Since October 2023) ---
  function updateLearningDuration() {
    const startDate = new Date(2023, 9, 1); // October 1, 2023
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

  // --- 2. Fetch and Cache GitHub Public Repo Count ---
  async function updateGitHubRepoCount() {
    const repoElement = document.getElementById("repo-count");
    if (!repoElement) return;

    const GITHUB_USERNAME = "parsafaramarzi";
    const CACHE_KEY = "github_repo_count";
    const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds

    // Check localStorage cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { count, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        repoElement.textContent = count + "+";
        return;
      }
    }

    // Fetch fresh data from GitHub API
    try {
      repoElement.textContent = "...";
      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}`,
      );

      if (!response.ok) {
        throw new Error(`GitHub API responded with status ${response.status}`);
      }

      const data = await response.json();
      const repoCount = data.public_repos;

      if (typeof repoCount === "number") {
        repoElement.textContent = repoCount + "+";
        // Cache the result
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            count: repoCount,
            timestamp: Date.now(),
          }),
        );
      } else {
        throw new Error("Invalid data structure received from GitHub API");
      }
    } catch (error) {
      console.error("Failed to fetch GitHub repo count:", error);
      repoElement.textContent = "?";
    }
  }

  // --- 3. Run Both Functions ---
  updateLearningDuration();
  await updateGitHubRepoCount();
})();

/* ==================== DYNAMIC PROJECTS FROM GITHUB (PAGINATED) ==================== */
let allProjects = [];
let currentPage = 1;
const projectsPerPage = 4;

async function fetchAndDisplayProjects() {
  const container = document.getElementById("projects-container");
  const prevBtn = document.getElementById("projects-prev");
  const nextBtn = document.getElementById("projects-next");
  const pageIndicator = document.getElementById("projects-page-indicator");

  if (!container) return;

  // Show loading state
  container.innerHTML =
    '<div class="loading-projects">Loading projects from GitHub...</div>';
  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;

  const username = "parsafaramarzi";
  const relevantTopics = [
    "artificial-intelligence",
    "machine-learning",
    "deep-learning",
    "computer-vision",
    "data-science",
    "data-analysis",
  ];
  const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const allRepos = await response.json();

    allProjects = allRepos.filter((repo) => {
      if (!repo.topics || !Array.isArray(repo.topics)) return false;
      return repo.topics.some((topic) => relevantTopics.includes(topic));
    });

    if (allProjects.length === 0) {
      container.innerHTML =
        '<div class="loading-projects">No AI/ML projects found. Check back soon!</div>';
      if (pageIndicator) pageIndicator.textContent = "Page 0 / 0";
      return;
    }

    currentPage = 1;
    renderProjectsPage(false); // initial render without animation

    // Set up event listeners
    if (prevBtn) {
      prevBtn.onclick = () => {
        if (currentPage > 1) {
          currentPage--;
          renderProjectsPage(); // animate
        }
      };
    }
    if (nextBtn) {
      nextBtn.onclick = () => {
        const totalPages = Math.ceil(allProjects.length / projectsPerPage);
        if (currentPage < totalPages) {
          currentPage++;
          renderProjectsPage(); // animate
        }
      };
    }
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    container.innerHTML =
      '<div class="loading-projects">Failed to load projects. Please try again later.</div>';
    if (pageIndicator) pageIndicator.textContent = "Error";
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
    // Initial load – no animation
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

  // Animate out, rebuild, then animate in
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

function rebuildCards(projects, container) {
  container.innerHTML = "";
  projects.forEach((repo) => {
    const card = document.createElement("div");
    card.className = "projects__card";
    const ogImageUrl = `https://opengraph.githubassets.com/1/parsafaramarzi/${repo.name}`;
    card.innerHTML = `
      <img src="${ogImageUrl}" alt="${repo.name}" class="projects__img" onerror="this.src='https://via.placeholder.com/300x150?text=No+Preview'">
      <h3 class="projects__title">${repo.name.replace(/-/g, " ")}</h3>
      <a href="${repo.html_url}" class="projects__button" target="_blank" rel="noopener noreferrer">
        View Project <i class="ri-arrow-right-line"></i>
      </a>
    `;
    container.appendChild(card);
  });
}

function updatePaginationButtons(prevBtn, nextBtn, pageIndicator, page, total) {
  if (pageIndicator) pageIndicator.textContent = `Page ${page} / ${total}`;
  if (prevBtn) prevBtn.disabled = page === 1;
  if (nextBtn) nextBtn.disabled = page === total;
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayProjects);
