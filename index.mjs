const IS_BROWSER = typeof document !== 'undefined';
const CHANGE_EVENT_NAME = 'visibilitychange';

// NodeJS defines an internal EventTarget and Events, but does not expose them. Fortunately, our usage is trivial.

function assertVisibilitychange(eventType) {
  if (eventType !== CHANGE_EVENT_NAME) throw new Error('hidableDocument is meant to be used only with the visibilitychange event.');
}

export const hidableDocument = IS_BROWSER ? window.document : { // Simulate the import behavior corresponding to simulateVisibility, below.
  addEventListener(eventType, handler) {
    assertVisibilitychange(eventType);
    const handlers = this[eventType] || [];
    this[eventType] = handlers;
    handlers.push(handler);
  },
  removeEventListener(eventType, handler) {
    assertVisibilitychange(eventType);
    this[eventType] = this[eventType].filter(h => h !== handler);
  },
  dispatchEvent(event) {
    assertVisibilitychange(event.type);
    this[event.type].forEach(h => h(event));
  }
};

const EventClass = IS_BROWSER ? Event : class Event {
  constructor(type) { this.type = type; }
};

export function simulateVisibility(state) {
  // Same implimentation in browser and NodeJS.
  if (!['hidden', 'visible'].includes(state)) return Promise.reject('state should be one of: hidden, visible.');

  Object.defineProperty(hidableDocument, 'visibilityState', {value: state, writable: true});
  hidableDocument.dispatchEvent(new EventClass(CHANGE_EVENT_NAME));
  return Promise.resolve(state === 'visible');
}

