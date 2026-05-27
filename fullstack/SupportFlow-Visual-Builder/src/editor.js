// Edit panel — right sidebar for modifying node content in real-time.
import { state, subscribe, updateNodeText, updateOptionLabel } from './store.js';

let panel, panelContent;

export function initEditor() {
  panel        = document.getElementById('edit-panel');
  panelContent = document.getElementById('edit-panel-content');

  subscribe('node:clicked',   id => openPanel(id));
  subscribe('nodes:changed',  ()  => refreshIfOpen());

  // Click on canvas background closes panel
  document.getElementById('canvas').addEventListener('click', closePanel);
}

function openPanel(id) {
  const node = state.nodes.find(n => n.id === id);
  if (!node) return;
  renderPanel(node);
  panel.classList.add('open');
}

function closePanel() {
  panel.classList.remove('open');
}

function refreshIfOpen() {
  if (!panel.classList.contains('open') || !state.selectedId) return;
  // Skip re-render if user is actively typing inside the panel
  if (panel.contains(document.activeElement)) return;
  const node = state.nodes.find(n => n.id === state.selectedId);
  if (node) renderPanel(node);
}

function renderPanel(node) {
  const typeLabel = { start: 'Start Node', question: 'Question Node', end: 'End Node' }[node.type] ?? node.type;

  const optionsSection = node.options.length
    ? `<label class="panel-section-label" style="margin-top:20px">Answer Options</label>
       ${node.options.map((opt, i) => `
         <div class="option-group">
           <label>Option ${i + 1}</label>
           <input type="text" data-opt="${i}" value="${escAttr(opt.label)}" placeholder="Option label" />
           <p class="option-next-hint">&rarr; node ${opt.nextId}</p>
         </div>`).join('')}`
    : `<p class="panel-empty-msg" style="margin-top:18px">End node — no outgoing options.</p>`;

  panelContent.innerHTML = `
    <p class="panel-title">${typeLabel}</p>
    <label class="panel-section-label">Question / Message</label>
    <textarea id="edit-text" rows="4">${escText(node.text)}</textarea>
    ${optionsSection}`;

  // Live text update — only update DOM card text, not full re-render
  panelContent.querySelector('#edit-text').addEventListener('input', e => {
    updateNodeText(node.id, e.target.value);
    const qEl = document.querySelector(`.node-card[data-id="${node.id}"] .node-question`);
    if (qEl) qEl.textContent = e.target.value;
  });

  // Live option label update
  panelContent.querySelectorAll('input[data-opt]').forEach(input => {
    input.addEventListener('input', e => {
      const idx = parseInt(e.target.dataset.opt, 10);
      updateOptionLabel(node.id, idx, e.target.value);
      const opts = document.querySelectorAll(`.node-card[data-id="${node.id}"] .node-option`);
      if (opts[idx]) opts[idx].textContent = '→ ' + e.target.value;
    });
  });
}

function escText(str) {
  return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}