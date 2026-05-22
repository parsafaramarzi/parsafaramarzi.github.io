/* ==================== DATA FETCHING & UPDATES ==================== */

let portfolioData = null;

async function loadPortfolioData() {
  try {
    const response = await fetch("./assets/data/data.json");
    if (!response.ok)
      throw new Error(`Failed to load data.json: ${response.status}`);
    portfolioData = await response.json();
    return portfolioData;
  } catch (error) {
    console.error("Error loading portfolio data:", error);
    return null;
  }
}

/* ==================== LEARNING DURATION ==================== */
function updateLearningDuration() {
  if (!portfolioData || !portfolioData.about) return;

  const startDate = new Date(portfolioData.about.learningStartDate);
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

/* ==================== GITHUB REPO COUNT ==================== */
async function updateGitHubRepoCount() {
  if (!portfolioData || !portfolioData.github) return;

  const repoElement = document.getElementById("repo-count");
  if (!repoElement) return;

  const CACHE_KEY = "github_repo_count";
  const CACHE_EXPIRY = 3600000;

  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { count, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      repoElement.textContent = count + "+";
      return;
    }
  }

  try {
    repoElement.textContent = "...";
    const response = await fetch(
      `https://api.github.com/users/${portfolioData.github.username}`,
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const data = await response.json();
    const repoCount = data.public_repos;

    if (typeof repoCount === "number") {
      repoElement.textContent = repoCount + "+";
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

/* ==================== GITHUB TECH STACK ==================== */
async function fetchAndDisplayTechStack() {
  const badgesContainer = document.querySelector(".skills__badges");
  if (!badgesContainer) return;

  badgesContainer.classList.add("loading");
  badgesContainer.innerHTML = "";

  const readmeUrl =
    "https://raw.githubusercontent.com/parsafaramarzi/parsafaramarzi/main/README.md";

  try {
    const response = await fetch(readmeUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const markdown = await response.text();
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

/* ==================== DYNAMIC PROJECTS FROM GITHUB (PAGINATED) ==================== */
let allProjects = [];
let currentPage = 1;
const projectsPerPage = 4;
let projectsRevealed = false;

async function fetchAndDisplayProjects() {
  if (!portfolioData || !portfolioData.github) return;

  const container = document.getElementById("projects-container");
  const prevBtn = document.getElementById("projects-prev");
  const nextBtn = document.getElementById("projects-next");
  const pageIndicator = document.getElementById("projects-page-indicator");

  if (!container) return;

  container.innerHTML =
    '<div class="loading-projects">Loading projects from GitHub...</div>';
  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;

  const apiUrl = `https://api.github.com/users/${portfolioData.github.username}/repos?sort=updated&per_page=100`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const allRepos = await response.json();

    allProjects = allRepos.filter((repo) => {
      if (!repo.topics || !Array.isArray(repo.topics)) return false;
      return repo.topics.some((topic) =>
        portfolioData.github.topics.includes(topic),
      );
    });

    if (allProjects.length === 0) {
      container.innerHTML =
        '<div class="loading-projects">No AI/ML projects found. Check back soon!</div>';
      if (pageIndicator) pageIndicator.textContent = "Page 0 / 0";
      return;
    }

    currentPage = 1;
    renderProjectsPage(false);

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
    const ogImageUrl = `https://opengraph.githubassets.com/1/${portfolioData.github.username}/${repo.name}`;
    card.innerHTML = `
      <img src="${ogImageUrl}" alt="${repo.name}" class="projects__img" onerror="this.src='https://via.placeholder.com/300x150?text=No+Preview'">
      <h3 class="projects__title"></h3>
      <a href="${repo.html_url}" class="projects__button" target="_blank" rel="noopener noreferrer">
        View Project <i class="ri-arrow-right-line"></i>
      </a>
    `;

    const titleEl = card.querySelector(".projects__title");
    if (titleEl) {
      titleEl.textContent = repo.name.replace(/-/g, " ");
      adjustTitleFontSize(titleEl);
    }

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
