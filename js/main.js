/* ==========================================================================
   John & Gurwinder Real Estate Group — Shared JS
   ========================================================================== */

// IDX / CRM base URL — confirm with John & Gurwinder whether this should
// stay as gurwindergill.exprealty.com or change to a new agent slug.
// Every city-search and "search all listings" link on this site is
// built from this constant so it only has to be updated here.
const EXP_REALTY_BASE_URL = "https://gurwindergill.exprealty.com";

// Property type codes carried over unchanged from the current
// westedgerealestate.ca city links (types[]=1,2,3,4,10,31).
const EXP_REALTY_TYPES = [1, 2, 3, 4, 10, 31];

// Service area list — city name plus the exact area_keyword value the
// current site uses in its exp Realty links (spaces become "+").
const SERVICE_AREAS = [
  { name: "Abbotsford", keyword: "ABBOTSFORD", image: "images/neighborhood-abbotsford.jpg" },
  { name: "Burnaby", keyword: "BURNABY", image: "images/neighborhood-burnaby.jpg" },
  { name: "Coquitlam", keyword: "COQUITLAM", image: "images/neighborhood-coquitlam.jpg" },
  { name: "Delta", keyword: "DELTA", image: "images/neighborhood-delta.jpg" },
  { name: "Langley", keyword: "LANGLEY", image: "images/neighborhood-langley.jpg" },
  { name: "Maple Ridge", keyword: "MAPLE+RIDGE", image: "images/neighborhood-maple-ridge.jpg" },
  { name: "Richmond", keyword: "RICHMOND", image: "images/neighborhood-richmond.jpg" },
  { name: "Surrey", keyword: "SURREY", image: "images/neighborhood-surrey.jpg" },
  { name: "Vancouver", keyword: "VANCOUVER", image: "images/neighborhood-vancouver.jpg" },
];

/**
 * Build an exp Realty city-search URL matching the current site's pattern:
 * https://gurwindergill.exprealty.com/index.php?advanced=1&area_keyword=CITY&types[]=1...&rtype=map#rslt
 */
function buildCitySearchUrl(areaKeyword) {
  const typeParams = EXP_REALTY_TYPES.map((t) => `types[]=${t}`).join("&");
  return (
    `${EXP_REALTY_BASE_URL}/index.php?advanced=1&area_keyword=${areaKeyword}` +
    `&${typeParams}&beds=0&baths=0&min=0&max=100000000&rtype=map#rslt`
  );
}

/**
 * exp Realty "search all listings" / general property search URL:
 * https://gurwindergill.exprealty.com/index.php?showagent=1&rtype=map
 */
function buildSearchAllUrl() {
  return `${EXP_REALTY_BASE_URL}/index.php?showagent=1&rtype=map`;
}

/* --------------------------------------------------------------------------
   Render city grid tiles (used on index.html)
   -------------------------------------------------------------------------- */
function renderCityGrid() {
  const grids = document.querySelectorAll("[data-city-grid]");
  if (!grids.length) return;

  grids.forEach((grid) => {
    const html = SERVICE_AREAS.map(
      (area) => `
      <a class="city-tile" href="${buildCitySearchUrl(area.keyword)}" target="_self" style="background-image: url('${area.image}');">
        <span>${area.name}</span>
      </a>`
    ).join("");
    grid.innerHTML = html;
  });
}

/* --------------------------------------------------------------------------
   Wire up any element flagged as a "search all listings" / property search
   link so every one of them points at the same exp Realty URL.
   -------------------------------------------------------------------------- */
function wireSearchAllLinks() {
  document.querySelectorAll("[data-idx-search-all]").forEach((el) => {
    el.setAttribute("href", buildSearchAllUrl());
  });
}

/* --------------------------------------------------------------------------
   Sticky / solidifying nav on scroll
   -------------------------------------------------------------------------- */
function initStickyNav() {
  const header = document.querySelector(".site-header");
  if (!header || header.classList.contains("solid")) return;

  const toggle = () => {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}

/* --------------------------------------------------------------------------
   Mobile nav toggle + dropdown handling
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".has-dropdown > button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".has-dropdown");
      const isMobile = window.matchMedia("(max-width: 860px)").matches;
      if (!isMobile) return;
      parent.classList.toggle("open");
    });
  });
}

/* --------------------------------------------------------------------------
   Init
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderCityGrid();
  wireSearchAllLinks();
  initStickyNav();
  initMobileNav();

  // Set current year in footer
  const yearEl = document.querySelector("#current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
