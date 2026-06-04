const Weight = {
  render() {
    const log = Storage.getWeightLog();
    const latest = log.length ? log[log.length - 1].weight : 76;
    const start = 76;
    const goal = 58;
    const lost = start - latest;
    const remaining = latest - goal;
    const pct = Math.min(100, Math.round(((start - latest) / (start - goal)) * 100));

    let status = 'var(--danger)';
    if (pct >= 75) status = 'var(--success)';
    else if (pct >= 40) status = 'var(--warning)';

    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">Peso y Progreso</span>
          <span class="card-icon">⚖️</span>
        </div>
        <div class="stat-grid">
          <div class="stat-item">
            <div class="stat-value">${latest}</div>
            <div class="stat-label">Peso actual (kg)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" style="color:var(--success)">${lost > 0 ? '-' + lost.toFixed(1) : '0'}</div>
            <div class="stat-label">Kg perdidos</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" style="color:var(--warning)">${remaining > 0 ? remaining.toFixed(1) : '0'}</div>
            <div class="stat-label">Kg por perder</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${goal}</div>
            <div class="stat-label">Meta (kg)</div>
          </div>
        </div>
        <div class="progress-bar" style="margin-top:12px;height:12px">
          <div class="progress-fill" style="width:${Math.max(0, pct)}%;background:${status}"></div>
        </div>
        <div style="text-align:center;margin:8px 0;font-size:13px;color:var(--text-muted)">
          ${pct}% hacia tu meta
        </div>
        <div class="weight-input-row">
          <input type="number" id="weight-input" placeholder="Peso hoy (kg)" step="0.1" min="40" max="120" value="">
          <button class="btn btn-primary btn-sm" onclick="Weight.add()">Registrar</button>
        </div>
        ${log.length > 1 ? `
          <div class="weight-chart-container">
            <canvas id="weight-chart"></canvas>
          </div>
          <div style="margin-top:12px">
            <div class="card-title" style="margin-bottom:8px">Historial</div>
            ${log.slice(-10).reverse().map(e => `
              <div class="schedule-item">
                <span class="schedule-time">${e.date}</span>
                <span class="schedule-desc">${e.weight} kg</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  },
  add() {
    const input = document.getElementById('weight-input');
    const val = parseFloat(input.value);
    if (!val || val < 40 || val > 120) return;
    Storage.addWeight(val);
    App.refresh();
    setTimeout(() => Weight.renderChart(), 100);
  },
  renderChart() {
    const canvas = document.getElementById('weight-chart');
    if (!canvas) return;
    const log = Storage.getWeightLog();
    if (log.length < 2) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 200;

    const weights = log.map(e => e.weight);
    const minW = Math.min(...weights) - 2;
    const maxW = Math.max(...weights) + 2;
    const w = canvas.width;
    const h = canvas.height;
    const padding = 30;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(124, 58, 237, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * (h - 2 * padding) / 4);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();

      const label = (maxW - (i * (maxW - minW) / 4)).toFixed(0);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText(label, 0, y + 3);
    }

    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, '#7c3aed');
    gradient.addColorStop(1, '#ec4899');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    weights.forEach((weight, i) => {
      const x = padding + (i * (w - padding - 10) / (weights.length - 1));
      const y = padding + ((maxW - weight) / (maxW - minW)) * (h - 2 * padding);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    weights.forEach((weight, i) => {
      const x = padding + (i * (w - padding - 10) / (weights.length - 1));
      const y = padding + ((maxW - weight) / (maxW - minW)) * (h - 2 * padding);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#7c3aed';
      ctx.fill();
      ctx.strokeStyle = '#0f0f1a';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    const goalY = padding + ((maxW - 58) / (maxW - minW)) * (h - 2 * padding);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding, goalY);
    ctx.lineTo(w - 10, goalY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#10b981';
    ctx.font = '10px sans-serif';
    ctx.fillText('Meta: 58', w - 55, goalY - 5);
  }
};
