import { loadNodes, setMode } from './store.js';
import { initGraph } from './graph.js';
import { initEditor } from './editor.js';
import { initPreview, startPreview, stopPreview } from './preview.js';

async function boot() {
  const res = await fetch('./src/flow_data.json');
  const data = await res.json();

  document.getElementById('root').innerHTML = `
    <div id="toolbar">
      <div class="toolbar-logo">
        <span class="toolbar-title">SupportFlow</span>
      </div>

      <div class="toolbar-spacer"></div>

      <span class="mode-badge" id="mode-badge">EDITOR</span>

      <button class="btn btn-primary" id="play-btn">
        Preview
      </button>
    </div>

    <div id="app">
      <div id="canvas">
        <svg id="svg-overlay"></svg>
      </div>

      <div id="edit-panel">
        <div id="edit-panel-content"></div>
      </div>
    </div>

    <div id="preview-panel">
      <div class="chat-window">

        <div class="chat-header">
          <div>
            <div class="chat-header-title">SupportFlow Bot</div>
            <div class="chat-header-sub">Live preview</div>
          </div>

          <button
            class="btn btn-ghost"
            id="stop-preview-btn"
            style="margin-left:auto"
          >
            Exit
          </button>
        </div>

        <div class="chat-body" id="chat-body"></div>

      </div>
    </div>
  `;

  const canvas = document.getElementById('canvas');
  const svgOverlay = document.getElementById('svg-overlay');

  initGraph(canvas, svgOverlay);
  initEditor();
  initPreview();

  loadNodes(data.nodes);

  document.getElementById('play-btn').addEventListener('click', () => {
    setMode('preview');

    document.getElementById('mode-badge').textContent = 'PREVIEW';

    document.getElementById('play-btn').style.display = 'none';

    startPreview();
  });

  document.getElementById('stop-preview-btn').addEventListener('click', () => {
    setMode('editor');

    document.getElementById('mode-badge').textContent = 'EDITOR';

    document.getElementById('play-btn').style.display = '';

    stopPreview();
  });

  canvas.addEventListener('scroll', () => {
    import('./graph.js').then(m => m.redrawConnectors());
  });
}

boot();