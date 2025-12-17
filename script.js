document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. LOGIKA DARK MODE 
    // =========================================
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Fungsi update UI Button
    function updateThemeButton(theme) {
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeBtn.setAttribute('aria-pressed', 'true');
            themeBtn.setAttribute('aria-label', 'Ubah ke Mode Terang');
        } else {
            document.body.setAttribute('data-theme', 'light');
            themeBtn.setAttribute('aria-pressed', 'false');
            themeBtn.setAttribute('aria-label', 'Ubah ke Mode Gelap');
        }
    }

    // Set kondisi awal
    if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
        updateThemeButton('dark');
    } else {
        updateThemeButton('light');
    }

    // Event Klik
    themeBtn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            updateThemeButton('light');
            localStorage.setItem('theme', 'light');
        } else {
            updateThemeButton('dark');
            localStorage.setItem('theme', 'dark');
        }
    });


    // =========================================
    // 2. LOGIKA BAHASA (COOKIE METHOD)
    // =========================================
    const langBtn = document.getElementById('lang-toggle');
    const langText = langBtn.querySelector('.lang-text') || langBtn;

    // Helper: Ambil Cookie
    function getCookie(name) {
        const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }

    // Helper: Set Cookie Google
    function setGoogleCookie(value) {
        document.cookie = "googtrans=" + value + "; path=/; domain=" + document.domain;
        document.cookie = "googtrans=" + value + "; path=/;";
    }

    // A. Cek Status Bahasa Saat Load (Untuk Label Tombol)
    const currentGoogleCookie = getCookie('googtrans');
    if (currentGoogleCookie && currentGoogleCookie.includes('/en')) {
        langText.textContent = 'EN'; 
        langBtn.setAttribute('aria-label', 'Current Language: English. Click to switch to Indonesian');
    } else {
        langText.textContent = 'ID';
        langBtn.setAttribute('aria-label', 'Bahasa saat ini Indonesia. Klik untuk ganti ke Inggris');
    }

    // B. Event Klik Tombol Bahasa (Manual Switch)
    langBtn.addEventListener('click', () => {
        if (langText.textContent.includes('ID')) {
            setGoogleCookie('/id/en'); // Ganti ke Inggris
            location.reload();
        } else {
            setGoogleCookie('/id/id'); // Ganti ke Indonesia
            location.reload();
        }
    });

    // C. AUTO DETECT LANGUAGE (Fitur Baru)
    // Jika browser bukan bahasa Indonesia & belum ada cookie preferensi, paksa Inggris.
    (function checkAutoLanguage() {
        var userLang = navigator.language || navigator.userLanguage; 
        
        // Cek apakah bahasa browser TIDAK mengandung 'id' atau 'ind'
        // Dan pastikan user belum pernah set bahasa (cookie kosong)
        if (userLang.indexOf('id') === -1 && userLang.indexOf('ind') === -1 && !getCookie('googtrans')) {
            console.log('Non-Indonesian browser detected (' + userLang + '). Switching to English.');
            setGoogleCookie('/id/en');
            location.reload();
        }
    })();

});


// =========================================
// 3. GOOGLE TRANSLATE LOADER (EXTERNAL)
// =========================================
// Loader ditaruh di luar DOMContentLoaded agar dieksekusi secepat mungkin
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'id',
        includedLanguages: 'en,id', // Hanya ID dan EN
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
};

(function loadGoogleScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    // Gunakan HTTPS agar aman
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
})();
