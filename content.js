// content.js


function waitForSelectors(selectors, timeout = 5000) {
return new Promise((resolve) => {
const start = Date.now();
(function poll() {
for (const sel of selectors) {
const el = document.querySelector(sel);
if (el && el.innerText && el.innerText.length > 20) return resolve(el);
}
if (Date.now() - start > timeout) return resolve(null);
setTimeout(poll, 200);
})();
});
}


function getTextFromSelectors(selectors, fallback = '') {
for (const s of selectors) {
const el = document.querySelector(s);
if (el && el.innerText && el.innerText.trim().length > 0) return el.innerText.trim();
}
return fallback;
}


async function extractJob() {
// Selettori tentati in ordine, aggiornali se LinkedIn cambia il DOM
const titleSel = ['h1', '.jobs-unified-top-card__job-title', '[data-test-job-title]'];
const companySel = ['.jobs-unified-top-card__company-name', '.topcard__org-name-link', '[data-test-company-name]'];
const locationSel = ['.jobs-unified-top-card__bullet', '.jobs-unified-top-card__subtle-location'];
const descSel = ['.jobs-description__container', '.jobs-box__html-content', '.show-more-less-html__markup'];


const titleEl = await waitForSelectors(titleSel, 4000);
const descEl = await waitForSelectors(descSel, 5000);


const title = titleEl ? titleEl.innerText.trim() : getTextFromSelectors(titleSel, '');
const company = getTextFromSelectors(companySel, '');
const location = getTextFromSelectors(locationSel, '');
let description = descEl ? descEl.innerText.trim() : getTextFromSelectors(descSel, '');


// Fallback: estrai il testo dal main e cerca la sezione "Job description"
if (!description || description.length < 50) {
const main = document.querySelector('main') || document.body;
const full = main.innerText || document.body.innerText;
// prova a trovare la porzione più rilevante
const idx = full.search(/job description|descrizione/i);
if (idx > -1) description = full.slice(idx, Math.min(full.length, idx + 3000));
else description = full.slice(0, 3000);
}


// Metadati minimi
const url = location.href;
const timestamp = new Date().toISOString();


return { title, company, location, description, url, timestamp };
// window.addEventListener('load', () => { /* estrazione automatica se vuoi */ });