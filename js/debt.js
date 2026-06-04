const Debt = {
  render() {
    const debt = Storage.getDebt();
    const totalPagado = debt.items.reduce((a, i) => a + i.pagado, 0);
    const totalDeuda = debt.items.reduce((a, i) => a + i.total, 0);
    const pct = Math.round((totalPagado / totalDeuda) * 100);
    const restante = totalDeuda - totalPagado;

    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">Tracker de Deudas</span>
          <span class="card-icon">💰</span>
        </div>
        <div class="debt-overview">
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:4px">Total deuda</div>
          <div class="debt-total">$${totalDeuda.toLocaleString('es-CO')}</div>
          <div style="margin-top:8px;font-size:14px;color:var(--success);font-weight:600">
            Pagado: $${totalPagado.toLocaleString('es-CO')}
          </div>
          <div style="font-size:13px;color:var(--text-muted)">
            Restante: $${restante.toLocaleString('es-CO')}
          </div>
        </div>
        <div class="debt-bar">
          <div class="debt-fill" style="width:${pct}%"></div>
        </div>
        <div style="text-align:center;font-size:13px;color:var(--text-muted);margin-bottom:16px">
          ${pct}% pagado — ${12 - Math.ceil(pct / 8.33)} meses estimados
        </div>
        <div class="debt-items">
          ${debt.items.map((item, i) => {
            const itemPct = Math.round((item.pagado / item.total) * 100);
            return `
              <div class="debt-item">
                <div class="debt-item-header">
                  <span class="debt-item-name">${item.nombre}</span>
                  <span class="debt-item-amount" style="color:var(--danger)">$${(item.total - item.pagado).toLocaleString('es-CO')}</span>
                </div>
                <div class="progress-bar" style="margin-top:6px">
                  <div class="progress-fill" style="width:${itemPct}%;background:var(--success)"></div>
                </div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px">
                  Pagado: $${item.pagado.toLocaleString('es-CO')} de $${item.total.toLocaleString('es-CO')} (${itemPct}%)
                </div>
                <div class="debt-input-row">
                  <input type="number" id="debt-pay-${i}" placeholder="Abono ($)" min="0">
                  <button class="btn btn-primary btn-sm" onclick="Debt.pay(${i})">Abonar</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },
  pay(idx) {
    const input = document.getElementById('debt-pay-' + idx);
    const amount = parseInt(input.value);
    if (!amount || amount <= 0) return;
    
    const debt = Storage.getDebt();
    debt.items[idx].pagado = Math.min(debt.items[idx].pagado + amount, debt.items[idx].total);
    Storage.setDebt(debt);
    App.refresh();
  }
};
