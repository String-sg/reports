// shared-components.js
// Utility functions for common UI components across reports

// Load site configuration
async function loadSiteConfig() {
  try {
    const response = await fetch('/config/site-config.json');
    return await response.json();
  } catch (error) {
    console.error('Error loading site configuration:', error);
    return null;
  }
}

// Generate navigation HTML
function generateNavigation(navItems) {
  return navItems.map(item => 
    `<a href="${item.url}">${item.text}</a>`
  ).join('');
}

// Generate footer links HTML
function generateFooterLinks(projects) {
  const links = projects.map(project => 
    `<a href="${project.url}">${project.name}</a>`
  ).join('');
  
  return `
    <footer class="report-links">
      <span class="me-2">Other reports:</span>
      ${links}
    </footer>
  `;
}

// Generate project card HTML
function generateProjectCard(project) {
  const statusClass = {
    'live': 'badge-maint',
    'wip': 'badge-rebuild',
    'deprecated': 'badge-deprecated'
  }[project.status] || 'badge-rebuild';
  
  return `
    <div class="col-md-4">
      <a class="text-decoration-none" href="${project.url}">
        <div class="metric-card h-100 d-flex flex-column">
          <h2 class="h4 mb-2">${project.name}</h2>
          <p class="small flex-grow-1 text-white">${project.description}</p>
          <span class="${statusClass} align-self-start" title="${project.statusText}">${project.statusText}</span>
        </div>
      </a>
    </div>
  `;
}

// Initialize common components on page load
async function initializeSharedComponents() {
  const config = await loadSiteConfig();
  if (!config) return;
  
  // Update footer navigation if present
  const existingFooter = document.querySelector('footer.report-links');
  if (existingFooter) {
    existingFooter.outerHTML = generateFooterLinks(config.projects);
  }
  
  return config;
}

// Export for use in other scripts
window.SharedComponents = {
  loadSiteConfig,
  generateNavigation,
  generateFooterLinks,
  generateProjectCard,
  initializeSharedComponents
};