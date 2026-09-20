<html lang="en" class="dark"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- 
    CSP justification: 'unsafe-eval' and 'wasm-unsafe-eval' are required for
    dynamic applet execution which compiles and runs user-provided code
    and libraries (like OpenCV or custom scripts) in the browser.
  -->
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'none';
    script-src https://esm.sh https://unpkg.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://docs.opencv.org 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob: data:;
    connect-src https://esm.sh https://unpkg.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://docs.opencv.org https://huggingface.co https://cdn-lfs.huggingface.co https://*.hf.co https://fonts.googleapis.com https://fonts.gstatic.com https://storage.googleapis.com https://img.youtube.com blob: data:;
    style-src 'unsafe-inline' https://esm.sh https://unpkg.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com;
    font-src https://fonts.gstatic.com https://esm.sh https://cdn.jsdelivr.net;
    img-src * data: blob:;
    media-src * data: blob:;
  ">
  <title>Flow app</title>
  <script>window.FLOW_PARENT_ORIGIN = "https://flow.google.com";</script>
  <script>
    (function(a){if(!a)throw Error("Xi");var b=c=>{c.origin===a&&
typeof c.data==="object"&&c.data!==null&&"kind"in c.data&&c.data.kind==="port_init"&&(window.FLOW_PORT=c.ports[0],window.dispatchEvent(new CustomEvent("flow_port_ready")),window.removeEventListener("message",b))};window.addEventListener("message",b)})(window.FLOW_PARENT_ORIGIN);
  </script>


  <!-- Tailwind CSS v4 (browser build) -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script><style>/*! tailwindcss v4.3.3 | MIT License | https://tailwindcss.com */
