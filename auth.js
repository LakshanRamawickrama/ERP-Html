// auth.js
(function() {
    // 1. Check for valid session
    let savedUserStr = localStorage.getItem('clearerp_user');

    // DEV FALLBACK: if opening files directly (file:// or no session), auto-inject Super Admin
    if (!savedUserStr) {
        const isLoginPage = window.location.href.includes('login.html');
        if (isLoginPage) return;

        // Auto-seed a Super Admin session so pages work without logging in during development
        const devUser = { username: 'superadmin', role: 'Super Admin', fullName: 'Super Administrator' };
        localStorage.setItem('clearerp_user', JSON.stringify(devUser));
        savedUserStr = JSON.stringify(devUser);
    }

    const currentUser = JSON.parse(savedUserStr);
    const isSuperAdmin = currentUser.role === 'Super Admin' || currentUser.role === 'superadmin';

    // 2. Export global variables for pages to use
    window.currentUser = currentUser;
    window.isSuperAdmin = isSuperAdmin;
    window.activeCompanyId = isSuperAdmin ? 'all' : (currentUser.businessId || 'c1');

    // 3. Set UI elements on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        // Update sidebar role text
        const sidebarBrandSmall = document.querySelector('.sidebar-brand-text small');
        if (sidebarBrandSmall) {
            sidebarBrandSmall.textContent = isSuperAdmin ? 'Super Admin' : 'Company Admin';
        }

        const roleBadge = document.getElementById('roleBadge');
        if (roleBadge) {
            roleBadge.textContent = isSuperAdmin ? 'Super Admin' : 'Company Admin';
            roleBadge.className = 'role-badge ' + (isSuperAdmin ? 'superadmin' : 'company-admin');
        }

        // Hide specific elements for regular Admin
        if (!isSuperAdmin) {
            const companySwitcher = document.getElementById('companySwitcherWrap');
            if (companySwitcher) {
                companySwitcher.style.display = 'none';
            }
            
            // Hide menu items that are super-admin only
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === 'user_management.html' || href === 'system_access.html') {
                    link.parentElement.style.display = 'none';
                }
            });

            // If a company admin tries to access a super-admin page directly, redirect to dashboard
            const currentPath = window.location.pathname.split('/').pop() || '';
            if (currentPath === 'user_management.html' || currentPath === 'system_access.html') {
                window.location.href = 'dashboard.html';
            }
        }

        // Add Logout button to the sidebar automatically
        const navList = document.querySelector('.sidebar-nav-list');
        if (navList) {
            const logoutLi = document.createElement('li');
            logoutLi.style.marginTop = '10px';
            logoutLi.innerHTML = '<a href="#" onclick="logout(); return false;" class="nav-link"><i class="fas fa-sign-out-alt nav-icon text-danger"></i><span class="nav-label text-danger fw-bold">Logout</span></a>';
            navList.appendChild(logoutLi);
        }
    });

    // 4. Global logout function
    window.logout = function() {
        localStorage.removeItem('clearerp_user');
        window.location.href = 'login.html';
    };
})();
