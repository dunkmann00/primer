import './github-clipboard-copy-element.js';

function makeCopyButtons() {
    const clipboardTemplate = document.getElementById("clipboard_template");

    const blocks = document.querySelectorAll('div.highlighter-rouge>div.highlight');
    blocks.forEach((block) => {
        //Create DOM node
        const clipboardNode = clipboardTemplate.content.cloneNode(true);
        // Put this block's content into the clipboard-copy element's value
        clipboardNode.querySelector("clipboard-copy").setAttribute("value", block.textContent);
        // Add it in to the end of the html code block
        block.appendChild(clipboardNode);
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
