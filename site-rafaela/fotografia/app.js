(function(){
  var STR = {
    pt: {
      pageTitle: 'Fotografia',
      brandSub: 'Montadora e<br>Assistente de Montagem',
      navWorks: 'Trabalhos', navContact: 'Contato',
      footerRole: 'Montadora e Assistente de Montagem',
      photo: 'Fotografia', menu: 'Abrir menu', menuClose: 'Fechar menu',
      docTitle: 'Fotografia | Rafaela Fontana'
    },
    en: {
      pageTitle: 'Photography',
      brandSub: 'Film Editor &<br>Assistant Editor',
      navWorks: 'Works', navContact: 'Contact',
      footerRole: 'Film Editor and Assistant Editor',
      photo: 'Photograph', menu: 'Open menu', menuClose: 'Close menu',
      docTitle: 'Photography | Rafaela Fontana'
    }
  };

  // mesma chave de idioma da home, então a escolha vale nas duas páginas
  var lang = 'pt';
  try { if (localStorage.getItem('lang') === 'en') lang = 'en'; } catch(e){}

  var galeria = document.getElementById('galeria');
  var imgs = [];
  var figs = [];
  (window.PHOTOS || []).forEach(function(item, i){
    var p = typeof item === 'string' ? { src: item } : item;
    var src = /^(data:|https?:|\/)/.test(p.src) ? p.src : 'img/' + p.src;
    var fig = document.createElement('figure');
    var img = document.createElement('img');
    img.src = src;
    img.decoding = 'async';
    if (i > 2) img.loading = 'lazy';
    if (p.w && p.h){ img.width = p.w; img.height = p.h; }
    fig._ratio = (p.w && p.h) ? p.w / p.h : 1.5;   // sem w/h: supõe 3:2 até a foto carregar
    if (!(p.w && p.h)){
      img.addEventListener('load', function(){
        if (img.naturalWidth){ fig._ratio = img.naturalWidth / img.naturalHeight; relayout(true); }
      });
    }
    img._alt = p.alt || null;
    img._n = i + 1;
    fig.appendChild(img);
    figs.push(fig);
    imgs.push(img);
  });

  // Colunas preenchidas na ordem da lista, da esquerda pra direita: cada foto vai
  // para a coluna mais baixa no momento. 3 colunas no computador, 2 no tablet, 1 no celular.
  var colunas = 0;
  function quantasColunas(){
    var w = window.innerWidth;
    return w <= 560 ? 1 : (w <= 1000 ? 2 : 3);
  }
  function relayout(force){
    var n = quantasColunas();
    if (n === colunas && !force) return;
    colunas = n;
    galeria.textContent = '';
    var cols = [], alturas = [];
    for (var c = 0; c < n; c++){
      var col = document.createElement('div');
      col.className = 'col';
      galeria.appendChild(col);
      cols.push(col); alturas.push(0);
    }
    figs.forEach(function(fig){
      var k = alturas.indexOf(Math.min.apply(null, alturas));
      cols[k].appendChild(fig);
      alturas[k] += 1 / fig._ratio + 0.03;
    });
  }
  relayout(true);
  window.addEventListener('resize', function(){ relayout(false); });

  var toggle = document.getElementById('lang-toggle');
  var navBtn = document.getElementById('nav-toggle');

  function apply(){
    var t = STR[lang];
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    document.title = t.docTitle;
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function(el){
      el.innerHTML = t[el.getAttribute('data-i18n')];
    });
    imgs.forEach(function(img){
      img.alt = (img._alt && img._alt[lang]) || (t.photo + ' ' + img._n);
    });
    toggle.textContent = lang === 'en' ? 'PT|EN' : 'EN|PT';
    navBtn.setAttribute('aria-label', document.body.classList.contains('nav-open') ? t.menuClose : t.menu);
  }

  toggle.addEventListener('click', function(e){
    e.preventDefault();
    lang = lang === 'en' ? 'pt' : 'en';
    try { localStorage.setItem('lang', lang); } catch(err){}
    apply();
  });

  function setNav(open){
    document.body.classList.toggle('nav-open', open);
    navBtn.setAttribute('aria-expanded', String(open));
    navBtn.setAttribute('aria-label', STR[lang][open ? 'menuClose' : 'menu']);
  }
  navBtn.addEventListener('click', function(){ setNav(!document.body.classList.contains('nav-open')); });
  Array.prototype.forEach.call(document.querySelectorAll('#site-nav a'), function(a){
    a.addEventListener('click', function(){ setNav(false); });
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setNav(false); });

  apply();
})();