@layer properties;
@layer theme, base, components, utilities;
@layer theme {
  :root, :host {
    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
    --color-gray-200: oklch(92.8% 0.006 264.531);
    --color-gray-300: oklch(87.2% 0.01 258.338);
    --color-black: #000;
    --color-white: #fff;
    --spacing: 0.25rem;
    --container-xs: 20rem;
    --container-2xl: 42rem;
    --text-sm: 0.875rem;
    --text-sm--line-height: calc(1.25 / 0.875);
    --text-lg: 1.125rem;
    --text-lg--line-height: calc(1.75 / 1.125);
    --text-3xl: 1.875rem;
    --text-3xl--line-height: calc(2.25 / 1.875);
    --text-4xl: 2.25rem;
    --text-4xl--line-height: calc(2.5 / 2.25);
    --font-weight-light: 300;
    --font-weight-medium: 500;
    --font-weight-bold: 700;
    --tracking-tight: -0.025em;
    --tracking-widest: 0.1em;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --blur-sm: 8px;
    --default-transition-duration: 150ms;
    --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    --default-font-family: var(--font-sans);
    --default-mono-font-family: var(--font-mono);
  }
}
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0 solid;
  }
  html, :host {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji');
    font-feature-settings: var(--default-font-feature-settings, normal);
    font-variation-settings: var(--default-font-variation-settings, normal);
    -webkit-tap-highlight-color: transparent;
  }
  hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
  }
  abbr:where([title]) {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }
  h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  a {
    color: inherit;
    -webkit-text-decoration: inherit;
    text-decoration: inherit;
  }
  b, strong {
    font-weight: bolder;
  }
  code, kbd, samp, pre {
    font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace);
    font-feature-settings: var(--default-mono-font-feature-settings, normal);
    font-variation-settings: var(--default-mono-font-variation-settings, normal);
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub, sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }
  :-moz-focusring:where(:not(iframe)) {
    outline: auto;
  }
  progress {
    vertical-align: baseline;
  }
  summary {
    display: list-item;
  }
  ol, ul, menu {
    list-style: none;
  }
  img, svg, video, canvas, audio, iframe, embed, object {
    display: block;
    vertical-align: middle;
  }
  img, video {
    max-width: 100%;
    height: auto;
  }
  button, input, select, optgroup, textarea, ::file-selector-button {
    font: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    letter-spacing: inherit;
    color: inherit;
    border-radius: 0;
    background-color: transparent;
    opacity: 1;
  }
  :where(select:is([multiple], [size])) optgroup {
    font-weight: bolder;
  }
  :where(select:is([multiple], [size])) optgroup option {
    padding-inline-start: 20px;
  }
  ::file-selector-button {
    margin-inline-end: 4px;
  }
  ::placeholder {
    opacity: 1;
  }
  @supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {
    ::placeholder {
      color: currentcolor;
      @supports (color: color-mix(in lab, red, red)) {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }
  }
  textarea {
    resize: vertical;
  }
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-date-and-time-value {
    min-height: 1lh;
    text-align: inherit;
  }
  ::-webkit-datetime-edit {
    display: inline-flex;
  }
  ::-webkit-datetime-edit-fields-wrapper {
    padding: 0;
  }
  ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field {
    padding-block: 0;
  }
  ::-webkit-calendar-picker-indicator {
    line-height: 1;
  }
  :-moz-ui-invalid {
    box-shadow: none;
  }
  button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-button {
    appearance: button;
  }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    height: auto;
  }
  [hidden]:where(:not([hidden='until-found'])) {
    display: none !important;
  }
}
@layer utilities {
  .absolute {
    position: absolute;
  }
  .fixed {
    position: fixed;
  }
  .relative {
    position: relative;
  }
  .inset-0 {
    inset: 0px;
  }
  .right-3 {
    right: calc(var(--spacing) * 3);
  }
  .bottom-3 {
    bottom: calc(var(--spacing) * 3);
  }
  .z-\[110\] {
    z-index: 110;
  }
  .m-0 {
    margin: 0px;
  }
  .mx-auto {
    margin-inline: auto;
  }
  .mt-1 {
    margin-top: var(--spacing);
  }
  .mt-10 {
    margin-top: calc(var(--spacing) * 10);
  }
  .mr-1 {
    margin-right: var(--spacing);
  }
  .flex {
    display: flex;
  }
  .grid {
    display: grid;
  }
  .aspect-square {
    aspect-ratio: 1 / 1;
  }
  .h-20 {
    height: calc(var(--spacing) * 20);
  }
  .h-32 {
    height: calc(var(--spacing) * 32);
  }
  .h-\[34px\] {
    height: 34px;
  }
  .h-full {
    height: 100%;
  }
  .h-screen {
    height: 100vh;
  }
  .w-\[300px\] {
    width: 300px;
  }
  .w-full {
    width: 100%;
  }
  .w-screen {
    width: 100vw;
  }
  .max-w-2xl {
    max-width: var(--container-2xl);
  }
  .max-w-xs {
    max-width: var(--container-xs);
  }
  .flex-1 {
    flex: 1;
  }
  .shrink-0 {
    flex-shrink: 0;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .resize-none {
    resize: none;
  }
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .flex-col {
    flex-direction: column;
  }
  .items-center {
    align-items: center;
  }
  .justify-between {
    justify-content: space-between;
  }
  .justify-center {
    justify-content: center;
  }
  .gap-0\.5 {
    gap: calc(var(--spacing) * 0.5);
  }
  .gap-1 {
    gap: var(--spacing);
  }
  .gap-1\.5 {
    gap: calc(var(--spacing) * 1.5);
  }
  .gap-2 {
    gap: calc(var(--spacing) * 2);
  }
  .gap-3 {
    gap: calc(var(--spacing) * 3);
  }
  .gap-6 {
    gap: calc(var(--spacing) * 6);
  }
  .gap-\[2px\] {
    gap: 2px;
  }
  :where(.space-y-2 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-y-3 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-y-4 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-y-8 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 8) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 8) * calc(1 - var(--tw-space-y-reverse)));
  }
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .overflow-hidden {
    overflow: hidden;
  }
  .overflow-y-auto {
    overflow-y: auto;
  }
  .rounded-2xl {
    border-radius: var(--radius-2xl);
  }
  .rounded-lg {
    border-radius: var(--radius-lg);
  }
  .rounded-xl {
    border-radius: var(--radius-xl);
  }
  .border {
    border-style: var(--tw-border-style);
    border-width: 1px;
  }
  .border-t {
    border-top-style: var(--tw-border-style);
    border-top-width: 1px;
  }
  .border-r {
    border-right-style: var(--tw-border-style);
    border-right-width: 1px;
  }
  .border-dashed {
    --tw-border-style: dashed;
    border-style: dashed;
  }
  .border-\[\#595959\] {
    border-color: #595959;
  }
  .border-white\/5 {
    border-color: color-mix(in srgb, #fff 5%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-white) 5%, transparent);
    }
  }
  .border-white\/10 {
    border-color: color-mix(in srgb, #fff 10%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-white) 10%, transparent);
    }
  }
  .border-white\/20 {
    border-color: color-mix(in srgb, #fff 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-white) 20%, transparent);
    }
  }
  .bg-\[\#0e0e0e\] {
    background-color: #0e0e0e;
  }
  .bg-\[\#1a1a1a\] {
    background-color: #1a1a1a;
  }
  .bg-\[\#969696\] {
    background-color: #969696;
  }
  .bg-black\/60 {
    background-color: color-mix(in srgb, #000 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-black) 60%, transparent);
    }
  }
  .bg-transparent {
    background-color: transparent;
  }
  .bg-white {
    background-color: var(--color-white);
  }
  .bg-white\/5 {
    background-color: color-mix(in srgb, #fff 5%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-white) 5%, transparent);
    }
  }
  .p-0 {
    padding: 0px;
  }
  .p-3 {
    padding: calc(var(--spacing) * 3);
  }
  .p-4 {
    padding: calc(var(--spacing) * 4);
  }
  .p-6 {
    padding: calc(var(--spacing) * 6);
  }
  .px-2 {
    padding-inline: calc(var(--spacing) * 2);
  }
  .px-3 {
    padding-inline: calc(var(--spacing) * 3);
  }
  .py-1 {
    padding-block: var(--spacing);
  }
  .py-2 {
    padding-block: calc(var(--spacing) * 2);
  }
  .py-20 {
    padding-block: calc(var(--spacing) * 20);
  }
  .pt-4 {
    padding-top: calc(var(--spacing) * 4);
  }
  .pt-\[5px\] {
    padding-top: 5px;
  }
  .pr-1 {
    padding-right: var(--spacing);
  }
  .pr-2 {
    padding-right: calc(var(--spacing) * 2);
  }
  .pr-\[16px\] {
    padding-right: 16px;
  }
  .pb-2 {
    padding-bottom: calc(var(--spacing) * 2);
  }
  .pb-4 {
    padding-bottom: calc(var(--spacing) * 4);
  }
  .pl-2\.5 {
    padding-left: calc(var(--spacing) * 2.5);
  }
  .pl-\[8px\] {
    padding-left: 8px;
  }
  .text-center {
    text-align: center;
  }
  .text-left {
    text-align: left;
  }
  .text-3xl {
    font-size: var(--text-3xl);
    line-height: var(--tw-leading, var(--text-3xl--line-height));
  }
  .text-4xl {
    font-size: var(--text-4xl);
    line-height: var(--tw-leading, var(--text-4xl--line-height));
  }
  .text-lg {
    font-size: var(--text-lg);
    line-height: var(--tw-leading, var(--text-lg--line-height));
  }
  .text-sm {
    font-size: var(--text-sm);
    line-height: var(--tw-leading, var(--text-sm--line-height));
  }
  .text-\[10px\] {
    font-size: 10px;
  }
  .text-\[11px\] {
    font-size: 11px;
  }
  .text-\[12px\] {
    font-size: 12px;
  }
  .text-\[16px\] {
    font-size: 16px;
  }
  .text-\[18px\] {
    font-size: 18px;
  }
  .font-bold {
    --tw-font-weight: var(--font-weight-bold);
    font-weight: var(--font-weight-bold);
  }
  .font-light {
    --tw-font-weight: var(--font-weight-light);
    font-weight: var(--font-weight-light);
  }
  .font-medium {
    --tw-font-weight: var(--font-weight-medium);
    font-weight: var(--font-weight-medium);
  }
  .tracking-\[0\.1px\] {
    --tw-tracking: 0.1px;
    letter-spacing: 0.1px;
  }
  .tracking-tight {
    --tw-tracking: var(--tracking-tight);
    letter-spacing: var(--tracking-tight);
  }
  .tracking-widest {
    --tw-tracking: var(--tracking-widest);
    letter-spacing: var(--tracking-widest);
  }
  .text-\[rgba\(218\,220\,224\,0\.9\)\] {
    color: rgba(218,220,224,0.9);
  }
  .text-black {
    color: var(--color-black);
  }
  .text-white {
    color: var(--color-white);
  }
  .text-white\/20 {
    color: color-mix(in srgb, #fff 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-white) 20%, transparent);
    }
  }
  .text-white\/30 {
    color: color-mix(in srgb, #fff 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-white) 30%, transparent);
    }
  }
  .text-white\/35 {
    color: color-mix(in srgb, #fff 35%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-white) 35%, transparent);
    }
  }
  .text-white\/40 {
    color: color-mix(in srgb, #fff 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-white) 40%, transparent);
    }
  }
  .text-white\/50 {
    color: color-mix(in srgb, #fff 50%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-white) 50%, transparent);
    }
  }
  .text-white\/60 {
    color: color-mix(in srgb, #fff 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-white) 60%, transparent);
    }
  }
  .text-white\/70 {
    color: color-mix(in srgb, #fff 70%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-white) 70%, transparent);
    }
  }
  .text-white\/90 {
    color: color-mix(in srgb, #fff 90%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-white) 90%, transparent);
    }
  }
  .normal-case {
    text-transform: none;
  }
  .uppercase {
    text-transform: uppercase;
  }
  .shadow-2xl {
    --tw-shadow: 0 25px 50px -12px var(--tw-shadow-color, rgb(0 0 0 / 0.25));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-inner {
    --tw-shadow: inset 0 2px 4px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.05));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .backdrop-blur-sm {
    --tw-backdrop-blur: blur(var(--blur-sm));
    -webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
    backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
  }
  .transition-all {
    transition-property: all;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-colors {
    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-transform {
    transition-property: transform, translate, scale, rotate;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .select-none {
    -webkit-user-select: none;
    user-select: none;
  }
  @media (hover: hover) {
    .hover\:translate-y-\[-2px\]:hover {
      --tw-translate-y: -2px;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
    .hover\:border-\[\#7a7a7a\]:hover {
      border-color: #7a7a7a;
    }
    .hover\:border-white\/40:hover {
      border-color: color-mix(in srgb, #fff 40%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:border-white\/40:hover {
        border-color: color-mix(in oklab, var(--color-white) 40%, transparent);
      }
    }
    .hover\:bg-gray-200:hover {
      background-color: var(--color-gray-200);
    }
    .hover\:bg-white\/5:hover {
      background-color: color-mix(in srgb, #fff 5%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-white\/5:hover {
        background-color: color-mix(in oklab, var(--color-white) 5%, transparent);
      }
    }
    .hover\:bg-white\/10:hover {
      background-color: color-mix(in srgb, #fff 10%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-white\/10:hover {
        background-color: color-mix(in oklab, var(--color-white) 10%, transparent);
      }
    }
    .hover\:text-white:hover {
      color: var(--color-white);
    }
    .hover\:text-white\/40:hover {
      color: color-mix(in srgb, #fff 40%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:text-white\/40:hover {
        color: color-mix(in oklab, var(--color-white) 40%, transparent);
      }
    }
  }
  .focus\:border-white\/30:focus {
    border-color: color-mix(in srgb, #fff 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-white) 30%, transparent);
    }
  }
  .focus\:outline-none:focus {
    --tw-outline-style: none;
    outline-style: none;
  }
  .active\:bg-gray-300:active {
    background-color: var(--color-gray-300);
  }
  .disabled\:cursor-not-allowed:disabled {
    cursor: not-allowed;
  }
  .disabled\:opacity-50:disabled {
    opacity: 50%;
  }
  @media (width >= 64rem) {
    .lg\:text-left {
      text-align: left;
    }
  }
}
@property --tw-space-y-reverse {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --tw-border-style {
  syntax: "*";
  inherits: false;
  initial-value: solid;
}
@property --tw-font-weight {
  syntax: "*";
  inherits: false;
}
@property --tw-tracking {
  syntax: "*";
  inherits: false;
}
@property --tw-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --tw-shadow-alpha {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}
@property --tw-inset-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-inset-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --tw-inset-shadow-alpha {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}
@property --tw-ring-color {
  syntax: "*";
  inherits: false;
}
@property --tw-ring-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-inset-ring-color {
  syntax: "*";
  inherits: false;
}
@property --tw-inset-ring-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-ring-inset {
  syntax: "*";
  inherits: false;
}
@property --tw-ring-offset-width {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}
@property --tw-ring-offset-color {
  syntax: "*";
  inherits: false;
  initial-value: #fff;
}
@property --tw-ring-offset-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-backdrop-blur {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-brightness {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-contrast {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-grayscale {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-hue-rotate {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-invert {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-opacity {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-saturate {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-sepia {
  syntax: "*";
  inherits: false;
}
@property --tw-translate-x {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --tw-translate-y {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --tw-translate-z {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@layer properties {
  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
    *, ::before, ::after, ::backdrop {
      --tw-space-y-reverse: 0;
      --tw-border-style: solid;
      --tw-font-weight: initial;
      --tw-tracking: initial;
      --tw-shadow: 0 0 #0000;
      --tw-shadow-color: initial;
      --tw-shadow-alpha: 100%;
      --tw-inset-shadow: 0 0 #0000;
      --tw-inset-shadow-color: initial;
      --tw-inset-shadow-alpha: 100%;
      --tw-ring-color: initial;
      --tw-ring-shadow: 0 0 #0000;
      --tw-inset-ring-color: initial;
      --tw-inset-ring-shadow: 0 0 #0000;
      --tw-ring-inset: initial;
      --tw-ring-offset-width: 0px;
      --tw-ring-offset-color: #fff;
      --tw-ring-offset-shadow: 0 0 #0000;
      --tw-backdrop-blur: initial;
      --tw-backdrop-brightness: initial;
      --tw-backdrop-contrast: initial;
      --tw-backdrop-grayscale: initial;
      --tw-backdrop-hue-rotate: initial;
      --tw-backdrop-invert: initial;
      --tw-backdrop-opacity: initial;
      --tw-backdrop-saturate: initial;
      --tw-backdrop-sepia: initial;
      --tw-translate-x: 0;
      --tw-translate-y: 0;
      --tw-translate-z: 0;
    }
  }
}
</style>
  <style type="text/tailwindcss">
    @custom-variant dark (&:where(.dark, .dark *));
    @theme {
      --color-slate-850: #1a1f2e;
      --color-slate-950: #0d1117;
      --color-app-bg-dark: #1a1a1a;
    }
  </style>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&amp;family=Google+Sans+Flex:wght@400;500;600;700&amp;family=Google+Sans+Text:wght@400;500;600;700&amp;display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0">

  <!-- Dynamic Import Map (resolves npm packages via esm.sh) -->
  <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@19.1.1",
    "react/": "https://esm.sh/react@19.1.1/",
    "react-dom": "https://esm.sh/react-dom@19.1.1",
    "react-dom/": "https://esm.sh/react-dom@19.1.1/",
    "react-dom/client": "https://esm.sh/react-dom@19.1.1/client",
    "react/jsx-runtime": "https://esm.sh/react@19.1.1/jsx-runtime",
    "flow-sdk": "data:text/javascript;base64,Ci8qKgogKiBAZmlsZW92ZXJ2aWV3IEZsb3cgU0RLIHRoYXQgcnVucyBpbnNpZGUgdGhlIGFwcGxldCBpZnJhbWUuCiAqCiAqIFRoaXMgZmlsZSBpcyBjb21waWxlZCB0byBKYXZhU2NyaXB0IGFuZCBpbmxpbmVkIGludG8gdGhlIGFwcGxldCBpZnJhbWUKICogdmlhIGFuIGltcG9ydCBtYXAgcG9pbnRpbmcgdG8gYSBkYXRhIFVSTCBvZiB0aGUgY29tcGlsZWQgY29kZS4KICoKICogS2VlcCB0aGlzIGZpbGUgc2VsZi1jb250YWluZWQuIERvIG5vdCBpbXBvcnQgYW55IGdvb2dsZTMgbW9kdWxlcwogKiBhcyB0aGV5IHdpbGwgbm90IGJlIGF2YWlsYWJsZSBpbiB0aGUgc2FuZGJveGVkIGlmcmFtZS4KICovCmNvbnN0IGlkVG9QZW5kaW5nUmVxdWVzdCA9IG5ldyBNYXAoKTsKbGV0IHJlcXVlc3RJZCA9IDA7CmZ1bmN0aW9uIGlzUmVjb3JkKHZhbHVlKSB7CiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSk7Cn0KZnVuY3Rpb24gYXNzZXJ0U3RyaW5nKHZhbHVlLCBuYW1lKSB7CiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykgewogICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgc3RyaW5nIGZvciAnICsgbmFtZSArICcsIGdvdCAnICsgdHlwZW9mIHZhbHVlKTsKICAgIH0KICAgIHJldHVybiB2YWx1ZTsKfQpmdW5jdGlvbiBhc3NlcnROdW1iZXIodmFsdWUsIG5hbWUpIHsKICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7CiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBudW1iZXIgZm9yICcgKyBuYW1lICsgJywgZ290ICcgKyB0eXBlb2YgdmFsdWUpOwogICAgfQogICAgcmV0dXJuIHZhbHVlOwp9CmZ1bmN0aW9uIGFzc2VydEltYWdlQml0bWFwKHZhbHVlKSB7CiAgICBpZiAoISh2YWx1ZSBpbnN0YW5jZW9mIEltYWdlQml0bWFwKSkgewogICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgSW1hZ2VCaXRtYXAsIGdvdCAnICsgdHlwZW9mIHZhbHVlKTsKICAgIH0KICAgIHJldHVybiB2YWx1ZTsKfQpmdW5jdGlvbiBpc1N0b3JhZ2VWYWx1ZSh2YWx1ZSkgewogICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwKICAgICAgICB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8CiAgICAgICAgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHsKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkgewogICAgICAgIHJldHVybiB2YWx1ZS5ldmVyeSgoaXRlbSkgPT4gaXRlbSA9PT0gbnVsbCB8fCBpc1N0b3JhZ2VWYWx1ZShpdGVtKSk7CiAgICB9CiAgICBpZiAoaXNSZWNvcmQodmFsdWUpKSB7CiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModmFsdWUpLmV2ZXJ5KChpdGVtKSA9PiBpdGVtID09PSBudWxsIHx8IGlzU3RvcmFnZVZhbHVlKGl0ZW0pKTsKICAgIH0KICAgIHJldHVybiBmYWxzZTsKfQpmdW5jdGlvbiBhc3NlcnRTdG9yYWdlVmFsdWVPck51bGwodmFsdWUpIHsKICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7CiAgICAgICAgcmV0dXJuIG51bGw7CiAgICB9CiAgICBpZiAoaXNTdG9yYWdlVmFsdWUodmFsdWUpKSB7CiAgICAgICAgcmV0dXJuIHZhbHVlOwogICAgfQogICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBzZXJpYWxpemFibGUgU3RvcmFnZVZhbHVlLCBnb3QgJyArIHR5cGVvZiB2YWx1ZSk7Cn0KZnVuY3Rpb24gYXNzZXJ0U3RyaW5nQXJyYXkodmFsdWUpIHsKICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHsKICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGFycmF5IHJlc3BvbnNlIGZvciBzdG9yYWdlIGtleXMnKTsKICAgIH0KICAgIGNvbnN0IHJlc3VsdCA9IFtdOwogICAgZm9yIChjb25zdCBpdGVtIG9mIHZhbHVlKSB7CiAgICAgICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnc3RyaW5nJykgewogICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHN0cmluZyBpbiBzdG9yYWdlIGtleXMgYXJyYXknKTsKICAgICAgICB9CiAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7CiAgICB9CiAgICByZXR1cm4gcmVzdWx0Owp9CmZ1bmN0aW9uIGFzc2VydElkUmVzcG9uc2UodmFsdWUpIHsKICAgIGlmICghaXNSZWNvcmQodmFsdWUpKSB7CiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBvYmplY3QgcmVzcG9uc2Ugd2l0aCBpZCcpOwogICAgfQogICAgcmV0dXJuIHsKICAgICAgICBpZDogYXNzZXJ0U3RyaW5nKHZhbHVlWydpZCddLCAnaWQnKSwKICAgIH07Cn0KZnVuY3Rpb24gYXNzZXJ0R2VuZXJhdGVSZXN1bHQodmFsdWUpIHsKICAgIGlmICghaXNSZWNvcmQodmFsdWUpKSB7CiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBvYmplY3QgcmVzcG9uc2Ugd2l0aCBtZWRpYSBmaWVsZHMnKTsKICAgIH0KICAgIHJldHVybiB7CiAgICAgICAgbWVkaWFJZDogYXNzZXJ0U3RyaW5nKHZhbHVlWydtZWRpYUlkJ10sICdtZWRpYUlkJyksCiAgICAgICAgYmFzZTY0OiBhc3NlcnRTdHJpbmcodmFsdWVbJ2Jhc2U2NCddLCAnYmFzZTY0JyksCiAgICAgICAgbWltZVR5cGU6IGFzc2VydFN0cmluZyh2YWx1ZVsnbWltZVR5cGUnXSwgJ21pbWVUeXBlJyksCiAgICB9Owp9CmZ1bmN0aW9uIGFzc2VydE1lZGlhVHlwZSh2YWx1ZSkgewogICAgY29uc3Qgbm9ybWFsaXplZCA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZS50b0xvd2VyQ2FzZSgpIDogdmFsdWU7CiAgICBpZiAobm9ybWFsaXplZCA9PT0gJ2ltYWdlJyB8fAogICAgICAgIG5vcm1hbGl6ZWQgPT09ICd2aWRlbycgfHwKICAgICAgICBub3JtYWxpemVkID09PSAnYXVkaW8nKSB7CiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWQ7CiAgICB9CiAgICBpZiAodHlwZW9mIG5vcm1hbGl6ZWQgPT09ICdzdHJpbmcnKSB7CiAgICAgICAgaWYgKG5vcm1hbGl6ZWQuc3RhcnRzV2l0aCgnaW1hZ2UnKSkKICAgICAgICAgICAgcmV0dXJuICdpbWFnZSc7CiAgICAgICAgaWYgKG5vcm1hbGl6ZWQuc3RhcnRzV2l0aCgndmlkZW8nKSkKICAgICAgICAgICAgcmV0dXJuICd2aWRlbyc7CiAgICAgICAgaWYgKG5vcm1hbGl6ZWQuc3RhcnRzV2l0aCgnYXVkaW8nKSkKICAgICAgICAgICAgcmV0dXJuICdhdWRpbyc7CiAgICB9CiAgICByZXR1cm4gJ2ltYWdlJzsKfQpmdW5jdGlvbiBhc3NlcnRNZWRpYUl0ZW0odmFsdWUpIHsKICAgIGNvbnN0IGl0ZW0gPSBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlWzBdIDogdmFsdWU7CiAgICBpZiAoIWlzUmVjb3JkKGl0ZW0pKSB7CiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBvYmplY3QgcmVzcG9uc2UgZm9yIE1lZGlhSXRlbScpOwogICAgfQogICAgY29uc3QgbWVkaWFJZCA9IGl0ZW1bJ21lZGlhSWQnXSA/PyBpdGVtWydpZCddOwogICAgY29uc3QgYmFzZTY0ID0gaXRlbVsnYmFzZTY0J10gPz8gaXRlbVsnZGF0YSddID8/ICcnOwogICAgY29uc3QgbWltZVR5cGUgPSBpdGVtWydtaW1lVHlwZSddID8/IGl0ZW1bJ3R5cGUnXSA/PyAnJzsKICAgIGNvbnN0IG5hbWUgPSBpdGVtWyduYW1lJ10gPz8gaXRlbVsndGl0bGUnXSA/PyBpdGVtWydkaXNwbGF5TmFtZSddID8/ICcnOwogICAgY29uc3QgcmF3VHlwZSA9IGl0ZW1bJ3R5cGUnXSA/PyBpdGVtWydtZWRpYVR5cGUnXSA/PyAnaW1hZ2UnOwogICAgcmV0dXJuIHsKICAgICAgICBtZWRpYUlkOiBhc3NlcnRTdHJpbmcobWVkaWFJZCwgJ21lZGlhSWQnKSwKICAgICAgICBiYXNlNjQ6IGFzc2VydFN0cmluZyhiYXNlNjQsICdiYXNlNjQnKSwKICAgICAgICBtaW1lVHlwZTogYXNzZXJ0U3RyaW5nKG1pbWVUeXBlLCAnbWltZVR5cGUnKSwKICAgICAgICB0eXBlOiBhc3NlcnRNZWRpYVR5cGUocmF3VHlwZSksCiAgICAgICAgbmFtZTogYXNzZXJ0U3RyaW5nKG5hbWUsICduYW1lJyksCiAgICB9Owp9CmZ1bmN0aW9uIGFzc2VydE1lZGlhR2V0QmFzZTY0UmVzdWx0KHZhbHVlKSB7CiAgICBpZiAoIWlzUmVjb3JkKHZhbHVlKSkgewogICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgb2JqZWN0IHJlc3BvbnNlIHdpdGggYmFzZTY0IGFuZCBtaW1lVHlwZScpOwogICAgfQogICAgcmV0dXJuIHsKICAgICAgICBiYXNlNjQ6IGFzc2VydFN0cmluZyh2YWx1ZVsnYmFzZTY0J10sICdiYXNlNjQnKSwKICAgICAgICBtaW1lVHlwZTogYXNzZXJ0U3RyaW5nKHZhbHVlWydtaW1lVHlwZSddLCAnbWltZVR5cGUnKSwKICAgIH07Cn0KZnVuY3Rpb24gYXNzZXJ0R2VuVGV4dFJlc3VsdCh2YWx1ZSkgewogICAgaWYgKCFpc1JlY29yZCh2YWx1ZSkpIHsKICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIG9iamVjdCByZXNwb25zZSBmb3IgVGV4dEdlbmVyYXRlUmVzdWx0Jyk7CiAgICB9CiAgICByZXR1cm4gewogICAgICAgIHRleHQ6IGFzc2VydFN0cmluZyh2YWx1ZVsndGV4dCddLCAndGV4dCcpLAogICAgfTsKfQpmdW5jdGlvbiBhc3NlcnRDYW1lcmFDYXB0dXJlUmVzdWx0KHZhbHVlKSB7CiAgICBpZiAoIWlzUmVjb3JkKHZhbHVlKSkgewogICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgb2JqZWN0IHJlc3BvbnNlIGZvciBDYW1lcmFDYXB0dXJlUmVzdWx0Jyk7CiAgICB9CiAgICByZXR1cm4gewogICAgICAgIGJhc2U2NDogYXNzZXJ0U3RyaW5nKHZhbHVlWydiYXNlNjQnXSwgJ2Jhc2U2NCcpLAogICAgICAgIG1pbWVUeXBlOiBhc3NlcnRTdHJpbmcodmFsdWVbJ21pbWVUeXBlJ10sICdtaW1lVHlwZScpLAogICAgICAgIHdpZHRoOiBhc3NlcnROdW1iZXIodmFsdWVbJ3dpZHRoJ10sICd3aWR0aCcpLAogICAgICAgIGhlaWdodDogYXNzZXJ0TnVtYmVyKHZhbHVlWydoZWlnaHQnXSwgJ2hlaWdodCcpLAogICAgfTsKfQpmdW5jdGlvbiBhc3NlcnRDYW1lcmFTdHJlYW1SZXNwb25zZSh2YWx1ZSkgewogICAgaWYgKCFpc1JlY29yZCh2YWx1ZSkpIHsKICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIG9iamVjdCByZXNwb25zZSBmb3IgQ2FtZXJhU3RyZWFtUmVzcG9uc2UnKTsKICAgIH0KICAgIHJldHVybiB7CiAgICAgICAgc3RyZWFtSWQ6IGFzc2VydFN0cmluZyh2YWx1ZVsnc3RyZWFtSWQnXSwgJ3N0cmVhbUlkJyksCiAgICAgICAgd2lkdGg6IGFzc2VydE51bWJlcih2YWx1ZVsnd2lkdGgnXSwgJ3dpZHRoJyksCiAgICAgICAgaGVpZ2h0OiBhc3NlcnROdW1iZXIodmFsdWVbJ2hlaWdodCddLCAnaGVpZ2h0JyksCiAgICB9Owp9CmZ1bmN0aW9uIGFzc2VydE1pY3JvcGhvbmVSZWNvcmRSZXN1bHQodmFsdWUpIHsKICAgIGlmICghaXNSZWNvcmQodmFsdWUpKSB7CiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBvYmplY3QgcmVzcG9uc2UgZm9yIE1pY3JvcGhvbmVSZWNvcmRSZXN1bHQnKTsKICAgIH0KICAgIHJldHVybiB7CiAgICAgICAgYmFzZTY0OiBhc3NlcnRTdHJpbmcodmFsdWVbJ2Jhc2U2NCddLCAnYmFzZTY0JyksCiAgICAgICAgbWltZVR5cGU6IGFzc2VydFN0cmluZyh2YWx1ZVsnbWltZVR5cGUnXSwgJ21pbWVUeXBlJyksCiAgICAgICAgZHVyYXRpb25NczogYXNzZXJ0TnVtYmVyKHZhbHVlWydkdXJhdGlvbk1zJ10sICdkdXJhdGlvbk1zJyksCiAgICB9Owp9CmxldCBwb3J0ID0gbnVsbDsKbGV0IHBvcnRQcm9taXNlID0gbnVsbDsKZnVuY3Rpb24gZ2V0UG9ydCgpIHsKICAgIGlmIChwb3J0KQogICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocG9ydCk7CiAgICBpZiAocG9ydFByb21pc2UpCiAgICAgICAgcmV0dXJuIHBvcnRQcm9taXNlOwogICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7CiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignV2luZG93IGlzIHVuZGVmaW5lZCcpKTsKICAgIH0KICAgIGlmICghd2luZG93WydGTE9XX1BBUkVOVF9PUklHSU4nXSkgewogICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ3dpbmRvdy5GTE9XX1BBUkVOVF9PUklHSU4gaXMgcmVxdWlyZWQnKSk7CiAgICB9CiAgICBjb25zdCBleGlzdGluZ1BvcnQgPSB3aW5kb3dbJ0ZMT1dfUE9SVCddOwogICAgaWYgKGV4aXN0aW5nUG9ydCkgewogICAgICAgIHBvcnQgPSBleGlzdGluZ1BvcnQ7CiAgICAgICAgc2V0dXBQb3J0TGlzdGVuZXIocG9ydCk7CiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwb3J0KTsKICAgIH0KICAgIHBvcnRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gewogICAgICAgIGNvbnN0IGxpc3RlbmVyID0gKCkgPT4gewogICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZmxvd19wb3J0X3JlYWR5JywgbGlzdGVuZXIpOwogICAgICAgICAgICBwb3J0UHJvbWlzZSA9IG51bGw7CiAgICAgICAgICAgIGNvbnN0IGZsb3dQb3J0ID0gd2luZG93WydGTE9XX1BPUlQnXTsKICAgICAgICAgICAgaWYgKCFmbG93UG9ydCkgewogICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignRkxPV19QT1JUIGlzIG5vdCBhdmFpbGFibGUnKSk7CiAgICAgICAgICAgICAgICByZXR1cm47CiAgICAgICAgICAgIH0KICAgICAgICAgICAgcG9ydCA9IGZsb3dQb3J0OwogICAgICAgICAgICBzZXR1cFBvcnRMaXN0ZW5lcihwb3J0KTsKICAgICAgICAgICAgcmVzb2x2ZShwb3J0KTsKICAgICAgICB9OwogICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdmbG93X3BvcnRfcmVhZHknLCBsaXN0ZW5lcik7CiAgICB9KTsKICAgIHJldHVybiBwb3J0UHJvbWlzZTsKfQpmdW5jdGlvbiBzZXR1cFBvcnRMaXN0ZW5lcihwKSB7CiAgICBwLm9ubWVzc2FnZSA9IChldmVudCkgPT4gewogICAgICAgIGNvbnN0IGRhdGEgPSBpc1JlY29yZChldmVudC5kYXRhKSA/IGV2ZW50LmRhdGEgOiB7fTsKICAgICAgICBjb25zdCB0eXBlID0gZGF0YVsndHlwZSddOwogICAgICAgIGNvbnN0IGlkID0gZGF0YVsnaWQnXTsKICAgICAgICBjb25zdCBwYXlsb2FkID0gZGF0YVsncGF5bG9hZCddOwogICAgICAgIGNvbnN0IGVycm9yID0gZGF0YVsnZXJyb3InXTsKICAgICAgICBpZiAodHlwZW9mIGlkICE9PSAnbnVtYmVyJyB8fAogICAgICAgICAgICB0eXBlICE9PSAnRkxPV19SRVNQT05TRScgfHwKICAgICAgICAgICAgIWlkVG9QZW5kaW5nUmVxdWVzdC5oYXMoaWQpKSB7CiAgICAgICAgICAgIHJldHVybjsKICAgICAgICB9CiAgICAgICAgY29uc3QgZW50cnkgPSBpZFRvUGVuZGluZ1JlcXVlc3QuZ2V0KGlkKTsKICAgICAgICBpZiAoIWVudHJ5KQogICAgICAgICAgICByZXR1cm47CiAgICAgICAgaWRUb1BlbmRpbmdSZXF1ZXN0LmRlbGV0ZShpZCk7CiAgICAgICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycgJiYgZXJyb3IpIHsKICAgICAgICAgICAgZW50cnkucmVqZWN0KG5ldyBFcnJvcihlcnJvcikpOwogICAgICAgIH0KICAgICAgICBlbHNlIHsKICAgICAgICAgICAgZW50cnkucmVzb2x2ZShwYXlsb2FkKTsKICAgICAgICB9CiAgICB9Owp9Ci8vIFRoaXMgZnVuY3Rpb24gaW50ZW50aW9uYWxseSBhdm9pZHMgYXN5bmMvYXdhaXQgdG8gZml4IGEKLy8gYnVpbGQtdGltZSBpbnN0cnVtZW50YXRpb24gaXNzdWUgKHRzaWNrbGUvQXN5bmNDb250ZXh0KSB0aGF0IGNhbiBjYXVzZQovLyBwcm9ibGVtcyBpbiB0aGUgc2FuZGJveGVkIGlmcmFtZSBlbnZpcm9ubWVudC4KZnVuY3Rpb24gcmVxdWVzdCh0eXBlLCBkYXRhID0ge30pIHsKICAgIHJldHVybiBnZXRQb3J0KCkudGhlbigocG9ydCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gewogICAgICAgIGNvbnN0IGlkID0gKytyZXF1ZXN0SWQ7CiAgICAgICAgaWRUb1BlbmRpbmdSZXF1ZXN0LnNldChpZCwgewogICAgICAgICAgICByZXNvbHZlLAogICAgICAgICAgICByZWplY3QsCiAgICAgICAgICAgIHR5cGUsCiAgICAgICAgfSk7CiAgICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7IHR5cGUsIC4uLmRhdGEsIGlkIH0pOwogICAgfSkpOwp9CmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgewogICAgLy8gVHJpZ2dlciBlYWdlciBwb3J0IHJldHJpZXZhbAogICAgZ2V0UG9ydCgpLmNhdGNoKCgpID0+IHsgfSk7Cn0KLyoqCiAqIFNESyBleHBvc2luZyBGbG93IGhvc3QgZnVuY3Rpb25hbGl0eSB0byB0aGUgYXBwbGV0LgogKi8KY29uc3QgRkxPVyA9IHsKICAgIG1lZGlhOiB7CiAgICAgICAgc2VsZWN0KG9wdGlvbnMpIHsKICAgICAgICAgICAgY29uc3Qgb3B0cyA9IHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyA/IHsgaWQ6IG9wdGlvbnMgfSA6IChvcHRpb25zID8/IHt9KTsKICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QoJ0ZMT1dfU0VMRUNUX01FRElBJywgewogICAgICAgICAgICAgICAgJ3BheWxvYWQnOiB7CiAgICAgICAgICAgICAgICAgICAgJ3ByZVNlbGVjdElkJzogb3B0cy5pZCwKICAgICAgICAgICAgICAgICAgICAnZmlsdGVyJzogb3B0cy5maWx0ZXIgPz8gJ2FsbCcsCiAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICB9KS50aGVuKChyZXNwb25zZSkgPT4gewogICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSBudWxsIHx8IHJlc3BvbnNlID09PSB1bmRlZmluZWQpIHsKICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIHJldHVybiBhc3NlcnRNZWRpYUl0ZW0ocmVzcG9uc2UpOwogICAgICAgICAgICB9KTsKICAgICAgICB9LAogICAgICAgIHNlbGVjdE11bHRpcGxlKG9wdGlvbnMpIHsKICAgICAgICAgICAgY29uc3Qgb3B0cyA9IHR5cGVvZiBvcHRpb25zID09PSAnbnVtYmVyJyA/IHsgbWF4Q291bnQ6IG9wdGlvbnMgfSA6IChvcHRpb25zID8/IHt9KTsKICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QoJ0ZMT1dfU0VMRUNUX01FRElBX01VTFRJJywgewogICAgICAgICAgICAgICAgJ3BheWxvYWQnOiB7CiAgICAgICAgICAgICAgICAgICAgJ21heENvdW50Jzogb3B0cy5tYXhDb3VudCwKICAgICAgICAgICAgICAgICAgICAnZmlsdGVyJzogb3B0cy5maWx0ZXIgPz8gJ2FsbCcsCiAgICAgICAgICAgICAgICAgICAgJ3ByZVNlbGVjdGVkSWRzJzogb3B0cy5wcmVTZWxlY3RlZElkcywKICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7CiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlKSB7CiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHJlc3BvbnNlKSkgewogICAgICAgICAgICAgICAgICAgIGlmICghaXNSZWNvcmQocmVzcG9uc2UpKSB7CiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYXJyYXkgcmVzcG9uc2UnKTsKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFthc3NlcnRNZWRpYUl0ZW0ocmVzcG9uc2UpXTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5tYXAoYXNzZXJ0TWVkaWFJdGVtKTsKICAgICAgICAgICAgfSk7CiAgICAgICAgfSwKICAgICAgICBnZXRCYXNlNjQob3B0aW9ucykgewogICAgICAgICAgICByZXR1cm4gcmVxdWVzdCgnRkxPV19NRURJQV9HRVRfQkFTRTY0JywgewogICAgICAgICAgICAgICAgJ3BheWxvYWQnOiB7ICdtZWRpYUlkJzogb3B0aW9ucy5tZWRpYUlkIH0sCiAgICAgICAgICAgIH0pCiAgICAgICAgICAgICAgICAudGhlbihhc3NlcnRNZWRpYUdldEJhc2U2NFJlc3VsdCkKICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7CiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcmVzcG9uc2UgZnJvbSBob3N0LiByZXF1ZXN0OiBGTE9XX01FRElBX0dFVF9CQVNFNjQsIGVycm9yOiAiJyArCiAgICAgICAgICAgICAgICAgICAgKGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKSkgKwogICAgICAgICAgICAgICAgICAgICciJyk7CiAgICAgICAgICAgIH0pOwogICAgICAgIH0sCiAgICB9LAogICAgc2F2ZShvcHRpb25zKSB7CiAgICAgICAgcmV0dXJuIHJlcXVlc3QoJ0ZMT1dfU0FWRScsIHsKICAgICAgICAgICAgJ3BheWxvYWQnOiB7CiAgICAgICAgICAgICAgICAnYmFzZTY0Jzogb3B0aW9ucy5iYXNlNjQsCiAgICAgICAgICAgICAgICAnbWltZVR5cGUnOiBvcHRpb25zLm1pbWVUeXBlLAogICAgICAgICAgICAgICAgJ25hbWUnOiBvcHRpb25zLm5hbWUgPz8gIsSQ4bqndSByYSBj4bunYSDhu6luZyBk4bulbmcgbmjhu48iLAogICAgICAgICAgICB9LAogICAgICAgIH0pCiAgICAgICAgICAgIC50aGVuKGFzc2VydElkUmVzcG9uc2UpCiAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gKHsKICAgICAgICAgICAgbWVkaWFJZDogcmVzcG9uc2UuaWQsCiAgICAgICAgfSkpOwogICAgfSwKICAgIHVwbG9hZChvcHRpb25zKSB7CiAgICAgICAgcmV0dXJuIHJlcXVlc3QoJ0ZMT1dfVVBMT0FEJywgewogICAgICAgICAgICAncGF5bG9hZCc6IHsKICAgICAgICAgICAgICAgICdiYXNlNjQnOiBvcHRpb25zLmJhc2U2NCwKICAgICAgICAgICAgICAgICdtaW1lVHlwZSc6IG9wdGlvbnMubWltZVR5cGUsCiAgICAgICAgICAgICAgICAnbmFtZSc6IG9wdGlvbnMubmFtZSA/PyAixJDhuqd1IHJhIGPhu6dhIOG7qW5nIGThu6VuZyBuaOG7jyIsCiAgICAgICAgICAgIH0sCiAgICAgICAgfSkKICAgICAgICAgICAgLnRoZW4oYXNzZXJ0SWRSZXNwb25zZSkKICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiAoewogICAgICAgICAgICBtZWRpYUlkOiByZXNwb25zZS5pZCwKICAgICAgICB9KSk7CiAgICB9LAogICAgZG93bmxvYWQob3B0aW9ucykgewogICAgICAgIHJldHVybiByZXF1ZXN0KCdGTE9XX0RPV05MT0FEJywgewogICAgICAgICAgICAncGF5bG9hZCc6IHsKICAgICAgICAgICAgICAgICdiYXNlNjQnOiBvcHRpb25zLmJhc2U2NCwKICAgICAgICAgICAgICAgICdtaW1lVHlwZSc6IG9wdGlvbnMubWltZVR5cGUsCiAgICAgICAgICAgICAgICAnZmlsZW5hbWUnOiBvcHRpb25zLmZpbGVuYW1lLAogICAgICAgICAgICB9LAogICAgICAgIH0pLnRoZW4oKCkgPT4gKHsgaXNTdWNjZXNzOiB0cnVlIH0pKTsKICAgIH0sCiAgICBnZW5lcmF0ZTogewogICAgICAgIGltYWdlKG9wdGlvbnMpIHsKICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QoJ0ZMT1dfR0VOX0lNQUdFJywgewogICAgICAgICAgICAgICAgJ3BheWxvYWQnOiB7CiAgICAgICAgICAgICAgICAgICAgJ3Byb21wdCc6IG9wdGlvbnMucHJvbXB0LAogICAgICAgICAgICAgICAgICAgICdtb2RlbERpc3BsYXlOYW1lJzogb3B0aW9ucy5tb2RlbERpc3BsYXlOYW1lLAogICAgICAgICAgICAgICAgICAgICdyZWZlcmVuY2VJbWFnZU1lZGlhSWRzJzogb3B0aW9ucy5yZWZlcmVuY2VJbWFnZU1lZGlhSWRzLAogICAgICAgICAgICAgICAgICAgICdhc3BlY3RSYXRpbyc6IG9wdGlvbnMuYXNwZWN0UmF0aW8gPz8gJzE2OjknLAogICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgfSkudGhlbihhc3NlcnRHZW5lcmF0ZVJlc3VsdCk7CiAgICAgICAgfSwKICAgICAgICB2aWRlbyhvcHRpb25zKSB7CiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0KCdGTE9XX0dFTl9WSURFTycsIHsKICAgICAgICAgICAgICAgICdwYXlsb2FkJzogewogICAgICAgICAgICAgICAgICAgICdwcm9tcHQnOiBvcHRpb25zLnByb21wdCwKICAgICAgICAgICAgICAgICAgICAnbW9kZWxEaXNwbGF5TmFtZSc6IG9wdGlvbnMubW9kZWxEaXNwbGF5TmFtZSwKICAgICAgICAgICAgICAgICAgICAnZmlyc3RGcmFtZUltYWdlTWVkaWFJZCc6IG9wdGlvbnMuZmlyc3RGcmFtZUltYWdlTWVkaWFJZCwKICAgICAgICAgICAgICAgICAgICAnbGFzdEZyYW1lSW1hZ2VNZWRpYUlkJzogb3B0aW9ucy5sYXN0RnJhbWVJbWFnZU1lZGlhSWQsCiAgICAgICAgICAgICAgICAgICAgJ3JlZmVyZW5jZUltYWdlTWVkaWFJZHMnOiBvcHRpb25zLnJlZmVyZW5jZUltYWdlTWVkaWFJZHMsCiAgICAgICAgICAgICAgICAgICAgJ3NvdXJjZVZpZGVvTWVkaWFJZCc6IG9wdGlvbnMuc291cmNlVmlkZW9NZWRpYUlkLAogICAgICAgICAgICAgICAgICAgICdzb3VyY2VWaWRlb01vZGUnOiBvcHRpb25zLnNvdXJjZVZpZGVvTW9kZSwKICAgICAgICAgICAgICAgICAgICAnYXVkaW9SZWZlcmVuY2VNZWRpYUlkcyc6IG9wdGlvbnMuYXVkaW9SZWZlcmVuY2VNZWRpYUlkcywKICAgICAgICAgICAgICAgICAgICAnYXNwZWN0UmF0aW8nOiBvcHRpb25zLmFzcGVjdFJhdGlvID8/ICcxNjo5JywKICAgICAgICAgICAgICAgICAgICAnZHVyYXRpb25TZWNvbmRzJzogb3B0aW9ucy5kdXJhdGlvblNlY29uZHMsCiAgICAgICAgICAgICAgICAgICAgJ3Jlc29sdXRpb24nOiBvcHRpb25zLnJlc29sdXRpb24sCiAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICB9KS50aGVuKGFzc2VydEdlbmVyYXRlUmVzdWx0KTsKICAgICAgICB9LAogICAgICAgIHRleHQocHJvbXB0T3JPcHRpb25zLCBvcHRpb25zKSB7CiAgICAgICAgICAgIGxldCBwcm9tcHQ7CiAgICAgICAgICAgIGxldCBvcHRzOwogICAgICAgICAgICBpZiAodHlwZW9mIHByb21wdE9yT3B0aW9ucyA9PT0gJ3N0cmluZycpIHsKICAgICAgICAgICAgICAgIHByb21wdCA9IHByb21wdE9yT3B0aW9uczsKICAgICAgICAgICAgICAgIG9wdHMgPSBvcHRpb25zOwogICAgICAgICAgICB9CiAgICAgICAgICAgIGVsc2UgaWYgKHByb21wdE9yT3B0aW9ucykgewogICAgICAgICAgICAgICAgcHJvbXB0ID0gcHJvbXB0T3JPcHRpb25zLnByb21wdDsKICAgICAgICAgICAgICAgIG9wdHMgPSBwcm9tcHRPck9wdGlvbnM7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHsKICAgICAgICAgICAgICAgICdwcm9tcHQnOiBwcm9tcHQgPz8gJycsCiAgICAgICAgICAgICAgICAnc3lzdGVtSW5zdHJ1Y3Rpb24nOiBvcHRzPy5zeXN0ZW1JbnN0cnVjdGlvbiwKICAgICAgICAgICAgICAgICd0aGlua2luZ0xldmVsJzogb3B0cz8udGhpbmtpbmdMZXZlbCwKICAgICAgICAgICAgICAgICdpbWFnZXMnOiBvcHRzPy5pbWFnZXMsCiAgICAgICAgICAgICAgICAndmlkZW9zJzogb3B0cz8udmlkZW9zLAogICAgICAgICAgICAgICAgJ2F1ZGlvcyc6IG9wdHM/LmF1ZGlvcywKICAgICAgICAgICAgfTsKICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QoJ0ZMT1dfR0VOX1RFWFQnLCB7CiAgICAgICAgICAgICAgICAncGF5bG9hZCc6IHBheWxvYWQsCiAgICAgICAgICAgIH0pLnRoZW4oYXNzZXJ0R2VuVGV4dFJlc3VsdCk7CiAgICAgICAgfSwKICAgIH0sCiAgICBjYW1lcmE6IHsKICAgICAgICBjYXB0dXJlKG9wdGlvbnMpIHsKICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QoJ0ZMT1dfQ0FQVFVSRV9DQU1FUkEnLCB7CiAgICAgICAgICAgICAgICAncGF5bG9hZCc6IHsKICAgICAgICAgICAgICAgICAgICAnZmFjaW5nTW9kZSc6IG9wdGlvbnM/LmZhY2luZ01vZGUgPz8gJ3VzZXInLAogICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgfSkudGhlbihhc3NlcnRDYW1lcmFDYXB0dXJlUmVzdWx0KTsKICAgICAgICB9LAogICAgICAgIHN0cmVhbShvcHRpb25zKSB7CiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0KCdGTE9XX0NBTUVSQV9TVFJFQU1fU1RBUlQnLCB7CiAgICAgICAgICAgICAgICAncGF5bG9hZCc6IHsKICAgICAgICAgICAgICAgICAgICAnZmFjaW5nTW9kZSc6IG9wdGlvbnM/LmZhY2luZ01vZGUgPz8gJ3VzZXInLAogICAgICAgICAgICAgICAgICAgICdmcmFtZVJhdGUnOiBvcHRpb25zPy5mcmFtZVJhdGUgPz8gMzAsCiAgICAgICAgICAgICAgICAgICAgJ3Jlc29sdXRpb24nOiBvcHRpb25zPy5yZXNvbHV0aW9uID8/ICdtZWRpdW0nLAogICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgfSkKICAgICAgICAgICAgICAgIC50aGVuKGFzc2VydENhbWVyYVN0cmVhbVJlc3BvbnNlKQogICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7CiAgICAgICAgICAgICAgICBjb25zdCBzdHJlYW1JZCA9IHJlc3BvbnNlLnN0cmVhbUlkOwogICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSByZXNwb25zZS53aWR0aDsKICAgICAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHJlc3BvbnNlLmhlaWdodDsKICAgICAgICAgICAgICAgIGxldCBmcmFtZUNhbGxiYWNrID0gbnVsbDsKICAgICAgICAgICAgICAgIGNvbnN0IGZyYW1lTGlzdGVuZXIgPSAoZXZlbnQpID0+IHsKICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQub3JpZ2luICE9PSB3aW5kb3dbJ0ZMT1dfUEFSRU5UX09SSUdJTiddKQogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47CiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGlzUmVjb3JkKGV2ZW50LmRhdGEpID8gZXZlbnQuZGF0YSA6IHt9OwogICAgICAgICAgICAgICAgICAgIGlmIChkYXRhWyd0eXBlJ10gIT09ICdGTE9XX0NBTUVSQV9GUkFNRScgfHwKICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVsnc3RyZWFtSWQnXSAhPT0gc3RyZWFtSWQpIHsKICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVsnaXNTdG9wcGVkJ10pIHsKICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWVDYWxsYmFjayA9IG51bGw7CiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnJhbWVMaXN0ZW5lcik7CiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgaWYgKGZyYW1lQ2FsbGJhY2spIHsKICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWVDYWxsYmFjayh7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaXRtYXA6IGFzc2VydEltYWdlQml0bWFwKGRhdGFbJ2JpdG1hcCddKSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBhc3NlcnROdW1iZXIoZGF0YVsnd2lkdGgnXSwgJ3dpZHRoJyksCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGFzc2VydE51bWJlcihkYXRhWydoZWlnaHQnXSwgJ2hlaWdodCcpLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBhc3NlcnROdW1iZXIoZGF0YVsndGltZXN0YW1wJ10sICd0aW1lc3RhbXAnKSwKICAgICAgICAgICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgfTsKICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnJhbWVMaXN0ZW5lcik7CiAgICAgICAgICAgICAgICByZXR1cm4gewogICAgICAgICAgICAgICAgICAgIHdpZHRoLAogICAgICAgICAgICAgICAgICAgIGhlaWdodCwKICAgICAgICAgICAgICAgICAgICBvbkZyYW1lKGNhbGxiYWNrKSB7CiAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lQ2FsbGJhY2sgPSBjYWxsYmFjazsKICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgIHN0b3AoKSB7CiAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lQ2FsbGJhY2sgPSBudWxsOwogICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZyYW1lTGlzdGVuZXIpOwogICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdCgnRkxPV19DQU1FUkFfU1RSRUFNX1NUT1AnLCB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGF5bG9hZCc6IHsgJ3N0cmVhbUlkJzogc3RyZWFtSWQgfSwKICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7IH0pOwogICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICB9OwogICAgICAgICAgICB9KTsKICAgICAgICB9LAogICAgfSwKICAgIG1pY3JvcGhvbmU6IHsKICAgICAgICByZWNvcmQob3B0aW9ucykgewogICAgICAgICAgICByZXR1cm4gcmVxdWVzdCgnRkxPV19SRUNPUkRfTUlDJywgewogICAgICAgICAgICAgICAgJ3BheWxvYWQnOiB7CiAgICAgICAgICAgICAgICAgICAgJ2R1cmF0aW9uTXMnOiBvcHRpb25zPy5kdXJhdGlvbk1zID8/IDUwMDAsCiAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICB9KS50aGVuKGFzc2VydE1pY3JvcGhvbmVSZWNvcmRSZXN1bHQpOwogICAgICAgIH0sCiAgICB9LAogICAgc3RvcmFnZTogewogICAgICAgIGdldEl0ZW0oa2V5KSB7CiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0KCdGTE9XX1NUT1JBR0VfR0VUX0lURU0nLCB7CiAgICAgICAgICAgICAgICAncGF5bG9hZCc6IHsgJ2tleSc6IGtleSB9LAogICAgICAgICAgICB9KQogICAgICAgICAgICAgICAgLnRoZW4oYXNzZXJ0U3RvcmFnZVZhbHVlT3JOdWxsKQogICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHsKICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCByZXNwb25zZSBmcm9tIGhvc3QuIHJlcXVlc3Q6IEZMT1dfU1RPUkFHRV9HRVRfSVRFTSwgZXJyb3I6ICInICsKICAgICAgICAgICAgICAgICAgICAoZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFN0cmluZyhlcnIpKSArCiAgICAgICAgICAgICAgICAgICAgJyInKTsKICAgICAgICAgICAgfSk7CiAgICAgICAgfSwKICAgICAgICBzZXRJdGVtKGtleSwgdmFsdWUpIHsKICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QoJ0ZMT1dfU1RPUkFHRV9TRVRfSVRFTScsIHsKICAgICAgICAgICAgICAgICdwYXlsb2FkJzogeyAna2V5Jzoga2V5LCAndmFsdWUnOiB2YWx1ZSB9LAogICAgICAgICAgICB9KQogICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4geyB9KQogICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHsKICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCByZXNwb25zZSBmcm9tIGhvc3QuIHJlcXVlc3Q6IEZMT1dfU1RPUkFHRV9TRVRfSVRFTSwgZXJyb3I6ICInICsKICAgICAgICAgICAgICAgICAgICAoZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFN0cmluZyhlcnIpKSArCiAgICAgICAgICAgICAgICAgICAgJyInKTsKICAgICAgICAgICAgfSk7CiAgICAgICAgfSwKICAgICAgICByZW1vdmVJdGVtKGtleSkgewogICAgICAgICAgICByZXR1cm4gcmVxdWVzdCgnRkxPV19TVE9SQUdFX1JFTU9WRV9JVEVNJywgewogICAgICAgICAgICAgICAgJ3BheWxvYWQnOiB7ICdrZXknOiBrZXkgfSwKICAgICAgICAgICAgfSkKICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHsgfSkKICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7CiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcmVzcG9uc2UgZnJvbSBob3N0LiByZXF1ZXN0OiBGTE9XX1NUT1JBR0VfUkVNT1ZFX0lURU0sIGVycm9yOiAiJyArCiAgICAgICAgICAgICAgICAgICAgKGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKSkgKwogICAgICAgICAgICAgICAgICAgICciJyk7CiAgICAgICAgICAgIH0pOwogICAgICAgIH0sCiAgICAgICAgY2xlYXIoKSB7CiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0KCdGTE9XX1NUT1JBR0VfQ0xFQVInLCB7fSkKICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHsgfSkKICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7CiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcmVzcG9uc2UgZnJvbSBob3N0LiByZXF1ZXN0OiBGTE9XX1NUT1JBR0VfQ0xFQVIsIGVycm9yOiAiJyArCiAgICAgICAgICAgICAgICAgICAgKGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKSkgKwogICAgICAgICAgICAgICAgICAgICciJyk7CiAgICAgICAgICAgIH0pOwogICAgICAgIH0sCiAgICAgICAga2V5cyhvcHRpb25zKSB7CiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0KCdGTE9XX1NUT1JBR0VfS0VZUycsIHsKICAgICAgICAgICAgICAgICdwYXlsb2FkJzogeyAncHJlZml4Jzogb3B0aW9ucz8ucHJlZml4IH0sCiAgICAgICAgICAgIH0pCiAgICAgICAgICAgICAgICAudGhlbihhc3NlcnRTdHJpbmdBcnJheSkKICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7CiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcmVzcG9uc2UgZnJvbSBob3N0LiByZXF1ZXN0OiBGTE9XX1NUT1JBR0VfS0VZUywgZXJyb3I6ICInICsKICAgICAgICAgICAgICAgICAgICAoZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFN0cmluZyhlcnIpKSArCiAgICAgICAgICAgICAgICAgICAgJyInKTsKICAgICAgICAgICAgfSk7CiAgICAgICAgfSwKICAgIH0sCn07CmV4cG9ydCBjb25zdCBGbG93ID0gRkxPVzsK",
    "@app": "data:text/javascript;base64,Ly8gdmlydHVhbDpBcHAudHN4CmltcG9ydCB7IHVzZVN0YXRlIGFzIHVzZVN0YXRlMiwgdXNlRWZmZWN0IGFzIHVzZUVmZmVjdDIgfSBmcm9tICJyZWFjdCI7CmltcG9ydCB7IEZsb3cgfSBmcm9tICJmbG93LXNkayI7CmltcG9ydCBKU1ppcCBmcm9tICJqc3ppcCI7CgovLyB2aXJ0dWFsOmNvbnN0YW50cy50cwp2YXIgU1VHR0VTVEVEX1RIRU1FUyA9IFsKICAiTmdcdTAxQjBcdTFFRERpIHF1ZSBjXHhGNCBcdTAxMTFcdTAxQTFuIHRceEVDbSB0aFx1MUVBNXkgbVx1MUVEOXQgbmdcdTAxQjBcdTFFRERpIGJcdTFFQTFuIHRyb25nIGNcdTAxQTFuIG1cdTAxQjBhIGdpXHUxRUE1eSIsCiAgIkNceEUydSBjaHV5XHUxRUM3biB2XHUxRUMxIGNoaVx1MUVCRmMgYlx4RjNuZyBraFx4RjRuZyBjaFx1MUVDQnUgclx1MUVERGkgXHUwMTExaSBnaVx1MUVFRmEgXHUwMTExXHhFQW0gdHJcdTAxMDNuZyIsCiAgIk1cdTFFRDl0IG5nXHUwMUIwXHUxRUREaSBxdWUgbmhcdTFFQ0YgYlx4RTkgeFx4RTJ5IGRcdTFFRjFuZyB0XHhGMmEgbFx4RTJ1IFx1MDExMVx4RTBpIHRcdTFFRUIgbmhcdTFFRUZuZyBtXHUxRUEzbmggZ2lcdTFFQTV5IHZcdTFFRTVuIiwKICAiTmdcdTAxQjBcdTFFRERpIHF1ZSBoXHUxRUNEYyBjXHhFMWNoIHRoYSB0aFx1MUVFOSBjaG8gY2hceEVEbmggbVx4RUNuaCIsCiAgIkNceEUydSBjaHV5XHUxRUM3biB2XHUxRUMxIHRcdTFFREQgZ2lcdTFFQTV5IG5oXHhFMHUgbWFuZyB0cm9uZyBtXHhFQ25oIG1cdTFFRDl0IGdpXHUxRUE1YyBtXHUwMUExIGJheSIsCiAgIk1cdTFFRDl0IGN1XHUxRUQ5YyBnXHUxRUI3cCBnXHUxRUUxIGtcdTFFRjMgbFx1MUVBMSB0cm9uZyB0aFx1MUVCRiBnaVx1MUVEQmkgZ2lcdTFFQTV5IG5oXHUwMTAzbiIsCiAgIk5nXHUwMUIwXHUxRUREaSBxdWUgXHUwMTExaSB0XHhFQ20gXHhGRCBuZ2hcdTAxMjlhIGNcdTFFRTdhIGhcdTFFQTFuaCBwaFx4RkFjIHF1YSB0XHUxRUVCbmcgblx1MUVCRnAgZ1x1MUVBNXAiLAogICJDXHhFMnUgY2h1eVx1MUVDN24gYnVcdTFFRDNuIHZcdTFFQzEgbVx1MUVEOXQgbFx1MUVERGkgaFx1MUVFOWEgYlx1MUVDQiBnaVx4RjMgY3VcdTFFRDFuIFx1MDExMWkiLAogICJOZ1x1MDFCMFx1MUVERGkgcXVlIHZceEUwIGNceEUxbmggY1x1MUVFRGEgYlx4RUQgbVx1MUVBRHQgZFx1MUVBQm4gXHUwMTExXHUxRUJGbiB0aFx1MUVCRiBnaVx1MUVEQmkgbVx4RTB1IHNcdTFFQUZjIiwKICAiTVx1MUVEOXQgbmdceEUweSB0aFx1MUVCRiBnaVx1MUVEQmkgZ2lcdTFFQTV5IG1cdTFFQTV0IFx1MDExMWkgbmhcdTFFRUZuZyBcdTAxMTFcdTAxQjBcdTFFRERuZyBrXHUxRUJCIFx4RjQiCl07CnZhciBQQVBFUl9TVFlMRVMgPSBbCiAgIkdpXHUxRUE1eSB0clx1MUVBRm5nIG5oXHUwMTAzbiIsCiAgIkdpXHUxRUE1eSBjXHUwMTY5IG5nXHUxRUEzIHZceEUwbmciLAogICJHaVx1MUVBNXkgaFx1MUVDRGMgc2luaCIsCiAgIkdpXHUxRUE1eSBnaGkgY2hceEZBIiwKICAiR2lcdTFFQTV5IHJceEUxY2ggbVx4RTlwIgpdOwp2YXIgU1RJQ0tNQU5fVFlQRVMgPSBbCiAgIk1cdTFFRjFjIFx1MDExMWVuIHRcdTFFRDFpIGdpXHUxRUEzbiIsCiAgIkJceEYzbmcgY2hpXHUxRUJGdSIsCiAgIlZcdTFFQkQgYlx4RkF0IGNoXHhFQyIsCiAgIkNcdTFFQUZ0IGdpXHUxRUE1eSBcdTAxMTFlbiIsCiAgIlBoXHUxRUE1biB0clx1MUVBRm5nIgpdOwp2YXIgUkhZVEhNUyA9IFsKICAiTmhcdTFFQjkgbmhceEUwbmciLAogICJCdVx1MUVEM24gc1x4RTJ1IGxcdTFFQUZuZyIsCiAgIkhceEUwaSBoXHUwMUIwXHUxRURCYyIsCiAgIlRydXlcdTFFQzFuIGNcdTFFQTNtIGhcdTFFRTluZyIsCiAgIkJceEVEIFx1MUVBOW4iLAogICJUaGlcdTFFQkZ1IG5oaSIKXTsKdmFyIFZPSUNFX1RZUEVTID0gWwogICJHaVx1MUVDRG5nIE5hbSBUclx1MUVBN20iLAogICJHaVx1MUVDRG5nIE5cdTFFRUYgTmdcdTFFQ0R0IE5nXHhFMG8iLAogICJHaVx1MUVDRG5nIFRydXlcdTFFQzFuIENcdTFFQTNtIiwKICAiR2lcdTFFQ0RuZyBLXHUxRUMzIENodXlcdTFFQzduIgpdOwp2YXIgR0VUX1NZU1RFTV9QUk9NUFQgPSAoaGFzUHJvZHVjdCwgcHJvZHVjdE5hbWUsIHByb2R1Y3REZXNjKSA9PiB7CiAgY29uc3QgcHJvZHVjdENvbnRleHQgPSBoYXNQcm9kdWN0ID8gYENcdTFFQTNuaCBjdVx1MUVEMWkgY1x4RjluZyAoQ1x1MUVBM25oIDYpIFBIXHUxRUEySSBsXHhFMCBtXHUxRUQ5dCBjXHUxRUEzbmggcXVcdTFFQTNuZyBiXHhFMSBzXHUxRUEzbiBwaFx1MUVBOW0gIiR7cHJvZHVjdE5hbWV9Ii4gCiAgICAgICBOXHUxRUQ5aSBkdW5nIGNcdTFFQTNuaCA2IHBoXHUxRUEzaSBsaVx4RUFuIGtcdTFFQkZ0IGxvZ2ljIHZcdTFFREJpIFx4RkQgdFx1MDFCMFx1MUVERm5nIGNcdTFFRDF0IHRydXlcdTFFQzduIGNcdTFFRTdhIDUgY1x1MUVBM25oIHRyXHUwMUIwXHUxRURCYyBcdTAxMTFceEYzLgogICAgICAgVHJvbmcgdm9pY2VTY3JpcHQgY1x1MUVFN2EgQ1x1MUVBM25oIDYsIEJcdTFFQUVUIEJVXHUxRUQ4QyBwaFx1MUVBM2kgbmhcdTFFQUZjIFx1MDExMVx1MUVCRm4gdFx4RUFuIHNcdTFFQTNuIHBoXHUxRUE5bSAiJHtwcm9kdWN0TmFtZX0iLiAKICAgICAgIE1ceEY0IHRcdTFFQTMgc1x1MUVBM24gcGhcdTFFQTltOiAke3Byb2R1Y3REZXNjfS5gIDogYFZpXHUxRUJGdCBrXHUxRUNCY2ggYlx1MUVBM24gZ1x1MUVEM20gNSBjXHUxRUEzbmguYDsKICByZXR1cm4gYEJcdTFFQTFuIGxceEUwIGJpXHhFQW4ga1x1MUVDQmNoIGNodXlceEVBbiBuZ2hpXHUxRUM3cC4gSFx4RTN5IHZpXHUxRUJGdCBrXHUxRUNCY2ggYlx1MUVBM24ga1x1MUVDMyBjaHV5XHUxRUM3biBuZ1x1MDFCMFx1MUVERGkgcXVlIHRyXHhFQW4gblx1MUVDMW4gZ2lcdTFFQTV5Lgoke3Byb2R1Y3RDb250ZXh0fQoKWVx4RUF1IGNcdTFFQTd1IHBob25nIGNceEUxY2ggY2h1bmc6Ck5oXHhFMm4gdlx1MUVBRHQgbFx4RTAgbmdcdTAxQjBcdTFFRERpIHF1ZSAoc3RpY2ttYW4pIFx1MDExMWVuLCBuXHUxRUMxbiBnaVx1MUVBNXkgbmhceEUwdSBjXHhGMyB0ZXh0dXJlIGNcdTFFRjFjIGtcdTFFRjMgY2hpIHRpXHUxRUJGdCwgXHhFMW5oIHNceEUxbmcgY2luZW1hdGljLCBiXHhGM25nIFx1MDExMVx1MUVENSB0aFx1MUVGMWMgdFx1MUVCRi4KClRyXHUxRUEzIHZcdTFFQzEgSlNPTiBsXHhFMCBtXHUxRUEzbmcgY1x4RTFjIFx1MDExMVx1MUVEMWkgdFx1MDFCMFx1MUVFM25nIGNcdTFFQTNuaDoKLSB0ZXh0Vmk6IFBoXHUxRUU1IFx1MDExMVx1MUVDMSBuZ1x1MUVBRm4gZ1x1MUVDRG4gKGRcdTAxQjBcdTFFREJpIDEwIHRcdTFFRUIpLgotIHZvaWNlU2NyaXB0OiBMXHUxRUREaSB0aHV5XHUxRUJGdCBtaW5oIHRydXlcdTFFQzFuIGNcdTFFQTNtLCBnaVx1MUVDRG5nIEJcdTFFQUZjIFZpXHUxRUM3dCBOYW0uIFx1MDExMFx1MUVEOSBkXHhFMGkgYlx1MUVBRnQgYnVcdTFFRDljIHRcdTFFRUIgMjAtMjUgdFx1MUVFQi4gTlx1MUVEOWkgZHVuZyBzXHhFMnUgc1x1MUVBRmMuCi0gYWN0aW9uOiBNXHhGNCB0XHUxRUEzIGhceEUwbmggXHUwMTExXHUxRUQ5bmcgY2hpIHRpXHUxRUJGdCAoVGlcdTFFQkZuZyBWaVx1MUVDN3QpLgotIGVtb3Rpb246IENcdTFFQTNtIHhceEZBYyBjaFx1MUVFNyBcdTAxMTFcdTFFQTFvLgotIHByb21wdEVuOiBQcm9tcHQgdGlcdTFFQkZuZyBBbmggY1x1MUVGMWMga1x1MUVGMyBjaGkgdGlcdTFFQkZ0LiBCYW8gZ1x1MUVEM206ICJ1bHRyYS1kZXRhaWxlZCIsICI0ayByZXNvbHV0aW9uIiwgImNpbmVtYXRpYyBsaWdodGluZyIsICJoZWF2eSBwYXBlciB0ZXh0dXJlIiwgIm5vIG9uLXNjcmVlbiB0ZXh0IiwgIm5vIGxldHRlcnMiLgotIGlzUHJvZHVjdEFkOiAoYm9vbGVhbikgdHJ1ZSBuXHUxRUJGdSBsXHhFMCBjXHUxRUEzbmggcXVcdTFFQTNuZyBiXHhFMSBzXHUxRUEzbiBwaFx1MUVBOW0gKGNcdTFFQTNuaCBjdVx1MUVEMWkpLCBmYWxzZSBjaG8gY1x4RTFjIGNcdTFFQTNuaCBraFx4RTFjLgoKVlx4RUQgZFx1MUVFNSB2b2ljZVNjcmlwdDogIkdpXHUxRUVGYSBuaFx1MUVFRm5nIG5cdTFFQkZwIGdcdTFFQTVwIHRoXHUxRUREaSBnaWFuIG5oXHUwMTAzbiBuaFx4RkFtLCBjXHUxRUFEdSBcdTFFQTV5IGNcdTFFRTkgbFx1MUVBN20gbFx1MDE2OWkgYlx1MDFCMFx1MUVEQmMgXHUwMTExaSwgY2hcdTFFQjNuZyBiaVx1MUVCRnQgXHUwMTExXHhFMnUgbFx4RTAgXHUwMTExaVx1MUVDM20gZFx1MUVFQm5nLCBjaFx1MUVDOSB0aFx1MUVBNXkgbFx4RjJuZyBtXHhFQ25oIG5cdTFFQjduZyB0clx1MDEyOXUgbmhcdTFFRUZuZyBuXHUxRUQ3aSBuaVx1MUVDMW0ga2hceEY0bmcgdFx4RUFuLiJgOwp9OwoKLy8gdmlydHVhbDpjb21wb25lbnRzL1ByaW1pdGl2ZXMudHN4CmltcG9ydCB7IHVzZVN0YXRlLCB1c2VSZWYsIHVzZUVmZmVjdCB9IGZyb20gInJlYWN0IjsKaW1wb3J0IHsganN4LCBqc3hzIH0gZnJvbSAicmVhY3QvanN4LXJ1bnRpbWUiOwp2YXIgU2VjdGlvbkxhYmVsID0gKHsgY2hpbGRyZW4gfSkgPT4gLyogQF9fUFVSRV9fICovIGpzeCgiZGl2IiwgeyBjbGFzc05hbWU6ICJmbGV4IGl0ZW1zLWNlbnRlciBweC0yIiwgY2hpbGRyZW46IC8qIEBfX1BVUkVfXyAqLyBqc3goInNwYW4iLCB7IGNsYXNzTmFtZTogInRleHQtWzExcHhdIGZvbnQtbWVkaXVtIHRleHQtW3JnYmEoMjE4LDIyMCwyMjQsMC45KV0gdHJhY2tpbmctWzAuMXB4XSBub3JtYWwtY2FzZSIsIGNoaWxkcmVuIH0pIH0pOwp2YXIgUGlsbEJ1dHRvbiA9ICh7CiAgaWNvbiwKICBjaGlsZHJlbiwKICB2YXJpYW50ID0gImZpbGxlZCIsCiAgb25DbGljaywKICBkaXNhYmxlZAp9KSA9PiB7CiAgY29uc3QgYmFzZSA9ICJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtWzJweF0ganVzdGlmeS1jZW50ZXIgdy1mdWxsIGgtWzM0cHhdIHJvdW5kZWQteGwgZm9udC1tZWRpdW0gdHJhY2tpbmctWzAuMXB4XSB0cmFuc2l0aW9uLWFsbCBjdXJzb3ItcG9pbnRlciBkaXNhYmxlZDpvcGFjaXR5LTUwIGRpc2FibGVkOmN1cnNvci1ub3QtYWxsb3dlZCI7CiAgY29uc3QgdmFyaWFudHMgPSB7CiAgICBmaWxsZWQ6ICJiZy1bIzk2OTY5Nl0gaG92ZXI6YmctWyNhNmE2YTZdIGFjdGl2ZTpiZy1bIzg2ODY4Nl0gdGV4dC1ibGFjayB0ZXh0LVsxMXB4XSBwbC1bOHB4XSBwci1bMjRweF0gcHktMSBzZWxlY3Qtbm9uZSIsCiAgICBvdXRsaW5lOiAiYm9yZGVyIGJvcmRlci1bIzU5NTk1OV0gaG92ZXI6Ymctd2hpdGUvNSBhY3RpdmU6Ymctd2hpdGUvMTAgYmFja2Ryb3AtYmx1ci1bNDBweF0gdGV4dC1bMTJweF0gcGwtWzhweF0gcHItWzE2cHhdIHB5LTIgdGV4dC13aGl0ZSBzZWxlY3Qtbm9uZSIsCiAgICBzb2xpZDogImJnLXdoaXRlIGhvdmVyOmJnLWdyYXktMjAwIGFjdGl2ZTpiZy1ncmF5LTMwMCB0ZXh0LWJsYWNrIHRleHQtWzEycHhdIHBsLVs4cHhdIHByLVsxNnB4XSBweS0yIHNlbGVjdC1ub25lIgogIH07CiAgcmV0dXJuIC8qIEBfX1BVUkVfXyAqLyBqc3hzKCJidXR0b24iLCB7IGNsYXNzTmFtZTogYCR7YmFzZX0gJHt2YXJpYW50c1t2YXJpYW50XX1gLCBvbkNsaWNrLCBkaXNhYmxlZCwgY2hpbGRyZW46IFsKICAgIGljb24gJiYgLyogQF9fUFVSRV9fICovIGpzeCgic3BhbiIsIHsgY2xhc3NOYW1lOiAiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdy02IGgtNiIsIGNoaWxkcmVuOiBpY29uIH0pLAogICAgLyogQF9fUFVSRV9fICovIGpzeCgic3BhbiIsIHsgY2hpbGRyZW4gfSkKICBdIH0pOwp9Owp2YXIgRmllbGREcm9wZG93biA9ICh7CiAgbGFiZWwsCiAgdmFsdWUsCiAgb3B0aW9ucywKICBvbkNoYW5nZSwKICBjbGFzc05hbWUgPSAiIgp9KSA9PiB7CiAgY29uc3QgW2lzT3Blbiwgc2V0SXNPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTsKICBjb25zdCByZWYgPSB1c2VSZWYobnVsbCk7CiAgdXNlRWZmZWN0KCgpID0+IHsKICAgIGNvbnN0IGxpc3RlbmVyID0gKGV2ZW50KSA9PiB7CiAgICAgIGlmICghcmVmLmN1cnJlbnQgfHwgIXJlZi5jdXJyZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHsKICAgICAgICBzZXRJc09wZW4oZmFsc2UpOwogICAgICB9CiAgICB9OwogICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigibW91c2Vkb3duIiwgbGlzdGVuZXIpOwogICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoIm1vdXNlZG93biIsIGxpc3RlbmVyKTsKICB9LCBbXSk7CiAgcmV0dXJuIC8qIEBfX1BVUkVfXyAqLyBqc3hzKCJkaXYiLCB7IHJlZiwgY2xhc3NOYW1lOiBgcmVsYXRpdmUgJHtjbGFzc05hbWV9YCwgY2hpbGRyZW46IFsKICAgIC8qIEBfX1BVUkVfXyAqLyBqc3hzKAogICAgICAiYnV0dG9uIiwKICAgICAgewogICAgICAgIHR5cGU6ICJidXR0b24iLAogICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldElzT3BlbighaXNPcGVuKSwKICAgICAgICBjbGFzc05hbWU6ICJ3LWZ1bGwgdGV4dC1sZWZ0IGJvcmRlciBib3JkZXItWyM1OTU5NTldIGhvdmVyOmJvcmRlci1bIzdhN2E3YV0gdHJhbnNpdGlvbi1jb2xvcnMgcm91bmRlZC14bCBmbGV4IGZsZXgtY29sIGdhcC0wLjUganVzdGlmeS1jZW50ZXIgcGItMiBwbC0yLjUgcHItMSBwdC1bNXB4XSBzZWxlY3Qtbm9uZSBmb2N1czpvdXRsaW5lLW5vbmUiLAogICAgICAgIGNoaWxkcmVuOiBbCiAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4KCJwIiwgeyBjbGFzc05hbWU6ICJ0ZXh0LVsxMXB4XSBmb250LW1lZGl1bSB0ZXh0LXdoaXRlLzM1IHRyYWNraW5nLVswLjFweF0iLCBjaGlsZHJlbjogbGFiZWwgfSksCiAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4cygiZGl2IiwgeyBjbGFzc05hbWU6ICJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4iLCBjaGlsZHJlbjogWwogICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4KCJzcGFuIiwgeyBjbGFzc05hbWU6ICJ0ZXh0LVsxMXB4XSBmb250LW1lZGl1bSB0ZXh0LXdoaXRlIHRyYWNraW5nLVswLjFweF0gdHJ1bmNhdGUgcHItMiIsIGNoaWxkcmVuOiB2YWx1ZSB9KSwKICAgICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeCgic3BhbiIsIHsgY2xhc3NOYW1lOiBgbWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB0ZXh0LVsxNnB4XSB0ZXh0LXdoaXRlLzUwIG1yLTEgdHJhbnNpdGlvbi10cmFuc2Zvcm0gJHtpc09wZW4gPyAicm90YXRlLTE4MCIgOiAiIn1gLCBjaGlsZHJlbjogImtleWJvYXJkX2Fycm93X2Rvd24iIH0pCiAgICAgICAgICBdIH0pCiAgICAgICAgXQogICAgICB9CiAgICApLAogICAgaXNPcGVuICYmIC8qIEBfX1BVUkVfXyAqLyBqc3goImRpdiIsIHsgY2xhc3NOYW1lOiAiYWJzb2x1dGUgei01MCB0b3AtW2NhbGMoMTAwJSs0cHgpXSBsZWZ0LTAgdy1mdWxsIGJnLVsjMGUwZTBlXSBib3JkZXIgYm9yZGVyLVsjNTk1OTU5XSByb3VuZGVkLXhsIG92ZXJmbG93LWhpZGRlbiBzaGFkb3cteGwgYmFja2Ryb3AtYmx1ci1tZCBhbmltYXRlLWRyb3Bkb3duIG9yaWdpbi10b3AiLCBjaGlsZHJlbjogLyogQF9fUFVSRV9fICovIGpzeCgiZGl2IiwgeyBjbGFzc05hbWU6ICJtYXgtaC00MCBvdmVyZmxvdy15LWF1dG8gZGFyay1zY3JvbGxiYXIiLCBjaGlsZHJlbjogb3B0aW9ucy5tYXAoKG9wdCkgPT4gewogICAgICBjb25zdCBpc1NlbGVjdGVkID0gdmFsdWUgPT09IG9wdDsKICAgICAgcmV0dXJuIC8qIEBfX1BVUkVfXyAqLyBqc3goCiAgICAgICAgImJ1dHRvbiIsCiAgICAgICAgewogICAgICAgICAgdHlwZTogImJ1dHRvbiIsCiAgICAgICAgICBjbGFzc05hbWU6IGB3LWZ1bGwgdGV4dC1sZWZ0IHB4LTIuNSBweS0yIHRleHQtWzExcHhdIGZvbnQtbWVkaXVtIHRyYWNraW5nLVswLjFweF0gaG92ZXI6YmctWyMxYTFhMWFdIHRyYW5zaXRpb24tY29sb3JzICR7aXNTZWxlY3RlZCA/ICJiZy1bIzFhMWExYV0gdGV4dC13aGl0ZSIgOiAidGV4dC13aGl0ZS83MCJ9YCwKICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHsKICAgICAgICAgICAgb25DaGFuZ2Uob3B0KTsKICAgICAgICAgICAgc2V0SXNPcGVuKGZhbHNlKTsKICAgICAgICAgIH0sCiAgICAgICAgICBjaGlsZHJlbjogb3B0CiAgICAgICAgfSwKICAgICAgICBvcHQKICAgICAgKTsKICAgIH0pIH0pIH0pCiAgXSB9KTsKfTsKdmFyIFNlZ21lbnRlZFRvZ2dsZSA9ICh7CiAgdmFsdWUsCiAgaXRlbXMsCiAgb25DaGFuZ2UKfSkgPT4gewogIHJldHVybiAvKiBAX19QVVJFX18gKi8ganN4KCJkaXYiLCB7IGNsYXNzTmFtZTogImZsZXggdy1mdWxsIGl0ZW1zLWNlbnRlciBib3JkZXIgYm9yZGVyLVsjNTk1OTU5XSByb3VuZGVkLXhsIG92ZXJmbG93LWhpZGRlbiBiZy10cmFuc3BhcmVudCIsIGNoaWxkcmVuOiBpdGVtcy5tYXAoKGl0ZW0pID0+IHsKICAgIGNvbnN0IGlzQWN0aXZlID0gdmFsdWUgPT09IGl0ZW0udmFsdWU7CiAgICByZXR1cm4gLyogQF9fUFVSRV9fICovIGpzeHMoCiAgICAgICJidXR0b24iLAogICAgICB7CiAgICAgICAgdHlwZTogImJ1dHRvbiIsCiAgICAgICAgb25DbGljazogKCkgPT4gb25DaGFuZ2UoaXRlbS52YWx1ZSksCiAgICAgICAgY2xhc3NOYW1lOiBgZmxleC0xIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0xIGgtWzM0cHhdIHB4LTMgcHktMiByb3VuZGVkLXhsIHRleHQtWzExcHhdIGZvbnQtbWVkaXVtIHRyYWNraW5nLVswLjFweF0gdHJhbnNpdGlvbi1hbGwgY3Vyc29yLXBvaW50ZXIgJHtpc0FjdGl2ZSA/ICJiZy1bIzk2OTY5Nl0gdGV4dC1ibGFjayIgOiAidGV4dC13aGl0ZS82MCBob3Zlcjp0ZXh0LXdoaXRlIGhvdmVyOmJnLXdoaXRlLzUifWAsCiAgICAgICAgY2hpbGRyZW46IFsKICAgICAgICAgIGl0ZW0uaWNvbiwKICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3goInNwYW4iLCB7IGNoaWxkcmVuOiBpdGVtLmxhYmVsIH0pCiAgICAgICAgXQogICAgICB9LAogICAgICBpdGVtLnZhbHVlCiAgICApOwogIH0pIH0pOwp9OwoKLy8gdmlydHVhbDpBcHAudHN4CmltcG9ydCB7IEZyYWdtZW50LCBqc3ggYXMganN4MiwganN4cyBhcyBqc3hzMiB9IGZyb20gInJlYWN0L2pzeC1ydW50aW1lIjsKdmFyIFZJREVPX01PREVMUyA9IFsKICAiT21uaSAxLjEgRmxhc2giLAogICJWZW8gMy4xIC0gTGl0ZSIsCiAgIlZlbyAzLjEgLSBGYXN0IiwKICAiVmVvIDMuMSAtIFF1YWxpdHkiCl07CmZ1bmN0aW9uIFN0aWNrbWFuU3RvcnlBcHAoKSB7CiAgY29uc3QgW2N1cnJlbnRTdGVwLCBzZXRDdXJyZW50U3RlcF0gPSB1c2VTdGF0ZTIoMSk7CiAgY29uc3QgW2NvbmZpZywgc2V0Q29uZmlnXSA9IHVzZVN0YXRlMih7CiAgICB2aWRlb01vZGVsOiAiT21uaSAxLjEgRmxhc2giLAogICAgaW1hZ2VNb2RlbDogIlx1ezFGMzRDfSBOYW5vIEJhbmFuYSBQcm8iLAogICAgYXNwZWN0UmF0aW86ICIxNjo5IiwKICAgIGR1cmF0aW9uOiA4LAogICAgcGFwZXJTdHlsZTogIkdpXHUxRUE1eSB0clx1MUVBRm5nIG5oXHUwMTAzbiIsCiAgICBzdGlja21hblR5cGU6ICJNXHUxRUYxYyBcdTAxMTFlbiB0XHUxRUQxaSBnaVx1MUVBM24iLAogICAgcmh5dGhtOiAiTmhcdTFFQjkgbmhceEUwbmciLAogICAgdm9pY2VUeXBlOiAiR2lcdTFFQ0RuZyBUcnV5XHUxRUMxbiBDXHUxRUEzbSIsCiAgICBwcm9kdWN0TmFtZTogIiIsCiAgICBwcm9kdWN0RGVzYzogIiIKICB9KTsKICBjb25zdCBbdGhlbWUsIHNldFRoZW1lXSA9IHVzZVN0YXRlMigiIik7CiAgY29uc3QgW3NjZW5lcywgc2V0U2NlbmVzXSA9IHVzZVN0YXRlMihbXSk7CiAgY29uc3QgW2lzUHJvY2Vzc2luZywgc2V0SXNQcm9jZXNzaW5nXSA9IHVzZVN0YXRlMihmYWxzZSk7CiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTIobnVsbCk7CiAgY29uc3QgW2Rvd25sb2FkU3RhdHVzLCBzZXREb3dubG9hZFN0YXR1c10gPSB1c2VTdGF0ZTIoe30pOwogIGNvbnN0IFtzaG93VmVyc2lvbk1vZGFsLCBzZXRTaG93VmVyc2lvbk1vZGFsXSA9IHVzZVN0YXRlMihmYWxzZSk7CiAgY29uc3QgW3Bhc3N3b3JkLCBzZXRQYXNzd29yZF0gPSB1c2VTdGF0ZTIoIiIpOwogIGNvbnN0IFtpc1ppcHBpbmcsIHNldElzWmlwcGluZ10gPSB1c2VTdGF0ZTIoZmFsc2UpOwogIHVzZUVmZmVjdDIoKCkgPT4gewogICAgY29uc3QgaWQgPSAic3RpY2ttYW4tZ2xvYmFsLXN0eWxlcyI7CiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKSByZXR1cm47CiAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInN0eWxlIik7CiAgICBzdHlsZS5pZCA9IGlkOwogICAgc3R5bGUudGV4dENvbnRlbnQgPSBgCiAgICAgIC5wYXBlci1iZyB7IGJhY2tncm91bmQtY29sb3I6ICMwZTBlMGU7IGJhY2tncm91bmQtaW1hZ2U6IHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDUwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjAyKSAwJSwgdHJhbnNwYXJlbnQgMTAwJSk7IH0KICAgICAgLmRhcmstc2Nyb2xsYmFyIHsgc2Nyb2xsYmFyLXdpZHRoOiB0aGluOyBzY3JvbGxiYXItY29sb3I6ICMzMzMgdHJhbnNwYXJlbnQ7IH0KICAgICAgLmRhcmstc2Nyb2xsYmFyOjotd2Via2l0LXNjcm9sbGJhciB7IHdpZHRoOiA0cHg7IH0KICAgICAgLmRhcmstc2Nyb2xsYmFyOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7IGJhY2tncm91bmQ6IHRyYW5zcGFyZW50OyB9CiAgICAgIC5kYXJrLXNjcm9sbGJhcjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIgeyBiYWNrZ3JvdW5kOiAjMzMzOyBib3JkZXItcmFkaXVzOiAxMHB4OyB9CiAgICAgIEBrZXlmcmFtZXMgcHVsc2Utc29mdCB7IDAlLCAxMDAlIHsgb3BhY2l0eTogMC44OyB9IDUwJSB7IG9wYWNpdHk6IDAuNDsgfSB9CiAgICAgIC5hbmltYXRlLXB1bHNlLXNvZnQgeyBhbmltYXRpb246IHB1bHNlLXNvZnQgMnMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IH0KICAgICAgQGtleWZyYW1lcyBkcm9wZG93bi1lbnRlciB7IGZyb20geyBvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHNjYWxlKDAuOTUpIHRyYW5zbGF0ZVkoLTVweCk7IH0gdG8geyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHNjYWxlKDEpIHRyYW5zbGF0ZVkoMCk7IH0gfQogICAgICAuYW5pbWF0ZS1kcm9wZG93biB7IGFuaW1hdGlvbjogZHJvcGRvd24tZW50ZXIgMC4xNXMgZWFzZS1vdXQgZm9yd2FyZHM7IH0KICAgIGA7CiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTsKICB9LCBbXSk7CiAgY29uc3QgaGFuZGxlU2VsZWN0UHJvZHVjdEltYWdlID0gYXN5bmMgKCkgPT4gewogICAgdHJ5IHsKICAgICAgY29uc3QgbWVkaWEgPSBhd2FpdCBGbG93Lm1lZGlhLnNlbGVjdCh7IGZpbHRlcjogImltYWdlIiB9KTsKICAgICAgaWYgKG1lZGlhKSB7CiAgICAgICAgc2V0Q29uZmlnKChwcmV2KSA9PiAoewogICAgICAgICAgLi4ucHJldiwKICAgICAgICAgIHByb2R1Y3RJbWFnZTogewogICAgICAgICAgICBtZWRpYUlkOiBtZWRpYS5tZWRpYUlkLAogICAgICAgICAgICBiYXNlNjQ6IG1lZGlhLmJhc2U2NCwKICAgICAgICAgICAgbWltZVR5cGU6IG1lZGlhLm1pbWVUeXBlCiAgICAgICAgICB9CiAgICAgICAgfSkpOwogICAgICB9CiAgICB9IGNhdGNoIChlcnIpIHsKICAgICAgY29uc29sZS5lcnJvcigiTFx1MUVEN2kgY2hcdTFFQ0RuIFx1MUVBM25oOiIsIGVycik7CiAgICB9CiAgfTsKICBjb25zdCBnZW5lcmF0ZVNjcmlwdCA9IGFzeW5jIChpbnB1dFRoZW1lKSA9PiB7CiAgICBpZiAoIWlucHV0VGhlbWUudHJpbSgpKSByZXR1cm47CiAgICBzZXRUaGVtZShpbnB1dFRoZW1lKTsKICAgIHNldElzUHJvY2Vzc2luZyh0cnVlKTsKICAgIHNldEVycm9yKG51bGwpOwogICAgdHJ5IHsKICAgICAgY29uc3QgaGFzUHJvZHVjdCA9ICEhY29uZmlnLnByb2R1Y3RJbWFnZTsKICAgICAgY29uc3Qgc3lzdGVtUHJvbXB0ID0gR0VUX1NZU1RFTV9QUk9NUFQoaGFzUHJvZHVjdCwgY29uZmlnLnByb2R1Y3ROYW1lLCBjb25maWcucHJvZHVjdERlc2MpOwogICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IEZsb3cuZ2VuZXJhdGUudGV4dCgKICAgICAgICBgQ2hcdTFFRTcgXHUwMTExXHUxRUMxOiAiJHtpbnB1dFRoZW1lfSIuIE5cdTFFQzFuOiAke2NvbmZpZy5wYXBlclN0eWxlfS4gTmhceEUybiB2XHUxRUFEdDogJHtjb25maWcuc3RpY2ttYW5UeXBlfS4gTmhcdTFFQ0JwIFx1MDExMVx1MUVEOTogJHtjb25maWcucmh5dGhtfS5gLAogICAgICAgIHsgc3lzdGVtSW5zdHJ1Y3Rpb246IHN5c3RlbVByb21wdCB9CiAgICAgICk7CiAgICAgIGNvbnN0IHRleHQgPSByZXNwb25zZS50ZXh0LnJlcGxhY2UoL2BgYGpzb258YGBgL2csICIiKS50cmltKCk7CiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UodGV4dCk7CiAgICAgIGNvbnN0IG5ld1NjZW5lcyA9IHBhcnNlZC5tYXAoKHMsIGlkeCkgPT4gKHsKICAgICAgICAuLi5zLAogICAgICAgIGlkOiBpZHggKyAxLAogICAgICAgIGltYWdlU3RhdHVzOiAiaWRsZSIsCiAgICAgICAgdmlkZW9TdGF0dXM6ICJpZGxlIgogICAgICB9KSk7CiAgICAgIHNldFNjZW5lcyhuZXdTY2VuZXMpOwogICAgICBzZXRDdXJyZW50U3RlcCgyKTsKICAgIH0gY2F0Y2ggKGVycikgewogICAgICBzZXRFcnJvcigiS2hceEY0bmcgdGhcdTFFQzMgdFx1MUVBMW8ga1x1MUVDQmNoIGJcdTFFQTNuLiBIXHhFM3kgdGhcdTFFRUQgXHhGRCB0XHUwMUIwXHUxRURGbmcga2hceEUxYy4iKTsKICAgICAgY29uc29sZS5lcnJvcigiTFx1MUVEN2kgdFx1MUVBMW8ga1x1MUVDQmNoIGJcdTFFQTNuOiIsIGVycik7CiAgICB9IGZpbmFsbHkgewogICAgICBzZXRJc1Byb2Nlc3NpbmcoZmFsc2UpOwogICAgfQogIH07CiAgY29uc3QgZ2VuZXJhdGVJbWFnZSA9IGFzeW5jIChzY2VuZUlkLCBzdHlsZVJlZklkKSA9PiB7CiAgICBzZXRTY2VuZXMoKHByZXYpID0+IHByZXYubWFwKChzKSA9PiBzLmlkID09PSBzY2VuZUlkID8geyAuLi5zLCBpbWFnZVN0YXR1czogImdlbmVyYXRpbmciIH0gOiBzKSk7CiAgICBzZXRFcnJvcihudWxsKTsKICAgIHRyeSB7CiAgICAgIGNvbnN0IHNjZW5lID0gc2NlbmVzLmZpbmQoKHMpID0+IHMuaWQgPT09IHNjZW5lSWQpOwogICAgICBpZiAoIXNjZW5lKSByZXR1cm4gbnVsbDsKICAgICAgY29uc3QgcmVmZXJlbmNlSWRzID0gW107CiAgICAgIGlmIChzdHlsZVJlZklkKSByZWZlcmVuY2VJZHMucHVzaChzdHlsZVJlZklkKTsKICAgICAgaWYgKHNjZW5lLmlzUHJvZHVjdEFkICYmIGNvbmZpZy5wcm9kdWN0SW1hZ2UpIHJlZmVyZW5jZUlkcy5wdXNoKGNvbmZpZy5wcm9kdWN0SW1hZ2UubWVkaWFJZCk7CiAgICAgIGNvbnN0IHByb21wdCA9IHNjZW5lLmlzUHJvZHVjdEFkID8gYCR7c2NlbmUucHJvbXB0RW59LCBzaG93Y2FzaW5nIHRoZSBwcm9kdWN0IG5hdHVyYWxseSBvbiAke2NvbmZpZy5wYXBlclN0eWxlfSBiYWNrZ3JvdW5kLCBjb25zaXN0ZW50IHN0aWNrbWFuIHN0eWxlLiBOTyB0ZXh0IG9uIHNjcmVlbi5gIDogYCR7c2NlbmUucHJvbXB0RW59LCAke2NvbmZpZy5wYXBlclN0eWxlfSwgJHtjb25maWcuc3RpY2ttYW5UeXBlfSBzdHlsZSwgTk8gb24tc2NyZWVuIHRleHQsIE5PIGxldHRlcnMuYDsKICAgICAgY29uc3QgcmVzID0gYXdhaXQgRmxvdy5nZW5lcmF0ZS5pbWFnZSh7CiAgICAgICAgcHJvbXB0LAogICAgICAgIG1vZGVsRGlzcGxheU5hbWU6IGNvbmZpZy5pbWFnZU1vZGVsLAogICAgICAgIGFzcGVjdFJhdGlvOiBjb25maWcuYXNwZWN0UmF0aW8sCiAgICAgICAgcmVmZXJlbmNlSW1hZ2VNZWRpYUlkczogcmVmZXJlbmNlSWRzLmxlbmd0aCA+IDAgPyByZWZlcmVuY2VJZHMgOiB2b2lkIDAKICAgICAgfSk7CiAgICAgIGNvbnN0IHJlc3VsdCA9IHsKICAgICAgICBiYXNlNjQ6IHJlcy5iYXNlNjQsCiAgICAgICAgbWltZVR5cGU6IHJlcy5taW1lVHlwZSwKICAgICAgICBtZWRpYUlkOiByZXMubWVkaWFJZAogICAgICB9OwogICAgICBzZXRTY2VuZXMoKHByZXYpID0+IHByZXYubWFwKChzKSA9PiBzLmlkID09PSBzY2VuZUlkID8gewogICAgICAgIC4uLnMsCiAgICAgICAgaW1hZ2VTdGF0dXM6ICJjb21wbGV0ZWQiLAogICAgICAgIGltYWdlUmVzdWx0OiByZXN1bHQKICAgICAgfSA6IHMpKTsKICAgICAgcmV0dXJuIHJlc3VsdDsKICAgIH0gY2F0Y2ggKGVycikgewogICAgICBjb25zb2xlLmVycm9yKCJMXHUxRUQ3aSB0XHUxRUExbyBcdTFFQTNuaDoiLCBlcnIpOwogICAgICBzZXRTY2VuZXMoKHByZXYpID0+IHByZXYubWFwKChzKSA9PiBzLmlkID09PSBzY2VuZUlkID8geyAuLi5zLCBpbWFnZVN0YXR1czogImVycm9yIiB9IDogcykpOwogICAgICBzZXRFcnJvcigiTFx1MUVEN2kga2hpIHRcdTFFQTFvIFx1MUVBM25oIHBoXHhFMWMgdGhcdTFFQTNvLiBWdWkgbFx4RjJuZyB0aFx1MUVFRCBsXHUxRUExaS4iKTsKICAgICAgcmV0dXJuIG51bGw7CiAgICB9CiAgfTsKICBjb25zdCBnZW5lcmF0ZUFsbEltYWdlcyA9IGFzeW5jICgpID0+IHsKICAgIGxldCBzY2VuZTFSZXN1bHQgPSBzY2VuZXMuZmluZCgocykgPT4gcy5pZCA9PT0gMSk/LmltYWdlUmVzdWx0OwogICAgaWYgKCFzY2VuZTFSZXN1bHQpIHsKICAgICAgc2NlbmUxUmVzdWx0ID0gYXdhaXQgZ2VuZXJhdGVJbWFnZSgxKTsKICAgIH0KICAgIGlmICghc2NlbmUxUmVzdWx0KSByZXR1cm47CiAgICBjb25zdCByZW1haW5pbmdTY2VuZXMgPSBzY2VuZXMuZmlsdGVyKChzKSA9PiBzLmlkICE9PSAxICYmIHMuaW1hZ2VTdGF0dXMgIT09ICJjb21wbGV0ZWQiKTsKICAgIGZvciAoY29uc3Qgc2NlbmUgb2YgcmVtYWluaW5nU2NlbmVzKSB7CiAgICAgIGF3YWl0IGdlbmVyYXRlSW1hZ2Uoc2NlbmUuaWQsIHNjZW5lMVJlc3VsdC5tZWRpYUlkKTsKICAgIH0KICB9OwogIGNvbnN0IGdlbmVyYXRlVmlkZW8gPSBhc3luYyAoc2NlbmVJZCkgPT4gewogICAgY29uc3Qgc2NlbmUgPSBzY2VuZXMuZmluZCgocykgPT4gcy5pZCA9PT0gc2NlbmVJZCk7CiAgICBpZiAoIXNjZW5lIHx8ICFzY2VuZS5pbWFnZVJlc3VsdCkgewogICAgICBzZXRFcnJvcigiQ1x1MUVBN24gY1x4RjMgXHUxRUEzbmggcGhceEUxYyB0aFx1MUVBM28gdHJcdTAxQjBcdTFFREJjIGtoaSBkXHUxRUYxbmcgdmlkZW8uIik7CiAgICAgIHJldHVybjsKICAgIH0KICAgIHNldFNjZW5lcygocHJldikgPT4gcHJldi5tYXAoKHMpID0+IHMuaWQgPT09IHNjZW5lSWQgPyB7IC4uLnMsIHZpZGVvU3RhdHVzOiAiZ2VuZXJhdGluZyIgfSA6IHMpKTsKICAgIHNldEVycm9yKG51bGwpOwogICAgdHJ5IHsKICAgICAgbGV0IGZpbmFsRHVyYXRpb24gPSBjb25maWcuZHVyYXRpb247CiAgICAgIGlmIChjb25maWcudmlkZW9Nb2RlbC5zdGFydHNXaXRoKCJWZW8iKSAmJiBmaW5hbER1cmF0aW9uID4gOCkgewogICAgICAgIGZpbmFsRHVyYXRpb24gPSA4OwogICAgICB9CiAgICAgIGNvbnN0IHZvaWNlb3Zlckluc3RydWN0aW9uID0gYFtBVURJTzogVmlldG5hbWVzZSBWb2ljZW92ZXIgKCR7Y29uZmlnLnZvaWNlVHlwZX0pXS4gTmFycmF0b3Igc2F5czogIiR7c2NlbmUudm9pY2VTY3JpcHR9Ii4gVGhlIHZpZGVvIG11c3QgaGF2ZSBjbGVhciBWaWV0bmFtZXNlIG5hcnJhdGlvbiBzeW5jIHdpdGggYWN0aW9uLiBOTyBvbi1zY3JlZW4gdGV4dC5gOwogICAgICBjb25zdCBwcm9tcHQgPSBzY2VuZS5pc1Byb2R1Y3RBZCA/IGAke3NjZW5lLnByb21wdEVufS4gUHJvZHVjdDogJHtjb25maWcucHJvZHVjdE5hbWV9LiAke3ZvaWNlb3Zlckluc3RydWN0aW9ufWAgOiBgJHtzY2VuZS5wcm9tcHRFbn0uICR7dm9pY2VvdmVySW5zdHJ1Y3Rpb259YDsKICAgICAgY29uc3QgcmVzID0gYXdhaXQgRmxvdy5nZW5lcmF0ZS52aWRlbyh7CiAgICAgICAgcHJvbXB0LAogICAgICAgIG1vZGVsRGlzcGxheU5hbWU6IGNvbmZpZy52aWRlb01vZGVsLAogICAgICAgIGFzcGVjdFJhdGlvOiBjb25maWcuYXNwZWN0UmF0aW8sCiAgICAgICAgZHVyYXRpb25TZWNvbmRzOiBmaW5hbER1cmF0aW9uLAogICAgICAgIGZpcnN0RnJhbWVJbWFnZU1lZGlhSWQ6IHNjZW5lLmltYWdlUmVzdWx0Lm1lZGlhSWQKICAgICAgfSk7CiAgICAgIHNldFNjZW5lcygocHJldikgPT4gcHJldi5tYXAoKHMpID0+IHMuaWQgPT09IHNjZW5lSWQgPyB7CiAgICAgICAgLi4ucywKICAgICAgICB2aWRlb1N0YXR1czogImNvbXBsZXRlZCIsCiAgICAgICAgdmlkZW9SZXN1bHQ6IHsKICAgICAgICAgIGJhc2U2NDogcmVzLmJhc2U2NCwKICAgICAgICAgIG1pbWVUeXBlOiByZXMubWltZVR5cGUsCiAgICAgICAgICBtZWRpYUlkOiByZXMubWVkaWFJZAogICAgICAgIH0KICAgICAgfSA6IHMpKTsKICAgIH0gY2F0Y2ggKGVycikgewogICAgICBjb25zb2xlLmVycm9yKCJMXHUxRUQ3aSBkXHUxRUYxbmcgdmlkZW86IiwgZXJyKTsKICAgICAgY29uc3QgZXJyb3JNc2cgPSBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogIktoXHhGNG5nIHRoXHUxRUMzIGtcdTFFQkZ0IG5cdTFFRDFpIHZcdTFFREJpIGhcdTFFQzcgdGhcdTFFRDFuZyB0XHUxRUExbyB2aWRlby4iOwogICAgICBzZXRTY2VuZXMoKHByZXYpID0+IHByZXYubWFwKChzKSA9PiBzLmlkID09PSBzY2VuZUlkID8geyAuLi5zLCB2aWRlb1N0YXR1czogImVycm9yIiB9IDogcykpOwogICAgICBzZXRFcnJvcihgTFx1MUVEN2kgZFx1MUVGMW5nIHZpZGVvOiAke2Vycm9yTXNnfWApOwogICAgfQogIH07CiAgY29uc3QgaGFuZGxlRG93bmxvYWRNZWRpYSA9IGFzeW5jIChiYXNlNjQsIG1pbWVUeXBlLCB0eXBlLCBzY2VuZUlkKSA9PiB7CiAgICBjb25zdCBrZXkgPSBgJHtzY2VuZUlkfV8ke3R5cGV9YDsKICAgIGNvbnN0IGV4dCA9IG1pbWVUeXBlLnNwbGl0KCIvIilbMV0gfHwgKHR5cGUgPT09ICJpbWFnZSIgPyAicG5nIiA6ICJtcDQiKTsKICAgIGNvbnN0IGZpbGVuYW1lID0gYHN0aWNrbWFuX3NjZW5lXyR7c2NlbmVJZH1fJHt0eXBlfS4ke2V4dH1gOwogICAgc2V0RG93bmxvYWRTdGF0dXMoKHByZXYpID0+ICh7IC4uLnByZXYsIFtrZXldOiAibG9hZGluZyIgfSkpOwogICAgdHJ5IHsKICAgICAgYXdhaXQgRmxvdy5kb3dubG9hZCh7IGJhc2U2NCwgbWltZVR5cGUsIGZpbGVuYW1lIH0pOwogICAgICBzZXREb3dubG9hZFN0YXR1cygocHJldikgPT4gKHsgLi4ucHJldiwgW2tleV06ICJkb25lIiB9KSk7CiAgICAgIHNldFRpbWVvdXQoKCkgPT4gc2V0RG93bmxvYWRTdGF0dXMoKHByZXYpID0+ICh7IC4uLnByZXYsIFtrZXldOiAiaWRsZSIgfSkpLCAyZTMpOwogICAgfSBjYXRjaCAoZXJyKSB7CiAgICAgIGNvbnNvbGUuZXJyb3IoIkxcdTFFRDdpIHRcdTFFQTNpIHh1XHUxRUQxbmc6IiwgZXJyKTsKICAgICAgc2V0RG93bmxvYWRTdGF0dXMoKHByZXYpID0+ICh7IC4uLnByZXYsIFtrZXldOiAiZXJyb3IiIH0pKTsKICAgICAgc2V0VGltZW91dCgoKSA9PiBzZXREb3dubG9hZFN0YXR1cygocHJldikgPT4gKHsgLi4ucHJldiwgW2tleV06ICJpZGxlIiB9KSksIDNlMyk7CiAgICB9CiAgfTsKICBjb25zdCBjb3B5Vm9pY2VvdmVyU2NyaXB0ID0gKCkgPT4gewogICAgY29uc3QgZnVsbFNjcmlwdCA9IHNjZW5lcy5tYXAoKHMpID0+IGBDXHUxRUEzbmggJHtzLmlkfTogJHtzLnZvaWNlU2NyaXB0fWApLmpvaW4oIlxuXG4iKTsKICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KGZ1bGxTY3JpcHQpOwogIH07CiAgY29uc3QgaGFuZGxlRG93bmxvYWRDb2RlUHJvamVjdCA9IGFzeW5jICgpID0+IHsKICAgIGlmIChwYXNzd29yZCAhPT0gIkZhc3RAMDA2IikgewogICAgICBzZXRFcnJvcigiTVx1MUVBRHQga2hcdTFFQTl1IGtoXHhGNG5nIGNoXHhFRG5oIHhceEUxYy4iKTsKICAgICAgcmV0dXJuOwogICAgfQogICAgc2V0SXNaaXBwaW5nKHRydWUpOwogICAgdHJ5IHsKICAgICAgY29uc3QgemlwID0gbmV3IEpTWmlwKCk7CiAgICAgIGNvbnN0IGZpbGVzVG9aaXAgPSB7CiAgICAgICAgIkFwcC50c3giOiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub3V0ZXJIVE1MLAogICAgICAgIC8vIFThuqFtIHRo4budaSBs4bqleSBET00gbuG6v3Uga2jDtG5nIGPDsyB0ZXh0IG5ndeG7k24sIG5oxrBuZyDEkcO6bmcgbmjhuqV0IGzDoCB0ZXh0IGPhu6dhIGNvbXBvbmVudCBuw6B5CiAgICAgICAgInR5cGVzLnRzIjogYGV4cG9ydCB0eXBlIFBhcGVyU3R5bGUgPSAnR2lcdTFFQTV5IHRyXHUxRUFGbmcgbmhcdTAxMDNuJyB8ICdHaVx1MUVBNXkgY1x1MDE2OSBuZ1x1MUVBMyB2XHhFMG5nJyB8ICdHaVx1MUVBNXkgaFx1MUVDRGMgc2luaCcgfCAnR2lcdTFFQTV5IGdoaSBjaFx4RkEnIHwgJ0dpXHUxRUE1eSByXHhFMWNoIG1ceEU5cCc7CmV4cG9ydCB0eXBlIFN0aWNrbWFuVHlwZSA9ICdNXHUxRUYxYyBcdTAxMTFlbiB0XHUxRUQxaSBnaVx1MUVBM24nIHwgJ0JceEYzbmcgY2hpXHUxRUJGdScgfCAnVlx1MUVCRCBiXHhGQXQgY2hceEVDJyB8ICdDXHUxRUFGdCBnaVx1MUVBNXkgXHUwMTExZW4nIHwgJ1BoXHUxRUE1biB0clx1MUVBRm5nJzsKLy8gLi4uIGNvbnRlbnQgZnJvbSB0eXBlcy50c2AsCiAgICAgICAgImNvbnN0YW50cy50cyI6IGBleHBvcnQgY29uc3QgU1VHR0VTVEVEX1RIRU1FUyA9IFsuLi5dOwovLyAuLi4gY29udGVudCBmcm9tIGNvbnN0YW50cy50c2AsCiAgICAgICAgImNvbXBvbmVudHMvUHJpbWl0aXZlcy50c3giOiBgaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JzsKLy8gLi4uIGNvbnRlbnQgZnJvbSBQcmltaXRpdmVzLnRzeGAKICAgICAgfTsKICAgICAgT2JqZWN0LmVudHJpZXMoZmlsZXNUb1ppcCkuZm9yRWFjaCgoW25hbWUsIGNvbnRlbnRdKSA9PiB7CiAgICAgICAgemlwLmZpbGUobmFtZSwgY29udGVudCk7CiAgICAgIH0pOwogICAgICBjb25zdCBibG9iID0gYXdhaXQgemlwLmdlbmVyYXRlQXN5bmMoeyB0eXBlOiAiYmxvYiIgfSk7CiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7CiAgICAgIHJlYWRlci5vbmxvYWQgPSBhc3luYyAoKSA9PiB7CiAgICAgICAgY29uc3QgYmFzZTY0ID0gcmVhZGVyLnJlc3VsdC5zcGxpdCgiLCIpWzFdOwogICAgICAgIGF3YWl0IEZsb3cuZG93bmxvYWQoewogICAgICAgICAgYmFzZTY0LAogICAgICAgICAgbWltZVR5cGU6ICJhcHBsaWNhdGlvbi96aXAiLAogICAgICAgICAgZmlsZW5hbWU6ICJzdGlja21hbi1hZC1zdG9yeXRlbGxlci1zcmMuemlwIgogICAgICAgIH0pOwogICAgICAgIHNldFNob3dWZXJzaW9uTW9kYWwoZmFsc2UpOwogICAgICAgIHNldFBhc3N3b3JkKCIiKTsKICAgICAgfTsKICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoYmxvYik7CiAgICB9IGNhdGNoIChlcnIpIHsKICAgICAgc2V0RXJyb3IoIkxcdTFFRDdpIGtoaSBuXHhFOW4gbVx4RTMgbmd1XHUxRUQzbi4iKTsKICAgIH0gZmluYWxseSB7CiAgICAgIHNldElzWmlwcGluZyhmYWxzZSk7CiAgICB9CiAgfTsKICBjb25zdCByZW5kZXJTaWRlYmFyID0gKCkgPT4gewogICAgcmV0dXJuIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6ICJib3JkZXItciBib3JkZXItd2hpdGUvMTAgZmxleCBmbGV4LWNvbCBqdXN0aWZ5LWJldHdlZW4gcC0zIHctWzMwMHB4XSBoLWZ1bGwgYmctWyMwZTBlMGVdIHNocmluay0wIiwgY2hpbGRyZW46IFsKICAgICAgLyogQF9fUFVSRV9fICovIGpzeHMyKCJkaXYiLCB7IGNsYXNzTmFtZTogImZsZXggZmxleC1jb2wgZ2FwLTYgb3ZlcmZsb3cteS1hdXRvIGRhcmstc2Nyb2xsYmFyIHByLTEiLCBjaGlsZHJlbjogWwogICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6ICJmbGV4IGZsZXgtY29sIGdhcC0zIiwgY2hpbGRyZW46IFsKICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKFNlY3Rpb25MYWJlbCwgeyBjaGlsZHJlbjogIlRoXHhGNG5nIHRpbiBTXHUxRUEzbiBwaFx1MUVBOW0gKFFDKSIgfSksCiAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAicC0zIHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci13aGl0ZS8xMCBiZy13aGl0ZS81IHNwYWNlLXktMyIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKAogICAgICAgICAgICAgICJidXR0b24iLAogICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgIG9uQ2xpY2s6IGhhbmRsZVNlbGVjdFByb2R1Y3RJbWFnZSwKICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogInctZnVsbCBhc3BlY3Qtc3F1YXJlIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1kYXNoZWQgYm9yZGVyLXdoaXRlLzIwIGhvdmVyOmJvcmRlci13aGl0ZS80MCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMiB0cmFuc2l0aW9uLWNvbG9ycyBvdmVyZmxvdy1oaWRkZW4gcmVsYXRpdmUgZ3JvdXAiLAogICAgICAgICAgICAgICAgY2hpbGRyZW46IGNvbmZpZy5wcm9kdWN0SW1hZ2UgPyAvKiBAX19QVVJFX18gKi8ganN4czIoRnJhZ21lbnQsIHsgY2hpbGRyZW46IFsKICAgICAgICAgICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoImltZyIsIHsgc3JjOiBgZGF0YToke2NvbmZpZy5wcm9kdWN0SW1hZ2UubWltZVR5cGV9O2Jhc2U2NCwke2NvbmZpZy5wcm9kdWN0SW1hZ2UuYmFzZTY0fWAsIGNsYXNzTmFtZTogInctZnVsbCBoLWZ1bGwgb2JqZWN0LWNvdmVyIiB9KSwKICAgICAgICAgICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoImRpdiIsIHsgY2xhc3NOYW1lOiAiYWJzb2x1dGUgaW5zZXQtMCBiZy1ibGFjay80MCBvcGFjaXR5LTAgZ3JvdXAtaG92ZXI6b3BhY2l0eS0xMDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdHJhbnNpdGlvbi1vcGFjaXR5IiwgY2hpbGRyZW46IC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJzcGFuIiwgeyBjbGFzc05hbWU6ICJtYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHRleHQtd2hpdGUiLCBjaGlsZHJlbjogImVkaXQiIH0pIH0pCiAgICAgICAgICAgICAgICBdIH0pIDogLyogQF9fUFVSRV9fICovIGpzeHMyKEZyYWdtZW50LCB7IGNoaWxkcmVuOiBbCiAgICAgICAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJzcGFuIiwgeyBjbGFzc05hbWU6ICJtYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHRleHQtd2hpdGUvMjAgdGV4dC0zeGwiLCBjaGlsZHJlbjogImFkZF9waG90b19hbHRlcm5hdGUiIH0pLAogICAgICAgICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4Migic3BhbiIsIHsgY2xhc3NOYW1lOiAidGV4dC1bMTBweF0gdGV4dC13aGl0ZS8zMCBmb250LWJvbGQgdXBwZXJjYXNlIiwgY2hpbGRyZW46ICJcdTFFQTJuaCBzXHUxRUEzbiBwaFx1MUVBOW0iIH0pCiAgICAgICAgICAgICAgICBdIH0pCiAgICAgICAgICAgICAgfQogICAgICAgICAgICApLAogICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MigKICAgICAgICAgICAgICAiaW5wdXQiLAogICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgIHR5cGU6ICJ0ZXh0IiwKICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAiVFx4RUFuIHNcdTFFQTNuIHBoXHUxRUE5bS4uLiIsCiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICJ3LWZ1bGwgYmctd2hpdGUvNSBib3JkZXIgYm9yZGVyLXdoaXRlLzEwIHJvdW5kZWQtbGcgcHgtMyBweS0yIHRleHQtWzExcHhdIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItd2hpdGUvMzAiLAogICAgICAgICAgICAgICAgdmFsdWU6IGNvbmZpZy5wcm9kdWN0TmFtZSwKICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiAoZSkgPT4gc2V0Q29uZmlnKChwKSA9PiAoeyAuLi5wLCBwcm9kdWN0TmFtZTogZS50YXJnZXQudmFsdWUgfSkpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICApLAogICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MigKICAgICAgICAgICAgICAidGV4dGFyZWEiLAogICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAiTVx4RjQgdFx1MUVBMyBuZ1x1MUVBRm4gdlx1MUVDMSBzXHUxRUEzbiBwaFx1MUVBOW0uLi4iLAogICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAidy1mdWxsIGgtMjAgYmctd2hpdGUvNSBib3JkZXIgYm9yZGVyLXdoaXRlLzEwIHJvdW5kZWQtbGcgcHgtMyBweS0yIHRleHQtWzExcHhdIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItd2hpdGUvMzAgcmVzaXplLW5vbmUiLAogICAgICAgICAgICAgICAgdmFsdWU6IGNvbmZpZy5wcm9kdWN0RGVzYywKICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiAoZSkgPT4gc2V0Q29uZmlnKChwKSA9PiAoeyAuLi5wLCBwcm9kdWN0RGVzYzogZS50YXJnZXQudmFsdWUgfSkpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICApCiAgICAgICAgICBdIH0pCiAgICAgICAgXSB9KSwKICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAiZmxleCBmbGV4LWNvbCBnYXAtMyIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MihTZWN0aW9uTGFiZWwsIHsgY2hpbGRyZW46ICJDXHUxRUE1dSBoXHhFQ25oIE1lZGlhICYgVGh1eVx1MUVCRnQgbWluaCIgfSksCiAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MihGaWVsZERyb3Bkb3duLCB7IGxhYmVsOiAiTW9kZWwgVmlkZW8iLCB2YWx1ZTogY29uZmlnLnZpZGVvTW9kZWwsIG9wdGlvbnM6IFZJREVPX01PREVMUywgb25DaGFuZ2U6ICh2KSA9PiBzZXRDb25maWcoKHApID0+ICh7IC4uLnAsIHZpZGVvTW9kZWw6IHYgfSkpIH0pLAogICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoRmllbGREcm9wZG93biwgeyBsYWJlbDogIkdpXHUxRUNEbmcgdGh1eVx1MUVCRnQgbWluaCIsIHZhbHVlOiBjb25maWcudm9pY2VUeXBlLCBvcHRpb25zOiBWT0lDRV9UWVBFUywgb25DaGFuZ2U6ICh2KSA9PiBzZXRDb25maWcoKHApID0+ICh7IC4uLnAsIHZvaWNlVHlwZTogdiB9KSkgfSksCiAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAiZmxleCBmbGV4LWNvbCBnYXAtMS41IiwgY2hpbGRyZW46IFsKICAgICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeHMyKFNlY3Rpb25MYWJlbCwgeyBjaGlsZHJlbjogWwogICAgICAgICAgICAgICJUaFx1MUVERGkgbFx1MDFCMFx1MUVFM25nOiAiLAogICAgICAgICAgICAgIGNvbmZpZy5kdXJhdGlvbiwKICAgICAgICAgICAgICAicyIKICAgICAgICAgICAgXSB9KSwKICAgICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoCiAgICAgICAgICAgICAgU2VnbWVudGVkVG9nZ2xlLAogICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgIHZhbHVlOiBTdHJpbmcoY29uZmlnLmR1cmF0aW9uKSwKICAgICAgICAgICAgICAgIGl0ZW1zOiBbeyB2YWx1ZTogIjQiLCBsYWJlbDogIjRzIiB9LCB7IHZhbHVlOiAiNiIsIGxhYmVsOiAiNnMiIH0sIHsgdmFsdWU6ICI4IiwgbGFiZWw6ICI4cyIgfSwgeyB2YWx1ZTogIjEwIiwgbGFiZWw6ICIxMHMiIH1dLAogICAgICAgICAgICAgICAgb25DaGFuZ2U6ICh2KSA9PiBzZXRDb25maWcoKHApID0+ICh7IC4uLnAsIGR1cmF0aW9uOiBOdW1iZXIodikgfSkpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICApLAogICAgICAgICAgICBjb25maWcudmlkZW9Nb2RlbC5zdGFydHNXaXRoKCJWZW8iKSAmJiBjb25maWcuZHVyYXRpb24gPiA4ICYmIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJwIiwgeyBjbGFzc05hbWU6ICJ0ZXh0LVs5cHhdIHRleHQtYW1iZXItNTAwLzgwIHB4LTIgaXRhbGljIiwgY2hpbGRyZW46ICJWZW8gY2hcdTFFQzkgaFx1MUVENyB0clx1MUVFMyB0XHUxRUQxaSBcdTAxMTFhIDhzIiB9KQogICAgICAgICAgXSB9KSwKICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJkaXYiLCB7IGNsYXNzTmFtZTogImZsZXggZ2FwLTEiLCBjaGlsZHJlbjogLyogQF9fUFVSRV9fICovIGpzeHMyKCJkaXYiLCB7IGNsYXNzTmFtZTogImZsZXgtMSIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKFNlY3Rpb25MYWJlbCwgeyBjaGlsZHJlbjogIlRcdTFFRjcgbFx1MUVDNyBraHVuZyBoXHhFQ25oIiB9KSwKICAgICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoCiAgICAgICAgICAgICAgU2VnbWVudGVkVG9nZ2xlLAogICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgIHZhbHVlOiBjb25maWcuYXNwZWN0UmF0aW8sCiAgICAgICAgICAgICAgICBpdGVtczogW3sgdmFsdWU6ICI5OjE2IiwgbGFiZWw6ICI5OjE2IiB9LCB7IHZhbHVlOiAiMTY6OSIsIGxhYmVsOiAiMTY6OSIgfV0sCiAgICAgICAgICAgICAgICBvbkNoYW5nZTogKHYpID0+IHNldENvbmZpZygocCkgPT4gKHsgLi4ucCwgYXNwZWN0UmF0aW86IHYgfSkpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICApCiAgICAgICAgICBdIH0pIH0pCiAgICAgICAgXSB9KSwKICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAiZmxleCBmbGV4LWNvbCBnYXAtMyBwYi00IiwgY2hpbGRyZW46IFsKICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKFNlY3Rpb25MYWJlbCwgeyBjaGlsZHJlbjogIlBob25nIGNceEUxY2ggTmdoXHUxRUM3IHRodVx1MUVBRHQiIH0pLAogICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoRmllbGREcm9wZG93biwgeyBsYWJlbDogIlRleHR1cmUgZ2lcdTFFQTV5IiwgdmFsdWU6IGNvbmZpZy5wYXBlclN0eWxlLCBvcHRpb25zOiBQQVBFUl9TVFlMRVMsIG9uQ2hhbmdlOiAodikgPT4gc2V0Q29uZmlnKChwKSA9PiAoeyAuLi5wLCBwYXBlclN0eWxlOiB2IH0pKSB9KSwKICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKEZpZWxkRHJvcGRvd24sIHsgbGFiZWw6ICJLaVx1MUVDM3Ugblx4RTl0IHZcdTFFQkQiLCB2YWx1ZTogY29uZmlnLnN0aWNrbWFuVHlwZSwgb3B0aW9uczogU1RJQ0tNQU5fVFlQRVMsIG9uQ2hhbmdlOiAodikgPT4gc2V0Q29uZmlnKChwKSA9PiAoeyAuLi5wLCBzdGlja21hblR5cGU6IHYgfSkpIH0pLAogICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoRmllbGREcm9wZG93biwgeyBsYWJlbDogIkNcdTFFQTNtIHhceEZBYyBrXHUxRUNCY2ggYlx1MUVBM24iLCB2YWx1ZTogY29uZmlnLnJoeXRobSwgb3B0aW9uczogUkhZVEhNUywgb25DaGFuZ2U6ICh2KSA9PiBzZXRDb25maWcoKHApID0+ICh7IC4uLnAsIHJoeXRobTogdiB9KSkgfSkKICAgICAgICBdIH0pCiAgICAgIF0gfSksCiAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6ICJmbGV4IGZsZXgtY29sIGdhcC0yIHB0LTQgYm9yZGVyLXQgYm9yZGVyLXdoaXRlLzUiLCBjaGlsZHJlbjogWwogICAgICAgIGN1cnJlbnRTdGVwID4gMSAmJiAvKiBAX19QVVJFX18gKi8ganN4MihQaWxsQnV0dG9uLCB7IHZhcmlhbnQ6ICJvdXRsaW5lIiwgaWNvbjogLyogQF9fUFVSRV9fICovIGpzeDIoInNwYW4iLCB7IGNsYXNzTmFtZTogIm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQgdGV4dC1bMThweF0iLCBjaGlsZHJlbjogInJlc3RhcnRfYWx0IiB9KSwgb25DbGljazogKCkgPT4gewogICAgICAgICAgc2V0Q3VycmVudFN0ZXAoMSk7CiAgICAgICAgICBzZXRFcnJvcihudWxsKTsKICAgICAgICB9LCBjaGlsZHJlbjogIkxceEUwbSBsXHUxRUExaSB0XHUxRUVCIFx1MDExMVx1MUVBN3UiIH0pLAogICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKAogICAgICAgICAgImJ1dHRvbiIsCiAgICAgICAgICB7CiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHNldFNob3dWZXJzaW9uTW9kYWwodHJ1ZSksCiAgICAgICAgICAgIGNsYXNzTmFtZTogInRleHQtWzEwcHhdIHRleHQtd2hpdGUvMjAgaG92ZXI6dGV4dC13aGl0ZS80MCB0cmFuc2l0aW9uLWNvbG9ycyB0ZXh0LWNlbnRlciBweS0xIG10LTEgY3Vyc29yLXBvaW50ZXIgc2VsZWN0LW5vbmUiLAogICAgICAgICAgICBjaGlsZHJlbjogIkFwcCB2ZXJzaW9uIDAuMS4wIgogICAgICAgICAgfQogICAgICAgICkKICAgICAgXSB9KQogICAgXSB9KTsKICB9OwogIGNvbnN0IGFzcGVjdENsYXNzID0gY29uZmlnLmFzcGVjdFJhdGlvID09PSAiOToxNiIgPyAiYXNwZWN0LVs5LzE2XSBtYXgtdy1bMzUwcHhdIG14LWF1dG8iIDogImFzcGVjdC12aWRlbyB3LWZ1bGwiOwogIHJldHVybiAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAiZmxleCBoLXNjcmVlbiB3LXNjcmVlbiBiZy1bIzBlMGUwZV0gdGV4dC13aGl0ZSBvdmVyZmxvdy1oaWRkZW4iLCBjaGlsZHJlbjogWwogICAgcmVuZGVyU2lkZWJhcigpLAogICAgLyogQF9fUFVSRV9fICovIGpzeHMyKCJtYWluIiwgeyBjbGFzc05hbWU6ICJmbGV4LTEgaC1mdWxsIG92ZXJmbG93LXktYXV0byBwLTYgcGFwZXItYmcgZGFyay1zY3JvbGxiYXIiLCBjaGlsZHJlbjogWwogICAgICBlcnJvciAmJiAvKiBAX19QVVJFX18gKi8ganN4MigiZGl2IiwgeyBjbGFzc05hbWU6ICJmaXhlZCB0b3AtNiByaWdodC02IHotWzEwMF0gbWF4LXctc20gYW5pbWF0ZS1kcm9wZG93biIsIGNoaWxkcmVuOiAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAiYmctcmVkLTUwMC8xMCBib3JkZXIgYm9yZGVyLXJlZC01MDAvMjAgYmFja2Ryb3AtYmx1ci1tZCBwLTQgcm91bmRlZC0yeGwgZmxleCBpdGVtcy1zdGFydCBnYXAtMyBzaGFkb3ctMnhsIiwgY2hpbGRyZW46IFsKICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4Migic3BhbiIsIHsgY2xhc3NOYW1lOiAibWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB0ZXh0LXJlZC01MDAgdGV4dC14bCBzaHJpbmstMCIsIGNoaWxkcmVuOiAiZXJyb3IiIH0pLAogICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6ICJzcGFjZS15LTEiLCBjaGlsZHJlbjogWwogICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoInAiLCB7IGNsYXNzTmFtZTogInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC13aGl0ZS85MCIsIGNoaWxkcmVuOiAiXHUwMTEwXHhFMyB4XHUxRUEzeSByYSBsXHUxRUQ3aSIgfSksCiAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MigicCIsIHsgY2xhc3NOYW1lOiAidGV4dC14cyB0ZXh0LXdoaXRlLzYwIGxlYWRpbmctcmVsYXhlZCIsIGNoaWxkcmVuOiBlcnJvciB9KQogICAgICAgIF0gfSksCiAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoImJ1dHRvbiIsIHsgb25DbGljazogKCkgPT4gc2V0RXJyb3IobnVsbCksIGNsYXNzTmFtZTogInRleHQtd2hpdGUvMjAgaG92ZXI6dGV4dC13aGl0ZS80MCB0cmFuc2l0aW9uLWNvbG9ycyIsIGNoaWxkcmVuOiAvKiBAX19QVVJFX18gKi8ganN4Migic3BhbiIsIHsgY2xhc3NOYW1lOiAibWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB0ZXh0LXNtIiwgY2hpbGRyZW46ICJjbG9zZSIgfSkgfSkKICAgICAgXSB9KSB9KSwKICAgICAgc2hvd1ZlcnNpb25Nb2RhbCAmJiAvKiBAX19QVVJFX18gKi8ganN4MigiZGl2IiwgeyBjbGFzc05hbWU6ICJmaXhlZCBpbnNldC0wIHotWzExMF0gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctYmxhY2svNjAgYmFja2Ryb3AtYmx1ci1zbSBwLTQiLCBjaGlsZHJlbjogLyogQF9fUFVSRV9fICovIGpzeHMyKCJkaXYiLCB7IGNsYXNzTmFtZTogImJnLVsjMWExYTFhXSBib3JkZXIgYm9yZGVyLXdoaXRlLzEwIHAtNiByb3VuZGVkLTJ4bCB3LWZ1bGwgbWF4LXcteHMgc2hhZG93LTJ4bCBhbmltYXRlLWRyb3Bkb3duIHNwYWNlLXktNCIsIGNoaWxkcmVuOiBbCiAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeHMyKCJkaXYiLCB7IGNsYXNzTmFtZTogImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MigiaDMiLCB7IGNsYXNzTmFtZTogInRleHQtc20gZm9udC1ib2xkIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdGV4dC13aGl0ZS82MCIsIGNoaWxkcmVuOiAiVFx1MUVBM2kgbVx4RTMgbmd1XHUxRUQzbiIgfSksCiAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MigiYnV0dG9uIiwgeyBvbkNsaWNrOiAoKSA9PiB7CiAgICAgICAgICAgIHNldFNob3dWZXJzaW9uTW9kYWwoZmFsc2UpOwogICAgICAgICAgICBzZXRQYXNzd29yZCgiIik7CiAgICAgICAgICB9LCBjbGFzc05hbWU6ICJ0ZXh0LXdoaXRlLzIwIGhvdmVyOnRleHQtd2hpdGUiLCBjaGlsZHJlbjogLyogQF9fUFVSRV9fICovIGpzeDIoInNwYW4iLCB7IGNsYXNzTmFtZTogIm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQgdGV4dC1bMThweF0iLCBjaGlsZHJlbjogImNsb3NlIiB9KSB9KQogICAgICAgIF0gfSksCiAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoInAiLCB7IGNsYXNzTmFtZTogInRleHQtWzExcHhdIHRleHQtd2hpdGUvNDAiLCBjaGlsZHJlbjogIk5oXHUxRUFEcCBtXHUxRUFEdCBraFx1MUVBOXUgXHUwMTExXHUxRUMzIG5ceEU5biB0b1x4RTBuIGJcdTFFRDkgcHJvamVjdCBjb2RlIHZceEUwbyBmaWxlIFpJUCB2XHhFMCB0XHUxRUEzaSB4dVx1MUVEMW5nIG1ceEUxeSB0XHhFRG5oLiIgfSksCiAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoCiAgICAgICAgICAiaW5wdXQiLAogICAgICAgICAgewogICAgICAgICAgICB0eXBlOiAicGFzc3dvcmQiLAogICAgICAgICAgICBwbGFjZWhvbGRlcjogIk1cdTFFQUR0IGtoXHUxRUE5dS4uLiIsCiAgICAgICAgICAgIGNsYXNzTmFtZTogInctZnVsbCBiZy13aGl0ZS81IGJvcmRlciBib3JkZXItd2hpdGUvMTAgcm91bmRlZC1sZyBweC0zIHB5LTIgdGV4dC1zbSBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6Ym9yZGVyLXdoaXRlLzMwIiwKICAgICAgICAgICAgdmFsdWU6IHBhc3N3b3JkLAogICAgICAgICAgICBvbkNoYW5nZTogKGUpID0+IHNldFBhc3N3b3JkKGUudGFyZ2V0LnZhbHVlKSwKICAgICAgICAgICAgb25LZXlEb3duOiAoZSkgPT4gZS5rZXkgPT09ICJFbnRlciIgJiYgaGFuZGxlRG93bmxvYWRDb2RlUHJvamVjdCgpCiAgICAgICAgICB9CiAgICAgICAgKSwKICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MihQaWxsQnV0dG9uLCB7IHZhcmlhbnQ6ICJzb2xpZCIsIGRpc2FibGVkOiBpc1ppcHBpbmcsIG9uQ2xpY2s6IGhhbmRsZURvd25sb2FkQ29kZVByb2plY3QsIGNoaWxkcmVuOiBpc1ppcHBpbmcgPyAiXHUwMTEwYW5nIG5ceEU5bi4uLiIgOiAiWFx4RTFjIG5oXHUxRUFEbiB0XHUxRUEzaSBaSVAiIH0pCiAgICAgIF0gfSkgfSksCiAgICAgIGN1cnJlbnRTdGVwID09PSAxICYmIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6ICJtYXgtdy0yeGwgbXgtYXV0byBweS0yMCBzcGFjZS15LTggYW5pbWF0ZS1kcm9wZG93biIsIGNoaWxkcmVuOiBbCiAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeHMyKCJkaXYiLCB7IGNsYXNzTmFtZTogInNwYWNlLXktMiB0ZXh0LWNlbnRlciBsZzp0ZXh0LWxlZnQiLCBjaGlsZHJlbjogWwogICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoImgxIiwgeyBjbGFzc05hbWU6ICJ0ZXh0LTR4bCBmb250LWxpZ2h0IHRyYWNraW5nLXRpZ2h0IHRleHQtd2hpdGUvOTAiLCBjaGlsZHJlbjogIlN0aWNrbWFuIEFkIFN0b3J5dGVsbGVyIiB9KSwKICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJwIiwgeyBjbGFzc05hbWU6ICJ0ZXh0LXdoaXRlLzQwIHRleHQtbGciLCBjaGlsZHJlbjogIktcdTFFQzMgY2h1eVx1MUVDN24gbmdcdTAxQjBcdTFFRERpIHF1ZSBrXHUxRUJGdCBoXHUxRUUzcCB0aHV5XHUxRUJGdCBtaW5oIHRpXHUxRUJGbmcgVmlcdTFFQzd0IHZceEUwIHF1XHUxRUEzbmcgYlx4RTEgc1x1MUVBM24gcGhcdTFFQTltLiIgfSkKICAgICAgICBdIH0pLAogICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJkaXYiLCB7IGNsYXNzTmFtZTogImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTIiLCBjaGlsZHJlbjogU1VHR0VTVEVEX1RIRU1FUy5zbGljZSgwLCA0KS5tYXAoKHQsIGkpID0+IC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJidXR0b24iLCB7IG9uQ2xpY2s6ICgpID0+IGdlbmVyYXRlU2NyaXB0KHQpLCBjbGFzc05hbWU6ICJ0ZXh0LWxlZnQgcC00IHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci13aGl0ZS8xMCBiZy13aGl0ZS81IGhvdmVyOmJnLXdoaXRlLzEwIHRyYW5zaXRpb24tYWxsIHRleHQtc20gdGV4dC13aGl0ZS83MCBob3Zlcjp0cmFuc2xhdGUteS1bLTJweF0iLCBjaGlsZHJlbjogdCB9LCBpKSkgfSksCiAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeHMyKCJkaXYiLCB7IGNsYXNzTmFtZTogInJlbGF0aXZlIG10LTEwIiwgY2hpbGRyZW46IFsKICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKAogICAgICAgICAgICAidGV4dGFyZWEiLAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgdmFsdWU6IHRoZW1lLAogICAgICAgICAgICAgIG9uQ2hhbmdlOiAoZSkgPT4gc2V0VGhlbWUoZS50YXJnZXQudmFsdWUpLAogICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAiTmhcdTFFQURwIFx4RkQgdFx1MDFCMFx1MUVERm5nIGNcdTFFRDF0IHRydXlcdTFFQzduIGNcdTFFRTdhIGJcdTFFQTFuIHRcdTFFQTFpIFx1MDExMVx4RTJ5Li4uIiwKICAgICAgICAgICAgICBjbGFzc05hbWU6ICJ3LWZ1bGwgaC0zMiBiZy13aGl0ZS81IGJvcmRlciBib3JkZXItd2hpdGUvMTAgcm91bmRlZC0yeGwgcC00IHRleHQtc20gZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOmJvcmRlci13aGl0ZS8zMCByZXNpemUtbm9uZSB0cmFuc2l0aW9uLWNvbG9ycyBzaGFkb3ctaW5uZXIiCiAgICAgICAgICAgIH0KICAgICAgICAgICksCiAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAiYWJzb2x1dGUgYm90dG9tLTMgcmlnaHQtMyBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAgIGNvbmZpZy5wcm9kdWN0SW1hZ2UgJiYgLyogQF9fUFVSRV9fICovIGpzeHMyKCJzcGFuIiwgeyBjbGFzc05hbWU6ICJ0ZXh0LVsxMHB4XSB0ZXh0LWdyZWVuLTUwMCBmb250LWJvbGQgYmctZ3JlZW4tNTAwLzEwIHB4LTIgcHktMSByb3VuZGVkLWZ1bGwgYm9yZGVyIGJvcmRlci1ncmVlbi01MDAvMjAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEiLCBjaGlsZHJlbjogWwogICAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJzcGFuIiwgeyBjbGFzc05hbWU6ICJtYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHRleHQtWzE0cHhdIiwgY2hpbGRyZW46ICJjaGVjayIgfSksCiAgICAgICAgICAgICAgIiBcdTAxMTBceEUzIG5cdTFFQTFwIHNcdTFFQTNuIHBoXHUxRUE5bSIKICAgICAgICAgICAgXSB9KSwKICAgICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoUGlsbEJ1dHRvbiwgeyB2YXJpYW50OiAic29saWQiLCBkaXNhYmxlZDogIXRoZW1lLnRyaW0oKSB8fCBpc1Byb2Nlc3NpbmcsIG9uQ2xpY2s6ICgpID0+IGdlbmVyYXRlU2NyaXB0KHRoZW1lKSwgY2hpbGRyZW46IGlzUHJvY2Vzc2luZyA/ICJcdTAxMTBhbmcgc29cdTFFQTFuIGtcdTFFQ0JjaCBiXHUxRUEzbi4uLiIgOiAiQlx1MUVBRnQgXHUwMTExXHUxRUE3dSBrXHUxRUMzIGNodXlcdTFFQzduIiB9KQogICAgICAgICAgXSB9KQogICAgICAgIF0gfSkKICAgICAgXSB9KSwKICAgICAgY3VycmVudFN0ZXAgPT09IDIgJiYgLyogQF9fUFVSRV9fICovIGpzeHMyKCJkaXYiLCB7IGNsYXNzTmFtZTogIm1heC13LTR4bCBteC1hdXRvIHNwYWNlLXktNiBhbmltYXRlLWRyb3Bkb3duIiwgY2hpbGRyZW46IFsKICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIGJvcmRlci1iIGJvcmRlci13aGl0ZS81IHBiLTQiLCBjaGlsZHJlbjogWwogICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeHMyKCJkaXYiLCB7IGNoaWxkcmVuOiBbCiAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJoMiIsIHsgY2xhc3NOYW1lOiAidGV4dC14bCBmb250LW1lZGl1bSIsIGNoaWxkcmVuOiAiS1x1MUVDQmNoIGJcdTFFQTNuIGNoaSB0aVx1MUVCRnQiIH0pLAogICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MigicCIsIHsgY2xhc3NOYW1lOiAidGV4dC1bMTBweF0gdGV4dC13aGl0ZS8zMCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IG10LTEiLCBjaGlsZHJlbjogY29uZmlnLnByb2R1Y3RJbWFnZSA/ICJIXHUxRUM3IHRoXHUxRUQxbmcgXHUwMTExXHhFMyB0aFx4RUFtIENcdTFFQTNuaCA2IFx1MDExMVx1MUVDMyBxdVx1MUVBM25nIGJceEUxIHNcdTFFQTNuIHBoXHUxRUE5bSIgOiAiNSBjXHUxRUEzbmggdHJ1eVx1MUVDN24gbmdcdTAxQjBcdTFFRERpIHF1ZSB0cnV5XHUxRUMxbiB0aFx1MUVEMW5nIiB9KQogICAgICAgICAgXSB9KSwKICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKFBpbGxCdXR0b24sIHsgdmFyaWFudDogInNvbGlkIiwgb25DbGljazogKCkgPT4gc2V0Q3VycmVudFN0ZXAoMyksIGNoaWxkcmVuOiAiRFx1MUVGMW5nIHBoaW0gbmdheSIgfSkKICAgICAgICBdIH0pLAogICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJkaXYiLCB7IGNsYXNzTmFtZTogInNwYWNlLXktNCBwYi0yMCIsIGNoaWxkcmVuOiBzY2VuZXMubWFwKChzKSA9PiAvKiBAX19QVVJFX18gKi8ganN4MigiZGl2IiwgeyBjbGFzc05hbWU6IGBwLTUgcm91bmRlZC0yeGwgYm9yZGVyIHRyYW5zaXRpb24tY29sb3JzICR7cy5pc1Byb2R1Y3RBZCA/ICJib3JkZXItYW1iZXItNTAwLzMwIGJnLWFtYmVyLTUwMC81IiA6ICJib3JkZXItd2hpdGUvMTAgYmctd2hpdGUvNSBob3ZlcjpiZy13aGl0ZS9bMC4wN10ifWAsIGNoaWxkcmVuOiAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAiZmxleCBnYXAtNCIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4Migic3BhbiIsIHsgY2xhc3NOYW1lOiBgdy04IGgtOCByb3VuZGVkLWZ1bGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC14cyBmb250LWJvbGQgc2hyaW5rLTAgJHtzLmlzUHJvZHVjdEFkID8gImJnLWFtYmVyLTUwMCB0ZXh0LWJsYWNrIiA6ICJiZy13aGl0ZS8xMCB0ZXh0LXdoaXRlLzYwIn1gLCBjaGlsZHJlbjogcy5pc1Byb2R1Y3RBZCA/IC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJzcGFuIiwgeyBjbGFzc05hbWU6ICJtYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHRleHQtWzE2cHhdIiwgY2hpbGRyZW46ICJjYW1wYWlnbiIgfSkgOiBgMCR7cy5pZH1gIH0pLAogICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeHMyKCJkaXYiLCB7IGNsYXNzTmFtZTogImZsZXgtMSBzcGFjZS15LTIiLCBjaGlsZHJlbjogWwogICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIiwgY2hpbGRyZW46IFsKICAgICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MigicCIsIHsgY2xhc3NOYW1lOiAidGV4dC1sZyB0ZXh0LXdoaXRlLzkwIGZvbnQtbWVkaXVtIiwgY2hpbGRyZW46IHMudGV4dFZpIH0pLAogICAgICAgICAgICAgIHMuaXNQcm9kdWN0QWQgJiYgLyogQF9fUFVSRV9fICovIGpzeDIoInNwYW4iLCB7IGNsYXNzTmFtZTogInRleHQtWzlweF0gZm9udC1ib2xkIHRleHQtYW1iZXItNTAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYmctYW1iZXItNTAwLzEwIHB4LTIgcHktMSByb3VuZGVkIiwgY2hpbGRyZW46ICJDXHUxRUEzbmggUXVcdTFFQTNuZyBDXHhFMW8iIH0pCiAgICAgICAgICAgIF0gfSksCiAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJkaXYiLCB7IGNsYXNzTmFtZTogInAtMyByb3VuZGVkLXhsIGJnLWJsYWNrLzMwIGJvcmRlciBib3JkZXItd2hpdGUvNSIsIGNoaWxkcmVuOiAvKiBAX19QVVJFX18gKi8ganN4czIoInAiLCB7IGNsYXNzTmFtZTogInRleHQtc20gdGV4dC13aGl0ZS82MCBpdGFsaWMgbGVhZGluZy1yZWxheGVkIiwgY2hpbGRyZW46IFsKICAgICAgICAgICAgICAnIicsCiAgICAgICAgICAgICAgcy52b2ljZVNjcmlwdCwKICAgICAgICAgICAgICAnIicKICAgICAgICAgICAgXSB9KSB9KQogICAgICAgICAgXSB9KQogICAgICAgIF0gfSkgfSwgcy5pZCkpIH0pCiAgICAgIF0gfSksCiAgICAgIGN1cnJlbnRTdGVwID09PSAzICYmIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6ICJtYXgtdy02eGwgbXgtYXV0byBzcGFjZS15LTEwIGFuaW1hdGUtZHJvcGRvd24gcGItMjAiLCBjaGlsZHJlbjogWwogICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6ICJmbGV4IGp1c3RpZnktYmV0d2VlbiBpdGVtcy1jZW50ZXIgc3RpY2t5IHRvcC0wIGJnLVsjMGUwZTBlXS84MCBiYWNrZHJvcC1ibHVyLW1kIHotMjAgcHktNCBib3JkZXItYiBib3JkZXItd2hpdGUvNSIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2hpbGRyZW46IFsKICAgICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoImgyIiwgeyBjbGFzc05hbWU6ICJ0ZXh0LTJ4bCBmb250LW1lZGl1bSIsIGNoaWxkcmVuOiAiU1x1MUVBM24geHVcdTFFQTV0IE1lZGlhIiB9KSwKICAgICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoInAiLCB7IGNsYXNzTmFtZTogInRleHQteHMgdGV4dC13aGl0ZS80MCIsIGNoaWxkcmVuOiAiVFx1MUVBMW8gaFx4RUNuaCBcdTFFQTNuaCB2XHhFMCBkaVx1MUVDNW4gaG9cdTFFQTF0IGNobyB0XHUxRUVCbmcgY1x1MUVBM25oIHBoaW0gdlx1MUVEQmkgdGh1eVx1MUVCRnQgbWluaCB0aVx1MUVCRm5nIFZpXHUxRUM3dC4iIH0pCiAgICAgICAgICBdIH0pLAogICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeHMyKCJkaXYiLCB7IGNsYXNzTmFtZTogImZsZXggZ2FwLTIiLCBjaGlsZHJlbjogWwogICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MihQaWxsQnV0dG9uLCB7IHZhcmlhbnQ6ICJvdXRsaW5lIiwgaWNvbjogLyogQF9fUFVSRV9fICovIGpzeDIoInNwYW4iLCB7IGNsYXNzTmFtZTogIm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQgdGV4dC1bMThweF0iLCBjaGlsZHJlbjogInBob3RvX2xpYnJhcnkiIH0pLCBvbkNsaWNrOiBnZW5lcmF0ZUFsbEltYWdlcywgY2hpbGRyZW46ICJUXHUxRUExbyB0b1x4RTBuIGJcdTFFRDkgXHUxRUEzbmgiIH0pLAogICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MihQaWxsQnV0dG9uLCB7IHZhcmlhbnQ6ICJzb2xpZCIsIGljb246IC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJzcGFuIiwgeyBjbGFzc05hbWU6ICJtYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHRleHQtWzE4cHhdIiwgY2hpbGRyZW46ICJjb250ZW50X2NvcHkiIH0pLCBvbkNsaWNrOiBjb3B5Vm9pY2VvdmVyU2NyaXB0LCBjaGlsZHJlbjogIkNvcHkgdGh1eVx1MUVCRnQgbWluaCIgfSkKICAgICAgICAgIF0gfSkKICAgICAgICBdIH0pLAogICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJkaXYiLCB7IGNsYXNzTmFtZTogImdyaWQgZ3JpZC1jb2xzLTEgZ2FwLTE2IiwgY2hpbGRyZW46IHNjZW5lcy5tYXAoKHNjZW5lKSA9PiB7CiAgICAgICAgICBjb25zdCBpbWdLZXkgPSBgJHtzY2VuZS5pZH1faW1hZ2VgOwogICAgICAgICAgY29uc3QgdmlkS2V5ID0gYCR7c2NlbmUuaWR9X3ZpZGVvYDsKICAgICAgICAgIGNvbnN0IGltZ0Rvd25sb2FkU3RhdGUgPSBkb3dubG9hZFN0YXR1c1tpbWdLZXldIHx8ICJpZGxlIjsKICAgICAgICAgIGNvbnN0IHZpZERvd25sb2FkU3RhdGUgPSBkb3dubG9hZFN0YXR1c1t2aWRLZXldIHx8ICJpZGxlIjsKICAgICAgICAgIHJldHVybiAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiBgZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtMiBnYXAtMTIgaXRlbXMtc3RhcnQgcC02IHJvdW5kZWQtM3hsIGJvcmRlciB0cmFuc2l0aW9uLWFsbCAke3NjZW5lLmlzUHJvZHVjdEFkID8gImJvcmRlci1hbWJlci01MDAvMjAgYmctYW1iZXItNTAwL1swLjAyXSIgOiAiYm9yZGVyLXdoaXRlLzUgYmctdHJhbnNwYXJlbnQifWAsIGNoaWxkcmVuOiBbCiAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6ICJzcGFjZS15LTQiLCBjaGlsZHJlbjogWwogICAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6ICJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcHgtMSIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMiLCBjaGlsZHJlbjogWwogICAgICAgICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4czIoInNwYW4iLCB7IGNsYXNzTmFtZTogYHRleHQtMnhsIGZvbnQtYm9sZCAke3NjZW5lLmlzUHJvZHVjdEFkID8gInRleHQtYW1iZXItNTAwLzIwIiA6ICJ0ZXh0LXdoaXRlLzEwIn1gLCBjaGlsZHJlbjogWwogICAgICAgICAgICAgICAgICAgICIwIiwKICAgICAgICAgICAgICAgICAgICBzY2VuZS5pZAogICAgICAgICAgICAgICAgICBdIH0pLAogICAgICAgICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MigiaDMiLCB7IGNsYXNzTmFtZTogInRleHQtbGcgZm9udC1tZWRpdW0gdGV4dC13aGl0ZS84MCIsIGNoaWxkcmVuOiBzY2VuZS50ZXh0VmkgfSkKICAgICAgICAgICAgICAgIF0gfSksCiAgICAgICAgICAgICAgICBzY2VuZS5pc1Byb2R1Y3RBZCAmJiAvKiBAX19QVVJFX18gKi8ganN4Migic3BhbiIsIHsgY2xhc3NOYW1lOiAidGV4dC1bMTBweF0gYmctYW1iZXItNTAwLzEwIHRleHQtYW1iZXItNTAwIHB4LTIgcHktMSByb3VuZGVkIGZvbnQtYm9sZCB1cHBlcmNhc2UiLCBjaGlsZHJlbjogIlBoXHUxRUQxaSBoXHUxRUUzcCBcdTFFQTNuaCBzXHUxRUEzbiBwaFx1MUVBOW0iIH0pCiAgICAgICAgICAgICAgXSB9KSwKICAgICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiBgcmVsYXRpdmUgcm91bmRlZC0yeGwgb3ZlcmZsb3ctaGlkZGVuIGJvcmRlciBib3JkZXItd2hpdGUvMTAgYmctYmxhY2sgJHthc3BlY3RDbGFzc30gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ3JvdXAgc2hhZG93LTJ4bGAsIGNoaWxkcmVuOiBbCiAgICAgICAgICAgICAgICBzY2VuZS5pbWFnZVN0YXR1cyA9PT0gImdlbmVyYXRpbmciICYmIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6ICJhYnNvbHV0ZSBpbnNldC0wIHotMTAgYmctYmxhY2svNzAgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTMiLCBjaGlsZHJlbjogWwogICAgICAgICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MigiZGl2IiwgeyBjbGFzc05hbWU6ICJ3LTEwIGgtMTAgYm9yZGVyLTIgYm9yZGVyLXdoaXRlLzEwIGJvcmRlci10LXdoaXRlIHJvdW5kZWQtZnVsbCBhbmltYXRlLXNwaW4iIH0pLAogICAgICAgICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4Migic3BhbiIsIHsgY2xhc3NOYW1lOiAidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgYW5pbWF0ZS1wdWxzZSB0ZXh0LXdoaXRlLzcwIiwgY2hpbGRyZW46IHNjZW5lLmlzUHJvZHVjdEFkID8gIlx1MDExMGFuZyBsXHUxRUQzbmcgZ2hceEU5cCBzXHUxRUEzbiBwaFx1MUVBOW0uLi4iIDogIlx1MDExMGFuZyB2XHUxRUJEIHBoXHhFMWMgdGhcdTFFQTNvLi4uIiB9KQogICAgICAgICAgICAgICAgXSB9KSwKICAgICAgICAgICAgICAgIHNjZW5lLmltYWdlUmVzdWx0ID8gLyogQF9fUFVSRV9fICovIGpzeDIoImltZyIsIHsgc3JjOiBgZGF0YToke3NjZW5lLmltYWdlUmVzdWx0Lm1pbWVUeXBlfTtiYXNlNjQsJHtzY2VuZS5pbWFnZVJlc3VsdC5iYXNlNjR9YCwgY2xhc3NOYW1lOiAidy1mdWxsIGgtZnVsbCBvYmplY3QtY292ZXIgdHJhbnNpdGlvbi10cmFuc2Zvcm0gZHVyYXRpb24tNzAwIGdyb3VwLWhvdmVyOnNjYWxlLTEwNSIgfSkgOiAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAidGV4dC13aGl0ZS81IGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGdhcC0zIiwgY2hpbGRyZW46IFsKICAgICAgICAgICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoInNwYW4iLCB7IGNsYXNzTmFtZTogIm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQgdGV4dC01eGwiLCBjaGlsZHJlbjogImRyYXciIH0pLAogICAgICAgICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4Migic3BhbiIsIHsgY2xhc3NOYW1lOiAidGV4dC1bMTBweF0gZm9udC1ib2xkIHRyYWNraW5nLXRpZ2h0ZXIgdXBwZXJjYXNlIiwgY2hpbGRyZW46ICJDaFx1MDFCMGEgY1x4RjMgYlx1MUVBM24gdlx1MUVCRCIgfSkKICAgICAgICAgICAgICAgIF0gfSksCiAgICAgICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAiYWJzb2x1dGUgYm90dG9tLTMgcmlnaHQtMyBmbGV4IGdhcC0yIiwgY2hpbGRyZW46IFsKICAgICAgICAgICAgICAgICAgc2NlbmUuaW1hZ2VSZXN1bHQgJiYgLyogQF9fUFVSRV9fICovIGpzeDIoCiAgICAgICAgICAgICAgICAgICAgImJ1dHRvbiIsCiAgICAgICAgICAgICAgICAgICAgewogICAgICAgICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gaGFuZGxlRG93bmxvYWRNZWRpYShzY2VuZS5pbWFnZVJlc3VsdC5iYXNlNjQsIHNjZW5lLmltYWdlUmVzdWx0Lm1pbWVUeXBlLCAiaW1hZ2UiLCBzY2VuZS5pZCksCiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICJ3LTEwIGgtWzM0cHhdIHJvdW5kZWQteGwgYmctd2hpdGUvMTAgaG92ZXI6Ymctd2hpdGUvMjAgYmFja2Ryb3AtYmx1ci1tZCBib3JkZXIgYm9yZGVyLXdoaXRlLzEwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHRyYW5zaXRpb24tYWxsIiwKICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiAvKiBAX19QVVJFX18gKi8ganN4Migic3BhbiIsIHsgY2xhc3NOYW1lOiAibWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB0ZXh0LVsxOHB4XSIsIGNoaWxkcmVuOiBpbWdEb3dubG9hZFN0YXRlID09PSAibG9hZGluZyIgPyAic3luYyIgOiBpbWdEb3dubG9hZFN0YXRlID09PSAiZG9uZSIgPyAiY2hlY2siIDogImRvd25sb2FkIiB9KQogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgKSwKICAgICAgICAgICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoCiAgICAgICAgICAgICAgICAgICAgUGlsbEJ1dHRvbiwKICAgICAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50OiBzY2VuZS5pbWFnZVN0YXR1cyA9PT0gImNvbXBsZXRlZCIgPyAib3V0bGluZSIgOiAic29saWQiLAogICAgICAgICAgICAgICAgICAgICAgaWNvbjogLyogQF9fUFVSRV9fICovIGpzeDIoInNwYW4iLCB7IGNsYXNzTmFtZTogIm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQgdGV4dC1bMThweF0iLCBjaGlsZHJlbjogc2NlbmUuaW1hZ2VTdGF0dXMgPT09ICJjb21wbGV0ZWQiID8gInJlZnJlc2giIDogImRyYXciIH0pLAogICAgICAgICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gewogICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzY2VuZTFSZWYgPSBzY2VuZXMuZmluZCgocykgPT4gcy5pZCA9PT0gMSk/LmltYWdlUmVzdWx0Py5tZWRpYUlkOwogICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZUltYWdlKHNjZW5lLmlkLCBzY2VuZS5pZCA+IDEgPyBzY2VuZTFSZWYgOiB2b2lkIDApOwogICAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBzY2VuZS5pbWFnZVN0YXR1cyA9PT0gImNvbXBsZXRlZCIgPyAiVlx1MUVCRCBsXHUxRUExaSIgOiAiVlx1MUVCRCBwaFx4RTFjIHRoXHUxRUEzbyIKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICkKICAgICAgICAgICAgICAgIF0gfSkKICAgICAgICAgICAgICBdIH0pCiAgICAgICAgICAgIF0gfSksCiAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6ICJzcGFjZS15LTQiLCBjaGlsZHJlbjogWwogICAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6ICJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcHgtMSIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4Migic3BhbiIsIHsgY2xhc3NOYW1lOiAidGV4dC1bMTBweF0gZm9udC1ib2xkIHRleHQtd2hpdGUvNDAgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCIsIGNoaWxkcmVuOiAiRGlcdTFFQzVuIGhvXHUxRUExdCBWaWRlbyAmIFRodXlcdTFFQkZ0IG1pbmgiIH0pLAogICAgICAgICAgICAgICAgc2NlbmUudmlkZW9TdGF0dXMgPT09ICJjb21wbGV0ZWQiICYmIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigic3BhbiIsIHsgY2xhc3NOYW1lOiAidGV4dC1bMTBweF0gdGV4dC1ncmVlbi01MDAvODAgZm9udC1ib2xkIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xIiwgY2hpbGRyZW46IFsKICAgICAgICAgICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeDIoInNwYW4iLCB7IGNsYXNzTmFtZTogIm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQgdGV4dC1bMTRweF0iLCBjaGlsZHJlbjogImNoZWNrX2NpcmNsZSIgfSksCiAgICAgICAgICAgICAgICAgICIgSE9ceEMwTiBUXHUxRUE0VCIKICAgICAgICAgICAgICAgIF0gfSkKICAgICAgICAgICAgICBdIH0pLAogICAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6IGByZWxhdGl2ZSByb3VuZGVkLTJ4bCBvdmVyZmxvdy1oaWRkZW4gYm9yZGVyIGJvcmRlci13aGl0ZS8xMCBiZy1ibGFjayAke2FzcGVjdENsYXNzfSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBzaGFkb3ctMnhsYCwgY2hpbGRyZW46IFsKICAgICAgICAgICAgICAgIHNjZW5lLnZpZGVvU3RhdHVzID09PSAiZ2VuZXJhdGluZyIgJiYgLyogQF9fUFVSRV9fICovIGpzeHMyKCJkaXYiLCB7IGNsYXNzTmFtZTogImFic29sdXRlIGluc2V0LTAgei0xMCBiZy1ibGFjay83MCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMyIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJkaXYiLCB7IGNsYXNzTmFtZTogInctMTAgaC0xMCBib3JkZXItMiBib3JkZXItd2hpdGUvMTAgYm9yZGVyLXQtd2hpdGUgcm91bmRlZC1mdWxsIGFuaW1hdGUtc3BpbiIgfSksCiAgICAgICAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJzcGFuIiwgeyBjbGFzc05hbWU6ICJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCBhbmltYXRlLXB1bHNlIHRleHQtd2hpdGUvNzAiLCBjaGlsZHJlbjogIlx1MDExMGFuZyBkXHUxRUYxbmcgJiB0XHUxRUExbyB0aHV5XHUxRUJGdCBtaW5oLi4uIiB9KQogICAgICAgICAgICAgICAgXSB9KSwKICAgICAgICAgICAgICAgIHNjZW5lLnZpZGVvUmVzdWx0ID8gLyogQF9fUFVSRV9fICovIGpzeDIoInZpZGVvIiwgeyBzcmM6IGBkYXRhOiR7c2NlbmUudmlkZW9SZXN1bHQubWltZVR5cGV9O2Jhc2U2NCwke3NjZW5lLnZpZGVvUmVzdWx0LmJhc2U2NH1gLCBjbGFzc05hbWU6ICJ3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlciIsIGNvbnRyb2xzOiB0cnVlLCBsb29wOiB0cnVlIH0pIDogLyogQF9fUFVSRV9fICovIGpzeHMyKCJkaXYiLCB7IGNsYXNzTmFtZTogInRleHQtd2hpdGUvNSBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBnYXAtMyIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJzcGFuIiwgeyBjbGFzc05hbWU6ICJtYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHRleHQtNXhsIiwgY2hpbGRyZW46ICJtb3ZpZSIgfSksCiAgICAgICAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJzcGFuIiwgeyBjbGFzc05hbWU6ICJ0ZXh0LVsxMHB4XSBmb250LWJvbGQgdHJhY2tpbmctdGlnaHRlciB1cHBlcmNhc2UiLCBjaGlsZHJlbjogIkNoXHUwMUIwYSBkaVx1MUVDNW4gaG9cdTFFQTF0IiB9KQogICAgICAgICAgICAgICAgXSB9KSwKICAgICAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigiZGl2IiwgeyBjbGFzc05hbWU6ICJhYnNvbHV0ZSBib3R0b20tMyByaWdodC0zIGZsZXggZ2FwLTIiLCBjaGlsZHJlbjogWwogICAgICAgICAgICAgICAgICBzY2VuZS52aWRlb1Jlc3VsdCAmJiAvKiBAX19QVVJFX18gKi8ganN4MigKICAgICAgICAgICAgICAgICAgICAiYnV0dG9uIiwKICAgICAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBoYW5kbGVEb3dubG9hZE1lZGlhKHNjZW5lLnZpZGVvUmVzdWx0LmJhc2U2NCwgc2NlbmUudmlkZW9SZXN1bHQubWltZVR5cGUsICJ2aWRlbyIsIHNjZW5lLmlkKSwKICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogInctMTAgaC1bMzRweF0gcm91bmRlZC14bCBiZy13aGl0ZS8xMCBob3ZlcjpiZy13aGl0ZS8yMCBiYWNrZHJvcC1ibHVyLW1kIGJvcmRlciBib3JkZXItd2hpdGUvMTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdHJhbnNpdGlvbi1hbGwiLAogICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJzcGFuIiwgeyBjbGFzc05hbWU6ICJtYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHRleHQtWzE4cHhdIiwgY2hpbGRyZW46IHZpZERvd25sb2FkU3RhdGUgPT09ICJsb2FkaW5nIiA/ICJzeW5jIiA6IHZpZERvd25sb2FkU3RhdGUgPT09ICJkb25lIiA/ICJjaGVjayIgOiAiZG93bmxvYWQiIH0pCiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICApLAogICAgICAgICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4MigKICAgICAgICAgICAgICAgICAgICBQaWxsQnV0dG9uLAogICAgICAgICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ6IHNjZW5lLnZpZGVvU3RhdHVzID09PSAiY29tcGxldGVkIiA/ICJvdXRsaW5lIiA6ICJzb2xpZCIsCiAgICAgICAgICAgICAgICAgICAgICBpY29uOiAvKiBAX19QVVJFX18gKi8ganN4Migic3BhbiIsIHsgY2xhc3NOYW1lOiAibWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB0ZXh0LVsxOHB4XSIsIGNoaWxkcmVuOiBzY2VuZS52aWRlb1N0YXR1cyA9PT0gImNvbXBsZXRlZCIgPyAicmVmcmVzaCIgOiAicGxheV9jaXJjbGUiIH0pLAogICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6ICFzY2VuZS5pbWFnZVJlc3VsdCB8fCBzY2VuZS52aWRlb1N0YXR1cyA9PT0gImdlbmVyYXRpbmciLAogICAgICAgICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gZ2VuZXJhdGVWaWRlbyhzY2VuZS5pZCksCiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogc2NlbmUudmlkZW9TdGF0dXMgPT09ICJjb21wbGV0ZWQiID8gIkRcdTFFRjFuZyBsXHUxRUExaSIgOiAiRFx1MUVGMW5nIFZpZGVvIgogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgKQogICAgICAgICAgICAgICAgXSB9KSwKICAgICAgICAgICAgICAgIHNjZW5lLnZpZGVvU3RhdHVzID09PSAiZXJyb3IiICYmIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJkaXYiLCB7IGNsYXNzTmFtZTogImFic29sdXRlIGluc2V0LTAgYmctcmVkLTUwMC8yMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciIsIGNoaWxkcmVuOiAvKiBAX19QVVJFX18gKi8ganN4Migic3BhbiIsIHsgY2xhc3NOYW1lOiAidGV4dC1bMTBweF0gdGV4dC13aGl0ZSBmb250LWJvbGQgYmctcmVkLTYwMCBweC0zIHB5LTEgcm91bmRlZCIsIGNoaWxkcmVuOiAiTFx1MUVENkkgS1x1MUVCRVQgTlx1MUVEMEkgU0RLIiB9KSB9KQogICAgICAgICAgICAgIF0gfSksCiAgICAgICAgICAgICAgLyogQF9fUFVSRV9fICovIGpzeHMyKCJkaXYiLCB7IGNsYXNzTmFtZTogInAtNCByb3VuZGVkLTJ4bCBiZy13aGl0ZS9bMC4wM10gYm9yZGVyIGJvcmRlci13aGl0ZS81IHNwYWNlLXktMyIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAgICAgICAvKiBAX19QVVJFX18gKi8ganN4czIoImRpdiIsIHsgY2xhc3NOYW1lOiAiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgbWItMSIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJzcGFuIiwgeyBjbGFzc05hbWU6ICJtYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHRleHQtWzE0cHhdIHRleHQtd2hpdGUvNDAiLCBjaGlsZHJlbjogIm1pYyIgfSksCiAgICAgICAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3gyKCJzcGFuIiwgeyBjbGFzc05hbWU6ICJ0ZXh0LVs5cHhdIHVwcGVyY2FzZSBmb250LWJvbGQgdGV4dC13aGl0ZS8zMCB0cmFja2luZy13aWRlc3QiLCBjaGlsZHJlbjogY29uZmlnLnZvaWNlVHlwZSB9KQogICAgICAgICAgICAgICAgXSB9KSwKICAgICAgICAgICAgICAgIC8qIEBfX1BVUkVfXyAqLyBqc3hzMigicCIsIHsgY2xhc3NOYW1lOiAidGV4dC1zbSB0ZXh0LXdoaXRlLzcwIGxlYWRpbmctcmVsYXhlZCBpdGFsaWMgYm9yZGVyLWwtMiBib3JkZXItd2hpdGUvMTAgcGwtMyIsIGNoaWxkcmVuOiBbCiAgICAgICAgICAgICAgICAgICciJywKICAgICAgICAgICAgICAgICAgc2NlbmUudm9pY2VTY3JpcHQsCiAgICAgICAgICAgICAgICAgICciJwogICAgICAgICAgICAgICAgXSB9KQogICAgICAgICAgICAgIF0gfSkKICAgICAgICAgICAgXSB9KQogICAgICAgICAgXSB9LCBzY2VuZS5pZCk7CiAgICAgICAgfSkgfSkKICAgICAgXSB9KQogICAgXSB9KQogIF0gfSk7Cn0KZXhwb3J0IHsKICBTdGlja21hblN0b3J5QXBwIGFzIGRlZmF1bHQKfTsK",
    "jszip": "https://esm.sh/jszip@latest?external=react,react-dom"
  }
}
  </script>



  <style>
    * { box-sizing: border-box; }
    html { height: 100%; }
    :root {
      --mat-sys-background: #ffffff;
      --mat-sys-on-background: #1e293b;
      --scrollbar-thumb: #cbd5e1;
      --scrollbar-thumb-hover: #94a3b8;
    }
    .dark {
      --mat-sys-background: #1a1a1a;
      --mat-sys-on-background: #e2e8f0;
      --scrollbar-thumb: #475569;
      --scrollbar-thumb-hover: #64748b;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background-color: var(--mat-sys-background);
      color: var(--mat-sys-on-background);
    }
    #root { height: 100%; }

    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 0.5rem; height: 0.5rem; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--scrollbar-thumb-hover);
    }
  </style>
<style id="stickman-global-styles">
      .paper-bg { background-color: #0e0e0e; background-image: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 100%); }
      .dark-scrollbar { scrollbar-width: thin; scrollbar-color: #333 transparent; }
      .dark-scrollbar::-webkit-scrollbar { width: 4px; }
      .dark-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .dark-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      @keyframes pulse-soft { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.4; } }
      .animate-pulse-soft { animation: pulse-soft 2s infinite ease-in-out; }
      @keyframes dropdown-enter { from { opacity: 0; transform: scale(0.95) translateY(-5px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      .animate-dropdown { animation: dropdown-enter 0.15s ease-out forwards; }
    </style></head>
<body class="h-full m-0 p-0">
  <div id="root"><div class="flex h-screen w-screen bg-[#0e0e0e] text-white overflow-hidden"><div class="border-r border-white/10 flex flex-col justify-between p-3 w-[300px] h-full bg-[#0e0e0e] shrink-0"><div class="flex flex-col gap-6 overflow-y-auto dark-scrollbar pr-1"><div class="flex flex-col gap-3"><div class="flex items-center px-2"><span class="text-[11px] font-medium text-[rgba(218,220,224,0.9)] tracking-[0.1px] normal-case">Thông tin Sản phẩm (QC)</span></div><div class="p-3 rounded-xl border border-white/10 bg-white/5 space-y-3"><button class="w-full aspect-square rounded-lg border border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden relative group"><span class="material-symbols-outlined text-white/20 text-3xl">add_photo_alternate</span><span class="text-[10px] text-white/30 font-bold uppercase">Ảnh sản phẩm</span></button><input placeholder="Tên sản phẩm..." class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] focus:outline-none focus:border-white/30" type="text" value=""><textarea placeholder="Mô tả ngắn về sản phẩm..." class="w-full h-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] focus:outline-none focus:border-white/30 resize-none"></textarea></div></div><div class="flex flex-col gap-3"><div class="flex items-center px-2"><span class="text-[11px] font-medium text-[rgba(218,220,224,0.9)] tracking-[0.1px] normal-case">Cấu hình Media &amp; Thuyết minh</span></div><div class="relative "><button type="button" class="w-full text-left border border-[#595959] hover:border-[#7a7a7a] transition-colors rounded-xl flex flex-col gap-0.5 justify-center pb-2 pl-2.5 pr-1 pt-[5px] select-none focus:outline-none"><p class="text-[11px] font-medium text-white/35 tracking-[0.1px]">Model Video</p><div class="flex items-center justify-between"><span class="text-[11px] font-medium text-white tracking-[0.1px] truncate pr-2">Omni 1.1 Flash</span><span class="material-symbols-outlined text-[16px] text-white/50 mr-1 transition-transform ">keyboard_arrow_down</span></div></button></div><div class="relative "><button type="button" class="w-full text-left border border-[#595959] hover:border-[#7a7a7a] transition-colors rounded-xl flex flex-col gap-0.5 justify-center pb-2 pl-2.5 pr-1 pt-[5px] select-none focus:outline-none"><p class="text-[11px] font-medium text-white/35 tracking-[0.1px]">Giọng thuyết minh</p><div class="flex items-center justify-between"><span class="text-[11px] font-medium text-white tracking-[0.1px] truncate pr-2">Giọng Truyền Cảm</span><span class="material-symbols-outlined text-[16px] text-white/50 mr-1 transition-transform ">keyboard_arrow_down</span></div></button></div><div class="flex flex-col gap-1.5"><div class="flex items-center px-2"><span class="text-[11px] font-medium text-[rgba(218,220,224,0.9)] tracking-[0.1px] normal-case">Thời lượng: 8s</span></div><div class="flex w-full items-center border border-[#595959] rounded-xl overflow-hidden bg-transparent"><button type="button" class="flex-1 flex items-center justify-center gap-1 h-[34px] px-3 py-2 rounded-xl text-[11px] font-medium tracking-[0.1px] transition-all cursor-pointer text-white/60 hover:text-white hover:bg-white/5"><span>4s</span></button><button type="button" class="flex-1 flex items-center justify-center gap-1 h-[34px] px-3 py-2 rounded-xl text-[11px] font-medium tracking-[0.1px] transition-all cursor-pointer text-white/60 hover:text-white hover:bg-white/5"><span>6s</span></button><button type="button" class="flex-1 flex items-center justify-center gap-1 h-[34px] px-3 py-2 rounded-xl text-[11px] font-medium tracking-[0.1px] transition-all cursor-pointer bg-[#969696] text-black"><span>8s</span></button><button type="button" class="flex-1 flex items-center justify-center gap-1 h-[34px] px-3 py-2 rounded-xl text-[11px] font-medium tracking-[0.1px] transition-all cursor-pointer text-white/60 hover:text-white hover:bg-white/5"><span>10s</span></button></div></div><div class="flex gap-1"><div class="flex-1"><div class="flex items-center px-2"><span class="text-[11px] font-medium text-[rgba(218,220,224,0.9)] tracking-[0.1px] normal-case">Tỷ lệ khung hình</span></div><div class="flex w-full items-center border border-[#595959] rounded-xl overflow-hidden bg-transparent"><button type="button" class="flex-1 flex items-center justify-center gap-1 h-[34px] px-3 py-2 rounded-xl text-[11px] font-medium tracking-[0.1px] transition-all cursor-pointer text-white/60 hover:text-white hover:bg-white/5"><span>9:16</span></button><button type="button" class="flex-1 flex items-center justify-center gap-1 h-[34px] px-3 py-2 rounded-xl text-[11px] font-medium tracking-[0.1px] transition-all cursor-pointer bg-[#969696] text-black"><span>16:9</span></button></div></div></div></div><div class="flex flex-col gap-3 pb-4"><div class="flex items-center px-2"><span class="text-[11px] font-medium text-[rgba(218,220,224,0.9)] tracking-[0.1px] normal-case">Phong cách Nghệ thuật</span></div><div class="relative "><button type="button" class="w-full text-left border border-[#595959] hover:border-[#7a7a7a] transition-colors rounded-xl flex flex-col gap-0.5 justify-center pb-2 pl-2.5 pr-1 pt-[5px] select-none focus:outline-none"><p class="text-[11px] font-medium text-white/35 tracking-[0.1px]">Texture giấy</p><div class="flex items-center justify-between"><span class="text-[11px] font-medium text-white tracking-[0.1px] truncate pr-2">Giấy trắng nhăn</span><span class="material-symbols-outlined text-[16px] text-white/50 mr-1 transition-transform ">keyboard_arrow_down</span></div></button></div><div class="relative "><button type="button" class="w-full text-left border border-[#595959] hover:border-[#7a7a7a] transition-colors rounded-xl flex flex-col gap-0.5 justify-center pb-2 pl-2.5 pr-1 pt-[5px] select-none focus:outline-none"><p class="text-[11px] font-medium text-white/35 tracking-[0.1px]">Kiểu nét vẽ</p><div class="flex items-center justify-between"><span class="text-[11px] font-medium text-white tracking-[0.1px] truncate pr-2">Mực đen tối giản</span><span class="material-symbols-outlined text-[16px] text-white/50 mr-1 transition-transform ">keyboard_arrow_down</span></div></button></div><div class="relative "><button type="button" class="w-full text-left border border-[#595959] hover:border-[#7a7a7a] transition-colors rounded-xl flex flex-col gap-0.5 justify-center pb-2 pl-2.5 pr-1 pt-[5px] select-none focus:outline-none"><p class="text-[11px] font-medium text-white/35 tracking-[0.1px]">Cảm xúc kịch bản</p><div class="flex items-center justify-between"><span class="text-[11px] font-medium text-white tracking-[0.1px] truncate pr-2">Nhẹ nhàng</span><span class="material-symbols-outlined text-[16px] text-white/50 mr-1 transition-transform ">keyboard_arrow_down</span></div></button></div></div></div><div class="flex flex-col gap-2 pt-4 border-t border-white/5"><button class="text-[10px] text-white/20 hover:text-white/40 transition-colors text-center py-1 mt-1 cursor-pointer select-none">App version 0.1.0</button></div></div><main class="flex-1 h-full overflow-y-auto p-6 paper-bg dark-scrollbar"><div class="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"><div class="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl w-full max-w-xs shadow-2xl animate-dropdown space-y-4"><div class="flex justify-between items-center"><h3 class="text-sm font-bold uppercase tracking-widest text-white/60">Tải mã nguồn</h3><button class="text-white/20 hover:text-white"><span class="material-symbols-outlined text-[18px]">close</span></button></div><p class="text-[11px] text-white/40">Nhập mật khẩu để nén toàn bộ project code vào file ZIP và tải xuống máy tính.</p><input placeholder="Mật khẩu..." class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30" type="password" value="Fast@006"><button class="flex items-center gap-[2px] justify-center w-full h-[34px] rounded-xl font-medium tracking-[0.1px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-gray-200 active:bg-gray-300 text-black text-[12px] pl-[8px] pr-[16px] py-2 select-none"><span>Xác nhận tải ZIP</span></button></div></div><div class="max-w-2xl mx-auto py-20 space-y-8 animate-dropdown"><div class="space-y-2 text-center lg:text-left"><h1 class="text-4xl font-light tracking-tight text-white/90">Stickman Ad Storyteller</h1><p class="text-white/40 text-lg">Kể chuyện người que kết hợp thuyết minh tiếng Việt và quảng bá sản phẩm.</p></div><div class="grid grid-cols-2 gap-2"><button class="text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm text-white/70 hover:translate-y-[-2px]">Người que cô đơn tìm thấy một người bạn trong cơn mưa giấy</button><button class="text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm text-white/70 hover:translate-y-[-2px]">Câu chuyện về chiếc bóng không chịu rời đi giữa đêm trăng</button><button class="text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm text-white/70 hover:translate-y-[-2px]">Một người que nhỏ bé xây dựng tòa lâu đài từ những mảnh giấy vụn</button><button class="text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm text-white/70 hover:translate-y-[-2px]">Người que học cách tha thứ cho chính mình</button></div><div class="relative mt-10"><textarea placeholder="Nhập ý tưởng cốt truyện của bạn tại đây..." class="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-white/30 resize-none transition-colors shadow-inner"></textarea><div class="absolute bottom-3 right-3 flex items-center gap-2"><button class="flex items-center gap-[2px] justify-center w-full h-[34px] rounded-xl font-medium tracking-[0.1px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-gray-200 active:bg-gray-300 text-black text-[12px] pl-[8px] pr-[16px] py-2 select-none" disabled=""><span>Bắt đầu kể chuyện</span></button></div></div></div></main></div></div>

  <!-- Global error handlers -->
  <script>
    (function(a){if(!a)throw Error("Xi");window.onerror=(b,c,d,e,f)=>{c=!c||c.startsWith("data:")||c.startsWith("blob:")?"":c;var g;window.parent.postMessage({type:"FLOW_RUNTIME_ERROR",payload:{error:String(b)+(c?" at "+c+":"+String(d):""),stack:f instanceof Error?(g=f.stack)!=null?g:"":""}},a)};window.addEventListener("unhandledrejection",b=>{b=b.reason;var c;window.parent.postMessage({type:"FLOW_RUNTIME_ERROR",payload:{error:"Unhandled Promise: "+(b instanceof Error?b.message:String(b)),
stack:(c=b instanceof Error?b.stack:void 0)!=null?c:""}},a)});document.addEventListener("securitypolicyviolation",b=>{window.parent.postMessage({type:"FLOW_CSP_VIOLATION",payload:{blockedURI:b.blockedURI,violatedDirective:b.violatedDirective,effectiveDirective:b.effectiveDirective}},a)})})(window.FLOW_PARENT_ORIGIN);
  </script>

  <!-- ESM App Entry Point -->
  <script type="module">
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    await (function(a,b,c,d,e,f){if(!d)throw Error("Xi");var g=document.getElementById("root");if(!g)throw Error("Yi");return c().then(h=>{(h=h["default"]||h.App)?(b(g).render(a.createElement(h)),window.parent.postMessage({type:"FLOW_APP_MOUNTED"},
d)):(h=document.createElement("div"),h.className="p-8 text-red-500",h.textContent=e,g.replaceChildren(h))}).catch(h=>{var k=document.createElement("div");k.className="p-8 text-red-500";k.textContent=f+(h instanceof Error?h.message:String(h));g.replaceChildren(k);var l;window.parent.postMessage({type:"FLOW_RUNTIME_ERROR",payload:{error:h instanceof Error?h.message:String(h),stack:(l=h instanceof Error?h.stack:void 0)!=null?l:""}},d)})})(
      React, createRoot, () => import('@app'),
      window.FLOW_PARENT_ORIGIN,
      "Lỗi: Không tìm thấy giá trị xuất mặc định",
      "Lỗi thời gian chạy: "
    );
  </script>

</body></html>