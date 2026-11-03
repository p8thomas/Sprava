const tabs = [...document.querySelectorAll('[data-panel]')];
const panels = document.querySelectorAll('[data-panel-content]');
const rail = document.querySelector('.rail');
rail.setAttribute('role', 'tablist');
const narrowLayout = window.matchMedia('(max-width: 820px)');
function updateTabOrientation() {
  rail.setAttribute('aria-orientation', narrowLayout.matches ? 'horizontal' : 'vertical');
}
updateTabOrientation();
narrowLayout.addEventListener('change', updateTabOrientation);

function activateTab(tab) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  panels.forEach((panel) => {
    const active = panel.id === tab.dataset.panel;
    panel.classList.toggle('is-hidden', !active);
    panel.hidden = !active;
  });
}

tabs.forEach((tab, index) => {
  tab.id = `tab-${tab.dataset.panel}`;
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', tab.dataset.panel);
  const panel = document.getElementById(tab.dataset.panel);
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', tab.id);
  panel.tabIndex = 0;
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    activateTab(tabs[next]);
    tabs[next].focus();
  });
});
activateTab(tabs[0]);

const subject = document.getElementById('study-subject');
const board = document.getElementById('study-board');
const rows = document.querySelectorAll('[data-subject]');
const resources = document.querySelectorAll('[data-resource]');
const status = document.getElementById('selection-status');
const preview = document.getElementById('resource-preview');
const title = document.getElementById('resource-title');
const context = document.getElementById('resource-context');
const message = document.getElementById('resource-message');

function updateSelection() {
  const ready = Boolean(subject.value && board.value);
  rows.forEach((row) => {
    const selected = row.dataset.subject === subject.value;
    row.classList.toggle('is-selected', selected);
    row.querySelectorAll('button').forEach((button) => {
      button.disabled = !ready || !selected;
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', `${row.dataset.subject}: ${button.textContent}`);
    });
  });
  title.textContent = ready ? 'Choose a resource' : 'Choose your study resources';
  context.textContent = subject.value ? `${subject.value} · ${board.value || 'No exam board selected'}` : 'No subject or exam board selected.';
  message.textContent = ready ? 'Open a resource above to see its availability. No learning content is connected.' : 'Select a subject and exam board above to enable its resource buttons.';
  status.textContent = ready ? `${subject.value} · ${board.value}. Resource buttons enabled.` : subject.value ? `${subject.value} selected. Choose an exam board.` : 'Choose a subject, then an exam board to explore resources.';
}

subject.addEventListener('change', () => {
  // These are demonstration choices, not a claim of qualification coverage.
  board.replaceChildren(new Option(subject.value ? 'Choose an exam board' : 'Choose a subject first', ''));
  if (subject.value) ['AQA', 'Edexcel', 'OCR'].forEach((name) => board.add(new Option(name, name)));
  board.disabled = !subject.value;
  updateSelection();
});
board.addEventListener('change', updateSelection);
resources.forEach((button) => {
  button.addEventListener('click', () => {
    resources.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    const resource = button.textContent;
    title.textContent = `${resource}: not available in this prototype`;
    context.textContent = `${subject.value} · ${board.value}`;
    message.textContent = ['Weak topics', 'Marks'].includes(resource)
      ? 'No progress data yet. Tracking, scores and recommendations are not connected in this prototype.'
      : `No ${resource.toLowerCase()} have been added for this selection. This is an empty-state preview; no study materials or examination papers are provided.`;
    status.textContent = `${subject.value} · ${board.value} · ${resource}: unavailable in this prototype.`;
    preview.focus();
  });
});
updateSelection();
