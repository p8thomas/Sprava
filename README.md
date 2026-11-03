# Sprava × Refero prototype

Open `index.html`, then choose **Screens**. Select Biology, Chemistry or Maths,
choose an exam board, and open a resource. All nine original resource actions
are connected to explicit empty states. AQA, Edexcel and OCR are demonstration
choices only; no qualification or syllabus coverage is claimed.

There are no study materials, papers, scores, accounts, backend requests or
persistent progress. Changing subjects resets the board and resource preview.
Switching showcase tabs preserves the current selection during the page visit.

## Accessibility and responsive behaviour

- Native labelled selects and buttons; unavailable resource actions are disabled.
- Showcase tabs support arrow keys, Home/End and a single Tab stop.
- Selection changes have polite status announcements; opening a resource moves
  focus to its labelled preview. Tab or Shift+Tab continues navigation.
- Visible focus indicators and controls at least 44px high.
- Filters stack on small screens; resource buttons stack under their subject.

## Browser checks

With Node.js installed:

```sh
npm install
npx playwright install chromium
npm test
```

Tests cover all 27 subject/board/resource combinations, selection reset,
keyboard activation and preview focus, all four showcase panels, horizontal
overflow at 320/375/768/1024/1440px, and uncaught browser errors.
For an existing Chromium installation set `CHROMIUM_EXECUTABLE_PATH`.
Screenshots are written to the OS temporary directory for visual review.

Manual review: navigate with Tab/Shift+Tab, change both selects, activate
resources with Enter/Space, use tab arrows/Home/End, zoom to 200%, and check
that announcements and labels make sense with a screen reader.
