/* ==========================================
   FORKD — app.js
   ========================================== */

/* ---------- MOCK DATA ---------- */
const MOCK_USER = {
  name: 'Alex Kim',
  username: 'alexkim',
  bio: 'Full-stack engineer · building tools that don\'t suck · open source contributor',
  langs: ['JavaScript', 'Python', 'Rust'],
  website: 'https://alexkim.dev',
  github: null,
  initials: 'AK',
};

const MOCK_POSTS = [
  {
    id: 1, userId: 'priya', name: 'Priya Nair', initials: 'PN',
    handle: 'priyanair', time: '2h',
    text: 'Just deployed my first Rust web server with Axum 🦀 The performance difference vs my old Node.js setup is insane. Latency dropped from 80ms to 4ms on the same hardware.',
    code: `use axum::{routing::get, Router};

async fn hello() -> &'static str {
    "Hello, Forkd!"
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(hello));
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await.unwrap();
}`,
    lang: 'Rust',
    tags: ['#rust', '#webdev', '#performance'],
    likes: 142, comments: 28, shares: 19, forks: 34,
    liked: false,
  },
  {
    id: 2, userId: 'carlos', name: 'Carlos M.', initials: 'CM',
    handle: 'carlosm', time: '5h',
    text: 'Hot take: most codebases don\'t need microservices. A well-structured monolith with clean internal boundaries beats a distributed mess every time. Start simple, extract when you feel real pain.',
    code: null,
    tags: ['#architecture', '#softwaredevelopment'],
    likes: 387, comments: 91, shares: 64, forks: 0,
    liked: true,
  },
  {
    id: 3, userId: 'sarah', name: 'Sarah Chen', initials: 'SC',
    handle: 'sarahchen', time: '1d',
    text: 'CSS container queries are finally ready for production use. Here\'s the pattern I\'ve been using for responsive component design:',
    code: `.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}`,
    lang: 'CSS',
    tags: ['#css', '#webdev', '#frontend'],
    likes: 524, comments: 47, shares: 112, forks: 87,
    liked: false,
  },
  {
    id: 4, userId: 'dev_riku', name: 'Riku T.', initials: 'RT',
    handle: 'dev_riku', time: '2d',
    text: 'Built a terminal portfolio in 3 days. It responds to commands like `ls`, `cat about.md`, `open projects`. DM if you want the source — it\'s open source on GitHub.',
    code: null,
    tags: ['#opensource', '#javascript', '#terminal'],
    likes: 203, comments: 56, shares: 41, forks: 78,
    liked: false,
  },
];

const EXPLORE_USERS = [
  { name: 'Priya Nair',  initials: 'PN', handle: 'priyanair',  bio: 'Rust & WebAssembly nerd', langs: ['rs','py'] },
  { name: 'Carlos M.',   initials: 'CM', handle: 'carlosm',    bio: 'Backend @ stripe · distributed systems', langs: ['go','py'] },
  { name: 'Sarah Chen',  initials: 'SC', handle: 'sarahchen',  bio: 'CSS wizard · frontend architecture', langs: ['js','ts'] },
  { name: 'Riku T.',     initials: 'RT', handle: 'dev_riku',   bio: 'Building in public · OSS', langs: ['js','rs'] },
  { name: 'Maya Brooks', initials: 'MB', handle: 'mayabrooks', bio: 'ML engineer · PyTorch', langs: ['py'] },
  { name: 'Joel Park',   initials: 'JP', handle: 'joelpark',   bio: 'DevOps · k8s · GitOps', langs: ['go'] },
];

const NOTIFICATIONS = [
  { type: 'like',    user: 'Priya Nair',  text: 'liked your post about Rust ownership', time: '2m',  unread: true },
  { type: 'comment', user: 'Carlos M.',   text: 'commented on your post: "Great point about microservices"', time: '18m', unread: true },
  { type: 'follow',  user: 'Sarah Chen',  text: 'started following you', time: '1h',  unread: true },
  { type: 'fork',    user: 'Riku T.',     text: 'forked your code snippet', time: '3h',  unread: false },
  { type: 'like',    user: 'Maya Brooks', text: 'liked your post about tRPC', time: '5h',  unread: false },
  { type: 'follow',  user: 'Joel Park',   text: 'started following you', time: '1d',  unread: false },
];

