"use strict";
const storageKey = "karyaFrontendProjects";
const get = (selector) => { const el = document.querySelector(selector); if (!el)
    throw new Error(`Missing ${selector}`); return el; };
const modal = get("#projectModal"), goal = get("#projectGoal"), grid = get("#projectGrid"), empty = get("#projectsEmpty"), recent = get("#recentList"), count = get("#projectCount"), appToast = get("#appToast"), sidebar = get("#sidebar"), scrim = get("#sidebarScrim");
function readProjects() { try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "[]");
}
catch {
    return [];
} }
function writeProjects(items) { try {
    localStorage.setItem(storageKey, JSON.stringify(items));
}
catch { } }
function escapeHtml(value) { return value.replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c] ?? c)); }
function titleFrom(goalText) { const clean = goalText.trim().replace(/\s+/g, " "); return clean.length > 54 ? clean.slice(0, 51) + "…" : clean; }
function showAppToast(message) { appToast.textContent = message; appToast.classList.add("show"); setTimeout(() => appToast.classList.remove("show"), 2400); }
function render() { const items = readProjects(); count.textContent = String(items.length); empty.hidden = items.length > 0; grid.innerHTML = items.map(p => `<article class="project-card" data-project="${p.id}"><span class="status">READY TO PLAN</span><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.goal)}</p><footer><span>Karya project</span><span>${new Date(p.createdAt).toLocaleDateString()}</span></footer></article>`).join(""); recent.innerHTML = items.length ? items.slice(0, 5).map(p => `<button class="recent-item" data-project="${p.id}">${escapeHtml(p.title)}</button>`).join("") : '<p class="recent-empty">Projects you create will appear here.</p>'; }
function openModal(prefill = "") { goal.value = prefill; modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); setTimeout(() => goal.focus(), 20); }
function closeModal() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
function createProject(text) { const items = readProjects(); items.unshift({ id: crypto.randomUUID?.() ?? String(Date.now()), title: titleFrom(text), goal: text.trim(), createdAt: new Date().toISOString() }); writeProjects(items); render(); closeModal(); showAppToast("Project saved locally — PostgreSQL connects later"); switchView("projects"); }
function switchView(name) { document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.id === `${name}View`)); document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === name)); sidebar.classList.remove("open"); scrim.classList.remove("open"); }
document.querySelectorAll(".nav-item").forEach(b => b.addEventListener("click", () => switchView(b.dataset.view ?? "home")));
["#newProjectButton", "#projectsNewButton", "#emptyNewButton"].forEach(s => document.querySelector(s)?.addEventListener("click", () => openModal()));
document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
get("#projectForm").addEventListener("submit", e => { e.preventDefault(); if (goal.value.trim())
    createProject(goal.value); });
get("#composerForm").addEventListener("submit", e => { e.preventDefault(); const input = get("#composerInput"); if (input.value.trim()) {
    createProject(input.value);
    input.value = "";
} });
document.querySelectorAll(".suggestions button").forEach(b => b.addEventListener("click", () => openModal(b.textContent ?? "")));
get("#menuButton").addEventListener("click", () => { sidebar.classList.add("open"); scrim.classList.add("open"); });
get("#sidebarClose").addEventListener("click", () => { sidebar.classList.remove("open"); scrim.classList.remove("open"); });
scrim.addEventListener("click", () => { sidebar.classList.remove("open"); scrim.classList.remove("open"); });
const profileButton = get("#profileButton"), profileMenu = get("#profileMenu");
profileButton.addEventListener("click", () => { const open = profileMenu.classList.toggle("open"); profileButton.setAttribute("aria-expanded", String(open)); });
get("#signOutButton").addEventListener("click", () => { try {
    localStorage.removeItem("karyaDemoSession");
}
catch { } window.location.assign("/login"); });
document.addEventListener("keydown", e => { if (e.key === "Escape")
    closeModal(); if (e.key.toLowerCase() === "n" && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== "TEXTAREA")
    openModal(); });
render();
