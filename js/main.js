/* ==========================================================================
   John & Gurwinder Real Estate Group — Shared JS
   ========================================================================== */

// IDX / CRM base URL — confirm with John & Gurwinder whether this should
// stay as gurwindergill.exprealty.com or change to a new agent slug.
// Every city-search, featured-listing, and "search all listings" link on
// this site is built from this constant so it only has to be updated here.
const EXP_REALTY_BASE_URL = "https://gurwindergill.exprealty.com";

// Property type codes carried over unchanged from the current
// westedgerealestate.ca city links (types[]=1,2,3,4,10,31).
const EXP_REALTY_TYPES = [1, 2, 3, 4, 10, 31];

// Service area list — city name plus the exact area_keyword value the
// current site uses in its exp Realty links (spaces become "+").
const SERVICE_AREAS = [
  { name: "Abbotsford", keyword: "ABBOTSFORD" },
  { name: "Burnaby", keyword: "BURNABY" },
  { name: "Coquitlam", keyword: "COQUITLAM" },
  { name: "Delta", keyword: "DELTA" },
  { name: "Langley", keyword: "LANGLEY" },
  { name: "Maple Ridge", keyword: "MAPLE+RIDGE" },
  { name: "Richmond", keyword: "RICHMOND" },
  { name: "Surrey", keyword: "SURREY" },
  { name: "Vancouver", keyword: "VANCOUVER" },
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
   Render city grid tiles (used on index.html and listings.html)
   -------------------------------------------------------------------------- */
function renderCityGrid() {
  const grids = document.querySelectorAll("[data-city-grid]");
  if (!grids.length) return;

  grids.forEach((grid) => {
    const html = SERVICE_AREAS.map(
      (area) => `
      <a class="city-tile" href="${buildCitySearchUrl(area.keyword)}" target="_self">
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
   Mortgage calculator (mortgage-calculator.html)
   -------------------------------------------------------------------------- */
function initMortgageCalculator() {
  const form = document.querySelector("#mortgage-calc-form");
  if (!form) return;

  const priceInput = form.querySelector("#calc-price");
  const downInput = form.querySelector("#calc-down");
  const rateInput = form.querySelector("#calc-rate");
  const yearsInput = form.querySelector("#calc-years");

  const monthlyEl = document.querySelector("#calc-monthly");
  const principalEl = document.querySelector("#calc-principal");
  const totalInterestEl = document.querySelector("#calc-total-interest");
  const totalPaidEl = document.querySelector("#calc-total-paid");

  const currency = (n) =>
    n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

  function calculate() {
    const price = parseFloat(priceInput.value) || 0;
    const downPct = parseFloat(downInput.value) || 0;
    const annualRate = parseFloat(rateInput.value) || 0;
    const years = parseFloat(yearsInput.value) || 0;

    const downAmount = price * (downPct / 100);
    const principal = Math.max(price - downAmount, 0);
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;

    let monthlyPayment = 0;
    if (principal > 0 && numPayments > 0) {
      if (monthlyRate === 0) {
        monthlyPayment = principal / numPayments;
      } else {
        monthlyPayment =
          (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);
      }
    }

    const totalPaid = monthlyPayment * numPayments;
    const totalInterest = totalPaid - principal;

    monthlyEl.textContent = currency(monthlyPayment || 0);
    principalEl.textContent = currency(principal || 0);
    totalInterestEl.textContent = currency(totalInterest > 0 ? totalInterest : 0);
    totalPaidEl.textContent = currency(totalPaid > 0 ? totalPaid : 0);
  }

  form.addEventListener("input", calculate);
  calculate();
}

/* --------------------------------------------------------------------------
   Init
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderCityGrid();
  wireSearchAllLinks();
  initStickyNav();
  initMobileNav();
  initMortgageCalculator();

  // Set current year in footer
  const yearEl = document.querySelector("#current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
