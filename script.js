document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LOGIKA DARK MODE ---
    const themeBtn = document.getElementById('theme-toggle');
    
    // Cek preferensi tersimpan
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
            // Pindah ke Light
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeBtn.setAttribute('aria-pressed', 'false');
            themeBtn.setAttribute('aria-label', 'Ubah ke Mode Gelap');
        } else {
            // Pindah ke Dark
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeBtn.setAttribute('aria-pressed', 'true');
            themeBtn.setAttribute('aria-label', 'Ubah ke Mode Terang');
        }
    });

    // --- 2. LOGIKA BAHASA (GOOGLE TRANSLATE) ---
    const langBtn = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('google_translate_element');

    langBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Mencegah event bubbling
        const isExpanded = langBtn.getAttribute('aria-expanded') === 'true';

        // Toggle status
        langBtn.setAttribute('aria-expanded', !isExpanded);
        langDropdown.setAttribute('aria-hidden', isExpanded); // Kebalikan dari expanded
        langDropdown.classList.toggle('active');

        // Fokus manajemen: Jika dibuka, coba fokus ke elemen pertama di dalamnya
        if (!isExpanded) {
            setTimeout(() => {
                // Mencoba mencari elemen select Google Translate (jika sudah ter-load)
                const googleSelect = langDropdown.querySelector('select, div.goog-te-gadget-simple');
                if (googleSelect) googleSelect.focus();
            }, 100);
        }
    });

    // Menutup dropdown jika klik di luar area
    document.addEventListener('click', (e) => {
        if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
            langDropdown.classList.remove('active');
            langBtn.setAttribute('aria-expanded', 'false');
            langDropdown.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Menutup dropdown dengan tombol ESC (Syarat WCAG)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && langDropdown.classList.contains('active')) {
            langDropdown.classList.remove('active');
            langBtn.setAttribute('aria-expanded', 'false');
            langBtn.focus(); // Kembalikan fokus ke tombol pemicu
        }
    });
});
