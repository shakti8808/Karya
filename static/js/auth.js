"use strict";
const googleButton = document.querySelector("#googleButton");
googleButton?.addEventListener("click", () => {
    try {
        localStorage.setItem("karyaDemoSession", "active");
    }
    catch { }
    googleButton.disabled = true;
    googleButton.textContent = "Opening Karya…";
    window.setTimeout(() => window.location.assign("/app"), 420);
});
