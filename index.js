
const menuCategories = ["Beverages", "Croissants", "Sandwiches", "Coffee"];
const [first, second, ...rest] = menuCategories;
console.log("First category:", first);          // Beverages
console.log("Second category:", second);         // Croissants
console.log("Rest:", rest);                      // ["Sandwiches","Coffee"]

// Swap via destructuring
let [a, b] = [1, 2];
[a, b] = [b, a];
console.log("Swapped a, b:", a, b);

// --- Object Destructuring ---
const cafeInfo = {
  name: "Cozy Sip",
  city: "Rajpura",
  state: "Punjab",
  ratings: { overall: 4.9, taste: 5, ambience: 4.8 }
};

const { name: cafeName, city, ratings: { overall, taste } } = cafeInfo;
console.log(`${cafeName} is in ${city} with rating ${overall}/5`);

// Default value in destructuring
const { phone = "Not available", city: cafeCity } = cafeInfo;
console.log("Phone:", phone, "| City:", cafeCity);

// Function parameter destructuring
function greetGuest({ name = "Guest", city = "Punjab" } = {}) {
  return `Welcome to Cozy Sip, ${name} from ${city}! ☕`;
}
console.log(greetGuest({ name: "Pari", city: "Chandigarh" }));



const originalOrder = {
  item: "Almond Croissant",
  price: 120,
  addons: ["butter", "jam"]
};

// Shallow copy — nested arrays/objects are still shared references
const shallowOrder = { ...originalOrder };
shallowOrder.addons.push("honey");
console.log("Shallow — original addons:", originalOrder.addons); // affected!

// Deep copy — completely independent clone
const deepOrder = JSON.parse(JSON.stringify(originalOrder));
deepOrder.addons.push("syrup");
console.log("Deep — original addons after deep copy change:", originalOrder.addons); // NOT affected


// JSON.stringify — convert JS object → JSON string
const orderData = {
  customer: "Neha",
  items: ["Espresso", "Butter Croissant"],
  total: 350,
  time: new Date().toLocaleTimeString()
};

const jsonString = JSON.stringify(orderData, null, 2);
console.log("JSON String:\n", jsonString);

// JSON.parse — convert JSON string → JS object
const parsedOrder = JSON.parse(jsonString);
console.log("Parsed customer:", parsedOrder.customer);
console.log("Parsed items:", parsedOrder.items);

// Storing & retrieving from localStorage using JSON
function saveOrderToStorage(order) {
  const existing = JSON.parse(localStorage.getItem("cozy_orders") || "[]");
  existing.push(order);
  localStorage.setItem("cozy_orders", JSON.stringify(existing));
}

function getOrdersFromStorage() {
  return JSON.parse(localStorage.getItem("cozy_orders") || "[]");
}


// --- Selectors ---
const navbar     = document.getElementById("navbar");
const heroTitle  = document.querySelector(".hero-title");
const allCards   = document.querySelectorAll(".feat-card");
const allLinks   = document.querySelectorAll(".nav-links a");

// --- Read / Write HTML & CSS ---
if (heroTitle) {
  // Read
  console.log("Hero text:", heroTitle.textContent);
  // Write CSS
  heroTitle.style.textShadow = "0 4px 20px rgba(0,0,0,0.4)";
}

// --- Scroll-reveal: toggle class on elements ---
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) {
      el.classList.add("visible");
    }
  });
}

