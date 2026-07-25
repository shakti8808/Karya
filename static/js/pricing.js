"use strict";
// Local equivalents of the USD base prices: $5, $10 and $20.
const markets = {
    IN: { name: "India", currency: "INR", locale: "en-IN", prices: { starter: 418, pro: 835, team: 1670 } },
    US: { name: "United States", currency: "USD", locale: "en-US", prices: { starter: 5, pro: 10, team: 20 } },
    GB: { name: "United Kingdom", currency: "GBP", locale: "en-GB", prices: { starter: 4, pro: 8, team: 16 } },
    EU: { name: "European Union", currency: "EUR", locale: "en-IE", prices: { starter: 5, pro: 9, team: 18 } },
    CA: { name: "Canada", currency: "CAD", locale: "en-CA", prices: { starter: 7, pro: 14, team: 27 } },
    AU: { name: "Australia", currency: "AUD", locale: "en-AU", prices: { starter: 8, pro: 15, team: 30 } },
    SG: { name: "Singapore", currency: "SGD", locale: "en-SG", prices: { starter: 7, pro: 13, team: 27 } },
    AE: { name: "United Arab Emirates", currency: "AED", locale: "en-AE", prices: { starter: 18, pro: 37, team: 73 } },
    JP: { name: "Japan", currency: "JPY", locale: "ja-JP", prices: { starter: 785, pro: 1570, team: 3140 } }
};
const europeanRegions = new Set(["AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"]);
function isCountryCode(value) {
    return value !== null && value in markets;
}
function getSavedCountry() {
    try {
        return localStorage.getItem("karyaPricingCountry");
    }
    catch {
        return null;
    }
}
function saveCountry(country) {
    try {
        localStorage.setItem("karyaPricingCountry", country);
    }
    catch { /* Storage can be blocked in embedded HTML previews. */ }
}
function detectCountry() {
    const queryCountry = new URLSearchParams(location.search).get("country")?.toUpperCase() ?? null;
    if (isCountryCode(queryCountry))
        return queryCountry;
    const saved = getSavedCountry();
    if (isCountryCode(saved))
        return saved;
    const region = navigator.language.split("-")[1]?.toUpperCase();
    if (isCountryCode(region ?? null))
        return region;
    if (region && europeanRegions.has(region))
        return "EU";
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (zone === "Asia/Kolkata" || zone === "Asia/Calcutta")
        return "IN";
    if (zone === "Europe/London")
        return "GB";
    if (zone === "Asia/Dubai")
        return "AE";
    if (zone === "Asia/Singapore")
        return "SG";
    if (zone === "Asia/Tokyo")
        return "JP";
    if (zone.startsWith("Australia/"))
        return "AU";
    if (zone.startsWith("Europe/"))
        return "EU";
    if (zone.startsWith("America/Toronto") || zone.startsWith("America/Vancouver"))
        return "CA";
    return "US";
}
function formatPrice(value, market) {
    return new Intl.NumberFormat(market.locale, {
        style: "currency",
        currency: market.currency,
        maximumFractionDigits: 0
    }).format(value);
}
function renderMarket(country) {
    const market = markets[country];
    document.querySelectorAll("[data-price]").forEach((element) => {
        const key = element.dataset.price;
        element.textContent = formatPrice(market.prices[key], market);
    });
    const select = document.querySelector("#country");
    if (select)
        select.value = country;
    const note = document.querySelector("#locationNote span");
    if (note)
        note.textContent = `Prices shown in ${market.currency} for ${market.name}.`;
    document.documentElement.lang = market.locale;
}
const countrySelect = document.querySelector("#country");
renderMarket(detectCountry());
countrySelect?.addEventListener("change", () => {
    const country = countrySelect.value;
    if (!isCountryCode(country))
        return;
    saveCountry(country);
    renderMarket(country);
});
