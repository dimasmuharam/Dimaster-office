document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. LOGIKA DARK MODE 
    // =========================================
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Fungsi update UI Button (Ikon Matahari/Bulan)
    function updateThemeButton(theme) {
        // Kita menggunakan CSS class untuk show/hide SVG, jadi cukup set atribut body
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

    // Set awal
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
    // 2. LOGIKA GANTI BAHASA (METODE COOKIE)
    // =========================================
    const langBtn = document.getElementById('lang-toggle');
    const langText = langBtn.querySelector('.lang-text') || langBtn; // Fallback jika span tidak ada

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

    // Cek Status Bahasa Saat Load
    const currentGoogleCookie = getCookie('googtrans');

    if (currentGoogleCookie && currentGoogleCookie.includes('/en')) {
        // Sedang Bahasa Inggris
        langText.textContent = 'EN'; 
        langBtn.setAttribute('aria-label', 'Current Language: English. Click to switch to Indonesian');
    } else {
        // Sedang Bahasa Indonesia (Default)
        langText.textContent = 'ID';
        langBtn.setAttribute('aria-label', 'Bahasa saat ini Indonesia. Klik untuk ganti ke Inggris');
    }

    // Event Klik Tombol Bahasa
    langBtn.addEventListener('click', () => {
        if (langText.textContent.includes('ID')) {
            // Mau ganti ke Inggris
            setGoogleCookie('/id/en'); 
            location.reload(); // Wajib reload agar cookie terbaca Google
        } else {
            // Mau ganti ke Indonesia
            setGoogleCookie('/id/id'); 
            location.reload();
        }
    });

});


// =========================================
// 3. GOOGLE TRANSLATE LOADER (EXTERNAL)
// =========================================
// Ini ditaruh di luar DOMContentLoaded agar langsung dieksekusi browser
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
    // Gunakan protokol https agar aman
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
})();
