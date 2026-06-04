const SCHEDULE = [
  { time: '5:30', desc: 'Levantarse' },
  { time: '5:30', desc: 'Oración + lectura bíblica' },
  { time: '6:00', desc: 'Ejercicio (pesas o trotadora)' },
  { time: '6:40', desc: 'Baño + desayuno' },
  { time: '7:15', desc: 'Lectura en voz alta + inglés' },
  { time: '8:00', desc: 'Trabajo' },
  { time: '12:30', desc: 'Almuerzo (comida de casa)' },
  { time: '17:00', desc: 'Estudio técnico' },
  { time: '18:00', desc: 'Tiempo con esposo / cena' },
  { time: '19:00', desc: 'Universidad / trabajo de grado' },
  { time: '20:00', desc: 'Freelance o proyecto personal' },
  { time: '20:30', desc: 'Lectura antes de dormir' },
  { time: '21:30', desc: 'Acostarse' }
];

let currentTab = 'inicio';
let booksData = null;
let newWorker = null;

const App = {
  async init() {
    this.applyTheme();
    
    await Promise.all([
      Verse.load(),
      Routine.load()
    ]);

    try {
      const res = await fetch('data/books.json');
      booksData = await res.json();
    } catch { booksData = []; }

    this.render();
    this.setupNav();
    this.registerSW();
    this.checkForUpdates();
  },

  checkForUpdates() {
    if ('serviceWorker' in navigator) {
      setInterval(() => {
        navigator.serviceWorker.getRegistration().then(reg => {
          if (reg) reg.update();
        });
      }, 60000);
    }
  },

  applyUpdate() {
    if (newWorker) {
      newWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  },

  applyTheme() {
    const theme = Storage.getTheme();
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggleTheme() {
    const current = Storage.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    Storage.setTheme(next);
    this.applyTheme();
    this.refresh();
  },

  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
          newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              const banner = document.getElementById('update-banner');
              if (banner) banner.style.display = 'flex';
            }
          });
        });
      }).catch(() => {});

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  },

  setupNav() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTab = btn.dataset.tab;
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.render();
        window.scrollTo(0, 0);
      });
    });
  },

  refresh() {
    this.render();
  },

  render() {
    const content = document.getElementById('content');
    if (!content) return;

    switch (currentTab) {
      case 'inicio': content.innerHTML = this.renderInicio(); break;
      case 'habitos': content.innerHTML = this.renderHabitos(); break;
      case 'comida': content.innerHTML = this.renderComida(); break;
      case 'metas': content.innerHTML = this.renderMetas(); break;
      case 'mas': content.innerHTML = this.renderMas(); break;
    }

    if (currentTab === 'inicio') {
      setTimeout(() => Weight.renderChart(), 200);
    }
    if (currentTab === 'comida') {
      setTimeout(() => Meals.renderRecipes(), 100);
    }
  },

  renderInicio() {
    const habits = Storage.getHabits();
    const completed = Object.values(habits).filter(v => v).length;
    const streak = Storage.getStreak();
    const log = Storage.getWeightLog();
    const latest = log.length ? log[log.length - 1].weight : 76;
    const meals = Storage.getMeals();
    const totalCal = Object.values(meals).reduce((a, b) => a + b, 0);

    return `
      <div class="fade-in">
        ${Verse.render()}
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">Resumen del día</span>
            <span class="streak-counter">
              <span class="streak-fire">🔥</span>
              ${streak.count} días
            </span>
          </div>
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-value">${completed}/8</div>
              <div class="stat-label">Hábitos hoy</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${latest}</div>
              <div class="stat-label">Peso (kg)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${totalCal}</div>
              <div class="stat-label">Calorías</div>
            </div>
            <div class="stat-item">
              <div class="stat-value" style="color:var(--success)">${76 - latest > 0 ? (76 - latest).toFixed(1) : '0'}</div>
              <div class="stat-label">Kg perdidos</div>
            </div>
          </div>
        </div>

        ${Weight.render()}

        <div class="card">
          <div class="card-header">
            <span class="card-title">Rutina de hoy</span>
            <span class="card-icon">${Routine.getToday() ? Routine.getToday().icono : '💪'}</span>
          </div>
          ${(() => {
            const today = Routine.getToday();
            if (!today) return '<p style="color:var(--text-muted);font-size:13px">Día de descanso</p>';
            return today.ejercicios.slice(0, 4).map(ex => `
              <div class="exercise-item">
                <div class="exercise-sets">${ex.sets}x</div>
                <div class="exercise-info">
                  <div class="exercise-name">${ex.nombre}</div>
                  <div class="exercise-detail">${ex.detalle}</div>
                </div>
              </div>
            `).join('');
          })()}
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Horario ideal</span>
            <span class="card-icon">📋</span>
          </div>
          ${SCHEDULE.map(s => `
            <div class="schedule-item">
              <span class="schedule-time">${s.time}</span>
              <span class="schedule-desc">${s.desc}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderHabitos() {
    return `
      <div class="fade-in">
        ${Habits.render()}
        ${Routine.render()}
      </div>
    `;
  },

  renderComida() {
    return `<div class="fade-in">${Meals.render()}</div>`;
  },

  renderMetas() {
    const booksRead = Storage.getBooksRead();

    return `
      <div class="fade-in">
        ${Goals.render()}
        ${Debt.render()}
        <div class="card">
          <div class="card-header">
            <span class="card-title">Plan de lectura 2025</span>
            <span class="card-icon">📚</span>
          </div>
          <div style="margin-bottom:8px;font-size:12px;color:var(--text-muted)">
            ${booksRead.length} libros leídos
          </div>
          ${booksData ? booksData.filter(b => !b.mes.toString().startsWith('extra')).map(b => {
            const isRead = booksRead.includes(b.mes);
            return `
              <div class="book-item" onclick="App.toggleBook(${b.mes})">
                <div class="book-month ${isRead ? 'read' : ''}">${b.mes}</div>
                <div class="book-info">
                  <div class="book-title" style="${isRead ? 'text-decoration:line-through;opacity:0.6' : ''}">${b.libro}</div>
                  <div class="book-topic">${b.tema}${b.paginas ? ' • ' + b.paginas + ' págs' : ''}</div>
                </div>
                ${isRead ? '<span style="color:var(--success)">✓</span>' : ''}
              </div>
            `;
          }).join('') : '<p>Cargando...</p>'}
          <div style="margin-top:16px">
            <div class="card-title" style="margin-bottom:8px">Extras recomendados</div>
            ${booksData ? booksData.filter(b => b.mes.toString().startsWith('extra')).map(b => {
              const isRead = booksRead.includes(b.mes);
              return `
                <div class="book-item" onclick="App.toggleBook('${b.mes}')">
                  <div class="book-month ${isRead ? 'read' : ''}" style="background:${isRead ? 'var(--success)' : 'var(--secondary)'}">+</div>
                  <div class="book-info">
                    <div class="book-title" style="${isRead ? 'text-decoration:line-through;opacity:0.6' : ''}">${b.libro}</div>
                    <div class="book-topic">${b.tema}</div>
                  </div>
                  ${isRead ? '<span style="color:var(--success)">✓</span>' : ''}
                </div>
              `;
            }).join('') : ''}
          </div>
        </div>
      </div>
    `;
  },

  renderMas() {
    return `
      <div class="fade-in">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Rutina semanal completa</span>
            <span class="card-icon">📅</span>
          </div>
          ${Routine.weekData ? Routine.weekData.map(d => `
            <div style="padding:8px 0;border-bottom:1px solid var(--border)">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                <span style="font-size:18px">${d.icono}</span>
                <strong style="font-size:14px">${d.dia}</strong>
                <span style="font-size:12px;color:var(--text-muted)">${d.tipo}</span>
              </div>
              ${d.ejercicios.map(ex => `
                <div style="display:flex;align-items:center;gap:8px;padding:3px 0 3px 26px">
                  <span style="font-size:11px;color:var(--primary-light);font-weight:600">${ex.sets}x${ex.reps}</span>
                  <span style="font-size:12px;color:var(--text-muted)">${ex.nombre}</span>
                </div>
              `).join('')}
            </div>
          `).join('') : '<p>Cargando...</p>'}
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Ideas para ingresos</span>
            <span class="card-icon">💡</span>
          </div>
          <div class="goal-area">
            <div class="goal-header"><span class="goal-emoji">🤖</span><span class="goal-name">Consultoría IA</span></div>
            <p style="font-size:13px;color:var(--text-muted);padding-left:26px">Automatizaciones con IA para pymes en Medellín. Cobrar $500k-2M COP por proyecto.</p>
          </div>
          <div class="goal-area">
            <div class="goal-header"><span class="goal-emoji">💻</span><span class="goal-name">Freelance Upwork/Toptal</span></div>
            <p style="font-size:13px;color:var(--text-muted);padding-left:26px">Desarrollo web/móvil en USD. Meta: $1,500-3,000 USD/mes cuando inglés sea B2+.</p>
          </div>
          <div class="goal-area">
            <div class="goal-header"><span class="goal-emoji">🎬</span><span class="goal-name">Content Tech en Español</span></div>
            <p style="font-size:13px;color:var(--text-muted);padding-left:26px">YouTube/blog: IA + liderazgo técnico desde Medellín. Nicho casi vacío.</p>
          </div>
          <div class="goal-area">
            <div class="goal-header"><span class="goal-emoji">📱</span><span class="goal-name">App con IA</span></div>
            <p style="font-size:13px;color:var(--text-muted);padding-left:26px">LearnaLand — plataforma educativa gamificada. Proyecto a mediano plazo.</p>
          </div>
          <div class="goal-area">
            <div class="goal-header"><span class="goal-emoji">🎓</span><span class="goal-name">Clases particulares</span></div>
            <p style="font-size:13px;color:var(--text-muted);padding-left:26px">Enseñar programación a estudiantes. $50-100k COP/hora.</p>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Hitos mensuales</span>
            <span class="card-icon">🏆</span>
          </div>
          ${[
            { mes: 1, desc: 'Hábito ejercicio 5x/sem, oración diaria, meal prep, sin redes antes 12pm, perfil Upwork' },
            { mes: 2, desc: '-3-4 kg, inglés A2, empezar Clean Code, primer cliente freelance o primer video' },
            { mes: 3, desc: '-6-8 kg, inglés B1, primera cert AWS, trabajo de grado 50%' },
            { mes: 4, desc: '-10 kg, empezar clases conversación inglés, $500+ USD extras' },
            { mes: 5, desc: '-13 kg, inglés conversacional, proyecto IA o app en progreso' },
            { mes: 6, desc: '-10-12 kg, inglés B2, deuda pagada 50%, trabajo de grado avanzado' },
            { mes: 7, desc: '-15 kg, clases iTalki 2x/sem, freelance estable $1,000+ USD' },
            { mes: 8, desc: 'Cerca meta peso, inglés B2-C1, trabajo de grado casi listo' },
            { mes: 9, desc: 'Prácticamente en meta de peso, avanzar trabajo de grado' },
            { mes: 10, desc: 'Graduada, deuda 27M pagada, ingresos estables' },
            { mes: 11, desc: 'Peso meta, todos los hábitos sólidos' },
            { mes: 12, desc: 'Peso meta ✅, graduada ✅, deuda pagada ✅, ingresos USD estables ✅' }
          ].map(h => `
            <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;gap:10px">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">${h.mes}</div>
              <p style="font-size:12px;color:var(--text-muted);line-height:1.5">${h.desc}</p>
            </div>
          `).join('')}
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Acciones inmediatas esta semana</span>
            <span class="card-icon">⚡</span>
          </div>
          ${[
            'Tirar/regalar comida chatarra de la casa',
            'Descargar MyFitnessPal y registrar comidas',
            'Poner alarma a 5:30am',
            'Caminar 30 min en trotadora (día 1)',
            'Orar 5 min al levantarte',
            'Aprender 3 recetas (huevos, arroz, pollo)',
            'Meal prep el domingo',
            'Cambiar celular a inglés',
            'Bloquear redes (30 min/día max)',
            'Caminar 45 min con esposo el fin de semana'
          ].map((a, i) => `
            <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;display:flex;gap:8px;align-items:start">
              <span style="color:var(--warning);font-weight:700;min-width:18px">${i + 1}.</span>
              <span style="color:var(--text-muted)">${a}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  toggleBook(mes) {
    Storage.toggleBook(mes);
    this.refresh();
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