const MESSAGES = [
  { id: 1, user: 'Priya Nair', initials: 'PN', preview: 'That Rust snippet was 🔥 can you share...', time: '5m', active: false },
  { id: 2, user: 'Carlos M.',  initials: 'CM', preview: 'Let\'s collab on the OSS project', time: '1h', active: false },
  { id: 3, user: 'Sarah Chen', initials: 'SC', preview: 'Have you tried container queries in...', time: '3h', active: false },
];

const TRENDING = [
  { rank: 1, tag: '#javascript', count: '24.1k posts' },
  { rank: 2, tag: '#rust',       count: '18.7k posts' },
  { rank: 3, tag: '#opensource', count: '15.2k posts' },
  { rank: 4, tag: '#devops',     count: '11.8k posts' },
  { rank: 5, tag: '#python',     count: '9.4k posts'  },
];

const SUGGESTIONS = [
  { name: 'Maya Brooks', initials: 'MB', handle: 'mayabrooks', following: false },
  { name: 'Joel Park',   initials: 'JP', handle: 'joelpark',   following: false },
  { name: 'Lin Wei',     initials: 'LW', handle: 'linwei',     following: false },
];

const MOCK_REPOS = [
  { name: 'forkd-cli',      desc: 'Command-line interface for Forkd API',   lang: 'Rust',       langColor: '#f74c00', stars: 342, forks: 41 },
  { name: 'react-hooks-x',  desc: 'Advanced React hooks for async state',   lang: 'TypeScript', langColor: '#3178c6', stars: 1284, forks: 93 },
  { name: 'devlog',         desc: 'Minimal blog engine for developers',      lang: 'JavaScript', langColor: '#f7df1e', stars: 87,  forks: 14 },
  { name: 'perf-bench',     desc: 'Benchmarking suite for HTTP frameworks',  lang: 'Go',         langColor: '#00aed8', stars: 521, forks: 67 },
];

/* ---------- STATE ---------- */
let currentUser = { ...MOCK_USER };
let posts = [...MOCK_POSTS];
let suggestions = [...SUGGESTIONS];
let isLoggedIn = false;
let currentView = 'feed';
let githubConnected = false;

/* ---------- DOM REFS ---------- */
const authScreen = document.getElementById('auth-screen');
const appScreen  = document.getElementById('app-screen');

/* ==========================================
   INIT
   ========================================== */
function init() {
  buildAuthGrid();
  setupAuthTabs();
  setupAuthButtons();
  setupNav();
  setupCompose();
  setupProfile();
  setupGithub();
  renderTrending();
  renderSuggestions();
  feedTabs();
}

/* ==========================================
   AUTH GRID ANIMATION
   ========================================== */
function buildAuthGrid() {
  const grid = document.getElementById('auth-grid');
  if (!grid) return;
  const count = 12 * 8;
  for (let i = 0; i < count; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
  setInterval(() => {
    const cells = grid.querySelectorAll('.grid-cell');
    const idx = Math.floor(Math.random() * cells.length);
    cells[idx].classList.add('lit');
    setTimeout(() => cells[idx].classList.remove('lit'), 1200 + Math.random() * 1000);
  }, 140);
}

/* ==========================================
   AUTH TABS
   ========================================== */
function setupAuthTabs() {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });
}

/* ==========================================
   AUTH BUTTONS
   ========================================== */
function setupAuthButtons() {
  ['github-login-btn', 'github-signup-btn', 'login-btn', 'signup-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', enterApp);
  });
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
}

function enterApp() {
  isLoggedIn = true;
  authScreen.classList.remove('active');
  appScreen.classList.add('active');
  updateUserUI();
  showView('feed');
  renderFeed();
  renderNotifications();
  renderMessages();
  renderProfilePosts();
  renderRepos();
  renderActivity();
}

function logout() {
  isLoggedIn = false;
  appScreen.classList.remove('active');
  authScreen.classList.add('active');
  document.getElementById('login-email').value = '';
  document.getElementById('login-pass').value = '';
}

