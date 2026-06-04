const MEALS_DEF = [
  { key: 'desayuno', name: 'Desayuno', emoji: '🍳', cal: 250 },
  { key: 'snack1', name: 'Snack AM', emoji: '🥜', cal: 150 },
  { key: 'almuerzo', name: 'Almuerzo', emoji: '🍗', cal: 500 },
  { key: 'snack2', name: 'Snack PM', emoji: '🥛', cal: 150 },
  { key: 'cena', name: 'Cena', emoji: '🥗', cal: 320 }
];

const Meals = {
  render() {
    const meals = Storage.getMeals();
    const totalCal = Object.values(meals).reduce((a, b) => a + b, 0);
    const goalCal = 1550;

    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">Alimentación de hoy</span>
          <span class="card-icon">🍽️</span>
        </div>
        <div class="calorie-summary">
          <div>
            <div class="cal-consumed">${totalCal}</div>
            <div class="cal-goal">de ${goalCal} calorías</div>
          </div>
          <div class="progress-bar" style="width:120px;height:8px">
            <div class="progress-fill" style="width:${Math.min(100, (totalCal / goalCal) * 100)}%;background:${totalCal > goalCal ? 'var(--danger)' : 'var(--success)'}"></div>
          </div>
        </div>
        <div class="meal-tracker">
          ${MEALS_DEF.map(m => `
            <div class="meal-slot ${meals[m.key] > 0 ? 'active' : ''}" onclick="Meals.toggleMeal('${m.key}', ${m.cal})">
              <div class="meal-emoji">${m.emoji}</div>
              <div class="meal-name">${m.name}</div>
              <div class="meal-cal">${meals[m.key] > 0 ? meals[m.key] + ' cal' : m.cal + ' cal'}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Mis Recetas</span>
          <span class="card-icon">👨‍🍳</span>
        </div>
        <div id="recipes-list">Cargando recetas...</div>
      </div>
    `;
  },
  toggleMeal(key, cal) {
    const meals = Storage.getMeals();
    meals[key] = meals[key] > 0 ? 0 : cal;
    Storage.setMeals(meals);
    App.refresh();
  },
  async renderRecipes() {
    try {
      const res = await fetch('data/recipes.json');
      const recipes = await res.json();
      const container = document.getElementById('recipes-list');
      if (!container) return;

      container.innerHTML = recipes.map(r => `
        <div class="recipe-card" style="margin-bottom:12px">
          <div class="recipe-header">
            <div>
              <div class="recipe-name">${r.nombre}</div>
              <div class="recipe-meta">
                <span class="recipe-tag">${r.tiempo}</span>
                <span class="recipe-tag" style="background:var(--success)">${r.calorias} cal</span>
                <span class="recipe-tag" style="background:var(--secondary)">${r.proteina}g proteína</span>
              </div>
            </div>
          </div>
          <div class="recipe-section-title">Ingredientes</div>
          <ul class="recipe-list">
            ${r.ingredientes.map(i => `<li>${i}</li>`).join('')}
          </ul>
          <div class="recipe-section-title">Preparación</div>
          <ol class="recipe-steps">
            ${r.pasos.map(p => `<li>${p}</li>`).join('')}
          </ol>
        </div>
      `).join('');
    } catch (e) {
      const container = document.getElementById('recipes-list');
      if (container) container.innerHTML = '<p style="color:var(--text-muted);font-size:13px">Error cargando recetas</p>';
    }
  }
};
