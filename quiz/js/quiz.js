'use strict';
const questions = [
  { question: 'Qual musical tem a temporada mais longa da história da Broadway?', answers: ['O Fantasma da Ópera', 'Cats', 'Chicago', 'O Rei Leão'], explanation: 'O Fantasma da Ópera estreou em 1988 e ficou em cartaz até 2023.' },
  { question: 'Quem criou o musical "Hamilton"?', answers: ['Lin-Manuel Miranda', 'Andrew Lloyd Webber', 'Stephen Sondheim', 'Alan Menken'], explanation: 'Lin-Manuel Miranda criou o texto, as músicas e as letras de Hamilton.' },
  { question: '"Les Misérables" é baseado na obra de qual escritor?', answers: ['Victor Hugo', 'Alexandre Dumas', 'Charles Dickens', 'Gustave Flaubert'], explanation: 'O musical adapta o romance Os Miseráveis, de Victor Hugo.' },
  { question: 'Qual é o principal prêmio do teatro da Broadway?', answers: ['Tony Awards', 'Oscar', 'Grammy', 'Emmy'], explanation: 'Os Tony Awards celebram as produções e os profissionais do teatro da Broadway.' },
  { question: 'Quem escreveu o musical brasileiro "Ópera do Malandro" (1978)?', answers: ['Chico Buarque', 'Caetano Veloso', 'Gilberto Gil', 'Tom Jobim'], explanation: 'Chico Buarque escreveu Ópera do Malandro, que estreou em 1978.' },
  { question: 'No teatro, o que é a "coxia"?', answers: ['Área lateral do palco, escondida do público', 'A primeira fila da plateia', 'O figurino principal', 'O ensaio final'], explanation: 'A coxia fica nas laterais do palco, fora da visão do público, e dá acesso à cena.' },
  { question: 'O musical "Cats" foi inspirado em poemas de qual autor?', answers: ['T. S. Eliot', 'William Shakespeare', 'Edgar Allan Poe', 'Lewis Carroll'], explanation: 'Cats nasceu de uma coletânea de poemas sobre gatos escrita por T. S. Eliot.' },
  { question: 'Em "Wicked", qual é o nome da bruxa de pele verde?', answers: ['Elphaba', 'Glinda', 'Dorothy', 'Nessarose'], explanation: 'Elphaba é a bruxa de pele verde cuja história é contada em Wicked.' },
  { question: 'Qual palavra artistas brasileiros dizem para desejar boa sorte antes de entrar em cena?', answers: ['Merda', 'Sucesso', 'Bravo', 'Axé'], explanation: '“Merda” é uma expressão tradicional do teatro para desejar boa sorte antes de uma apresentação.' },
  { question: 'Como se chama a parte do palco à frente da boca de cena, mais próxima da plateia?', answers: ['Proscênio', 'Urdimento', 'Camarim', 'Bastidor'], explanation: 'O proscênio é a parte do palco que avança à frente da boca de cena, em direção à plateia.' }
];
const profiles = [
  { max: 3, title: 'Talento em Ensaio', description: 'Todo grande artista começa com uma descoberta. Continue explorando o teatro musical: seu próximo ato pode surpreender!' },
  { max: 6, title: 'Estrela em Ascensão', description: 'Você já conhece os caminhos do palco e tem muito brilho para mostrar. A cada nova descoberta, sua estrela ganha mais força!' },
  { max: 8, title: 'Protagonista da Cena', description: 'Você domina o assunto e chega com presença de protagonista. Seu repertório já merece uma bela salva de palmas!' },
  { max: 10, title: 'Lenda da Broadway', description: 'Seu conhecimento é digno dos grandes palcos! Você atravessou este espetáculo com o repertório de uma verdadeira lenda.' }
];
const $ = id => document.getElementById(id);
let current = 0, score = 0, streak = 0, answered = false, timer = null, deadline = 0, confettiFrame = null, toastTimer = null;
function showScreen(id) {
  for (const screen of document.querySelectorAll('.screen')) screen.hidden = screen.id !== id;
}
function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function updateStats() {
  $('score').textContent = `Acertos: ${score}`;
  $('streak').textContent = `Sequência: ${streak}`;
}
function start() {
  clearInterval(timer);
  stopConfetti();
  clearTimeout(toastTimer);
  $('toast').hidden = true;
  current = score = streak = 0;
  showScreen('quiz');
  renderQuestion();
}
function renderQuestion() {
  answered = false;
  const item = questions[current];
  $('progress-label').textContent = `PERGUNTA ${current + 1} DE ${questions.length}`;
  $('progress').style.width = `${(current + 1) / questions.length * 100}%`;
  updateStats();
  $('question').textContent = item.question;
  $('feedback').hidden = true;
  $('next-btn').hidden = true;
  $('next-btn').innerHTML = current === questions.length - 1 ? 'Ver resultado <span aria-hidden="true">→</span>' : 'Próxima <span aria-hidden="true">→</span>';
  $('options').replaceChildren();
  shuffle(item.answers.map((text, index) => ({ text, correct: index === 0 }))).forEach((answer, index) => {
    const button = document.createElement('button');
    button.className = 'option';
    button.dataset.testid = 'option';
    button.dataset.correct = String(answer.correct);
    const letter = document.createElement('span');
    letter.className = 'option-letter';
    letter.setAttribute('aria-hidden', 'true');
    letter.textContent = String.fromCharCode(65 + index);
    const label = document.createElement('span');
    label.textContent = answer.text;
    button.append(letter, label);
    button.addEventListener('click', () => answerQuestion(button));
    $('options').append(button);
  });
  deadline = performance.now() + 20000;
  tick();
  timer = setInterval(tick, 100);
  $('question').focus({ preventScroll: true });
}
function tick() {
  const remaining = Math.max(0, deadline - performance.now());
  $('timer-text').textContent = `${Math.ceil(remaining / 1000)}s`;
  $('timer-bar').style.transform = `scaleX(${remaining / 20000})`;
  $('timer-bar').classList.toggle('urgent', remaining <= 5000);
  if (remaining <= 0) answerQuestion(null);
}
function answerQuestion(selected) {
  if (answered) return;
  if (selected && performance.now() >= deadline) selected = null;
  answered = true;
  clearInterval(timer);
  const correct = selected?.dataset.correct === 'true';
  if (correct) { score++; streak++; } else { streak = 0; }
  for (const button of $('options').children) {
    button.disabled = true;
    if (button.dataset.correct === 'true') {
      button.classList.add('correct');
      button.setAttribute('aria-label', `${button.textContent.slice(1)} — resposta correta`);
    } else if (button === selected) {
      button.classList.add('wrong');
      button.setAttribute('aria-label', `${button.textContent.slice(1)} — resposta incorreta`);
    }
  }
  updateStats();
  $('feedback-title').textContent = correct ? 'Você acertou! ✦' : selected ? 'Ainda não foi desta vez!' : 'O tempo acabou!';
  $('explanation').textContent = `${correct ? '' : `Resposta correta: ${questions[current].answers[0]}. `}${questions[current].explanation}`;
  $('feedback').hidden = false;
  $('next-btn').hidden = false;
}
function finish() {
  clearInterval(timer);
  const profile = profiles.find(item => score <= item.max);
  $('final-score').innerHTML = `${score}<span>/10</span>`;
  $('result-title').textContent = profile.title;
  $('profile-description').textContent = profile.description;
  showScreen('result');
  $('result-title').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
  launchConfetti();
}
async function share() {
  const profile = profiles.find(item => score <= item.max);
  const url = new URL(location.href);
  url.hash = '';
  const data = { title: 'Quiz do Teatro Musical — Fábrica de Talentos', text: `Fiz ${score}/10 no Quiz do Teatro Musical! Meu perfil artístico: ${profile.title}. Descubra o seu!`, url: url.href };
  if (navigator.share) {
    try { await navigator.share(data); return; }
    catch (error) { if (error.name === 'AbortError') return; }
  }
  try {
    await navigator.clipboard.writeText(url.href);
  } catch {
    const field = document.createElement('textarea');
    field.value = url.href;
    field.style.cssText = 'position:fixed;left:0;top:0;opacity:0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) { showToast('Não foi possível copiar o link. Copie o endereço do navegador.'); return; }
  }
  showToast('Link copiado!');
}
function showToast(message) {
  clearTimeout(toastTimer);
  $('toast').textContent = message;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 3500);
}
function stopConfetti() {
  cancelAnimationFrame(confettiFrame);
  const canvas = $('confetti');
  canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
}
function launchConfetti() {
  stopConfetti();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = $('confetti'), context = canvas.getContext('2d');
  if (!context) return;
  const width = innerWidth, height = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  const pieces = Array.from({ length: 100 }, () => ({ x: Math.random() * width, y: -Math.random() * height, speed: 1.5 + Math.random() * 3, angle: Math.random() * Math.PI, drift: Math.random() * 2 - 1, color: ['#d9a93b', '#f3cf6b', '#f4efe6'][Math.floor(Math.random() * 3)] }));
  const started = performance.now();
  let previous = started;
  function frame(now) {
    const step = Math.min((now - previous) / 16.67, 3);
    previous = now;
    context.clearRect(0, 0, width, height);
    for (const piece of pieces) {
      piece.y += piece.speed * step;
      piece.x += piece.drift * step;
      piece.angle += .035 * step;
      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.angle);
      context.fillStyle = piece.color;
      context.fillRect(-3, -5, 6, 10);
      context.restore();
    }
    if (now - started < 5500) confettiFrame = requestAnimationFrame(frame);
    else context.clearRect(0, 0, width, height);
  }
  confettiFrame = requestAnimationFrame(frame);
}
$('start-btn').addEventListener('click', start);
$('restart-btn').addEventListener('click', start);
$('next-btn').addEventListener('click', () => {
  if (!answered) return;
  current++;
  if (current < questions.length) renderQuestion(); else finish();
});
$('share-btn').addEventListener('click', share);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && !answered && !$('quiz').hidden) tick();
});