function updateUserUI() {
  const initials = currentUser.initials;
  ['sidebar-avatar','compose-avatar','profile-avatar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = initials;
  });
  const sname = document.getElementById('sidebar-name');
  const shandle = document.getElementById('sidebar-handle');
  if (sname) sname.textContent = currentUser.name;
  if (shandle) shandle.textContent = `@${currentUser.username}`;

  document.getElementById('compose-name').textContent = currentUser.name;
  document.getElementById('profile-name').textContent = currentUser.name;
  document.getElementById('profile-handle').textContent = `@${currentUser.username}`;
  document.getElementById('profile-bio').textContent = currentUser.bio;
  document.getElementById('profile-posts-count').textContent = posts.filter(p => p.userId === 'me').length;
}

/* ==========================================
   NAVIGATION
   ========================================== */
function setupNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      showView(view);
    });
  });
}

function showView(name) {
  currentView = name;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(`view-${name}`);
  if (target) {
    target.classList.add('active');
    // Hide search wrap in non-explore views
    const searchWrap = document.querySelector('.explore-search');
    if (searchWrap) searchWrap.style.display = name === 'explore' ? '' : '';
  }
  // Show/hide new post button search bar on header based on view
  const searchEl = document.getElementById('explore-search');
  if (name === 'explore' && searchEl) searchEl.focus();
}

/* ==========================================
   FEED
   ========================================== */
function feedTabs() {
  document.querySelectorAll('.feed-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.feed-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

function renderFeed() {
  const container = document.getElementById('feed-posts');
  container.innerHTML = posts.map(p => renderPostCard(p)).join('');
  bindPostActions(container);
}

function renderPostCard(p, minimal = false) {
  const codeBlock = p.code ? `
    <div class="post-code-block">
      <div class="code-lang-bar">
        <span class="code-lang-name">${escapeHTML(p.lang || 'code')}</span>
        <button class="code-copy-btn" onclick="copyCode(this, \`${escapeJS(p.code)}\`)">copy</button>
      </div>
      <pre class="code-content">${escapeHTML(p.code)}</pre>
    </div>` : '';

  const tagsHTML = p.tags && p.tags.length
    ? `<div class="post-tags">${p.tags.map(t => `<span class="post-tag">${escapeHTML(t)}</span>`).join('')}</div>`
    : '';

  return `
    <div class="post-card" data-id="${p.id}">
      <div class="post-header">
        <div class="avatar sm">${escapeHTML(p.initials)}</div>
        <div class="post-user">
          <div class="post-username">${escapeHTML(p.name)}</div>
          <div class="post-handle-time">@${escapeHTML(p.handle)}<span>·</span>${escapeHTML(p.time)}</div>
        </div>
      </div>
      <div class="post-body">${escapeHTML(p.text)}</div>
      ${codeBlock}
      ${tagsHTML}
      <div class="post-actions-row">
        <button class="post-action-btn like ${p.liked ? 'liked' : ''}" data-action="like" data-id="${p.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${p.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          <span>${p.likes}</span>
        </button>
        <button class="post-action-btn comment" data-action="comment" data-id="${p.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          <span>${p.comments}</span>
        </button>
        <button class="post-action-btn fork" data-action="fork" data-id="${p.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6"  cy="18" r="3"/><circle cx="6"  cy="6"  r="3"/><path d="M18 9a9 9 0 01-9 9"/></svg>
          <span>${p.forks}</span>
        </button>
        <button class="post-action-btn share" data-action="share" data-id="${p.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <span>${p.shares}</span>
        </button>
      </div>
    </div>`;
}

function bindPostActions(container) {
  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      const post = posts.find(p => p.id === id);
      if (!post) return;

      if (action === 'like') {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        btn.classList.toggle('liked', post.liked);
        const svg = btn.querySelector('svg');
        if (svg) svg.setAttribute('fill', post.liked ? 'currentColor' : 'none');
        btn.querySelector('span').textContent = post.likes;
      } else if (action === 'fork') {
        post.forks++;
        btn.querySelector('span').textContent = post.forks;
        btn.style.color = 'var(--yellow)';
        setTimeout(() => btn.style.color = '', 600);
      } else if (action === 'share') {
        btn.style.color = 'var(--accent)';
        setTimeout(() => btn.style.color = '', 600);
      }
    });
  });
}

