// ============================================
// LMS Solution - Core JavaScript
// ============================================

// Role-based menu configuration with parent-child structure
const menuConfig = {
  admin: [
    { icon: '🏠', label: 'Home', href: 'landing.html' },
    { icon: '📊', label: 'Analytics', href: 'analytics.html' },
    { icon: '📚', label: 'Courses', href: 'courses.html' },
    { icon: '📖', label: 'Modules', href: 'contents.html' },
    { icon: '👥', label: 'Sessions', href: 'sessions.html' },
    { icon: '📄', label: 'Reports', href: 'reports.html' },
    { icon: '🔐', label: 'Roles', href: 'roles.html' },
    { icon: '🔑', label: 'Permissions', href: 'permissions.html' },
    { icon: '👤', label: 'Users', href: 'users.html' },
    { icon: '⚙️', label: 'Settings', href: 'admin-settings.html' },
    { icon: '🎓', label: 'Certificate Search', href: 'certificate-search.html' },
    { icon: '👤', label: 'Profile', href: 'profile.html' }
  ],
  headoffice: [
    { icon: '🏠', label: 'Home', href: 'landing.html' },
    { icon: '📊', label: 'Analytics', href: 'analytics.html' },
    { icon: '📚', label: 'Courses', href: 'courses.html' },
    { icon: '📖', label: 'Modules', href: 'contents.html' },
    { icon: '👥', label: 'Sessions', href: 'sessions.html' },
    { icon: '📄', label: 'Reports', href: 'reports.html' },
    { icon: '👤', label: 'Profile', href: 'profile.html' }
  ],
  territorymanager: [
    { icon: '🏠', label: 'Home', href: 'landing.html' },
    { icon: '📊', label: 'Analytics', href: 'analytics.html' },
    { icon: '📚', label: 'Courses', href: 'courses.html' },
    { icon: '📖', label: 'Modules', href: 'contents.html' },
    { icon: '👥', label: 'Sessions', href: 'sessions.html' },
    { icon: '📄', label: 'Reports', href: 'reports.html' },
    { icon: '👤', label: 'Profile', href: 'profile.html' }
  ],
  unitmanager: [
    { icon: '🏠', label: 'Home', href: 'landing.html' },
    { icon: '📊', label: 'Analytics', href: 'analytics.html' },
    { icon: '📚', label: 'Courses', href: 'courses.html' },
    { icon: '📖', label: 'Modules', href: 'contents.html' },
    { icon: '👥', label: 'Sessions', href: 'sessions.html' },
    { icon: '📄', label: 'Reports', href: 'reports.html' },
    { icon: '👤', label: 'Profile', href: 'profile.html' }
  ],
  ro: [
    { icon: '🏠', label: 'Home', href: 'landing.html' },
    { icon: '📊', label: 'Analytics', href: 'analytics.html' },
    { icon: '📚', label: 'Courses', href: 'courses.html' },
    { icon: '📖', label: 'Modules', href: 'contents.html' },
    { icon: '👥', label: 'Sessions', href: 'sessions.html' },
    { icon: '📄', label: 'Reports', href: 'reports.html' },
    { icon: '👤', label: 'Profile', href: 'profile.html' }
  ],
  beneficiary: [
    { icon: '🏠', label: 'Home', href: 'landing.html' },
    { icon: '📚', label: 'My Learning', href: 'contents.html' },
    { icon: '📊', label: 'My Progress', href: 'analytics.html' },
    { icon: '👤', label: 'Profile', href: 'profile.html' }
  ]
};

// Check authentication
function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn || isLoggedIn !== 'true') {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Get current user role
function getUserRole() {
  return localStorage.getItem('userRole') || 'beneficiary';
}

// Get user name
function getUserName() {
  return localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'User';
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.clear();
    window.location.href = 'login.html';
  }
}

// Render sidebar menu based on role
function renderSidebar() {
  const role = getUserRole();
  const menuItems = menuConfig[role] || menuConfig.beneficiary;
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const sidebarNav = document.getElementById('sidebarNav');
  if (!sidebarNav) return;

  sidebarNav.innerHTML = menuItems.map(item => {
    if (item.children) {
      // Parent menu with children
      const childrenHtml = item.children.map(child => `
        <a href="${child.href}" class="sidebar-link" style="padding-left: 3rem; font-size: var(--text-sm);">
          <span class="sidebar-icon">${child.icon}</span>
          <span class="sidebar-text">${child.label}</span>
        </a>
      `).join('');

      return `
        <div class="sidebar-parent">
          <div class="sidebar-link" onclick="toggleSubmenu(this)" style="cursor: pointer;">
            <span class="sidebar-icon">${item.icon}</span>
            <span class="sidebar-text">${item.label}</span>
            <span style="margin-left: auto;">▼</span>
          </div>
          <div class="sidebar-submenu" style="display: none;">
            ${childrenHtml}
          </div>
        </div>
      `;
    } else {
      // Regular menu item
      return `
        <a href="${item.href}" class="sidebar-link ${currentPage === item.href ? 'active' : ''}">
          <span class="sidebar-icon">${item.icon}</span>
          <span class="sidebar-text">${item.label}</span>
        </a>
      `;
    }
  }).join('');
}

// Toggle submenu
function toggleSubmenu(element) {
  const submenu = element.nextElementSibling;
  const arrow = element.querySelector('span:last-child');

  if (submenu.style.display === 'none') {
    submenu.style.display = 'block';
    arrow.textContent = '▲';
  } else {
    submenu.style.display = 'none';
    arrow.textContent = '▼';
  }
}

