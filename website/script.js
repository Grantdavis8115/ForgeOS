const accountForm = document.getElementById('account-form');
const accountFormEyebrow = document.getElementById('account-form-eyebrow');
const accountFormTitle = document.getElementById('account-form-title');
const accountSubmit = document.getElementById('account-submit');
const nameField = document.getElementById('name-field');
const registerTab = document.getElementById('register-tab');
const loginTab = document.getElementById('login-tab');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const previewThumbs = document.querySelectorAll('.preview-thumb');
const previewPanel = document.getElementById('preview-panel');
const packageSearch = document.getElementById('package-search');
const filterChips = document.querySelectorAll('.filter-chip');
const packageCards = document.querySelectorAll('.package-card');
const installButtons = document.querySelectorAll('.install-btn');
const docLinks = document.querySelectorAll('.doc-link');
const docContent = document.getElementById('doc-content');
const galleryItems = document.querySelectorAll('.gallery-item');
let activePackageCategory = 'all';
const animatedSections = document.querySelectorAll('.animate-on-scroll');
const accountWelcome = document.getElementById('account-welcome');
const accountUsername = document.getElementById('account-username');
const existingUsers = JSON.parse(localStorage.getItem('forgeUsers') || '[]');
let currentMode = 'register';

const docs = {
  installation: {
    title: 'Install ForgeOS',
    content: `
      <p>
        Download the latest ForgeOS image, verify the SHA256 checksum, and follow the guided installation steps for desktop and virtual machines.
      </p>
      <h3>Minimum requirements</h3>
      <ul>
        <li>4 GB RAM</li>
        <li>20 GB storage</li>
        <li>UEFI or legacy boot support</li>
      </ul>
      <h3>Getting ready</h3>
      <p>Create a bootable USB, back up your files, and choose the ForgeOS stable image for the most polished experience.</p>
    `,
  },
  'getting-started': {
    title: 'Getting Started',
    content: `
      <p>Set up ForgeOS, create your first user, and explore the desktop, package manager, and system settings.</p>
    `,
  },
  updates: {
    title: 'Updates',
    content: `
      <p>Keep ForgeOS fresh with release updates and automatic security patches.</p>
    `,
  },
  terminal: {
    title: 'Terminal',
    content: `
      <p>Learn terminal commands, shell customization, and developer workflows.</p>
    `,
  },
  'package-manager': {
    title: 'Package Manager',
    content: `
      <p>Install apps, manage versions, and search Forge packages from a polished storefront.</p>
    `,
  },
  networking: {
    title: 'Networking',
    content: `
      <p>Configure Wi-Fi, wired connections, and secure remote access with ForgeOS networking tools.</p>
    `,
  },
  customization: {
    title: 'Customization',
    content: `
      <p>Personalize your desktop experience with themes, wallpapers, and UI settings.</p>
    `,
  },
  troubleshooting: {
    title: 'Troubleshooting',
    content: `
      <p>Resolve installation issues, recover from boot errors, and get help fast.</p>
    `,
  },
};

const previewImages = ['Desktop', 'Applications', 'Settings', 'Terminal', 'Package Manager', 'File Manager'];

function updatePreview(name) {
  previewThumbs.forEach((button) => button.classList.toggle('active', button.dataset.image === name));
  previewPanel.setAttribute('aria-label', `${name} preview screenshot`);
}
previewThumbs.forEach((button) => {
  button.addEventListener('click', () => updatePreview(button.dataset.image));
});

function filterPackages() {
  const query = packageSearch?.value.toLowerCase() || '';
  packageCards.forEach((card) => {
    const name = card.querySelector('h3')?.textContent?.toLowerCase() || '';
    const description = card.querySelector('p')?.textContent?.toLowerCase() || '';
    const matchesSearch = query.length === 0 || name.includes(query) || description.includes(query);
    const matchesCategory = activePackageCategory === 'all' || card.dataset.category === activePackageCategory;
    card.style.display = matchesSearch && matchesCategory ? 'grid' : 'none';
  });
}

filterChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    filterChips.forEach((item) => item.classList.toggle('active', item === chip));
    activePackageCategory = chip.dataset.category;
    filterPackages();
  });
});

packageSearch?.addEventListener('input', filterPackages);

function setDocument(article) {
  docLinks.forEach((link) => {
    const active = link.dataset.article === article;
    link.classList.toggle('active', active);
  });
  const doc = docs[article] || docs.installation;
  docContent.innerHTML = `
    <p class="eyebrow">${doc.title}</p>
    <h2>${doc.title}</h2>
    ${doc.content}
  `;
}

docLinks.forEach((link) => {
  link.addEventListener('click', () => setDocument(link.dataset.article));
});

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    // Gallery items remain interactive without a modal.
  });
});

installButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.package-card');
    const status = card?.querySelector('.runtime-status');
    button.textContent = 'Running';
    button.classList.add('installed');
    button.disabled = true;
    if (status) {
      status.textContent = 'Live';
    }
  });
});

function showAccountWelcome(name) {
  accountWelcome?.removeAttribute('hidden');
  accountUsername.textContent = name;
}

function updateAccountMode(mode) {
  currentMode = mode;
  const isRegister = mode === 'register';
  registerTab?.classList.toggle('active', isRegister);
  loginTab?.classList.toggle('active', !isRegister);
  accountFormEyebrow.textContent = isRegister ? 'Create your Forge Account' : 'Welcome back to Forge';
  accountFormTitle.textContent = isRegister ? 'Sign up for Forge Account' : 'Log in to your Forge Account';
  accountSubmit.textContent = isRegister ? 'Create account' : 'Log in';
  nameField.style.display = isRegister ? 'grid' : 'none';
}

registerTab?.addEventListener('click', () => updateAccountMode('register'));
loginTab?.addEventListener('click', () => updateAccountMode('login'));

accountForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(accountForm);
  const name = formData.get('fullName')?.toString().trim() || 'Forge User';
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString().trim();

  if (!email || !password) {
    return;
  }

  if (currentMode === 'register') {
    const users = JSON.parse(localStorage.getItem('forgeUsers') || '[]');
    users.push({ name, email, password });
    localStorage.setItem('forgeUsers', JSON.stringify(users));
    showAccountWelcome(name);
    accountForm.querySelectorAll('input, button').forEach((el) => (el.disabled = true));
  } else {
    const users = JSON.parse(localStorage.getItem('forgeUsers') || '[]');
    const matchedUser = users.find((user) => user.email === email && user.password === password);
    if (matchedUser) {
      showAccountWelcome(matchedUser.name || email);
      accountForm.querySelectorAll('input, button').forEach((el) => (el.disabled = true));
    } else {
      accountForm.querySelector('.form-footnote').textContent = 'No matching Forge account found. Please check your email and password or create a new account.';
    }
  }
});

updateAccountMode('register');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

animatedSections.forEach((section) => observer.observe(section));

updatePreview(previewImages[0]);
setDocument('installation');

loginBtn?.addEventListener('click', () => {
  window.location.hash = '#account';
});

logoutBtn?.addEventListener('click', () => {
  window.location.hash = '#home';
});
