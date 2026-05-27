// Preview mode — chat interface that traverses the decision tree.
import { state } from './store.js';

let previewPanel, chatBody;

export function initPreview() {
  previewPanel = document.getElementById('preview-panel');
  chatBody     = document.getElementById('chat-body');
}

export function startPreview() {
  previewPanel.classList.add('open');
  chatBody.innerHTML = '';
  const startNode = state.nodes.find(n => n.type === 'start') ?? state.nodes[0];
  if (startNode) showNode(startNode);
}

export function stopPreview() {
  previewPanel.classList.remove('open');
}

function showNode(node) {
  appendBotBubble(node.text);

  if (!node.options.length) {
    appendEndState();
    return;
  }

  const optWrap = document.createElement('div');
  optWrap.className = 'chat-options';

  node.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className     = 'chat-option-btn';
    btn.textContent   = opt.label;
    btn.addEventListener('click', () => handleChoice(opt, optWrap));
    optWrap.appendChild(btn);
  });

  chatBody.appendChild(optWrap);
  scrollBottom();
}

function handleChoice(opt, optWrap) {
  // Replace options with a user bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user-bubble';
  userBubble.textContent = opt.label;
  optWrap.replaceWith(userBubble);
  scrollBottom();

  // Navigate after brief pause (feels natural)
  setTimeout(() => {
    const nextNode = state.nodes.find(n => n.id === opt.nextId);
    if (nextNode) showNode(nextNode);
  }, 380);
}

function appendBotBubble(text) {
  const bubble = document.createElement('div');
  bubble.className   = 'chat-bubble';
  bubble.textContent = text;
  chatBody.appendChild(bubble);
  scrollBottom();
}

function appendEndState() {
  const wrap = document.createElement('div');
  wrap.className = 'chat-restart';
  wrap.innerHTML = `
    <p class="chat-end-msg">End of conversation</p>
    <button class="btn btn-ghost" id="restart-btn">&#8635; Restart</button>`;
  chatBody.appendChild(wrap);
  scrollBottom();

  document.getElementById('restart-btn').addEventListener('click', () => {
    chatBody.innerHTML = '';
    const startNode = state.nodes.find(n => n.type === 'start') ?? state.nodes[0];
    if (startNode) showNode(startNode);
  });
}

function scrollBottom() {
  chatBody.scrollTop = chatBody.scrollHeight;
}