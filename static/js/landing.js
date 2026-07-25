"use strict";
function requiredElement(selector) {
    const element = document.querySelector(selector);
    if (!element)
        throw new Error(`Required landing-page element is missing: ${selector}`);
    return element;
}
const promptInput = requiredElement('#prompt');
const toast = requiredElement('#toast');
const progressValue = requiredElement('#progressValue');
const typedText = requiredElement('#typedText');
const typeCaret = requiredElement('#typeCaret');
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2200);
}
let progress = 68;
window.setInterval(() => {
    progress = progress >= 96 ? 68 : progress + 1;
    progressValue.textContent = String(progress);
}, 520);
const demoPrompts = [
    'Build a research-backed launch plan for my product',
    'Research India’s electric vehicle market',
    'Create a polished investor briefing',
    'Organise my project into an action plan',
];
let promptIndex = 0;
let charIndex = 0;
let deleting = false;
let caretTimer = 0;
function moveCaret() {
    typeCaret.classList.add('moving');
    window.clearTimeout(caretTimer);
    caretTimer = window.setTimeout(() => typeCaret.classList.remove('moving'), 140);
}
function syncPrompt(value) {
    promptInput.value = value;
    typedText.textContent = value;
    moveCaret();
}
function typePrompt() {
    if (document.activeElement === promptInput) {
        window.setTimeout(typePrompt, 300);
        return;
    }
    const phrase = demoPrompts[promptIndex];
    if (!deleting) {
        charIndex += 1;
        syncPrompt(phrase.slice(0, charIndex));
        if (charIndex === phrase.length) {
            deleting = true;
            window.setTimeout(typePrompt, 1500);
            return;
        }
    }
    else {
        charIndex -= 1;
        syncPrompt(phrase.slice(0, charIndex));
        if (charIndex === 0) {
            deleting = false;
            promptIndex = (promptIndex + 1) % demoPrompts.length;
        }
    }
    window.setTimeout(typePrompt, deleting ? 28 : 58);
}
promptInput.addEventListener('input', () => { typedText.textContent = promptInput.value; });
promptInput.addEventListener('blur', () => { typedText.textContent = promptInput.value; });
window.setTimeout(typePrompt, 450);
document.querySelectorAll('.sample').forEach((button) => {
    button.addEventListener('click', () => {
        syncPrompt(button.textContent?.trim() ?? '');
        charIndex = 0;
        deleting = false;
        promptInput.focus();
    });
});
document.querySelector('#go')?.addEventListener('click', () => {
    showToast('Karya received — agents are assembling');
});
document.querySelector('#copy')?.addEventListener('click', async () => {
    const pitch = 'Karya turns your ideas and instructions into finished work using coordinated AI agents.';
    try {
        await navigator.clipboard.writeText(pitch);
        showToast('One-line pitch copied');
    }
    catch {
        showToast(pitch);
    }
});
document.querySelectorAll('[data-waitlist-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.assign(link.href);
    });
});
