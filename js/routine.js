const Routine = {
  weekData: null,
  async load() {
    try {
      const res = await fetch('data/exercises.json');
      this.weekData = await res.json();
    } catch {
      this.weekData = [];
    }
  },
  getToday() {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const today = days[new Date().getDay()];
    return this.weekData ? this.weekData.find(d => d.dia === today) : null;
  },
  render() {
    const today = this.getToday();
    
    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">Rutina de hoy</span>
          <span class="card-icon">${today ? today.icono : '💪'}</span>
        </div>
        ${today ? `
          <div class="exercise-day-title">${today.dia}</div>
          <div class="exercise-day-type">${today.tipo}</div>
          ${today.ejercicios.map(ex => `
            <div class="exercise-item">
              <div class="exercise-sets">${ex.sets}x</div>
              <div class="exercise-info">
                <div class="exercise-name">${ex.nombre}</div>
                <div class="exercise-detail">${ex.detalle}</div>
              </div>
              <span style="color:var(--text-muted);font-size:13px">${ex.reps}</span>
            </div>
          `).join('')}
        ` : `
          <div class="empty-state">
            <div class="empty-icon">😴</div>
            <p>Hoy es día de descanso. Aprovecha para recuperar.</p>
          </div>
        `}
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Toda la semana</span>
        </div>
        ${this.weekData ? this.weekData.map(d => `
          <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;${d.dia === (today ? today.dia : '') ? 'background:var(--primary);margin:0 -16px;padding:10px 16px;border-radius:8px' : ''}">
            <span style="font-size:20px">${d.icono}</span>
            <div style="flex:1">
              <div style="font-weight:600;font-size:14px;${d.dia === (today ? today.dia : '') ? 'color:white' : ''}">${d.dia}</div>
              <div style="font-size:12px;${d.dia === (today ? today.dia : '') ? 'color:rgba(255,255,255,0.8)' : 'color:var(--text-muted)'}">${d.tipo}</div>
            </div>
            <span style="font-size:12px;${d.dia === (today ? today.dia : '') ? 'color:rgba(255,255,255,0.8)' : 'color:var(--text-muted)'}">${d.ejercicios.length} ejercicios</span>
          </div>
        `).join('') : ''}
      </div>
    `;
  }
};