/* ==========================================
   EXPLORE
   ========================================== */
function renderExplore() {
  const grid = document.getElementById('explore-grid');
  grid.innerHTML = EXPLORE_USERS.map(u => `
    <div class="explore-card">
      <div class="explore-card-user">
        <div class="avatar sm">${escapeHTML(u.initials)}</div>
        <div>
          <div class="explore-card-name">${escapeHTML(u.name)}</div>
          <div class="explore-card-handle">@${escapeHTML(u.handle)}</div>
        </div>
      </div>
      <div class="explore-card-langs">${u.langs.map(l => `<span class="lang-tag ${l}">${langLabel(l)}</span>`).join('')}</div>
      <div class="explore-card-text">${escapeHTML(u.bio)}</div>
    </div>
  `).join('');

  document.getElementById('explore-search').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = q
      ? EXPLORE_USERS.filter(u => u.name.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q) || u.bio.toLowerCase().includes(q))
      : EXPLORE_USERS;
    grid.innerHTML = filtered.map(u => `
      <div class="explore-card">
        <div class="explore-card-user">
          <div class="avatar sm">${escapeHTML(u.initials)}</div>
          <div>
            <div class="explore-card-name">${escapeHTML(u.name)}</div>
            <div class="explore-card-handle">@${escapeHTML(u.handle)}</div>
          </div>
        </div>
        <div class="explore-card-langs">${u.langs.map(l => `<span class="lang-tag ${l}">${langLabel(l)}</span>`).join('')}</div>
        <div class="explore-card-text">${escapeHTML(u.bio)}</div>
      </div>
    `).join('');
  });

  document.querySelectorAll('.explore-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.querySelectorAll('.explore-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
    });
  });
}

function langLabel(code) {
  const map = { js: 'JavaScript', ts: 'TypeScript', py: 'Python', rs: 'Rust', go: 'Go' };
  return map[code] || code;
}

/* ==========================================
   NOTIFICATIONS
   ========================================== */
function renderNotifications() {
  const iconMap = {
    like:    { icon: heartSVG(), cls: 'like' },
    comment: { icon: commentSVG(), cls: 'comment' },
    follow:  { icon: followSVG(), cls: 'follow' },
    fork:    { icon: forkSVG(), cls: 'fork' },
  };
  const list = document.getElementById('notif-list');
  list.innerHTML = NOTIFICATIONS.map(n => {
    const { icon, cls } = iconMap[n.type] || { icon: '', cls: '' };
    return `
      <div class="notif-item ${n.unread ? 'unread' : ''}">
        <div class="notif-icon ${cls}">${icon}</div>
        <div>
          <div class="notif-text"><strong>${escapeHTML(n.user)}</strong> ${escapeHTML(n.text)}</div>
          <div class="notif-time">${escapeHTML(n.time)}</div>
        </div>
      </div>`;
  }).join('');
}

/* ==========================================
   MESSAGES
   ========================================== */
