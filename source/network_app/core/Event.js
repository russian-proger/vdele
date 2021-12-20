export default function Event() {
  const listeners = new Map();

  // Добавляет слушатель
  this.addEventListener = (eventType, listener) => {
    if (!listeners.has(eventType)) {
      listeners.set(eventType, new Set());
    }
    listeners.get(eventType).add(listener);
    return () => this.removeEventListener(eventType, listener);
  }

  // Удаляет слушатель
  this.removeEventListener = (eventType, listener) => {
    if (!listeners.has(eventType)) return false;
    return listeners.get(eventType).delete(listener);
  }

  /**
   * Call event listeners
   * @param {string} eventType event name
   * @param {Array<any>} arguments arguments for listeners
   * @returns {void}
   */
  this.dispatchEvent = (eventType, args=[]) => {
    if (!listeners.has(eventType)) return false;
    listeners.get(eventType).forEach(v => v(...args));
  }
}