# 📄 JSONify - Fast JSON Formatter & Validator

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-blue?logo=visual-studio-code)](https://microsoft.github.io/monaco-editor/)

**JSONify** is a fast, privacy-friendly JSON formatter and validator that runs entirely in your browser. No data is sent to any server - all processing happens locally on your device. Perfect for developers who need to quickly format, validate, minify, or convert JSON data.

![JSONify Preview](public/preview.png)

## ✨ Features

- **📝 Smart JSON Editor**: Monaco Editor with syntax highlighting, line numbers, auto-indentation, and bracket matching
- **🎨 Format & Beautify**: Pretty-print JSON with configurable indentation (2/4 spaces or tabs)
- **🗜️ Minify**: Compress JSON to single-line format
- **✅ Real-time Validation**: Instant error detection with line number and error message
- **📥 Copy & Download**: One-click copy to clipboard or download as `.json`/`.txt` file
- **🌳 Tree View**: Expandable/collapsible tree view for easy JSON navigation
- **🔄 Conversion Tools**: Convert JSON to YAML, XML, CSV, or plain text
- **🔍 Search & Navigate**: Search within JSON, jump to specific lines
- **🌓 Dark Mode**: Beautiful dark/light theme toggle
- **📱 Fully Responsive**: Works on desktop, tablet, and mobile
- **🔒 Privacy First**: Your JSON never leaves your browser

## 🛠️ Tech Stack

- **Core**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (same editor as VS Code)
- **Icons**: [Lucide React](https://lucide.dev/)
- **YAML**: [js-yaml](https://github.com/nodeca/js-yaml)
- **Infrastructure**: TypeScript for type safety

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm / npm / yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/montasim/Jsonify.git
   cd Jsonify
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   pnpm dev
   ```

4. **Open the browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```text
├── app/                    # Next.js App Router (Pages & Layouts)
│   ├── contact/            # Contact page
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms of service
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main JSON formatter page
│   └── globals.css         # Global styles
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn/ui components
│   ├── json-editor.tsx     # Monaco Editor wrapper
│   ├── json-tree-view.tsx  # Expandable tree view
│   ├── json-toolbar.tsx    # Action buttons toolbar
│   ├── json-settings.tsx   # Indentation settings
│   ├── json-converter.tsx  # Main component
│   └── layout.tsx          # App layout components
├── lib/                    # Logic, helpers, and utilities
│   ├── hooks.ts            # Custom React hooks
│   ├── json-utils.ts       # JSON format, minify, validate
│   ├── json-conversions.ts # JSON to YAML, XML, CSV converters
│   ├── constants.ts        # Default settings
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Format JSON |
| `Ctrl + Shift + M` | Minify JSON |
| `Ctrl + C` | Copy to clipboard |
| `Ctrl + S` | Download JSON |

## 🔒 Privacy & Security

- **No server-side processing**: All JSON formatting happens in your browser
- **No data storage**: Your JSON is never stored or logged
- **No tracking**: No analytics or tracking scripts
- **Open source**: All code is transparent and auditable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [r3tr0](https://github.com/r3tr0)
