(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;
  const dict = window.I18N;

  const storage = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} }
  };

  let lang = storage.get('lang') === 'en' ? 'en' : 'pt';
  const t = key => dict[lang][key];

  /* ---------- stack data ---------- */

  const DEV = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
  const SI = 'https://cdn.simpleicons.org/';

  const STACK = {
    languages: [
      { name: 'Python', type: 'lang', icon: DEV + 'python/python-original.svg' },
      { name: 'JavaScript', type: 'lang', icon: DEV + 'javascript/javascript-original.svg' },
      { name: 'Dart', type: 'lang', icon: DEV + 'dart/dart-original.svg' },
      { name: 'C#', type: 'lang', icon: DEV + 'csharp/csharp-original.svg' },
      { name: 'C', type: 'lang', icon: DEV + 'c/c-original.svg' },
      { name: 'Kotlin', type: 'lang', icon: DEV + 'kotlin/kotlin-original.svg' },
      { name: 'Swift', type: 'lang', icon: DEV + 'swift/swift-original.svg' },
      { name: 'Lua', type: 'game', icon: DEV + 'lua/lua-original.svg' }
    ],
    frameworks: [
      { name: 'HTML5', type: 'markup', icon: DEV + 'html5/html5-original.svg' },
      { name: 'CSS3', type: 'style', icon: DEV + 'css3/css3-original.svg' },
      { name: 'Bootstrap', type: 'ui', icon: DEV + 'bootstrap/bootstrap-original.svg' },
      { name: 'Flutter', type: 'fw', icon: DEV + 'flutter/flutter-original.svg' },
      { name: 'Flask', type: 'fw', icon: DEV + 'flask/flask-original.svg', invert: true },
      { name: 'SwiftUI', type: 'ui', icon: SI + 'swift/0a84ff' }
    ],
    data: [
      { name: 'MySQL', type: 'db', icon: DEV + 'mysql/mysql-original.svg' },
      { name: 'SQLite', type: 'db', icon: DEV + 'sqlite/sqlite-original.svg' }
    ],
    deploy: [
      { name: 'GitHub', type: 'vcs', icon: DEV + 'github/github-original.svg', invert: true },
      { name: 'Vercel', type: 'deploy', icon: DEV + 'vercel/vercel-original.svg', invert: true },
      { name: 'Render', type: 'deploy', icon: SI + 'render/ffffff' },
      { name: 'Cloudflare', type: 'cdn', icon: DEV + 'cloudflare/cloudflare-original.svg' }
    ],
    tools: [
      { name: 'VS Code', type: 'ide', icon: DEV + 'vscode/vscode-original.svg' },
      { name: 'IntelliJ', type: 'ide', icon: DEV + 'intellij/intellij-original.svg' },
      { name: 'Android Studio', type: 'ide', icon: DEV + 'androidstudio/androidstudio-original.svg' },
      { name: 'Xcode', type: 'ide', icon: DEV + 'xcode/xcode-original.svg' },
      { name: 'Figma', type: 'design', icon: DEV + 'figma/figma-original.svg' }
    ],
    ai: [
      { name: 'Claude Code', type: 'ai', icon: SI + 'claude/d97757' },
      { name: 'DeepSeek', type: 'ai', icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek-color.svg' },
      { name: 'Copilot', type: 'ai', icon: SI + 'githubcopilot/ffffff' }
    ]
  };

  let currentCat = 'languages';

  function renderTabs() {
    const wrap = $('#stackTabs');
    wrap.innerHTML = '';
    Object.keys(STACK).forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'stack__tab' + (cat === currentCat ? ' is-active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', cat === currentCat);
      btn.dataset.cat = cat;
      btn.innerHTML = `<span>${t('stackCats')[cat]}</span><span class="stack__tab-count">${String(STACK[cat].length).padStart(2, '0')}</span>`;
      btn.addEventListener('click', () => {
        if (cat === currentCat) return;
        currentCat = cat;
        $$('.stack__tab', wrap).forEach(b => {
          const on = b.dataset.cat === cat;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', on);
        });
        renderGrid();
      });
      wrap.appendChild(btn);
    });
  }

  function renderGrid() {
    const grid = $('#stackGrid');
    const items = STACK[currentCat];
    $('#stackPath').textContent = currentCat;
    $('#stackCount').textContent = `· ${items.length} items`;
    grid.innerHTML = items.map((it, i) => `
      <div class="tech" style="--i:${i}">
        <span class="tech__logo">
          <img src="${it.icon}" alt="" width="34" height="34" loading="lazy" ${it.invert ? 'class="invert"' : ''} data-fallback="${it.name.slice(0, 2)}">
        </span>
        <span class="tech__name">${it.name}</span>
        <span class="tech__type">${t('stackTypes')[it.type]}</span>
      </div>`).join('');
    $$('img[data-fallback]', grid).forEach(img => {
      img.addEventListener('error', () => {
        const s = document.createElement('span');
        s.className = 'mono';
        s.style.cssText = 'font-weight:700;color:var(--lilac)';
        s.textContent = img.dataset.fallback;
        img.replaceWith(s);
      }, { once: true });
    });
    bindTilt($$('.tech', grid));
  }

  /* ---------- i18n ---------- */

  const nodes = $$('[data-i18n], [data-i18n-html]');
  nodes.forEach(el => { el.dataset.pt = el.innerHTML; });

  function applyLang(next, first = false) {
    lang = next;
    storage.set('lang', lang);
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = lang === 'pt' ? 'Marcos Paulo | Desenvolvedor Front-end' : 'Marcos Paulo | Front-end Developer';

    nodes.forEach(el => {
      const key = el.dataset.i18n || el.dataset.i18nHtml;
      const val = lang === 'pt' ? el.dataset.pt : dict.en[key];
      if (val != null) el.innerHTML = val;
    });

    const group = $('.lang');
    group.dataset.current = lang;
    $$('.lang__btn').forEach(b => {
      const on = b.dataset.lang === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on);
    });

    renderTabs();
    renderGrid();
    updateResume();
    if (!first) restartRoles();
  }

  $$('.lang__btn').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang !== lang) applyLang(b.dataset.lang);
  }));

  /* ---------- loader ---------- */

  function runLoader(done) {
    const loader = $('#loader');
    if (reduced) { loader.classList.add('is-done'); done(); return; }
    const lines = t('loader');
    const box = $('#loaderLines');
    const bar = $('#loaderBar');
    const pct = $('#loaderPct');
    let i = 0;
    const step = () => {
      if (i > 0) box.lastElementChild.classList.add('ok');
      if (i < lines.length) {
        const p = document.createElement('p');
        p.textContent = lines[i];
        box.appendChild(p);
        const v = Math.round(((i + 1) / lines.length) * 100);
        bar.style.width = v + '%';
        pct.textContent = v;
        i++;
        setTimeout(step, i === lines.length ? 380 : 240);
      } else {
        loader.classList.add('is-done');
        done();
      }
    };
    step();
  }

  /* ---------- background canvas ---------- */

  function initCanvas() {
    const cvs = $('#bgCanvas');
    const ctx = cvs.getContext('2d');
    const glyphs = ['{', '}', '</>', '()', '=>', ';', '01', '[]', '#', '&&'];
    const mouse = { x: -9999, y: -9999 };
    let w, h, dpr, parts = [], raf;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = cvs.clientWidth;
      h = cvs.clientHeight;
      cvs.width = w * dpr;
      cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.round((w * h) / 16000), w < 700 ? 45 : 100);
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - .5) * .3,
        vy: (Math.random() - .5) * .3,
        r: Math.random() * 1.6 + .6,
        g: Math.random() < .16 ? glyphs[(Math.random() * glyphs.length) | 0] : null
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const max = 130;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;

        const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 160) {
          ctx.strokeStyle = `rgba(196,181,253,${(1 - md / 160) * .5})`;
          ctx.lineWidth = .8;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          p.x += mdx / md * .4; p.y += mdy / md * .4;
        }

        for (let j = i + 1; j < parts.length; j++) {
          const q = parts[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = dx * dx + dy * dy;
          if (d < max * max) {
            ctx.strokeStyle = `rgba(139,92,246,${(1 - Math.sqrt(d) / max) * .22})`;
            ctx.lineWidth = .7;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }

        if (p.g) {
          ctx.fillStyle = 'rgba(196,181,253,.35)';
          ctx.font = '11px JetBrains Mono, monospace';
          ctx.fillText(p.g, p.x, p.y);
        } else {
          ctx.fillStyle = 'rgba(196,181,253,.7)';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduced) raf = requestAnimationFrame(draw);
    });

    if (reduced) { draw(); cancelAnimationFrame(raf); }
    else draw();
  }

  /* ---------- cursor glow ---------- */

  function initCursor() {
    if (!canHover || reduced) return;
    const el = $('#cursorGlow');
    let x = -999, y = -999, tx = x, ty = y;
    window.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() {
      x += (tx - x) * .12;
      y += (ty - y) * .12;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- hero ---------- */

  function scramble(el) {
    const final = el.dataset.text;
    const chars = '<>/{}[]=#$%01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const total = 26;
    let frame = 0;
    const tick = () => {
      el.textContent = final.split('').map((c, i) => {
        if (frame >= (i + 1) * (total / final.length)) return c;
        return chars[(Math.random() * chars.length) | 0];
      }).join('');
      if (frame++ < total) setTimeout(tick, 45);
      else el.textContent = final;
    };
    tick();
    setInterval(() => {
      el.classList.add('is-glitch');
      setTimeout(() => el.classList.remove('is-glitch'), 900);
    }, 6500);
  }

  let roleTimer;
  function restartRoles() {
    clearTimeout(roleTimer);
    const el = $('#typeRole');
    const list = t('roles');
    let idx = 0, pos = 0, deleting = false;
    el.textContent = '';
    const tick = () => {
      const word = list[idx];
      if (!deleting) {
        el.textContent = word.slice(0, ++pos);
        if (pos === word.length) { deleting = true; roleTimer = setTimeout(tick, 1800); return; }
        roleTimer = setTimeout(tick, 55 + Math.random() * 50);
      } else {
        el.textContent = word.slice(0, --pos);
        if (pos === 0) { deleting = false; idx = (idx + 1) % list.length; roleTimer = setTimeout(tick, 300); return; }
        roleTimer = setTimeout(tick, 28);
      }
    };
    tick();
  }

  function typeEditor() {
    const code = $('#editorCode');
    const L = [
      [['k', 'const '], ['', 'marcos '], ['', '= {']],
      [['p', '  role'], ['', ': '], ['s', '"Front-end Developer"'], ['', ',']],
      [['p', '  base'], ['', ': '], ['s', '"Belo Horizonte, MG"'], ['', ',']],
      [['p', '  founder'], ['', ': '], ['s', '"MAvision"'], ['', ',']],
      [['p', '  stack'], ['', ': ['], ['s', '"JS"'], ['', ', '], ['s', '"Python"'], ['', ', '], ['s', '"Flutter"'], ['', '],']],
      [['p', '  projects'], ['', ': '], ['n', '3'], ['', ',']],
      [['p', '  motto'], ['', ': '], ['s', '"next one, always better"']],
      [['', '};']],
      [],
      [['', 'marcos.'], ['f', 'build'], ['', '(); '], ['c', '// ✓ deployed']]
    ];

    if (reduced) {
      code.innerHTML = L.map((line, n) => `<span class="ln">${n + 1}</span>` + line.map(([c, s]) => `<span class="${c ? 'tk-' + c : ''}">${s}</span>`).join('')).join('\n');
      return;
    }

    let li = 0, ti = 0, ci = 0, span = null;
    const next = () => {
      if (li >= L.length) return;
      const line = L[li];
      if (ti === 0 && ci === 0 && !span) {
        if (li > 0) code.append('\n');
        const ln = document.createElement('span');
        ln.className = 'ln';
        ln.textContent = li + 1;
        code.appendChild(ln);
      }
      if (ti >= line.length) { li++; ti = 0; ci = 0; span = null; setTimeout(next, 120); return; }
      const [cls, str] = line[ti];
      if (!span) {
        span = document.createElement('span');
        if (cls) span.className = 'tk-' + cls;
        code.appendChild(span);
      }
      span.textContent += str[ci++];
      if (ci >= str.length) { ti++; ci = 0; span = null; }
      setTimeout(next, 22 + Math.random() * 30);
    };
    next();
  }

  function initClock() {
    const el = $('#clock');
    const fmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Sao_Paulo' });
    const tick = () => { el.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- reveal & counters ---------- */

  function initReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => io.observe(el));

    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const end = +el.dataset.count;
        const suffix = el.dataset.suffix || '';
        const start = performance.now();
        const dur = 1600;
        const step = now => {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))) + (p === 1 ? suffix : '');
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: .6 });
    $$('[data-count]').forEach(el => cio.observe(el));
  }

  /* ---------- nav ---------- */

  function initNav() {
    const nav = $('#nav');
    const links = $('#navLinks');
    const burger = $('#burger');

    const toggle = open => {
      links.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? t('menuClose') : t('menuOpen'));
    };

    burger.addEventListener('click', () => toggle(!links.classList.contains('is-open')));
    $$('a', links).forEach(a => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });

    const sections = $$('main section[id]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        $$('a', links).forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));

    const progress = $('#scrollProgress');
    const toTop = $('#toTop');
    const ring = $('#toTopProgress');
    const fill = $('#timelineFill');
    const tl = $('#timeline');
    const C = 2 * Math.PI * 22;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? y / max : 0;
      nav.classList.toggle('is-scrolled', y > 30);
      progress.style.transform = `scaleX(${p})`;
      toTop.classList.toggle('is-visible', y > window.innerHeight * .6);
      ring.style.strokeDashoffset = C * (1 - p);

      const r = tl.getBoundingClientRect();
      const vh = window.innerHeight;
      const tp = Math.min(Math.max((vh * .7 - r.top) / r.height, 0), 1);
      fill.style.transform = `scaleY(${tp})`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  }

  /* ---------- pointer effects ---------- */

  function initGlow() {
    document.addEventListener('pointermove', e => {
      const card = e.target.closest && e.target.closest('[data-glow]');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--gx', `${e.clientX - r.left}px`);
      card.style.setProperty('--gy', `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  function bindTilt(list) {
    if (!canHover || reduced) return;
    list.forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  function initPortraitTilt() {
    if (!canHover || reduced) return;
    const el = $('[data-tilt]');
    const area = $('.hero__visual');
    area.addEventListener('pointermove', e => {
      const r = area.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
    });
    area.addEventListener('pointerleave', () => { el.style.transform = ''; });
  }

  function initMagnetic() {
    if (!canHover || reduced) return;
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', `${(e.clientX - r.left - r.width / 2) * .25}px`);
        btn.style.setProperty('--my', `${(e.clientY - r.top - r.height / 2) * .35}px`);
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
      });
    });
  }

  /* ---------- project screenshots ---------- */

  function initShots() {
    const projects = $$('.project');

    const measure = p => {
      const img = $('.browser__view img', p);
      const view = $('.browser__view', p);
      if (!img.complete || !img.naturalHeight) return;
      const shift = Math.min(view.clientHeight - img.clientHeight, 0);
      p.style.setProperty('--shift', `${shift}px`);
      p.style.setProperty('--dur', `${Math.max(4, Math.abs(shift) / 420).toFixed(2)}s`);
    };

    projects.forEach(p => {
      const img = $('.browser__view img', p);
      img.addEventListener('load', () => measure(p));
      if (img.complete) measure(p);
      $('.project__shot', p).addEventListener('pointerenter', () => measure(p));
    });

    window.addEventListener('resize', () => projects.forEach(measure));

    if (!canHover && !reduced) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          measure(e.target);
          e.target.classList.toggle('is-auto', e.isIntersecting);
        });
      }, { threshold: .35 });
      projects.forEach(p => io.observe(p));
    }
  }

  /* ---------- misc ---------- */

  function initCopy() {
    const toast = $('#toast');
    let tt;
    $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
      const val = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(val);
        toast.textContent = `${t('copied')}: ${val}`;
      } catch {
        window.location.href = 'mailto:' + val;
        return;
      }
      toast.classList.add('is-on');
      clearTimeout(tt);
      tt = setTimeout(() => toast.classList.remove('is-on'), 2400);
    }));
  }

  function updateResume() {
    const file = `assets/curriculo-${lang}.pdf`;
    $('#resumeBtn').href = file;
    $('#resumeBtn').download = lang === 'pt' ? 'Curriculo-Marcos-Paulo.pdf' : 'Resume-Marcos-Paulo.pdf';
    $('#resumeView').href = file;
  }

  /* ---------- boot ---------- */

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const toStart = () => { if (!location.hash) window.scrollTo({ top: 0, behavior: 'instant' }); };
  toStart();
  window.addEventListener('load', toStart, { once: true });

  applyLang(lang, true);
  initCanvas();
  initCursor();
  initNav();
  initGlow();
  initMagnetic();
  initPortraitTilt();
  initShots();
  initCopy();
  initClock();

  runLoader(() => {
    document.body.classList.remove('is-loading');
    toStart();
    initReveal();
    scramble($('#heroName'));
    restartRoles();
    setTimeout(typeEditor, 500);
  });
})();
