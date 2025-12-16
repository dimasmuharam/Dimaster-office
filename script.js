/* script.js - Dimaster Institute Logic */

// --- DARK MODE LOGIC ---
const themeBtn = document.getElementById('theme-toggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');

// Set initial theme
if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
}

themeBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
});

// --- ROI CALCULATOR (For tools.html) ---
function calculateROI() {
    const traffic = document.getElementById('traffic').value;
    const value = document.getElementById('value').value;
    const resultBox = document.getElementById('roi-result');
    const amountDisplay = document.getElementById('loss-amount');

    if(traffic && value) {
        // Logic: 15% disability population * 70% bounce rate due to inaccessibility
        const loss = (traffic * 0.15 * 0.70) * value; 
        const formatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(loss);
        
        amountDisplay.innerText = formatted;
        resultBox.style.display = 'block';
        resultBox.setAttribute('aria-hidden', 'false');
    }
}
