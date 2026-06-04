const HABITS_DEF = [
  { key: 'oracion', name: 'Oración', desc: '5 min de oración', emoji: '🙏' },
  { key: 'lectura_biblica', name: 'Lectura bíblica', desc: 'Leer la Biblia', emoji: '📖' },
  { key: 'ejercicio', name: 'Ejercicio', desc: 'Rutina del día', emoji: '🏋️‍♀️' },
  { key: 'agua', name: 'Agua', desc: '8 vasos de agua', emoji: '💧' },
  { key: 'ingles', name: 'Inglés', desc: '30 min de práctica', emoji: '🇺🇸' },
  { key: 'lectura', name: 'Lectura', desc: '30 min de libro', emoji: '📚' },
  { key: 'sin_redes', name: 'Sin redes', desc: 'Reducción de redes', emoji: '📵' },
  { key: 'journal', name: 'Journal', desc: '5 min de escritura', emoji: '✍️' }
];

const Habits = {
  render() {
    const habits = Storage.getHabits();
    const completed = Object.values(habits).filter(v => v).length;
    const total = Object.keys(habits).length;
    const pct = Math.round((completed / total) * 100);

    let color = 'var(--danger)';
    if (pct >= 75) color = 'var(--success)';
    else if (pct >= 50) color = 'var(--warning)';

    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">Hábitos de hoy</span>
          <span class="streak-counter">
            <span class="streak-fire">🔥</span>
            ${Storage.getStreak().count} días
          </span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%;background:${color}"></div>
        </div>
        <div style="text-align:center;margin:8px 0;font-size:13px;color:var(--text-muted)">
          ${completed}/${total} completados (${pct}%)
        </div>
        <ul class="habit-list">
          ${HABITS_DEF.map(h => `
            <li class="habit-item" onclick="Habits.toggle('${h.key}')">
              <div class="habit-check ${habits[h.key] ? 'done' : ''}"></div>
              <div class="habit-info">
                <div class="habit-name">${h.name}</div>
                <div class="habit-desc">${h.desc}</div>
              </div>
              <span class="habit-emoji">${h.emoji}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  },
  toggle(key) {
    const habits = Storage.getHabits();
    habits[key] = !habits[key];
    Storage.setHabits(habits);
    App.refresh();
  }
};
