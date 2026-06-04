const GOALS_DEF = {
  espiritual: {
    emoji: '🙏',
    name: 'Espiritual',
    color: 'var(--primary)',
    items: [
      'Oración diaria de 5+ minutos',
      'Lectura bíblica diaria',
      'Adoración 3+ veces/semana',
      'Vigilia 1 noche/semana'
    ]
  },
  fisico: {
    emoji: '🏋️‍♀️',
    name: 'Físico y Salud',
    color: 'var(--success)',
    items: [
      'Ejercicio 5x/semana',
      'Perder 18kg (76→58)',
      'Aprender 5 recetas base',
      'Dormir 7-8 horas diario'
    ]
  },
  mental: {
    emoji: '🧠',
    name: 'Mental',
    color: 'var(--secondary)',
    items: [
      'Meditación 5 min/día',
      'Leer en voz alta 5 min/día',
      'Redes <30 min/día',
      'Journal 5 min/día'
    ]
  },
  educativo: {
    emoji: '🎓',
    name: 'Educativo',
    color: 'var(--orange)',
    items: [
      'Terminar trabajo de grado',
      'Inglés nivel B2',
      'Leer 12 libros técnicos',
      'Certificación AWS',
      'Aprender IA práctica'
    ]
  },
  profesional: {
    emoji: '💼',
    name: 'Profesional',
    color: 'var(--pink)',
    items: [
      'Mejorar como líder técnica',
      'Generar ingresos en USD',
      'Sobresalir con resultados',
      'Manejar timidez y sensibilidad'
    ]
  },
  familia: {
    emoji: '❤️',
    name: 'Familia y Relaciones',
    color: 'var(--warning)',
    items: [
      'Enamorar esposo cada día',
      'Pagar deuda mamá',
      'Inspirar a mis hermanos',
      'Conseguir amigos verdaderos'
    ]
  }
};

const Goals = {
  render() {
    const goals = Storage.getGoals();
    
    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">Mis Metas</span>
          <span class="card-icon">🎯</span>
        </div>
        ${Object.entries(GOALS_DEF).map(([key, area]) => {
          const done = goals[key].filter(v => v).length;
          const total = goals[key].length;
          const pct = Math.round((done / total) * 100);
          return `
            <div class="goal-area">
              <div class="goal-header">
                <span class="goal-emoji">${area.emoji}</span>
                <span class="goal-name">${area.name}</span>
                <span class="tag tag-${key === 'espiritual' ? 'purple' : key === 'fisico' ? 'green' : key === 'mental' ? 'blue' : key === 'educativo' ? 'orange' : key === 'profesional' ? 'pink' : 'purple'}">${done}/${total}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${pct}%;background:${area.color}"></div>
              </div>
              <div class="goal-items">
                ${area.items.map((item, i) => `
                  <div class="goal-item">
                    <div class="mini-check ${goals[key][i] ? 'done' : ''}" onclick="Goals.toggle('${key}', ${i})"></div>
                    <span style="${goals[key][i] ? 'text-decoration:line-through;opacity:0.6' : ''}">${item}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },
  toggle(area, idx) {
    const goals = Storage.getGoals();
    goals[area][idx] = !goals[area][idx];
    Storage.setGoals(goals);
    App.refresh();
  }
};
