type CountryCode = "IN" | "US" | "GB" | "EU" | "CA" | "AU" | "SG" | "AE" | "JP";
type PriceKey = "starter" | "pro" | "team";

type Market = {
  name: string;
  currency: string;
  locale: string;
  prices: Record<PriceKey, number>;
};

// Local equivalents of the USD base prices: $5, $10 and $20.
const markets: Record<CountryCode, Market> = {
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

function isCountryCode(value: string | null): value is CountryCode {
  return value !== null && value in markets;
}

function getSavedCountry(): string | null {
  try { return localStorage.getItem("karyaPricingCountry"); }
  catch { return null; }
}

function saveCountry(country: CountryCode): void {
  try { localStorage.setItem("karyaPricingCountry", country); }
  catch { /* Storage can be blocked in embedded HTML previews. */ }
}

function detectCountry(): CountryCode {
  const queryCountry = new URLSearchParams(location.search).get("country")?.toUpperCase() ?? null;
  if (isCountryCode(queryCountry)) return queryCountry;

  const saved = getSavedCountry();
  if (isCountryCode(saved)) return saved;

  const region = navigator.language.split("-")[1]?.toUpperCase();
  if (isCountryCode(region ?? null)) return region as CountryCode;
  if (region && europeanRegions.has(region)) return "EU";

  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (zone === "Asia/Kolkata" || zone === "Asia/Calcutta") return "IN";
  if (zone === "Europe/London") return "GB";
  if (zone === "Asia/Dubai") return "AE";
  if (zone === "Asia/Singapore") return "SG";
  if (zone === "Asia/Tokyo") return "JP";
  if (zone.startsWith("Australia/")) return "AU";
  if (zone.startsWith("Europe/")) return "EU";
  if (zone.startsWith("America/Toronto") || zone.startsWith("America/Vancouver")) return "CA";
  return "US";
}

function formatPrice(value: number, market: Market): string {
  return new Intl.NumberFormat(market.locale, {
    style: "currency",
    currency: market.currency,
    maximumFractionDigits: 0
  }).format(value);
}

function renderMarket(country: CountryCode): void {
  const market = markets[country];
  document.querySelectorAll<HTMLElement>("[data-price]").forEach((element) => {
    const key = element.dataset.price as PriceKey;
    element.textContent = formatPrice(market.prices[key], market);
  });

  const select = document.querySelector<HTMLSelectElement>("#country");
  if (select) select.value = country;

  const note = document.querySelector<HTMLElement>("#locationNote span");
  if (note) note.textContent = `Prices shown in ${market.currency} for ${market.name}.`;

  document.documentElement.lang = market.locale;
}

const countrySelect = document.querySelector<HTMLSelectElement>("#country");
renderMarket(detectCountry());

countrySelect?.addEventListener("change", () => {
  const country = countrySelect.value;
  if (!isCountryCode(country)) return;
  saveCountry(country);
  renderMarket(country);
});
