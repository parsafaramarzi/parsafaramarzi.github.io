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

/* ==================== FETCH GITHUB REPO COUNT ==================== */
async function fetchGitHubRepoCount() {
  if (!portfolioData || !portfolioData.github) return null;

  const CACHE_KEY = "github_repo_count";
  const CACHE_EXPIRY = 3600000;

  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { count, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return count;
    }
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${portfolioData.github.username}`,
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const data = await response.json();
    const repoCount = data.public_repos;

    if (typeof repoCount === "number") {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          count: repoCount,
          timestamp: Date.now(),
        }),
      );
      return repoCount;
    } else {
      throw new Error("Invalid data structure received from GitHub API");
    }
  } catch (error) {
    console.error("Failed to fetch GitHub repo count:", error);
    return null;
  }
}

/* ==================== FETCH GITHUB TECH STACK ==================== */
async function fetchTechStack() {
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

    return badgeUrls;
  } catch (error) {
    console.error("Error fetching tech stack:", error);
    return null;
  }
}

/* ==================== FETCH PROJECT PREVIEW IMAGE ==================== */
async function fetchProjectPreviewImage(username, repoName, defaultBranch) {
  const baseUrl = `https://raw.githubusercontent.com/${username}/${repoName}/${defaultBranch}`;
  const fileNames = ["preview.jpg", "preview.png"];

  for (let fileName of fileNames) {
    try {
      const imageUrl = `${baseUrl}/${fileName}`;
      const response = await fetch(imageUrl, { method: "HEAD" });

      if (response.ok) {
        console.log(`✓ Found preview image for ${repoName}: ${fileName}`);
        return imageUrl;
      }
    } catch (error) {
      console.log(`✗ preview.${fileName.split('.')[1]} not found for ${repoName}`);
    }
  }

  console.warn(`✗ No preview image found for ${repoName}, using default`);
  return null;
}

/* ==================== FETCH GITHUB PROJECTS ==================== */
async function fetchGitHubProjects() {
  if (!portfolioData || !portfolioData.github) return null;

  const apiUrl = `https://api.github.com/users/${portfolioData.github.username}/repos?sort=updated&per_page=100`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const allRepos = await response.json();

    const filteredProjects = allRepos.filter((repo) => {
      if (!repo.topics || !Array.isArray(repo.topics)) return false;
      return repo.topics.some((topic) =>
        portfolioData.github.topics.includes(topic),
      );
    });

    console.log(`Fetching preview images for ${filteredProjects.length} projects...`);
    for (let project of filteredProjects) {
      project.previewImage = await fetchProjectPreviewImage(
        portfolioData.github.username,
        project.name,
        project.default_branch,
      );
    }

    return filteredProjects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return null;
  }
}
