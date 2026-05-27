// Graph renderer
import {
  state,
  subscribe,
  selectNode,
  updateNodePosition,
  emit
} from './store.js';

let canvas, svgOverlay;

// Drag state
const drag = {
  active: false,
  nodeId: null,
  startMx: 0,
  startMy: 0,
  startNx: 0,
  startNy: 0
};

// Initialize graph
export function initGraph(_canvas, _svg) {
  canvas = _canvas;
  svgOverlay = _svg;

  subscribe('nodes:changed', () => fullRender());
  subscribe('nodes:moved', () => redrawConnectors());
  subscribe('node:selected', id => highlightSelected(id));

  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);

  // Redraw on scroll
  canvas.addEventListener('scroll', redrawConnectors);
}

// Render all nodes
export function fullRender() {
  canvas.querySelectorAll('.node-card').forEach(el => el.remove());

  state.nodes.forEach(node => {
    canvas.appendChild(buildCard(node));
  });

  redrawConnectors();
}

// Create node card
function buildCard(node) {
  const typeLabel = {
    start: 'Start',
    question: 'Question',
    end: 'End'
  }[node.type] ?? node.type;

  const card = document.createElement('div');

  card.className = 'node-card';
  card.dataset.id = node.id;
  card.dataset.type = node.type;

  card.style.left = node.position.x + 'px';
  card.style.top = node.position.y + 'px';

  const optionsHtml = node.options.length
    ? node.options
        .map(o => `<div class="node-option">${esc(o.label)}</div>`)
        .join('')
    : `<div class="node-option">End of flow</div>`;

  card.innerHTML = `
    <div class="node-header">
      <span class="node-type-badge">${typeLabel}</span>
    </div>

    <div class="node-body">
      <div class="node-question">${esc(node.text)}</div>

      <div class="node-options">
        ${optionsHtml}
      </div>
    </div>
  `;

  // Select node
  card.addEventListener('click', e => {
    e.stopPropagation();

    selectNode(node.id);
    emit('node:clicked', node.id);
  });

  // Drag node
  card.addEventListener('mousedown', e => {
    onDragStart(e, node, card);
  });

  return card;
}

// Start dragging
function onDragStart(e, node, card) {
  if (e.target.closest('input, textarea, button')) return;

  drag.active = true;
  drag.nodeId = node.id;
  drag.card = card;

  drag.startMx = e.clientX;
  drag.startMy = e.clientY;

  drag.startNx = node.position.x;
  drag.startNy = node.position.y;

  card.classList.add('dragging');

  e.preventDefault();
}

// Move node
function onDragMove(e) {
  if (!drag.active) return;

  const dx = e.clientX - drag.startMx;
  const dy = e.clientY - drag.startMy;

  const newX = Math.max(0, drag.startNx + dx);
  const newY = Math.max(0, drag.startNy + dy);

  drag.card.style.left = newX + 'px';
  drag.card.style.top = newY + 'px';

  updateNodePosition(drag.nodeId, newX, newY);
}

// Stop dragging
function onDragEnd() {
  if (!drag.active) return;

  drag.active = false;

  drag.card?.classList.remove('dragging');
  drag.card = null;
}

// Highlight selected node
function highlightSelected(id) {
  canvas.querySelectorAll('.node-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.id === id);
  });
}

// Draw connection lines
export function redrawConnectors() {
  svgOverlay.innerHTML = '';

  state.nodes.forEach(parent => {
    parent.options.forEach(opt => {
      if (!opt.nextId) return;

      const child = state.nodes.find(n => n.id === opt.nextId);

      if (!child) return;

      const pEl = canvas.querySelector(
        `.node-card[data-id="${parent.id}"]`
      );

      const cEl = canvas.querySelector(
        `.node-card[data-id="${child.id}"]`
      );

      if (!pEl || !cEl) return;

      // Parent position
      const x1 =
        pEl.offsetLeft +
        pEl.offsetWidth / 2;

      const y1 =
        pEl.offsetTop +
        pEl.offsetHeight;

      // Child position
      const x2 =
        cEl.offsetLeft +
        cEl.offsetWidth / 2;

      const y2 =
        cEl.offsetTop;

      // Create line
      const line = createSvgEl('line');

      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);

      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);

      line.setAttribute('stroke', '#999');
      line.setAttribute('stroke-width', '2');

      svgOverlay.appendChild(line);
    });
  });
}

// Create SVG element
function createSvgEl(tag) {
  return document.createElementNS(
    'http://www.w3.org/2000/svg',
    tag
  );
}

// Escape HTML
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}