function renderMessages() {
  const list = document.getElementById('messages-list');
  list.innerHTML = MESSAGES.map(m => `
    <div class="msg-preview" data-msgid="${m.id}">
      <div class="avatar sm">${escapeHTML(m.initials)}</div>
      <div class="msg-preview-info">
        <div class="msg-preview-name">${escapeHTML(m.user)}</div>
        <div class="msg-preview-text">${escapeHTML(m.preview)}</div>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.msg-preview').forEach(el => {
    el.addEventListener('click', () => {
      list.querySelectorAll('.msg-preview').forEach(e => e.classList.remove('active'));
      el.classList.add('active');
      const m = MESSAGES.find(msg => msg.id === parseInt(el.dataset.msgid));
      if (m) openThread(m);
    });
  });
}

function openThread(m) {
  const thread = document.getElementById('message-thread');
  thread.innerHTML = `
    <div style="padding: 20px 24px; border-bottom: 1px solid var(--border); display:flex; align-items:center; gap:12px;">
      <div class="avatar sm">${escapeHTML(m.initials)}</div>
      <div>
        <div style="font-weight:600; font-size:14px;">${escapeHTML(m.user)}</div>
        <div style="font-size:12px; color:var(--text-3); font-family:var(--font-code);">@${escapeHTML(m.user.toLowerCase().replace(' ',''))}</div>
      </div>
    </div>
    <div style="flex:1; padding:20px 24px; display:flex; flex-direction:column; gap:12px;">
      <div style="display:flex; gap:10px;">
        <div class="avatar sm">${escapeHTML(m.initials)}</div>
        <div style="background:var(--bg-2); border-radius:0 12px 12px 12px; padding:10px 14px; font-size:14px; color:var(--text-2); max-width:80%;">${escapeHTML(m.preview)}</div>
      </div>
    </div>
    <div style="padding:14px 24px; border-top:1px solid var(--border); display:flex; gap:10px; align-items:center;">
      <input type="text" class="field-input" placeholder="Send a message..." style="flex:1;" />
      <button class="btn-primary" style="padding:10px 16px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>`;
}

/* ==========================================
   PROFILE
   ========================================== */
function setupProfile() {
  document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const ptab = tab.dataset.ptab;
      document.getElementById('profile-posts').classList.toggle('hidden', ptab !== 'posts');
      document.getElementById('profile-repos-panel').classList.toggle('hidden', ptab !== 'repos');
      document.getElementById('profile-activity').classList.toggle('hidden', ptab !== 'activity');
    });
  });

  // Edit profile modal
  document.getElementById('edit-profile-btn').addEventListener('click', () => {
    document.getElementById('ep-name').value = currentUser.name;
    document.getElementById('ep-username').value = currentUser.username;
    document.getElementById('ep-bio').value = currentUser.bio;
    document.getElementById('ep-langs').value = currentUser.langs.join(', ');
    document.getElementById('ep-website').value = currentUser.website || '';
    document.getElementById('edit-profile-modal').classList.remove('hidden');
  });

  document.getElementById('close-edit-profile').addEventListener('click', () => {
    document.getElementById('edit-profile-modal').classList.add('hidden');
  });

  document.getElementById('cancel-edit-profile').addEventListener('click', () => {
    document.getElementById('edit-profile-modal').classList.add('hidden');
  });

  document.getElementById('save-profile-btn').addEventListener('click', () => {
    currentUser.name = document.getElementById('ep-name').value.trim() || currentUser.name;
    currentUser.username = document.getElementById('ep-username').value.trim() || currentUser.username;
    currentUser.bio = document.getElementById('ep-bio').value.trim() || currentUser.bio;
    currentUser.langs = document.getElementById('ep-langs').value.split(',').map(s => s.trim()).filter(Boolean);
    currentUser.website = document.getElementById('ep-website').value.trim();
    updateUserUI();
    document.getElementById('edit-profile-modal').classList.add('hidden');
  });
}

function renderProfilePosts() {
  const container = document.getElementById('profile-posts');
  const myPosts = posts.filter(p => p.userId === 'me');
  container.innerHTML = myPosts.length === 0
    ? `<div style="padding:40px 24px; text-align:center; color:var(--text-4); font-family:var(--font-code); font-size:14px;">No posts yet. Hit "New Post" to share something.</div>`
    : myPosts.map(p => renderPostCard(p)).join('');
  if (myPosts.length > 0) bindPostActions(container);
}

function renderRepos() {
  const panel = document.getElementById('profile-repos-panel');
  panel.innerHTML = MOCK_REPOS.map(r => `
    <div class="repo-card">
      <div class="repo-name">${escapeHTML(r.name)}</div>
      <div class="repo-desc">${escapeHTML(r.desc)}</div>
      <div class="repo-meta">
        <span><span class="repo-lang-dot" style="background:${r.langColor};"></span> ${escapeHTML(r.lang)}</span>
        <span>★ ${r.stars}</span>
        <span>⑂ ${r.forks}</span>
      </div>
    </div>
  `).join('');
}