// --- Creating, Appending & Deleting Nodes ---
function createVisitorBadge(userName) {
  // Create node
  const badge = document.createElement("div");
  badge.id = "visitor-badge";
  badge.innerHTML = `☕ Welcome back, <strong>${userName}</strong>! &nbsp;
    <button id="close-badge">✕</button>`;
  badge.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: #2b1509; color: #f5e6d3; padding: 12px 28px;
    border-radius: 50px; font-size: 0.95rem; z-index: 9999;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4); animation: fadeUp .5s ease;
  `;
  document.body.appendChild(badge);  // Append

  // Delete node on close
  document.getElementById("close-badge").addEventListener("click", () => {
    badge.remove();
  });

  // Auto-remove after 5s
  setTimeout(() => badge && badge.isConnected && badge.remove(), 5000);
}

// --- DOM Performance Optimisation: DocumentFragment ---
function renderMenuItems(items) {
  const container = document.querySelector(".features-grid");
  if (!container) return;

  const fragment = document.createDocumentFragment(); // avoids multiple repaints
  items.forEach(({ icon, name, desc, link, href }) => {
    const card = document.createElement("div");
    card.className = "feat-card";
    card.innerHTML = `
      <span class="feat-icon">${icon}</span>
      <h3 class="feat-name">${name}</h3>
      <p class="feat-desc">${desc}</p>
      <a href="${href}" class="feat-link">${link}</a>
    `;
    fragment.appendChild(card);
  });
  container.innerHTML = "";
  container.appendChild(fragment); // single DOM write
}


// --- addEventListener ---
window.addEventListener("scroll", revealOnScroll);


const featuresSection = document.querySelector("#features");
if (featuresSection) {
  featuresSection.addEventListener("click", (e) => {
    // Bubbling: event propagates up from child to parent
    console.log("Bubble — click caught on #features, target:", e.target.className);
  });
}

document.addEventListener("click", (e) => {
  // Capture phase — fires before any child handlers
}, true);

const navLinks = document.querySelector(".nav-links");
if (navLinks) {
  navLinks.addEventListener("click", (e) => {
    // Delegation: check which child was actually clicked
    if (e.target.tagName === "A") {
      e.preventDefault();
      // Remove active from all, add to clicked
      allLinks.forEach(l => l.classList.remove("active"));
      e.target.classList.add("active");
      // Navigate after short delay
      setTimeout(() => { window.location.href = e.target.href; }, 200);
    }
  });
}

// stopPropagation example — reserve button should NOT bubble to nav
const reserveBtn = document.querySelector(".nav-reserve:last-of-type");
if (reserveBtn) {
  reserveBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // stops bubbling to navbar listener
    showReserveModal();
  });
}

// --- Feat-card click with delegation on grid ---
const featGrid = document.querySelector(".features-grid");
if (featGrid) {
  featGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".feat-card");
    if (card) {
      card.style.transform = "scale(1.03)";
      setTimeout(() => card.style.transform = "", 300);
    }
  });
}


/* ─────────────────────────────────────────────
   6.  FORM VALIDATION  (Reserve a Table modal)
   ───────────────────────────────────────────── */

function showReserveModal() {
  if (document.getElementById("reserve-modal")) return; // prevent duplicates

  const modal = document.createElement("div");
  modal.id = "reserve-modal";
  modal.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center; z-index: 10000;
  `;
  modal.innerHTML = `
    <div style="background:#fff8f0;padding:40px;border-radius:16px;width:340px;
      box-shadow:0 20px 60px rgba(0,0,0,0.4);font-family:'Segoe UI',sans-serif;">
      <h2 style="color:#2b1509;margin:0 0 20px;text-align:center;">Reserve a Table ☕</h2>

      <label style="font-size:.85rem;color:#666;display:block;margin-bottom:4px;">Date *</label>
      <input id="rv-date" type="date"
        style="width:100%;padding:10px;border:1.5px solid #ddd;border-radius:8px;
               box-sizing:border-box;margin-bottom:14px;font-size:.95rem;">

      <label style="font-size:.85rem;color:#666;display:block;margin-bottom:4px;">No. of Guests *</label>
      <input id="rv-guests" type="number" min="1" max="12" placeholder="2"
        style="width:100%;padding:10px;border:1.5px solid #ddd;border-radius:8px;
               box-sizing:border-box;margin-bottom:56px;font-size:.95rem;">

      <div id="rv-error" style="color:#c0392b;font-size:.85rem;margin-bottom:10px;display:none;"></div>

      <div style="display:flex;gap:10px;">
        <button id="rv-cancel" style="flex:1;padding:12px;background:#eee;border:none;
          border-radius:8px;cursor:pointer;font-size:.95rem;">Cancel</button>
        <button id="rv-submit" style="flex:2;padding:12px;background:#2b1509;color:#f5e6d3;
          border:none;border-radius:8px;cursor:pointer;font-size:.95rem;font-weight:600;">
          Confirm Reservation
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("rv-cancel").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

  document.getElementById("rv-submit").addEventListener("click", () => {
    validateReservation(modal);
  });
}

function validateReservation(modal) {
  const date   = document.getElementById("rv-date").value;
  const guests = document.getElementById("rv-guests").value;
  const errEl  = document.getElementById("rv-error");

  // --- Validation Rules ---
  if (!date) return showError(errEl, "Please select a date.");

  const selectedDate = new Date(date);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (selectedDate < today) return showError(errEl, "Date cannot be in the past.");
  if (!guests || guests < 1 || guests > 12)
    return showError(errEl, "Guests must be between 1 and 12.");

  // All good — save to localStorage
  const reservation = { date, guests: Number(guests), bookedAt: new Date().toISOString() };
  saveReservation(reservation);

  modal.remove();
  showToast(`Table reserved for ${date}! ☕`);
}

function showError(el, msg) {
  el.textContent = msg;
  el.style.display = "block";
}

// Save reservation in localStorage
function saveReservation(data) {
  const all = JSON.parse(localStorage.getItem("cozy_reservations") || "[]");
  all.push(data);
  localStorage.setItem("cozy_reservations", JSON.stringify(all));
  console.log("Reservation saved:", data);
}


/* ─────────────────────────────────────────────
   7.  DOM PERFORMANCE OPTIMISATION
   ───────────────────────────────────────────── */

// requestAnimationFrame for smooth scroll-based animations
function smoothReveal() {
  requestAnimationFrame(() => {
    revealOnScroll();
  });
}
window.addEventListener("scroll", smoothReveal, { passive: true });

// Navbar background change on scroll (efficient — no layout thrash)
window.addEventListener("scroll", () => {
  requestAnimationFrame(() => {
    if (!navbar) return;
    navbar.style.background = window.scrollY > 60
      ? "rgba(43,21,9,0.97)"
      : "rgba(43,21,9,0.65)";
  });
}, { passive: true });


/* ─────────────────────────────────────────────
   8.  BOM — Browser Object Model
   ───────────────────────────────────────────── */

// window.navigator — browser / device info
console.log("Browser:", navigator.userAgent);
console.log("Online?:", navigator.onLine);
console.log("Language:", navigator.language);
console.log("Platform:", navigator.platform);

// window.location — URL info
console.log("Hostname:", location.hostname);
console.log("Pathname:", location.pathname);
console.log("Protocol:", location.protocol);

// --- BOM Alerts / Dialogs ---
// window.alert()   → already used in Reserve a Table
// window.confirm() — used below
// window.prompt()  — used in theme prompt

// --- Timers ---
// setInterval — live clock in footer
function startLiveClock() {
  const clockEl = document.getElementById("live-clock");
  if (!clockEl) return;
  setInterval(() => {
    clockEl.textContent = new Date().toLocaleTimeString("en-IN");
  }, 1000);
}

// setTimeout — delayed welcome toast after page load
setTimeout(() => {
  const savedUser = localStorage.getItem("cozy_last_user");
  if (savedUser) {
    createVisitorBadge(savedUser);
  }
}, 1500);

// clearTimeout / clearInterval example
let autoSlideTimer = null;
function startAutoSlide() {
  autoSlideTimer = setInterval(() => {
    // hypothetical gallery auto-slide
  }, 3000);
}
function stopAutoSlide() {
  clearInterval(autoSlideTimer);
}


/* ─────────────────────────────────────────────
   9.  LOCAL STORAGE — Full Integration
   ───────────────────────────────────────────── */

// Theme preference
function applyTheme() {
  const savedTheme = localStorage.getItem("cozy_theme") || "light";
  document.body.setAttribute("data-theme", savedTheme);
}

function toggleTheme() {
  const current = localStorage.getItem("cozy_theme") || "light";
  const next = current === "light" ? "dark" : "light";
  localStorage.setItem("cozy_theme", next);
  applyTheme();
  showToast(`Theme switched to ${next} mode 🎨`);
}

// Wishlist / Favourites stored in localStorage
function addToWishlist(itemName) {
  const list = JSON.parse(localStorage.getItem("cozy_wishlist") || "[]");
  if (!list.includes(itemName)) {
    list.push(itemName);
    localStorage.setItem("cozy_wishlist", JSON.stringify(list));
    showToast(`${itemName} added to your wishlist ❤️`);
  } else {
    showToast(`${itemName} is already in your wishlist!`);
  }
}

function getWishlist() {
  return JSON.parse(localStorage.getItem("cozy_wishlist") || "[]");
}

function clearWishlist() {
  if (window.confirm("Clear your entire wishlist?")) {
    localStorage.removeItem("cozy_wishlist");
    showToast("Wishlist cleared.");
  }
}

// Visit counter
function trackVisit() {
  let count = parseInt(localStorage.getItem("cozy_visit_count") || "0");
  count++;
  localStorage.setItem("cozy_visit_count", String(count));
  console.log(`This is visit #${count} to Cozy Sip`);
  if (count === 1) showToast("Welcome to Cozy Sip for the first time! ☕");
  if (count === 5) showToast("You're a regular! Thanks for visiting 5 times 🎉");
}


