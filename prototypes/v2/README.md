# JsonFlow UI prototype v2

Open `index.html` in a browser. V2 is a new interface direction built with semantic HTML, Tailwind CSS via the browser CDN, Phosphor icons, and dependency-free browser JavaScript. V1 remains unchanged.

## Design direction

V2 treats JsonFlow as a focused developer workspace rather than a web page containing an editor.

- Cloud `#F3F5F7`, paper `#FFFFFF`, carbon `#131820`, line `#D9DEE5`, teal `#087F72`, success `#17805E`.
- Manrope for interface hierarchy and JetBrains Mono for JSON and metadata.
- Desktop uses a command sidebar, flexible input canvas, functional transformation rail, and dedicated result inspector.
- Mobile uses one focused panel at a time with persistent Input, Format, and Result controls.
- The teal transformation rail is the signature element. Its arrow is the real Format action, not decoration.

## Working features

- Live validation with empty, valid, and invalid states.
- Format and minify with configurable indentation.
- Copy and download results.
- Open, drag and drop, paste, or load example JSON.
- Convert to YAML, XML, CSV, or plain text.
- Expandable tree inspection.
- Responsive input-result navigation.
- Persistent light and dark themes.
- Keyboard shortcuts and visible interaction feedback.