function renderActivity() {
  const activities = [
    { icon: '★', text: 'Starred <a href="#">axum</a> · Rust HTTP framework', time: '2h ago' },
    { icon: '⑂', text: 'Forked <a href="#">rust-web-framework-comparison</a>', time: '1d ago' },
    { icon: '✦', text: 'Opened PR #24 in <a href="#">react-hooks-x</a> — "Add useDeferredState"', time: '2d ago' },
    { icon: '◉', text: 'Pushed 3 commits to <a href="#">devlog</a> · main', time: '3d ago' },
  ];
  const panel = document.getElementById('profile-activity');
  panel.innerHTML = activities.map(a => `
    <div class="activity-item">
      <div class="activity-icon">${a.icon}</div>
      <div>
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>
  `).join('');
}

/* ==========================================
   GITHUB INTEGRATION
   ========================================== */
function setupGithub() {
  document.getElementById('connect-github-btn').addEventListener('click', () => {
    document.getElementById('github-modal').classList.remove('hidden');
  });
  document.getElementById('close-github-modal').addEventListener('click', () => {
    document.getElementById('github-modal').classList.add('hidden');
  });
  document.getElementById('cancel-github').addEventListener('click', () => {
    document.getElementById('github-modal').classList.add('hidden');
  });
  document.getElementById('confirm-github').addEventListener('click', connectGitHub);
}

