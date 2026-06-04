const Storage = {
  get(key, fallback = null) {
    try {
      const data = localStorage.getItem('lvl_' + key);
      return data ? JSON.parse(data) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    localStorage.setItem('lvl_' + key, JSON.stringify(value));
  },
  todayKey() {
    return new Date().toISOString().split('T')[0];
  },
  getHabits() {
    return this.get('habits_' + this.todayKey(), {
      oracion: false,
      lectura_biblica: false,
      ejercicio: false,
      agua: false,
      ingles: false,
      lectura: false,
      sin_redes: false,
      journal: false
    });
  },
  setHabits(habits) {
    this.set('habits_' + this.todayKey(), habits);
    this.updateStreak();
  },
  getStreak() {
    return this.get('streak', { count: 0, lastDate: '' });
  },
  updateStreak() {
    const today = this.todayKey();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const streak = this.getStreak();
    
    const allDone = Object.values(this.getHabits()).filter(v => v).length >= 5;
    
    if (streak.lastDate === today) return streak;
    
    if (allDone) {
      if (streak.lastDate === yesterday) {
        streak.count++;
      } else if (streak.lastDate !== today) {
        streak.count = 1;
      }
      streak.lastDate = today;
    }
    
    this.set('streak', streak);
    return streak;
  },
  getWeightLog() {
    return this.get('weight_log', []);
  },
  addWeight(weight) {
    const log = this.getWeightLog();
    log.push({ date: this.todayKey(), weight: parseFloat(weight) });
    this.set('weight_log', log);
  },
  getMeals() {
    return this.get('meals_' + this.todayKey(), {
      desayuno: 0,
      snack1: 0,
      almuerzo: 0,
      snack2: 0,
      cena: 0
    });
  },
  setMeals(meals) {
    this.set('meals_' + this.todayKey(), meals);
  },
  getGoals() {
    return this.get('goals', {
      espiritual: [false, false, false, false],
      fisico: [false, false, false, false],
      mental: [false, false, false, false],
      educativo: [false, false, false, false, false],
      profesional: [false, false, false, false],
      familia: [false, false, false, false]
    });
  },
  setGoals(goals) {
    this.set('goals', goals);
  },
  getDebt() {
    return this.get('debt', {
      total: 29000000,
      pagado: 0,
      items: [
        { nombre: 'Deuda con esposo', total: 27000000, pagado: 0 },
        { nombre: 'Deuda mamá', total: 2000000, pagado: 0 }
      ]
    });
  },
  setDebt(debt) {
    this.set('debt', debt);
  },
  getBooksRead() {
    return this.get('books_read', []);
  },
  toggleBook(mes) {
    const read = this.getBooksRead();
    const idx = read.indexOf(mes);
    if (idx > -1) read.splice(idx, 1);
    else read.push(mes);
    this.set('books_read', read);
    return read;
  },
  getTheme() {
    return this.get('theme', 'dark');
  },
  setTheme(theme) {
    this.set('theme', theme);
  }
};
