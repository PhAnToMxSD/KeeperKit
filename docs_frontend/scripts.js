const PAGE_FLOW = {
  'index.html': { label: 'Get Started', href: 'getting-started.html' },
  'protocol.html': { label: 'Getting Started', href: 'getting-started.html' },
  'getting-started.html': { label: 'SDK Surface', href: 'sdk.html' },
  'sdk.html': { label: 'Workflows', href: 'workflows.html' },
  'workflows.html': { label: 'Executions', href: 'executions.html' },
  'executions.html': { label: 'Direct Execute', href: 'direct-execute.html' },
  'direct-execute.html': { label: 'Ecosystem', href: 'ecosystem.html' },
  'ecosystem.html': { label: 'Troubleshooting', href: 'troubleshooting.html' },
  'troubleshooting.html': { label: 'Overview', href: 'index.html' },
};

function showToast(message) {
  let toast = document.querySelector('[data-toast]');

  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('data-toast', '');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove('hidden');

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.add('hidden');
  }, 1600);
}

function setActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.body.dataset.docPage = current.replace(/\.html$/, '');
  const nextPage = PAGE_FLOW[current];
  const cta = document.querySelector('.topbar-cta');
  if (cta && nextPage) {
    cta.textContent = nextPage.label;
    cta.setAttribute('href', nextPage.href);
  }

  document.querySelectorAll('[data-nav-link], .topbar-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.split('/').pop() === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  renderPageNav(nextPage);
}

function renderPageNav(nextPage) {
  if (!nextPage) {
    return;
  }

  const page = document.querySelector('.page');
  const footer = document.querySelector('.footer');

  if (!page) {
    return;
  }

  const existing = document.querySelector('.page-nav');
  if (existing) {
    existing.remove();
  }

  const nav = document.createElement('section');
  nav.className = 'section page-nav';
  nav.setAttribute('aria-label', 'Next page navigation');
  nav.innerHTML = `
    <div class="section-head">
      <div>
        <div class="mini-kicker">Next page</div>
        <h2>Continue to ${nextPage.label}</h2>
        <p class="subtitle">Keep moving through the docs with the next recommended page.</p>
      </div>
    </div>
    <div class="actions">
      <a class="button primary" href="${nextPage.href}">Next: ${nextPage.label}</a>
    </div>
  `;

  if (footer && footer.parentElement) {
    footer.parentElement.insertBefore(nav, footer);
  } else {
    page.appendChild(nav);
  }
}

function setupCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const shell = button.closest('.code-shell');
      const code = shell ? shell.querySelector('code') : null;

      if (!code) {
        return;
      }

      const text = code.textContent.replace(/^\n+|\n+$/g, '');

      try {
        await navigator.clipboard.writeText(text);
        showToast('Copied code block');
      } catch {
        showToast('Copy not available');
      }
    });
  });
}

function setupSearchFilter() {
  document.querySelectorAll('[data-doc-search]').forEach((input) => {
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      const blocks = document.querySelectorAll('[data-searchable]');

      blocks.forEach((block) => {
        const text = block.textContent.toLowerCase();
        block.classList.toggle('hidden', Boolean(query) && !text.includes(query));
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  setupCopyButtons();
  setupSearchFilter();
});