function connectGitHub() {
  const username = document.getElementById('github-username-input').value.trim();
  if (!username) return;

  const btn = document.getElementById('confirm-github');
  btn.textContent = 'Connecting...';
  btn.disabled = true;

  // Simulate connecting — in production you'd do OAuth
  setTimeout(() => {
    githubConnected = true;
    currentUser.github = username;
    document.getElementById('github-modal').classList.add('hidden');

    // Update connect button
    const connectBtn = document.getElementById('connect-github-btn');
    connectBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
      @${username}`;
    connectBtn.style.color = 'var(--accent)';
    connectBtn.style.borderColor = 'rgba(0,255,178,0.4)';

    // Show GitHub widget in right panel
    showGitHubWidget(username);

    // Show repos count
    document.getElementById('profile-repos').textContent = MOCK_REPOS.length;

    btn.textContent = 'Connect GitHub';
    btn.disabled = false;
  }, 1200);
}

function showGitHubWidget(username) {
  const widget = document.getElementById('github-widget');
  widget.classList.remove('hidden');
  const panel = document.getElementById('github-stats-panel');
  const stats = [
    { label: 'Public repos', value: MOCK_REPOS.length },
    { label: 'Total stars', value: MOCK_REPOS.reduce((s, r) => s + r.stars, 0).toLocaleString() },
    { label: 'Contributions', value: '1,284' },
    { label: 'Followers', value: '248' },
  ];

  // Build contribution grid
  const cells = Array.from({ length: 26 * 7 }, () => {
    const r = Math.random();
    if (r > 0.75) return 'l4';
    if (r > 0.55) return 'l3';
    if (r > 0.38) return 'l2';
    if (r > 0.22) return 'l1';
    return '';
  });

  panel.innerHTML = `
    <div style="font-size:12px; color:var(--text-3); font-family:var(--font-code); margin-bottom:8px;">@${escapeHTML(username)}</div>
    ${stats.map(s => `
      <div class="github-stat-row">
        <span class="github-stat-label">${s.label}</span>
        <span class="github-stat-value">${s.value}</span>
      </div>`).join('')}
    <div style="margin-top:12px;">
      <div style="font-size:11px; color:var(--text-4); font-family:var(--font-code); margin-bottom:6px;">contribution activity</div>
      <div class="contrib-grid">
        ${cells.map(cls => `<div class="contrib-cell ${cls}"></div>`).join('')}
      </div>
    </div>`;
}

/* ==========================================
   COMPOSE MODAL
   ========================================== */
function setupCompose() {
  const modal = document.getElementById('compose-modal');
  document.getElementById('compose-btn').addEventListener('click', () => modal.classList.remove('hidden'));
  document.getElementById('close-compose').addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

  const textarea = document.getElementById('compose-text');
  const charCount = document.getElementById('char-count');
  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    charCount.textContent = `${len} / 500`;
    charCount.style.color = len > 450 ? 'var(--red)' : 'var(--text-4)';
  });

  document.querySelectorAll('.compose-tool').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.compose-tool').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const codeArea = document.getElementById('code-block-area');
      codeArea.classList.toggle('hidden', btn.dataset.tool !== 'code');
    });
  });

  document.getElementById('publish-btn').addEventListener('click', publishPost);
}

function publishPost() {
  const text = document.getElementById('compose-text').value.trim();
  if (!text) return;

  const codeToolActive = document.querySelector('.compose-tool[data-tool="code"]').classList.contains('active');
  const code = codeToolActive ? document.getElementById('compose-code').value.trim() : null;
  const lang = document.getElementById('lang-select').value;
  const tagInput = document.getElementById('compose-tags').value;
  const tags = tagInput.split(/[\s,]+/).filter(t => t.startsWith('#'));

  const newPost = {
    id: Date.now(),
    userId: 'me',
    name: currentUser.name,
    initials: currentUser.initials,
    handle: currentUser.username,
    time: 'just now',
    text,
    code: code || null,
    lang: code ? lang : null,
    tags,
    likes: 0, comments: 0, shares: 0, forks: 0,
    liked: false,
  };

  posts.unshift(newPost);
  renderFeed();
  renderProfilePosts();
  document.getElementById('profile-posts-count').textContent = posts.filter(p => p.userId === 'me').length;

  // Reset
  document.getElementById('compose-text').value = '';
  document.getElementById('compose-code').value = '';
  document.getElementById('compose-tags').value = '';
  document.getElementById('char-count').textContent = '0 / 500';
  document.getElementById('code-block-area').classList.add('hidden');
  document.querySelectorAll('.compose-tool').forEach(b => b.classList.remove('active'));
  document.querySelector('.compose-tool[data-tool="text"]').classList.add('active');
  document.getElementById('compose-modal').classList.add('hidden');

  // Switch to feed view
  showView('feed');
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.view === 'feed');
  });
}

/* ==========================================
   RIGHT PANEL
   ========================================== */
function renderTrending() {
  const el = document.getElementById('trending-list');
  el.innerHTML = TRENDING.map(t => `
    <div class="trending-item">
      <div class="trending-rank">${t.rank}. trending</div>
      <div class="trending-tag">${escapeHTML(t.tag)}</div>
      <div class="trending-count">${escapeHTML(t.count)}</div>
    </div>`).join('');
}

function renderSuggestions() {
  const el = document.getElementById('suggestions-list');
  const render = () => {
    el.innerHTML = suggestions.map((s, i) => `
      <div class="suggestion-item">
        <div class="avatar sm">${escapeHTML(s.initials)}</div>
        <div class="suggestion-info">
          <div class="suggestion-name">${escapeHTML(s.name)}</div>
          <div class="suggestion-handle">@${escapeHTML(s.handle)}</div>
        </div>
        <button class="follow-btn ${s.following ? 'following' : ''}" data-si="${i}">${s.following ? 'Following' : 'Follow'}</button>
      </div>`).join('');

    el.querySelectorAll('.follow-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.si);
        suggestions[i].following = !suggestions[i].following;
        render();
      });
    });
  };
  render();
}

/* ==========================================
   UTILITIES
   ========================================== */
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function escapeJS(str) {
  return str.replace(/`/g,'\\`').replace(/\$/g,'\\$');
}

function copyCode(btn, code) {
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'copied!';
    setTimeout(() => btn.textContent = 'copy', 1500);
  });
}

function heartSVG()   { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`; }
function commentSVG() { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`; }
function followSVG()  { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`; }
function forkSVG()    { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M18 9a9 9 0 01-9 9"/></svg>`; }

/* ---------- GLOBAL MODAL CLOSE ---------- */
['compose-modal','github-modal','edit-profile-modal'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', (e) => { if (e.target === el) el.classList.add('hidden'); });
});

/* ==========================================
   ROUTE TO RENDER ON VIEW CHANGE
   ========================================== */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const view = item.dataset.view;
    if (view === 'explore') renderExplore();
  });
});

/* ==========================================
   START
   ========================================== */
init();
