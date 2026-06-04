const Verse = {
  todayVerse: null,
  async load() {
    try {
      const res = await fetch('data/verses.json');
      const verses = await res.json();
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      this.todayVerse = verses[dayOfYear % verses.length];
    } catch {
      this.todayVerse = 'Confía en el Señor con todo tu corazón. - Proverbios 3:5';
    }
  },
  render() {
    if (!this.todayVerse) return '';
    const parts = this.todayVerse.split(' - ');
    return `
      <div class="card verse-card">
        <div class="card-header">
          <span class="card-title">Versículo del día</span>
          <span class="card-icon">✨</span>
        </div>
        <div class="verse-text">"${parts[0]}"</div>
        <div class="verse-ref">— ${parts[1] || ''}</div>
      </div>
    `;
  }
};
