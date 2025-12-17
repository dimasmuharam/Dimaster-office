document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DARK MODE LOGIC ---
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Cek LocalStorage atau Preferensi OS
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme == 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    } else if (currentTheme == 'light') {
        document.body.setAttribute('data-theme', 'light');
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.body.getAttribute('data-theme');
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // --- 2. GOOGLE TRANSLATE ACCESSIBLE TOGGLE ---
    const langToggle = document.getElementById('lang-toggle');
    const translateBox = document.getElementById('google_translate_element');

    langToggle.addEventListener('click', () => {
        // Toggle class 'active' untuk menampilkan/menyembunyikan widget
        const isExpanded = langToggle.getAttribute('aria-expanded') === 'true';
        langToggle.setAttribute('aria-expanded', !isExpanded);
        translateBox.classList.toggle('active');
        
        // Fokuskan ke widget jika dibuka (untuk screen reader)
        if (!isExpanded) {
            setTimeout(() => {
                const select = translateBox.querySelector('select');
                if (select) select.focus();
            }, 100);
        }
    });

    // Menutup widget translate jika klik di luar area
    document.addEventListener('click', (e) => {
        if (!langToggle.contains(e.target) && !translateBox.contains(e.target)) {
            translateBox.classList.remove('active');
            langToggle.setAttribute('aria-expanded', 'false');
        }
    });
});
