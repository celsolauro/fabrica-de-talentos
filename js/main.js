// Contagem regressiva: 20/11/2026 23:59 America/Sao_Paulo (UTC-3) — horário a confirmar
(function(){
  var end = new Date('2026-11-20T23:59:00-03:00').getTime();
  var el = function(i){return document.getElementById(i)};
  function pad(n){return String(n).padStart(2,'0')}
  function tick(){
    var t = Math.max(0, end - Date.now());
    el('d').textContent = Math.floor(t/864e5);
    el('h').textContent = pad(Math.floor(t/36e5)%24);
    el('m').textContent = pad(Math.floor(t/6e4)%60);
    el('s').textContent = pad(Math.floor(t/1e3)%60);
    if (!t) { document.querySelector('.cd-label').textContent = 'Inscrições encerradas'; clearInterval(iv); }
  }
  var iv = setInterval(tick, 1000); tick();

  // Repassa parâmetros UTM da URL ao link do formulário
  var FORM_URL = ''; // [A CONFIRMAR] link do formulário de inscrição
  var a = el('cta-form'); var src = new URLSearchParams(location.search);
  if (FORM_URL) {
    var u = new URL(FORM_URL);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(k){
      if (src.get(k)) u.searchParams.set(k, src.get(k));
    });
    a.href = u.toString(); a.target = '_blank'; a.rel = 'noopener';
    el('form-note').hidden = true;
  } else {
    a.addEventListener('click', function(e){ e.preventDefault(); alert('Link do formulário [A CONFIRMAR]'); });
  }
})();
