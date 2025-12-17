document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LOGIKA DARK MODE (Sama seperti sebelumnya) ---
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
    
    // Fungsi untuk mengubah nilai Google Translate
    function triggerGoogleTranslate(langCode) {
        // Cari elemen select tersembunyi milik Google
        const googleSelect = document.querySelector('.goog-te-combo');
        
        if (googleSelect) {
            googleSelect.value = langCode;
            googleSelect.dispatchEvent(new Event('change')); // Trigger event change
        }
    }

    // Cek status bahasa saat load (mendeteksi cookie Google)
    function checkCurrentLanguage() {
        const googleSelect = document.querySelector('.goog-te-combo');
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
            // Jika Inggris, ubah ke Indonesia
            triggerGoogleTranslate('id'); // 'id' atau kosong '' untuk default
            document.body.setAttribute('data-lang', 'id');
            langBtn.setAttribute('aria-label', 'Switch to English');
        } else {
            // Jika Indonesia, ubah ke Inggris
            triggerGoogleTranslate('en');
            document.body.setAttribute('data-lang', 'en');
            langBtn.setAttribute('aria-label', 'Ganti ke Bahasa Indonesia');
        }
    });

    // Karena Google Translate load-nya agak lambat (async),
    // kita perlu cek berulang kali di awal apakah widget sudah siap
    const checkInterval = setInterval(() => {
        const googleSelect = document.querySelector('.goog-te-combo');
        if (googleSelect) {
            checkCurrentLanguage();
            // Tambahkan listener jika user mengubah bahasa lewat cara lain (opsional)
            googleSelect.addEventListener('change', checkCurrentLanguage);
            clearInterval(checkInterval); // Stop checking
        }
    }, 500); // Cek setiap 0.5 detik
});
