"use strict";
const accessForm = document.querySelector('#form');
const successPanel = document.querySelector('#success');
if (!accessForm || !successPanel)
    throw new Error('Early access form elements are missing.');
accessForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(accessForm).entries());
    try {
        localStorage.setItem('karyaEarlyAccess', JSON.stringify({ ...data, submittedAt: new Date().toISOString() }));
    }
    catch { }
    accessForm.classList.add('hide');
    successPanel.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
