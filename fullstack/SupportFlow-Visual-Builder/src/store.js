// Reactive pub/sub store — no external dependencies.
const subscribers = {};

export const state = {
  nodes: [],
  selectedId: null,
  mode: 'editor',   
  history: [],     
};

export function subscribe(event, fn) {
  (subscribers[event] ??= []).push(fn);
}

export function emit(event, data) {
  (subscribers[event] ?? []).forEach(fn => fn(data));
}

export function loadNodes(nodes) {
  state.nodes = nodes.map(deepCopyNode);
  emit('nodes:changed', state.nodes);
}

export function selectNode(id) {
  state.selectedId = id;
  emit('node:selected', id);
}

export function updateNodeText(id, text) {
  _pushHistory();
  const node = state.nodes.find(n => n.id === id);
  if (node) {
    node.text = text;
    emit('nodes:changed', state.nodes);
  }
}

export function updateOptionLabel(nodeId, optionIndex, label) {
  _pushHistory();
  const node = state.nodes.find(n => n.id === nodeId);
  if (node && node.options[optionIndex]) {
    node.options[optionIndex].label = label;
    emit('nodes:changed', state.nodes);
  }
}

export function updateNodePosition(id, x, y) {
  const node = state.nodes.find(n => n.id === id);
  if (node) {
    node.position.x = x;
    node.position.y = y;
    emit('nodes:moved', id);
  }
}

export function setMode(mode) {
  state.mode = mode;
  emit('mode:changed', mode);
}

export function undo() {
  if (!state.history.length) return;
  state.nodes = state.history.pop();
  emit('nodes:changed', state.nodes);
}

function _pushHistory() {
  state.history.push(state.nodes.map(deepCopyNode));
  if (state.history.length > 50) state.history.shift();
}

function deepCopyNode(n) {
  return {
    ...n,
    position: { ...n.position },
    options: n.options.map(o => ({ ...o })),
  };
}