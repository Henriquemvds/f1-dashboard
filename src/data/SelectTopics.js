// SelectTopics.js
class SelectTopicsManager {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // retorna função para remover
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;

    this.listeners[event] = this.listeners[event].filter(fn => fn !== callback);
  }

  emit(event, data) {
    if (!this.listeners[event]) return;

    this.listeners[event].forEach(fn => fn(data));
  }
}

export const SelectTopics = new SelectTopicsManager();
