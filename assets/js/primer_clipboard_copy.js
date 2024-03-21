String.prototype.format = function () {
  var args = arguments;
  return this.replace(/{([0-9]+)}/g, function (match, index) {
    return typeof args[index] == 'undefined' ? match : args[index];
  });
};

function fromHTML(html, trim = true) {
  // Process the HTML string.
  html = trim ? html.trim() : html;
  if (!html) return null;

  // Then set up a new template element.
  const template = document.createElement('template');
  template.innerHTML = html;
  const result = template.content.children;

  // Then return either an HTMLElement or HTMLCollection,
  // based on whether the input HTML had one or more roots.
  if (result.length === 1) return result[0];
  return result;
}

function makeCopyButtons() {
    clipboard = `
    <clipboard-copy aria-label="Copy" class="btn btn-invisible m-2 p-0 tooltipped-no-delay d-flex flex-justify-center flex-items-center" value="{0}" tabindex="0" role="button">
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy">
        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
      </svg>
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check color-fg-success d-none">
        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
      </svg>
    </clipboard-copy>
    `

    const blocks = document.querySelectorAll('div.highlighter-rouge>div.highlight');
    blocks.forEach((block) => {
        // Put this blocks content into the clipboard string
        block_clipboard = clipboard.format(block.textContent);
        // Make an html element from the block clipboard string
        block_clipboard_node = fromHTML(block_clipboard);
        // Add it in to the end of the html code block
        block.appendChild(block_clipboard_node);
    });
}

makeCopyButtons()

const CLIPBOARD_COPY_TIMER_DURATION = 2000;
function showSVG(svg) {
    svg.classList.remove('d-none');
}
function hideSVG(svg) {
    svg.classList.add('d-none');
}
function activateTooltip(button) {
    button.classList.add("tooltipped");
    button.classList.add("tooltipped-w");
    button.setAttribute("aria-label", "Copied!");
}
function deactivateTooltip(button) {
    button.classList.remove("tooltipped");
    button.classList.remove("tooltipped-w");
    button.setAttribute("aria-label", "Copy");
}
// Toggle a copy button.
function showCopy(button) {
    const [copyIcon, checkIcon] = button.querySelectorAll('.octicon');
    if (!copyIcon || !checkIcon)
        return;
    showSVG(copyIcon);
    hideSVG(checkIcon);
}
// Toggle a copy button.
function showCheck(button) {
    const [copyIcon, checkIcon] = button.querySelectorAll('.octicon');
    if (!copyIcon || !checkIcon)
        return;
    hideSVG(copyIcon);
    showSVG(checkIcon);
}
const clipboardCopyElementTimers = new WeakMap();
document.addEventListener('clipboard-copy', ({ target }) => {
    if (!(target instanceof HTMLElement))
        return;
    const currentTimeout = clipboardCopyElementTimers.get(target);
    if (currentTimeout) {
        clearTimeout(currentTimeout);
        clipboardCopyElementTimers.delete(target);
    }
    else {
        showCheck(target);
        activateTooltip(target);
    }
    clipboardCopyElementTimers.set(target, setTimeout(() => {
        showCopy(target);
        deactivateTooltip(target);
        clipboardCopyElementTimers.delete(target);
    }, CLIPBOARD_COPY_TIMER_DURATION));
});