// Toggle sidebar on mobile
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.main-content');

  if (sidebar) {
    sidebar.classList.toggle('active');
  }

  if (mainContent) {
    mainContent.classList.toggle('sidebar-open');
  }
}

// Close sidebar when clicking outside on mobile
function setupSidebarClose() {
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');

    if (sidebar && menuToggle) {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        if (window.innerWidth < 1024) {
          sidebar.classList.remove('active');
        }
      }
    }
  });
}

// Initialize user info in navbar
function initUserInfo() {
  const userName = getUserName();
  const userRole = getUserRole();

  const userNameElement = document.getElementById('userName');
  const userRoleElement = document.getElementById('userRole');

  if (userNameElement) {
    userNameElement.textContent = userName.split('@')[0];
  }

  if (userRoleElement) {
    const roleLabels = {
      admin: 'Administrator',
      headoffice: 'Head Office',
      territorymanager: 'Territory Manager',
      unitmanager: 'Unit Manager',
      ro: 'Regional Officer',
      beneficiary: 'Beneficiary'
    };
    userRoleElement.textContent = roleLabels[userRole] || 'User';
  }
}

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal when clicking backdrop
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Form validation helper
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;

  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('error');

      // Remove error class on input
      input.addEventListener('input', () => {
        input.classList.remove('error');
      }, { once: true });
    }
  });

  if (!isValid) {
    alert('Please fill in all required fields');
  }

  return isValid;
}

// Format date helper
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format number helper
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

// Calculate progress percentage
function calculateProgress(completed, total) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// Demo data for charts and tables
const demoData = {
  modules: [
    {
      id: 1,
      title: 'Introduction to Financial Literacy',
      description: 'Understanding basic financial concepts and their importance in daily life',
      duration: '45 min',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'images/module1.jpg',
      type: 'Video Lesson',
      completed: false
    },
    {
      id: 2,
      title: 'Budgeting and Saving',
      description: 'Learn how to create a budget and develop effective saving habits',
      duration: '50 min',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'images/module2.jpg',
      type: 'Video Lesson',
      completed: false
    },
    {
      id: 3,
      title: 'Banking Services and Digital Payments',
      description: 'Explore banking services and how to use digital payment platforms safely',
      duration: '55 min',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'images/module3.jpg',
      type: 'Video Lesson',
      completed: false
    },
    {
      id: 4,
      title: 'Remittance Management',
      description: 'Best practices for sending and receiving remittances efficiently',
      duration: '40 min',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'images/module4.jpg',
      type: 'Video Lesson',
      completed: false
    },
    {
      id: 5,
      title: 'Investment and Insurance',
      description: 'Understanding investment options and the importance of insurance',
      duration: '60 min',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'images/module5.jpg',
      type: 'Video Lesson',
      completed: false
    }
  ],

  sessions: [
    {
      id: 1,
      name: 'Financial Literacy Workshop - Dhaka',
      date: '2026-01-10',
      district: 'Dhaka',
      upazila: 'Savar',
      union: 'Ashulia',
      unitOffice: 'Dhaka Central',
      participants: 45,
      male: 20,
      female: 25,
      unitManager: 'Karim Rahman',
      status: 'Completed'
    },
    {
      id: 2,
      name: 'Digital Banking Training - Chittagong',
      date: '2026-01-08',
      district: 'Chittagong',
      upazila: 'Rangunia',
      union: 'Betagi',
      unitOffice: 'Chittagong South',
      participants: 38,
      male: 18,
      female: 20,
      unitManager: 'Fatima Begum',
      status: 'Completed'
    }
  ],

  districts: ['Chattogram', 'Feni', 'Cumilla', 'Munshiganj', 'Narsingdi', 'Tangail'],

  upazilas: {
    'Chattogram': ['Anwara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari', 'Hathazari', 'Lohagara', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda'],
    'Feni': ['Chhagalnaiya', 'Daganbhuiyan', 'Feni Sadar', 'Fulgazi', 'Parshuram', 'Sonagazi'],
    'Cumilla': ['Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Cumilla Sadar', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Meghna', 'Muradnagar', 'Nangalkot', 'Titas'],
    'Munshiganj': ['Gazaria', 'Lohajang', 'Munshiganj Sadar', 'Sirajdikhan', 'Sreenagar', 'Tongibari'],
    'Narsingdi': ['Belabo', 'Monohardi', 'Narsingdi Sadar', 'Palash', 'Raipura', 'Shibpur'],
    'Tangail': ['Basail', 'Bhuapur', 'Delduar', 'Dhanbari', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur', 'Tangail Sadar']
  }
};

// Get module progress from localStorage
function getModuleProgress() {
  const progress = localStorage.getItem('moduleProgress');
  return progress ? JSON.parse(progress) : {};
}

// Save module progress
function saveModuleProgress(moduleId, completed) {
  const progress = getModuleProgress();
  progress[moduleId] = completed;
  localStorage.setItem('moduleProgress', JSON.stringify(progress));
}

// Check if all modules completed
function allModulesCompleted() {
  const progress = getModuleProgress();
  return demoData.modules.every(module => progress[module.id] === true);
}

// Initialize page
function initPage() {
  // Check authentication
  if (!checkAuth()) return;

  // Initialize UI components
  renderSidebar();
  initUserInfo();
  setupSidebarClose();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
