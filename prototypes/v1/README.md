# JsonFlow UI prototype v1

Open `index.html` in a browser. This is a functional prototype built with semantic HTML, Tailwind CSS via the browser CDN, and dependency-free browser JavaScript. It does not change the production application.

## Working features

- Live JSON validation and recovery messages.
- Format and minify with 2 spaces, 4 spaces, or tabs.
- Copy and download output.
- Open or drag and drop `.json` files.
- Paste from the clipboard and load a sample.
- Convert to YAML, XML, CSV, or plain text.
- Expandable tree view.
- Input and output tabs on mobile.
- Keyboard shortcuts.
- A single shortcut entry point in the header, without a duplicate tip strip.
- System-aware light and dark themes with saved preference.
- A full-width workspace with compact 12-16px viewport gutters.
- Phosphor icons used consistently for actions, navigation, status, and theme controls.

## Design read

Redesign-overhaul of a browser-based JSON utility for developers and analysts. The interface should feel calm, precise, private, and immediately usable.

## Direction

- Primary job: paste JSON, understand validity, and format it.
- Secondary jobs: copy, download, minify, convert, inspect as a tree, or compare.
- Palette: workspace `#F7F8FA`, ink `#17202A`, cobalt `#2457D6`, selection `#E8EEFC`, line `#DCE1E8`, success `#17785B`.
- Type: native system sans for UI, native system mono for JSON and keyboard metadata.
- Shape system: 6-12px radii for controls and surfaces, with the circular flow marker as the sole exception because it represents direction rather than a container.
- Signature: the cobalt flow marker at the input-output seam makes the transformation model visible without adding explanatory copy.

## Layout sketch

```text
+------------------------------------------------------------------+
| Brand       Formatter  Compare               privacy  GitHub     |
+------------------------------------------------------------------+
| Format JSON                              Indent     Open file     |
|                                                                  |
| [Editor] [Tree]                      Valid  Clear  [Format JSON]  |
| +-----------------------------+  >  +---------------------------+ |
| | Input      Paste   Sample   |     | Output      Copy Download | |
| |                             |     |                           | |
| | editable JSON               |     | formatted JSON            | |
| |                             |     |                           | |
| +-----------------------------+     +---------------------------+ |
| More actions: Minify / YAML / XML              local processing |
+------------------------------------------------------------------+
| Shortcut tip                                                     |
+------------------------------------------------------------------+
```

On viewports below 1024px, input and output stack into one column and the directional seam marker is removed.
