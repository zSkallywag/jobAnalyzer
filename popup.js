// popup.js


const btn = document.getElementById('extract');
const preview = document.getElementById('preview');
const status = document.getElementById('status');
const apikey = document.getElementById('apikey');


btn.addEventListener('click', async () => {
status.innerText = 'Richiedo estrazione...';
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
chrome.tabs.sendMessage(tab.id, { action: 'extract_job' }, async (resp) => {
if (!resp || !resp.ok) {
status.innerText = 'Errore estrazione: ' + (resp && resp.error ? resp.error : 'nessuna risposta');
return;
}
const data = resp.data;
preview.value = JSON.stringify(data, null, 2);
status.innerText = 'Estratto. Invio al backend...';


try {
const backend = 'http://localhost:8000/api/job'; // cambia con il tuo backend
const headers = { 'Content-Type': 'application/json' };
if (apikey.value) headers['x-api-key'] = apikey.value;
const r = await fetch(backend, { method: 'POST', headers, body: JSON.stringify(data) });
const j = await r.json();
status.innerText = 'Backend risposto: ' + (j && j.detail ? JSON.stringify(j.detail) : r.statusText);
} catch (e) {
status.innerText = 'Errore invio backend: ' + e.message;
}
});
});