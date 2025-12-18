/* ==========================================================================
   DIMASTER GROUP - UNIVERSAL SCRIPT (ACCESSIBLE & CORPORATE)
   Compatible with: accessible.web.id & dimaster.co.id
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. LOGIKA DARK MODE (THEME SWITCHER)
    // =========================================
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    
    // Fungsi Update Tampilan & Atribut Aksesibilitas
    function updateThemeButton(theme) {
        if (!themeToggle) return;
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️'; // Icon Matahari untuk mode gelap (klik untuk terang)
            themeToggle.setAttribute('aria-label', 'Ganti ke Mode Terang'); 
            themeToggle.setAttribute('title', 'Ganti ke Mode Terang');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.textContent = '🌙'; // Icon Bulan untuk mode terang (klik untuk gelap)
            themeToggle.setAttribute('aria-label', 'Ganti ke Mode Gelap');
            themeToggle.setAttribute('title', 'Ganti ke Mode Gelap');
        }
    }

    // Cek preferensi tersimpan saat loading
    if (currentTheme === 'dark') {
        updateThemeButton('dark');
    } else {
        updateThemeButton('light'); // Default
    }
    
    // Event Klik Tombol Tema
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let newTheme = 'light';
            if (document.documentElement.getAttribute('data-theme') !== 'dark') {
                newTheme = 'dark';
            }
            updateThemeButton(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }


    // =========================================
    // 2. LOGIKA BAHASA (MANUAL CONTROL ONLY)
    // =========================================
    const langToggle = document.getElementById('lang-toggle');
    
    // Helper: Ambil Cookie Google
    function getCookie(name) {
        const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }

    // Helper: Set Cookie Global
    function setGoogleCookie(value) {
        document.cookie = "googtrans=" + value + "; path=/; domain=" + document.domain;
        document.cookie = "googtrans=" + value + "; path=/;";
    }

    const currentLang = getCookie('googtrans');
    
    if (langToggle) {
        // Cek status bahasa saat ini berdasarkan Cookie
        // Jika cookie mengandung '/en', berarti sedang bahasa Inggris
        if (currentLang && currentLang.includes('/en')) {
            langToggle.textContent = 'EN';
            langToggle.setAttribute('aria-label', 'Bahasa saat ini Inggris. Klik untuk ganti ke Indonesia');
        } else {
            // Default atau '/id'
            langToggle.textContent = 'ID';
            langToggle.setAttribute('aria-label', 'Bahasa saat ini Indonesia. Klik untuk ganti ke Inggris');
        }

        // Event Klik Tombol Bahasa
        langToggle.addEventListener('click', () => {
            const current = getCookie('googtrans');
            
            if (current && current.includes('/en')) {
                // Sedang Inggris -> Ganti ke Indonesia
                setGoogleCookie('/id/id'); 
            } else {
                // Sedang Indonesia (atau null) -> Ganti ke Inggris
                setGoogleCookie('/id/en'); 
            }
            
            // Reload halaman agar Google Translate memproses perubahan
            location.reload();
        });
    }


    // =========================================
    // 3. LOGIKA NAVIGASI & DROPDOWN (SMART DETECTION)
    // =========================================
    (function manageNavigation() {
        // Deteksi halaman aktif berdasarkan URL
        let currentPath = window.location.pathname.split('/').pop();
        if (currentPath === '') currentPath = 'index.html';
        
        // Selektor elemen (Gunakan 'try-catch' logic dengan pengecekan null)
        const navLinks = document.querySelectorAll('#nav-menu a');
        const toolsBtn = document.getElementById('tools-btn');
        const toolsList = document.getElementById('tools-list');
        let isToolActive = false;

        // A. Highlight Menu Aktif (Jika ada menu)
        if (navLinks.length > 0) {
            navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                
                // Bandingkan filename
                if (linkHref === currentPath) {
                    link.setAttribute('aria-current', 'page');
                    link.classList.add('active');
                    
                    // Cek apakah link ini ada di dalam dropdown?
                    if (toolsList && toolsList.contains(link)) {
                        isToolActive = true;
                    }
                } else {
                    link.removeAttribute('aria-current');
                    link.classList.remove('active');
                }
            });
        }

        // Jika salah satu tool dibuka, nyalakan induknya (Dropdown Button)
        if (isToolActive && toolsBtn) {
            toolsBtn.classList.add('active-parent');
        }

        // B. Logika Dropdown (Hanya jalan jika elemen dropdown ada)
        if (toolsBtn && toolsList) {
            
            function toggleMenu(event) {
                if (event) event.stopPropagation();
                
                const isExpanded = toolsBtn.getAttribute('aria-expanded') === 'true';
                if (isExpanded) closeMenu();
                else openMenu();
            }

            function openMenu() {
                toolsList.classList.add('show');
                toolsBtn.setAttribute('aria-expanded', 'true');
            }

            function closeMenu() {
                toolsList.classList.remove('show');
                toolsBtn.setAttribute('aria-expanded', 'false');
            }

            // Mouse Click
            toolsBtn.addEventListener('click', toggleMenu);

            // Keyboard Accessibility (Enter/Space)
            toolsBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); 
                    toggleMenu(e);
                }
            });

            // Close on Click Outside
            document.addEventListener('click', (e) => {
                if (!toolsBtn.contains(e.target) && !toolsList.contains(e.target)) {
                    closeMenu();
                }
            });

            // Close on Escape Key (WCAG Standard)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeMenu();
                    toolsBtn.focus(); // Kembalikan fokus ke tombol
                }
            });
        }
    })();

});


// =========================================
// 4. GOOGLE TRANSLATE LOADER (EXTERNAL)
// =========================================
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'id',
        includedLanguages: 'en,id', // Batasi hanya ID dan EN
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
};

(function loadGoogleScript() {
    // Cek dulu apakah elemen target ada agar tidak error di console
    if (document.getElementById('google_translate_element')) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
    }
})();
