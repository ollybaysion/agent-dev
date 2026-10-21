/* =====================================================================
   에이전트 개발자를 위한 인증·인가 세미나 — 공통 슬라이드 스크립트
   - 발표 모드(한 장씩) / 문서 모드(전체 스크롤)
   - 키보드: ← → Space PgUp PgDn Home End, O(모드), T(테마), N(노트), F(전체화면), ?(도움말)
   - URL 해시 #n 으로 n번째 슬라이드 열기
   - ?check=1 : 모든 슬라이드의 내용 넘침 검사 결과를 상단 배너로 표시
   외부 의존성 없음.
   ===================================================================== */
(function () {
  'use strict';

  var W = 1280, H = 720;

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 무시 */ } }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* ---------- 테마 (모든 페이지 공통) ---------- */
  function applyTheme(t) {
    // 저장된 값이 있을 때만 덮어쓴다. 없으면 HTML 의 data-theme 또는 OS 설정을 따른다.
    if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
  }
  function currentTheme() {
    var forced = document.documentElement.getAttribute('data-theme');
    if (forced) return forced;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store('seminar-theme', next);
  }
  applyTheme(load('seminar-theme'));
  window.SeminarSlides = { toggleTheme: toggleTheme };

  /* ---------- 공유 화살촉 정의 ---------- */
  function injectMarkers() {
    if (document.getElementById('arrow')) return;
    var names = ['arrow', 'arrow-bad', 'arrow-ok', 'arrow-muted', 'arrow-idp', 'arrow-token', 'arrow-agent'];
    var defs = names.map(function (n) {
      return '<marker id="' + n + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" ' +
             'orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z"/></marker>';
    }).join('');
    var svg = '<svg class="svg-defs" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs></svg>';
    document.body.insertAdjacentHTML('afterbegin', svg);
  }

  /* ---------- 코드 하이라이트 (간단 토크나이저) ---------- */
  var LANG = {
    java: [
      ['cm',  /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
      ['str', /"(?:[^"\\\n]|\\.)*"/],
      ['ann', /@[A-Za-z_][\w.]*/],
      ['kw',  /\b(?:public|private|protected|class|interface|record|enum|return|new|static|final|void|if|else|for|while|throws|throw|try|catch|finally|import|package|extends|implements|var|boolean|int|long|double|this|null|true|false|instanceof|switch|case|default|break)\b/],
      ['num', /\b\d+(?:\.\d+)?[LlfFdD]?\b/]
    ],
    kotlin: [
      ['cm',  /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
      ['str', /"(?:[^"\\\n]|\\.)*"/],
      ['ann', /@[A-Za-z_][\w.]*/],
      ['kw',  /\b(?:fun|val|var|class|object|return|if|else|when|null|true|false|import|package|override|private|public)\b/],
      ['num', /\b\d+(?:\.\d+)?\b/]
    ],
    yaml: [
      ['cm',  /#[^\n]*/],
      ['str', /"(?:[^"\\\n]|\\.)*"|'[^'\n]*'/],
      ['key', /^[ \t-]*[\w.\-\/${}]+(?=\s*:(?:\s|$))/m],
      ['kw',  /\b(?:true|false|null)\b/],
      ['num', /\b\d+(?:\.\d+)?\b/]
    ],
    json: [
      ['key', /"(?:[^"\\\n]|\\.)*"(?=\s*:)/],
      ['str', /"(?:[^"\\\n]|\\.)*"/],
      ['kw',  /\b(?:true|false|null)\b/],
      ['num', /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/]
    ],
    js: [
      ['cm',  /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
      ['str', /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/],
      ['kw',  /\b(?:const|let|var|function|return|if|else|await|async|import|from|export|new|throw|try|catch|window|document|true|false|null|undefined)\b/],
      ['num', /\b\d+(?:\.\d+)?\b/]
    ],
    http: [
      ['cm',  /#[^\n]*/],
      ['kw',  /^(?:GET|POST|PUT|DELETE|PATCH|HTTP\/[\d.]+)\b/m],
      ['key', /^[A-Za-z][\w-]*(?=:)/m],
      ['str', /"(?:[^"\\\n]|\\.)*"/],
      ['num', /\b[1-5]\d\d\b/]
    ],
    bash: [
      ['cm',  /#[^\n]*/],
      ['str', /"(?:[^"\\\n]|\\.)*"|'[^'\n]*'/],
      ['kw',  /\b(?:docker|curl|export|run|echo|jq|base64|cut|tr|sed|cat)\b/],
      ['ann', /(?<=\s)--?[A-Za-z][\w-]*/]
    ],
    sql: [
      ['cm',  /--[^\n]*/],
      ['str', /'[^'\n]*'/],
      ['kw',  /\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|ON|AND|OR|NOT|NULL|CREATE|TABLE)\b/i],
      ['num', /\b\d+\b/]
    ]
  };
  LANG.javascript = LANG.js;
  LANG.sh = LANG.bash;
  LANG.yml = LANG.yaml;

  function highlight(codeEl) {
    var m = codeEl.className.match(/lang(?:uage)?-(\w+)/);
    var rules = m && LANG[m[1]];
    if (!rules) return;
    var src = codeEl.textContent;
    var re = new RegExp(rules.map(function (r) { return '(' + r[1].source + ')'; }).join('|'), 'gm');
    var out = '', last = 0, t;
    while ((t = re.exec(src))) {
      if (t.index > last) out += esc(src.slice(last, t.index));
      var k = 1;
      while (k < t.length && t[k] === undefined) k++;
      out += '<span class="tok-' + rules[k - 1][0] + '">' + esc(t[0]) + '</span>';
      last = t.index + t[0].length;
      if (t[0].length === 0) re.lastIndex++;
    }
    out += esc(src.slice(last));
    codeEl.innerHTML = out;
  }

  /* ---------- 덱 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    injectMarkers();
    Array.prototype.forEach.call(document.querySelectorAll('pre code'), highlight);

    var deck = document.querySelector('.deck');
    if (!deck) return; // 목차 등 일반 페이지

    var deckTitle = deck.getAttribute('data-deck') || document.title;
    var indexHref = deck.getAttribute('data-index');
    var slides = Array.prototype.slice.call(deck.querySelectorAll('section.slide'));
    if (!slides.length) return;

    var wraps = slides.map(function (s, i) {
      var w = el('div', 'slide-wrap');
      w.setAttribute('data-index', i);
      s.parentNode.insertBefore(w, s);
      w.appendChild(s);
      if (!s.classList.contains('title')) {
        s.appendChild(el('div', 'foot',
          '<span>' + esc(deckTitle) + '</span><span>' + (i + 1) + ' / ' + slides.length + '</span>'));
      }
      return w;
    });

    /* HUD */
    var hud = el('div', 'hud');
    var btnPrev = el('button', 'present-only', '‹'); btnPrev.title = '이전 (←)';
    var btnNext = el('button', 'present-only', '›'); btnNext.title = '다음 (→)';
    var counter = el('span', 'counter present-only');
    var btnMode = el('button', '', '문서 보기 (O)');
    var btnTheme = el('button', '', '테마 (T)');
    var btnNotes = el('button', '', '노트 (N)');
    var btnHelp = el('button', '', '?'); btnHelp.title = '도움말 (?)';
    if (indexHref) { var aIdx = el('a', '', '목차'); aIdx.href = indexHref; hud.appendChild(aIdx); }
    [btnPrev, counter, btnNext, btnMode, btnTheme, btnNotes, btnHelp].forEach(function (b) { hud.appendChild(b); });
    document.body.appendChild(hud);

    var progress = el('div', 'progress'); document.body.appendChild(progress);
    var notesPanel = el('div', 'notes-panel'); document.body.appendChild(notesPanel);
    var help = el('div', 'help',
      '<div class="box"><h3>조작법</h3><table>' +
      '<tr><td><kbd>→</kbd> <kbd>Space</kbd> <kbd>PgDn</kbd></td><td>다음 슬라이드</td></tr>' +
      '<tr><td><kbd>←</kbd> <kbd>PgUp</kbd></td><td>이전 슬라이드</td></tr>' +
      '<tr><td><kbd>Home</kbd> / <kbd>End</kbd></td><td>처음 / 끝</td></tr>' +
      '<tr><td><kbd>O</kbd> 또는 <kbd>Esc</kbd></td><td>발표 모드 ↔ 문서 모드(전체 스크롤)</td></tr>' +
      '<tr><td><kbd>T</kbd></td><td>라이트 / 다크 테마</td></tr>' +
      '<tr><td><kbd>N</kbd></td><td>발표자 노트 표시</td></tr>' +
      '<tr><td><kbd>F</kbd></td><td>전체 화면</td></tr>' +
      '<tr><td><kbd>?</kbd></td><td>이 도움말</td></tr>' +
      '<tr><td>문서 모드에서 더블클릭</td><td>그 슬라이드로 발표 모드 진입</td></tr>' +
      '<tr><td>인쇄 (Ctrl+P)</td><td>한 장씩 가로 페이지로 출력 / PDF 저장</td></tr>' +
      '</table><p class="muted" style="margin:12px 0 0;font-size:13px">주소 끝에 <code>#7</code>처럼 번호를 붙이면 그 슬라이드로 바로 열립니다.</p></div>');
    help.addEventListener('click', function (e) { if (e.target === help) help.classList.remove('open'); });
    document.body.appendChild(help);

    var cur = 0, mode = 'present';

    function layout() {
      var vw = document.documentElement.clientWidth, vh = window.innerHeight, s;
      if (mode === 'present') s = Math.min(vw / W, vh / H) * 0.96;
      else s = Math.min(1, (vw - 32) / W);
      document.documentElement.style.setProperty('--scale', s.toFixed(4));
    }
    function updateNotes() {
      var n = slides[cur].querySelector('aside.notes');
      notesPanel.innerHTML = '<strong>발표자 노트 · ' + (cur + 1) + '</strong> ' +
        (n ? '<div>' + n.innerHTML + '</div>' : '<span class="muted">이 슬라이드에는 노트가 없습니다.</span>');
    }
    function go(i, opts) {
      opts = opts || {};
      i = Math.max(0, Math.min(slides.length - 1, i));
      wraps[cur].classList.remove('active');
      cur = i;
      wraps[cur].classList.add('active');
      counter.textContent = (cur + 1) + ' / ' + slides.length;
      progress.style.width = ((cur + 1) / slides.length * 100) + '%';
      if (!opts.noHash) history.replaceState(null, '', '#' + (cur + 1));
      updateNotes();
      if (mode === 'doc' && opts.scroll) wraps[cur].scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    function setMode(m) {
      mode = m;
      document.body.classList.toggle('mode-present', m === 'present');
      document.body.classList.toggle('mode-doc', m === 'doc');
      btnMode.textContent = m === 'present' ? '문서 보기 (O)' : '발표 보기 (O)';
      if (!check) store('seminar-mode', m); // 넘침 검사 모드는 사용자 설정을 덮어쓰지 않는다
      layout();
      if (m === 'doc') setTimeout(function () { wraps[cur].scrollIntoView({ block: 'start' }); }, 0);
    }
    function toggleMode() { setMode(mode === 'present' ? 'doc' : 'present'); }
    function toggleFullscreen() {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
    }

    btnPrev.onclick = function () { go(cur - 1); };
    btnNext.onclick = function () { go(cur + 1); };
    btnMode.onclick = toggleMode;
    btnTheme.onclick = toggleTheme;
    btnNotes.onclick = function () { document.body.classList.toggle('show-notes'); };
    btnHelp.onclick = function () { help.classList.toggle('open'); };

    wraps.forEach(function (w, i) {
      w.addEventListener('dblclick', function () {
        if (mode === 'doc') { go(i); setMode('present'); }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      var k = e.key;
      if (k === '?') { help.classList.toggle('open'); return; }
      if (k === 'Escape') {
        if (help.classList.contains('open')) { help.classList.remove('open'); return; }
        toggleMode(); return;
      }
      if (k === 'o' || k === 'O') { toggleMode(); return; }
      if (k === 't' || k === 'T') { toggleTheme(); return; }
      if (k === 'n' || k === 'N') { document.body.classList.toggle('show-notes'); return; }
      if (k === 'f' || k === 'F') { toggleFullscreen(); return; }
      if (mode !== 'present') return;
      switch (k) {
        case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter':
          go(cur + 1); e.preventDefault(); break;
        case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace':
          go(cur - 1); e.preventDefault(); break;
        case 'Home': go(0); e.preventDefault(); break;
        case 'End': go(slides.length - 1); e.preventDefault(); break;
      }
    });

    /* 터치 스와이프 */
    var tx = null;
    document.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', function (e) {
      if (tx === null || mode !== 'present') return;
      var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 50) go(dx < 0 ? cur + 1 : cur - 1);
    }, { passive: true });

    window.addEventListener('resize', layout);
    window.addEventListener('hashchange', function () {
      var h = parseInt(location.hash.slice(1), 10);
      if (h && h - 1 !== cur) go(h - 1, { noHash: true, scroll: true });
    });

    /* 초기 상태 */
    var h0 = parseInt(location.hash.slice(1), 10);
    var check = /[?&]check=1/.test(location.search);
    setMode(check ? 'doc' : (load('seminar-mode') === 'doc' ? 'doc' : 'present'));
    go(h0 ? h0 - 1 : 0, { noHash: !h0 });

    /* 넘침 검사 */
    if (check) {
      (function () { // 동기 실행: scrollHeight 읽기가 레이아웃을 강제하므로 rAF 를 기다릴 필요가 없다
        var over = [];
        slides.forEach(function (s, i) {
          var dy = s.scrollHeight - s.clientHeight, dx = s.scrollWidth - s.clientWidth;
          if (dy > 1 || dx > 1) {
            over.push((i + 1) + (dy > 1 ? ' (+' + dy + 'px)' : '') + (dx > 1 ? ' (x+' + dx + 'px)' : ''));
            wraps[i].classList.add('overflow');
          }
        });
        var b = el('div', 'check-banner');
        if (!over.length) { b.classList.add('ok'); b.textContent = 'OK ' + slides.length + ' slides, no overflow'; }
        else b.textContent = 'OVERFLOW ' + over.length + '/' + slides.length + ': ' + over.join(', ');
        document.body.appendChild(b);
        document.title = b.textContent;
        console.log(b.textContent);
      })();
    }
  });
})();