/* ─────────────────────────────────────────────
   10.  UTILITY — Toast notification
   ───────────────────────────────────────────── */

function showToast(msg) {
  const old = document.getElementById("cozy-toast");
  if (old) old.remove();

  const toast = document.createElement("div");
  toast.id = "cozy-toast";
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed;bottom:28px;right:28px;background:#2b1509;color:#f5e6d3;
    padding:14px 24px;border-radius:12px;font-size:.9rem;
    box-shadow:0 8px 30px rgba(0,0,0,0.35);z-index:99999;
    animation:fadeUp .4s ease;max-width:300px;line-height:1.4;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast && toast.isConnected && toast.remove(), 3500);
}


/* ─────────────────────────────────────────────
   11.  CSS animation (injected for toast/badge)
   ───────────────────────────────────────────── */
const styleTag = document.createElement("style");
styleTag.textContent = `
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0);     }
  }
  .reveal { opacity:0; transform:translateY(40px); transition: opacity .7s ease, transform .7s ease; }
  .reveal.visible { opacity:1; transform:translateY(0); }
`;
document.head.appendChild(styleTag);


/* ─────────────────────────────────────────────
   12.  INIT — runs when DOM is ready
   ───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  trackVisit();
  revealOnScroll();
  startLiveClock();

  // Attach theme toggle if button exists
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  // Expose helpers globally for onclick="" attributes in HTML
  window.addToWishlist = addToWishlist;
  window.clearWishlist = clearWishlist;
  window.getWishlist   = getWishlist;
  window.toggleTheme   = toggleTheme;
  window.showReserveModal = showReserveModal;

  console.log("✅ Cozy Sip JS loaded. Wishlist:", getWishlist());
  console.log("📋 All reservations:", JSON.parse(localStorage.getItem("cozy_reservations") || "[]"));
});
