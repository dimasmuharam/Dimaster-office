document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LOGIKA DARK MODE ---
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
        document.body.setAttribute('data-theme', 'dark');
        themeBtn.setAttribute('aria-pressed', 'true');
        themeBtn.setAttribute('aria-label', 'Ubah ke Mode Terang');
    }

    themeBtn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeBtn.setAttribute('aria-pressed', 'false');
            themeBtn.setAttribute('aria-label', 'Ubah ke Mode Gelap');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeBtn.setAttribute('aria-pressed', 'true');
            themeBtn.setAttribute('aria-label', 'Ubah ke Mode Terang');
        }
    });


    // --- 2. LOGIKA BAHASA (TOGGLE ID <-> EN) ---
    const langBtn = document.getElementById('lang-toggle');
    
    // Fungsi pemicu yang lebih kuat (Perbaikan 1)
    function triggerGoogleTranslate(langCode) {
        const googleSelect = document.querySelector('.goog-te-combo');
        if (googleSelect) {
            googleSelect.value = langCode;
            // Google butuh kedua event ini agar sadar ada perubahan
            googleSelect.dispatchEvent(new Event('change')); 
            googleSelect.dispatchEvent(new Event('input')); 
        }
    }

    // Cek status saat load
    function checkCurrentLanguage() {
        const googleSelect = document.querySelector('.goog-te-combo');
        // Jika value 'en', artinya sedang diterjemahkan ke Inggris
        if (googleSelect && googleSelect.value === 'en') {
            document.body.setAttribute('data-lang', 'en');
            langBtn.setAttribute('aria-label', 'Ganti ke Bahasa Indonesia');
        } else {
            document.body.setAttribute('data-lang', 'id');
            langBtn.setAttribute('aria-label', 'Switch to English');
        }
    }

    // Listener Tombol
    langBtn.addEventListener('click', () => {
        const currentLang = document.body.getAttribute('data-lang');
        
        if (currentLang === 'en') {
            // Balik ke Indo (Perbaikan 2: Gunakan string kosong '' untuk reset)
            triggerGoogleTranslate(''); 
            document.body.setAttribute('data-lang', 'id');
            langBtn.setAttribute('aria-label', 'Switch to English');
        } else {
            // Ubah ke Inggris
            triggerGoogleTranslate('en');
            document.body.setAttribute('data-lang', 'en');
            langBtn.setAttribute('aria-label', 'Ganti ke Bahasa Indonesia');
        }
    });

    // Cek berkala apakah widget Google sudah siap (Polling)
    // Dipercepat ke 300ms agar tombol cepat responsif
    const checkInterval = setInterval(() => {
        const googleSelect = document.querySelector('.goog-te-combo');
        if (googleSelect) {
            checkCurrentLanguage();
            // Tambahkan listener jika user mengubah bahasa lewat cara lain (opsional)
            googleSelect.addEventListener('change', checkCurrentLanguage);
            clearInterval(checkInterval); // Stop checking
        }
    }, 300);
});
