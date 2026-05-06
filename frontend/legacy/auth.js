// auth.js
(function () {
    // 1. Check for valid session
    let savedUserStr = localStorage.getItem('clearerp_user');

    // DEV FALLBACK: auto-inject Super Admin when no session exists
    if (!savedUserStr) {
        const isLoginPage = window.location.href.includes('login.html');
        if (isLoginPage) return;

        const devUser = {
            username: 'superadmin',
            role: 'Super Admin',
            fullName: 'Super Administrator',
            email: 'admin@businesscentral.com',
            roles: ['Super Admin'],
            businesses: ['All Entities']
        };
        localStorage.setItem('clearerp_user', JSON.stringify(devUser));
        savedUserStr = JSON.stringify(devUser);
    }

    const currentUser = JSON.parse(savedUserStr);
    const isSuperAdmin = currentUser.role === 'Super Admin' || currentUser.role === 'superadmin';

    // 2. Export globals
    window.currentUser = currentUser;
    window.isSuperAdmin = isSuperAdmin;
    window.activeCompanyId = isSuperAdmin ? 'all' : (currentUser.businessId || 'c1');

    // 3. DOM setup
    document.addEventListener('DOMContentLoaded', () => {

        // Sidebar brand small text
        const sidebarBrandSmall = document.querySelector('.sidebar-brand-text small');
        if (sidebarBrandSmall) {
            sidebarBrandSmall.textContent = isSuperAdmin ? 'Super Admin' : 'Company Admin';
        }

        // Role badge in topbar
        const roleBadge = document.getElementById('roleBadge');
        if (roleBadge) {
            roleBadge.textContent = isSuperAdmin ? 'Super Admin' : 'Company Admin';
            roleBadge.className = 'role-badge ' + (isSuperAdmin ? 'superadmin' : 'company-admin');
        }

        // Restrict non-super-admin access
        if (!isSuperAdmin) {
            const companySwitcher = document.getElementById('companySwitcherWrap');
            if (companySwitcher) companySwitcher.style.display = 'none';

            document.querySelectorAll('.nav-link').forEach(link => {
                const href = link.getAttribute('href');
                if (href === 'user_management.html' || href === 'system_access.html') {
                    link.parentElement.style.display = 'none';
                }
            });

            const currentPath = window.location.pathname.split('/').pop() || '';
            if (currentPath === 'user_management.html' || currentPath === 'system_access.html') {
                window.location.href = 'dashboard.html';
            }
        }

        // Logout button in sidebar
        const navList = document.querySelector('.sidebar-nav-list');
        if (navList) {
            const logoutLi = document.createElement('li');
            logoutLi.style.marginTop = '10px';
            logoutLi.innerHTML = '<a href="#" onclick="logout(); return false;" class="nav-link"><i class="fas fa-sign-out-alt nav-icon text-danger"></i><span class="nav-label text-danger fw-bold">Logout</span></a>';
            navList.appendChild(logoutLi);
        }

        // Profile avatar button in topbar
        const initials = getInitials(currentUser.fullName || currentUser.username || 'U');
        const avatarBtn = document.createElement('button');
        avatarBtn.id = 'profileAvatarBtn';
        avatarBtn.title = 'My Profile';
        avatarBtn.onclick = openProfileDrawer;
        avatarBtn.style.cssText = 'width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;border:2px solid #e2e8f0;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:box-shadow .2s;outline:none;';
        avatarBtn.textContent = initials;
        avatarBtn.addEventListener('mouseenter', () => { avatarBtn.style.boxShadow = '0 0 0 3px rgba(79,70,229,.25)'; });
        avatarBtn.addEventListener('mouseleave', () => { avatarBtn.style.boxShadow = ''; });

        // Restore saved photo if any
        if (currentUser.photo) {
            avatarBtn.textContent = '';
            const img = document.createElement('img');
            img.src = currentUser.photo;
            img.style.cssText = 'width:100%;height:100%;border-radius:50%;object-fit:cover;';
            avatarBtn.appendChild(img);
        }

        const topbarRight = document.querySelector('.topbar-right');
        if (topbarRight) {
            topbarRight.appendChild(avatarBtn);
        } else {
            const topbar = document.querySelector('.topbar');
            if (topbar) {
                topbar.style.position = 'relative';
                avatarBtn.style.cssText += 'position:absolute;right:16px;top:50%;transform:translateY(-50%);';
                topbar.appendChild(avatarBtn);
            }
        }

        // Build and inject the drawer
        injectProfileDrawer();
    });

    // ── Helpers ───────────────────────────────────────────────────────────────

    function getInitials(name) {
        return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join('');
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function formatList(arr) {
        if (!arr || !arr.length) return '—';
        return arr.join(', ');
    }

    // ── Drawer injection ──────────────────────────────────────────────────────

    function injectProfileDrawer() {
        const user = currentUser;
        const initials = getInitials(user.fullName || user.username || 'U');
        const roleBadgeClass = isSuperAdmin ? 'superadmin' : 'company-admin';
        const roleLabel = isSuperAdmin ? 'Super Admin' : 'Company Admin';
        const avatarSrc = user.photo || '';

        // ── Styles ──
        const style = document.createElement('style');
        style.textContent = `
            #pdOverlay {
                position:fixed;inset:0;background:rgba(0,0,0,.4);
                z-index:2000;opacity:0;pointer-events:none;
                transition:opacity .3s ease;
            }
            #pdOverlay.open { opacity:1;pointer-events:all; }

            #pdDrawer {
                position:fixed;top:0;right:0;height:100vh;
                width:360px;max-width:96vw;
                background:#fff;z-index:2001;
                box-shadow:-6px 0 40px rgba(0,0,0,.18);
                display:flex;flex-direction:column;
                transform:translateX(100%);
                transition:transform .32s cubic-bezier(.4,0,.2,1);
                font-family:'Inter',system-ui,sans-serif;
            }
            #pdDrawer.open { transform:translateX(0); }

            /* Header */
            .pd-hd {
                background:linear-gradient(135deg,#2c3e50 0%,#34495e 100%);
                padding:24px 20px 18px;
                display:flex;flex-direction:column;align-items:center;
                gap:8px;position:relative;flex-shrink:0;
            }
            .pd-x {
                position:absolute;top:12px;right:12px;
                background:rgba(255,255,255,.15);border:none;color:#fff;
                width:28px;height:28px;border-radius:50%;cursor:pointer;
                font-size:12px;display:flex;align-items:center;justify-content:center;
                transition:background .2s;
            }
            .pd-x:hover { background:rgba(255,255,255,.3); }

            .pd-av {
                width:68px;height:68px;border-radius:50%;
                background:linear-gradient(135deg,#4f46e5,#7c3aed);
                color:#fff;font-size:24px;font-weight:700;
                display:flex;align-items:center;justify-content:center;
                border:3px solid rgba(255,255,255,.25);
                position:relative;cursor:pointer;overflow:hidden;
                flex-shrink:0;
            }
            .pd-av img { width:100%;height:100%;object-fit:cover; }
            .pd-av-cam {
                position:absolute;bottom:0;right:0;
                width:22px;height:22px;border-radius:50%;
                background:#4f46e5;color:#fff;font-size:9px;
                display:flex;align-items:center;justify-content:center;
                border:2px solid #fff;
            }
            .pd-name { color:#fff;font-size:16px;font-weight:700;margin:0;text-align:center; }
            .pd-uname { color:rgba(255,255,255,.6);font-size:12px;margin:0; }
            .pd-rbadge {
                padding:3px 12px;border-radius:30px;font-size:11px;font-weight:600;
            }
            .pd-rbadge.superadmin { background:#ecfdf5;color:#059669;border:1px solid #b7f4d8; }
            .pd-rbadge.company-admin { background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe; }

            /* Body */
            .pd-body {
                flex:1;overflow-y:auto;padding:16px 16px 8px;
            }
            .pd-body::-webkit-scrollbar { width:4px; }
            .pd-body::-webkit-scrollbar-thumb { background:#cbd5e1;border-radius:2px; }

            .pd-sec {
                font-size:10px;font-weight:700;text-transform:uppercase;
                letter-spacing:.06em;color:#94a3b8;margin:14px 0 7px;
            }
            .pd-sec:first-child { margin-top:0; }

            .pd-row {
                display:flex;align-items:flex-start;gap:10px;
                padding:9px 12px;border-radius:8px;
                background:#f8fafc;border:1px solid #e2e8f0;
                margin-bottom:6px;
            }
            .pd-ico {
                width:28px;height:28px;border-radius:7px;
                display:flex;align-items:center;justify-content:center;
                font-size:12px;color:#fff;flex-shrink:0;margin-top:1px;
            }
            .pd-lbl { font-size:10px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.04em; }
            .pd-val { font-size:13px;color:#1e293b;font-weight:500;line-height:1.4; }

            /* Edit fields */
            .pd-field {
                width:100%;padding:8px 10px;font-size:13px;
                border:1px solid #e2e8f0;border-radius:7px;
                outline:none;font-family:inherit;color:#1e293b;
                background:#f8fafc;transition:border-color .2s;
                margin-bottom:6px;box-sizing:border-box;
            }
            .pd-field:focus { border-color:#4f46e5;background:#fff; }

            .pd-pw-wrap { display:flex;gap:6px;align-items:center;margin-bottom:6px; }
            .pd-pw-wrap .pd-field { margin-bottom:0;flex:1; }
            .pd-eye {
                background:none;border:none;color:#94a3b8;
                cursor:pointer;padding:4px 6px;font-size:13px;flex-shrink:0;
            }
            .pd-eye:hover { color:#4f46e5; }

            /* Footer actions */
            .pd-foot {
                padding:12px 16px;border-top:1px solid #e2e8f0;
                display:flex;flex-direction:column;gap:7px;flex-shrink:0;
            }
            .pd-btn {
                width:100%;padding:9px 14px;border-radius:8px;
                font-size:13px;font-weight:600;cursor:pointer;border:none;
                display:flex;align-items:center;justify-content:center;
                gap:8px;transition:all .2s;
            }
            .pd-btn-primary { background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff; }
            .pd-btn-primary:hover { opacity:.88; }
            .pd-btn-ghost { background:#fff;color:#64748b;border:1px solid #e2e8f0; }
            .pd-btn-ghost:hover { background:#f8fafc;color:#1e293b; }
            .pd-btn-danger { background:#fef2f2;color:#ef4444;border:1px solid #fecaca; }
            .pd-btn-danger:hover { background:#fee2e2; }

            /* Toast */
            .pd-toast {
                position:fixed;bottom:22px;right:22px;
                background:#1e293b;color:#fff;padding:9px 16px;
                border-radius:8px;font-size:13px;font-weight:500;
                z-index:3000;opacity:0;transform:translateY(8px);
                transition:all .3s;pointer-events:none;
                font-family:'Inter',system-ui,sans-serif;
            }
            .pd-toast.show { opacity:1;transform:translateY(0); }

            #pdPhotoInput { display:none; }
        `;
        document.head.appendChild(style);

        // ── Overlay ──
        const overlay = document.createElement('div');
        overlay.id = 'pdOverlay';
        overlay.onclick = closeProfileDrawer;

        // ── Drawer ──
        const drawer = document.createElement('div');
        drawer.id = 'pdDrawer';
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-modal', 'true');
        drawer.setAttribute('aria-label', 'My Profile');

        const rolesDisplay  = formatList(user.roles);
        const bizDisplay    = formatList(user.businesses);

        drawer.innerHTML = `
            <!-- Header -->
            <div class="pd-hd">
                <button class="pd-x" onclick="closeProfileDrawer()" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="pd-av" id="pdAvCircle"
                     onclick="document.getElementById('pdPhotoInput').click()"
                     title="Change photo">
                    ${avatarSrc
                        ? `<img src="${escapeHtml(avatarSrc)}" alt="Profile photo">`
                        : `<span id="pdAvInitials">${initials}</span>`}
                    <div class="pd-av-cam"><i class="fas fa-camera"></i></div>
                </div>
                <input type="file" id="pdPhotoInput" accept="image/*"
                       onchange="handleProfilePhoto(event)">
                <p class="pd-name" id="pdHdName">${escapeHtml(user.fullName || user.username || 'User')}</p>
                <p class="pd-uname">@${escapeHtml(user.username || 'user')}</p>
                <span class="pd-rbadge ${roleBadgeClass}">${roleLabel}</span>
            </div>

            <!-- Body -->
            <div class="pd-body">

                <!-- ── VIEW MODE ── -->
                <div id="pdView">
                    <div class="pd-sec">Account Details</div>

                    <div class="pd-row">
                        <div class="pd-ico" style="background:linear-gradient(135deg,#3b82f6,#2563eb)">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <div class="pd-lbl">Full Name</div>
                            <div class="pd-val" id="vFullName">${escapeHtml(user.fullName || '—')}</div>
                        </div>
                    </div>

                    <div class="pd-row">
                        <div class="pd-ico" style="background:linear-gradient(135deg,#10b981,#059669)">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div>
                            <div class="pd-lbl">Email Address</div>
                            <div class="pd-val" id="vEmail">${escapeHtml(user.email || '—')}</div>
                        </div>
                    </div>

                    <div class="pd-row">
                        <div class="pd-ico" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed)">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div>
                            <div class="pd-lbl">Assigned Roles</div>
                            <div class="pd-val" id="vRoles">${escapeHtml(rolesDisplay)}</div>
                        </div>
                    </div>

                    <div class="pd-row">
                        <div class="pd-ico" style="background:linear-gradient(135deg,#f59e0b,#d97706)">
                            <i class="fas fa-building"></i>
                        </div>
                        <div>
                            <div class="pd-lbl">Assigned Businesses</div>
                            <div class="pd-val" id="vBiz">${escapeHtml(bizDisplay)}</div>
                        </div>
                    </div>

                    <div class="pd-row">
                        <div class="pd-ico" style="background:linear-gradient(135deg,#ef4444,#dc2626)">
                            <i class="fas fa-lock"></i>
                        </div>
                        <div>
                            <div class="pd-lbl">Password</div>
                            <div class="pd-val">••••••••</div>
                        </div>
                    </div>
                </div>

                <!-- ── EDIT MODE ── -->
                <div id="pdEdit" style="display:none">
                    <div class="pd-sec">Edit Details</div>

                    <input class="pd-field" id="eFullName" type="text"
                           placeholder="Full Name"
                           value="${escapeHtml(user.fullName || '')}">

                    <input class="pd-field" id="eEmail" type="email"
                           placeholder="Email Address"
                           value="${escapeHtml(user.email || '')}">

                    <input class="pd-field" id="eRoles" type="text"
                           placeholder="Assigned Roles (comma-separated)"
                           value="${escapeHtml((user.roles || []).join(', '))}">

                    <input class="pd-field" id="eBiz" type="text"
                           placeholder="Assigned Businesses (comma-separated)"
                           value="${escapeHtml((user.businesses || []).join(', '))}">

                    <div class="pd-sec">Change Password</div>

                    <div class="pd-pw-wrap">
                        <input class="pd-field" id="ePwNew" type="password"
                               placeholder="New Password">
                        <button class="pd-eye" onclick="pdToggleEye('ePwNew')"
                                aria-label="Show/hide password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="pd-pw-wrap">
                        <input class="pd-field" id="ePwConfirm" type="password"
                               placeholder="Confirm New Password">
                        <button class="pd-eye" onclick="pdToggleEye('ePwConfirm')"
                                aria-label="Show/hide password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

            </div><!-- /pd-body -->

            <!-- Footer -->
            <div class="pd-foot">
                <div id="pdFootView">
                    <button class="pd-btn pd-btn-primary" onclick="pdSwitchEdit()">
                        <i class="fas fa-pen"></i> Edit Profile
                    </button>
                    <button class="pd-btn pd-btn-danger" style="margin-top:7px"
                            onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> Sign Out
                    </button>
                </div>
                <div id="pdFootEdit" style="display:none">
                    <button class="pd-btn pd-btn-primary" onclick="pdSaveChanges()">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                    <button class="pd-btn pd-btn-ghost" style="margin-top:7px"
                            onclick="pdSwitchView()">
                        Cancel
                    </button>
                </div>
            </div>

            <div class="pd-toast" id="pdToast"></div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(drawer);

        // Close on Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeProfileDrawer();
        });
    }

    // ── Public API ────────────────────────────────────────────────────────────

    window.openProfileDrawer = function () {
        document.getElementById('pdOverlay').classList.add('open');
        document.getElementById('pdDrawer').classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    window.closeProfileDrawer = function () {
        document.getElementById('pdOverlay').classList.remove('open');
        document.getElementById('pdDrawer').classList.remove('open');
        document.body.style.overflow = '';
        pdSwitchView();
    };

    window.pdSwitchEdit = function () {
        document.getElementById('pdView').style.display = 'none';
        document.getElementById('pdEdit').style.display = 'block';
        document.getElementById('pdFootView').style.display = 'none';
        document.getElementById('pdFootEdit').style.display = 'block';
    };

    window.pdSwitchView = function () {
        const pdView = document.getElementById('pdView');
        const pdEdit = document.getElementById('pdEdit');
        if (!pdView) return;
        pdView.style.display = 'block';
        pdEdit.style.display = 'none';
        document.getElementById('pdFootView').style.display = 'block';
        document.getElementById('pdFootEdit').style.display = 'none';
    };

    window.pdSaveChanges = function () {
        const fullName = document.getElementById('eFullName').value.trim();
        const email    = document.getElementById('eEmail').value.trim();
        const rolesRaw = document.getElementById('eRoles').value.trim();
        const bizRaw   = document.getElementById('eBiz').value.trim();
        const pwNew    = document.getElementById('ePwNew').value;
        const pwConf   = document.getElementById('ePwConfirm').value;

        if (pwNew && pwNew !== pwConf) {
            pdToast('Passwords do not match.', true);
            return;
        }

        // Update in-memory user
        if (fullName)   currentUser.fullName   = fullName;
        if (email)      currentUser.email      = email;
        if (rolesRaw)   currentUser.roles      = rolesRaw.split(',').map(s => s.trim()).filter(Boolean);
        if (bizRaw)     currentUser.businesses = bizRaw.split(',').map(s => s.trim()).filter(Boolean);

        // Persist
        localStorage.setItem('clearerp_user', JSON.stringify(currentUser));

        // Refresh view values
        document.getElementById('pdHdName').textContent  = currentUser.fullName || currentUser.username;
        document.getElementById('vFullName').textContent = currentUser.fullName || '—';
        document.getElementById('vEmail').textContent    = currentUser.email    || '—';
        document.getElementById('vRoles').textContent    = formatList(currentUser.roles);
        document.getElementById('vBiz').textContent      = formatList(currentUser.businesses);

        // Refresh topbar avatar initials
        const avatarBtn = document.getElementById('profileAvatarBtn');
        if (avatarBtn && !avatarBtn.querySelector('img')) {
            avatarBtn.textContent = getInitials(currentUser.fullName || currentUser.username || 'U');
        }
        const avInitials = document.getElementById('pdAvInitials');
        if (avInitials) {
            avInitials.textContent = getInitials(currentUser.fullName || currentUser.username || 'U');
        }

        // Clear password fields
        document.getElementById('ePwNew').value     = '';
        document.getElementById('ePwConfirm').value = '';

        pdSwitchView();
        pdToast('Profile updated successfully.');
    };

    window.handleProfilePhoto = function (event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            const src = e.target.result;

            // Update drawer avatar
            const circle = document.getElementById('pdAvCircle');
            circle.innerHTML = `<img src="${src}" alt="Profile photo"><div class="pd-av-cam"><i class="fas fa-camera"></i></div>`;
            circle.onclick = () => document.getElementById('pdPhotoInput').click();

            // Update topbar avatar
            const avatarBtn = document.getElementById('profileAvatarBtn');
            if (avatarBtn) {
                avatarBtn.innerHTML = '';
                const img = document.createElement('img');
                img.src = src;
                img.style.cssText = 'width:100%;height:100%;border-radius:50%;object-fit:cover;';
                avatarBtn.appendChild(img);
            }

            currentUser.photo = src;
            localStorage.setItem('clearerp_user', JSON.stringify(currentUser));
            pdToast('Profile photo updated.');
        };
        reader.readAsDataURL(file);
    };

    window.pdToggleEye = function (fieldId) {
        const f = document.getElementById(fieldId);
        if (f) f.type = f.type === 'password' ? 'text' : 'password';
    };

    function pdToast(msg, isError) {
        const t = document.getElementById('pdToast');
        if (!t) return;
        t.textContent = msg;
        t.style.background = isError ? '#ef4444' : '#1e293b';
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    }

    // 4. Logout
    window.logout = function () {
        localStorage.removeItem('clearerp_user');
        window.location.href = 'login.html';
    };
})();
