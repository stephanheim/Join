/**
 * Holds the current page identifier.
 * @type {string}
 */
let currentPage = "";

/**
 * A mapping of page identifiers to their respective titles.
 */
const pageTitles = {
  addTask: "Add Task",
  summary: "Summary User",
  board: "Board",
  contacts: "Contacts",
  privacy_policy: "Privacy Policy",
  legal_notice: "Legal notice",
  help: "Help",
};

/**
 * Initializes the page based on the given identifier and triggers relevant setup functions.
 * @param {string} page - The identifier for the page to initialize (e.g. 'summary', 'addTask').
 */
async function initPages(page) {
  currentPage = page;
  toggleNavPrivacyByPage(page);
  if (page === "summary") {
    initSummary();
  } else if (page === "addTask") {
    initAddTask();
  } else if (page === "board") {
    initBoard();
  } else if (page === "contacts") {
    initContacts();
  }
}

/**
 * Loads the content for the given page and initializes relevant functions.
 * @param {string} page - The identifier for the page (e.g. 'summary', 'addTask').
 */
async function loadPageContentPath(page) {
  let contentPages = document.getElementById("content");
  let content = await fetchContent(`${page}.html`);
  contentPages.innerHTML = content;
  initPages(page);
  toggleNavPrivacyByPage(page);
  changePageTitles(page);
  if (page === "summary") {
    showUserWelcome();
  }
}

/**
 * Fetches the content of a specified page from the server.
 * @param {string} page - The name of the page to fetch (e.g. 'summary.html').
 * @returns {Promise<string>} A promise that resolves to the HTML content of the page.
 */
async function fetchContent(page) {
  try {
    const response = await fetch(`../pages/${page}`);
    return await response.text();
  } catch (error) {
    console.error("Error during retrieval");
  }
}

/**
 * Re-applies the navigation privacy settings when the window is resized.
 */
window.onresize = () => toggleNavPrivacyByPage(currentPage);

/**
 * Toggles the visibility of the navigation based on the current page and screen size.
 * @param {string} page - The identifier for the current page (e.g., 'summary', 'addTask').
 */
function toggleNavPrivacyByPage(page) {
  const nav = document.getElementById("navPrivacy");
  if (!nav) return;
  const isDashboardPage = ["summary", "addTask", "board", "contacts", "legal_notice", "privacy_policy"].includes(page);
  const isSmallScreen = window.innerWidth < 1200;
  if (isDashboardPage && isSmallScreen) {
    nav.classList.add("d-none");
  } else {
    nav.classList.remove("d-none");
  }
}

/**
 * Changes the document title based on the provided page identifier.
 * @param {string} page - The identifier for the page (e.g., 'summary', 'addTask').
 */
function changePageTitles(page) {
  let changeTitles = pageTitles[page];
  document.title = changeTitles;
}

/**
 * Sets the active navigation item to the board navigation link.
 */
function setActiveNavBoard() {
  let boardNav = document.getElementById("sumToBoard");
  if (boardNav) {
    setActiveNav(boardNav);
  }
}

/**
 * Sets the clicked navigation item as active and disables its pointer events.
 * It also removes the active state and restores pointer events for all other navigation items.
 * @param {HTMLElement} clickedNav - The navigation link that was clicked.
 */
function setActiveNav(clickedNav) {
  let navLinks = document.getElementsByClassName("nav");
  let policyLinks = document.getElementsByClassName("policy-content");
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].classList.remove("active");
    navLinks[i].style.pointerEvents = "auto";
  }
  for (let i = 0; i < policyLinks.length; i++) {
    policyLinks[i].classList.remove("active");
    policyLinks[i].style.pointerEvents = "auto";
  }
  clickedNav.classList.add("active");
  clickedNav.style.pointerEvents = "none";
}

/**
 * Closes the contact overlay if the user clicks outside the overlay content.
 * @param {Event} event - The click event that triggered the function.
 */
function overlayClick(event) {
  let overlayContent = document.getElementById("contactFloater");
  if (!overlayContent.contains(event.target)) {
    animateCloseContact();
  }
}

/**
 * Stores the current page in sessionStorage and loads the help page.
 */
function openHelpPage() {
  sessionStorage.setItem("previousPage", currentPage);
  loadPageContentPath("help");
}

/**
 * Navigates back to the previously stored page from sessionStorage.
 * If no previous page is stored, nothing happens.
 */
function arrowBackToPreviousPage() {
  const previousPage = sessionStorage.getItem("previousPage");
  if (previousPage) {
    loadPageContentPath(previousPage);
    sessionStorage.removeItem("previousPage");
  }
}
