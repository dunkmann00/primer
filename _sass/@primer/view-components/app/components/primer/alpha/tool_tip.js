var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ToolTipElement_instances, _ToolTipElement_abortController, _ToolTipElement_align, _ToolTipElement_side, _ToolTipElement_allowUpdatePosition, _ToolTipElement_showReason, _ToolTipElement_update, _ToolTipElement_updateControlReference, _ToolTipElement_updateDirection, _ToolTipElement_updatePosition;
import '@oddbird/popover-polyfill';
import { getAnchoredPosition } from '@primer/behaviors';
const isPopoverOpen = (() => {
    let selector;
    function setSelector(el) {
        try {
            selector = ':popover-open';
            return el.matches(selector);
        }
        catch {
            try {
                selector = ':open';
                return el.matches(':open');
            }
            catch {
                selector = '.\\:popover-open';
                return el.matches('.\\:popover-open');
            }
        }
    }
    return (el) => (selector ? el.matches(selector) : setSelector(el));
})();
const TOOLTIP_ARROW_EDGE_OFFSET = 6;
const TOOLTIP_SR_ONLY_CLASS = 'sr-only';
const TOOLTIP_OFFSET = 10;
const DIRECTION_CLASSES = [
    'tooltip-n',
    'tooltip-s',
    'tooltip-e',
    'tooltip-w',
    'tooltip-ne',
    'tooltip-se',
    'tooltip-nw',
    'tooltip-sw',
];
function closeOpenTooltips(except) {
    for (const tooltip of openTooltips) {
        if (tooltip === except)
            continue;
        if (isPopoverOpen(tooltip)) {
            tooltip.hidePopover();
        }
        else {
            openTooltips.delete(tooltip);
        }
    }
}
function focusOutListener() {
    closeOpenTooltips();
}
function focusInListener(event) {
    setTimeout(() => {
        for (const tooltip of openTooltips) {
            if (isPopoverOpen(tooltip) && tooltip.showReason === 'focus' && tooltip.control !== event.target) {
                tooltip.hidePopover();
            }
        }
    }, 0);
}
const tooltips = new Set();
const openTooltips = new Set();
class ToolTipElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _ToolTipElement_instances.add(this);
        _ToolTipElement_abortController.set(this, void 0);
        _ToolTipElement_align.set(this, 'center');
        _ToolTipElement_side.set(this, 'outside-bottom');
        _ToolTipElement_allowUpdatePosition.set(this, false);
        _ToolTipElement_showReason.set(this, 'mouse');
    }
    styles() {
        return `
      :host {
        padding: var(--overlay-paddingBlock-condensed) var(--overlay-padding-condensed) !important;
        font: var(--text-body-shorthand-small);
        color: var(--fgColor-onEmphasis, var(--color-fg-on-emphasis)) !important;
        text-align: center;
        text-decoration: none;
        text-shadow: none;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: break-word;
        white-space: pre;
        background: var(--bgColor-emphasis, var(--color-neutral-emphasis-plus)) !important;
        border-radius: var(--borderRadius-medium);
        border: 0 !important;
        opacity: 0;
        max-width: var(--overlay-width-small);
        word-wrap: break-word;
        white-space: normal;
        width: max-content !important;
        inset: var(--tool-tip-position-top, 0) auto auto var(--tool-tip-position-left, 0) !important;
        overflow: visible !important;
        text-wrap: balance;
      }

      :host:before{
        position: absolute;
        z-index: 1000001;
        color: var(--bgColor-emphasis, var(--color-neutral-emphasis-plus));
        content: "";
        border: 6px solid transparent;
        opacity: 0;
      }

      @keyframes tooltip-appear {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      :host:after{
        position: absolute;
        display: block;
        right: 0;
        left: 0;
        height: 12px;
        content: "";
      }

      :host(:popover-open),
      :host(:popover-open):before {
        animation-name: tooltip-appear;
        animation-duration: .1s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-in;
      }

      :host(.\\:popover-open),
      :host(.\\:popover-open):before {
        animation-name: tooltip-appear;
        animation-duration: .1s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-in;
        animation-delay: .4s;
      }

      :host(.tooltip-s):before,
      :host(.tooltip-n):before {
        right: 50%;
        margin-right: -${TOOLTIP_ARROW_EDGE_OFFSET}px;
      }
      :host(.tooltip-s):before,
      :host(.tooltip-se):before,
      :host(.tooltip-sw):before {
        bottom: 100%;
        border-bottom-color: var(--bgColor-emphasis, var(--color-neutral-emphasis-plus));
      }
      :host(.tooltip-s):after,
      :host(.tooltip-se):after,
      :host(.tooltip-sw):after {
        bottom: 100%
      }
      :host(.tooltip-n):before,
      :host(.tooltip-ne):before,
      :host(.tooltip-nw):before {
        top: 100%;
        border-top-color: var(--bgColor-emphasis, var(--color-neutral-emphasis-plus));
      }
      :host(.tooltip-n):after,
      :host(.tooltip-ne):after,
      :host(.tooltip-nw):after {
        top: 100%;
      }
      :host(.tooltip-se):before,
      :host(.tooltip-ne):before {
        left: 0;
        margin-left: ${TOOLTIP_ARROW_EDGE_OFFSET}px;
      }
      :host(.tooltip-sw):before,
      :host(.tooltip-nw):before {
        right: 0;
        margin-right: ${TOOLTIP_ARROW_EDGE_OFFSET}px;
      }
      :host(.tooltip-w):before {
        top: 50%;
        bottom: 50%;
        left: 100%;
        margin-top: -6px;
        border-left-color: var(--bgColor-emphasis, var(--color-neutral-emphasis-plus));
      }
      :host(.tooltip-e):before {
        top: 50%;
        right: 100%;
        bottom: 50%;
        margin-top: -6px;
        border-right-color: var(--bgColor-emphasis, var(--color-neutral-emphasis-plus));
      }

      @media (forced-colors: active) {
        :host {
          outline: solid 1px transparent;
        }

        :host:before {
          display: none;
        }
      }
    `;
    }
    get showReason() {
        return __classPrivateFieldGet(this, _ToolTipElement_showReason, "f");
    }
    get htmlFor() {
        return this.getAttribute('for') || '';
    }
    set htmlFor(value) {
        this.setAttribute('for', value);
    }
    get type() {
        const type = this.getAttribute('data-type');
        return type === 'label' ? 'label' : 'description';
    }
    set type(value) {
        this.setAttribute('data-type', value);
    }
    get direction() {
        return (this.getAttribute('data-direction') || 's');
    }
    set direction(value) {
        this.setAttribute('data-direction', value);
    }
    get control() {
        return this.ownerDocument.getElementById(this.htmlFor);
    }
    /* @deprecated */
    set hiddenFromView(value) {
        if (value && isPopoverOpen(this)) {
            this.hidePopover();
        }
        else if (!value && !isPopoverOpen(this)) {
            this.showPopover();
        }
    }
    /* @deprecated */
    get hiddenFromView() {
        return !isPopoverOpen(this);
    }
    connectedCallback() {
        tooltips.add(this);
        __classPrivateFieldGet(this, _ToolTipElement_instances, "m", _ToolTipElement_updateControlReference).call(this);
        __classPrivateFieldGet(this, _ToolTipElement_instances, "m", _ToolTipElement_updateDirection).call(this);
        if (!this.shadowRoot) {
            const shadow = this.attachShadow({ mode: 'open' });
            const style = shadow.appendChild(document.createElement('style'));
            style.textContent = this.styles();
            shadow.appendChild(document.createElement('slot'));
        }
        __classPrivateFieldGet(this, _ToolTipElement_instances, "m", _ToolTipElement_update).call(this, false);
        __classPrivateFieldSet(this, _ToolTipElement_allowUpdatePosition, true, "f");
        if (!this.control)
            return;
        this.setAttribute('role', 'tooltip');
        __classPrivateFieldGet(this, _ToolTipElement_abortController, "f")?.abort();
        __classPrivateFieldSet(this, _ToolTipElement_abortController, new AbortController(), "f");
        const { signal } = __classPrivateFieldGet(this, _ToolTipElement_abortController, "f");
        this.addEventListener('mouseleave', this, { signal });
        this.addEventListener('toggle', this, { signal });
        this.control.addEventListener('mouseenter', this, { signal });
        this.control.addEventListener('mouseleave', this, { signal });
        this.control.addEventListener('focus', this, { signal });
        this.control.addEventListener('mousedown', this, { signal });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore popoverTargetElement is not in the type definition
        this.control.popoverTargetElement?.addEventListener('beforetoggle', this, {
            signal,
        });
        this.ownerDocument.addEventListener('focusout', focusOutListener);
        this.ownerDocument.addEventListener('focusin', focusInListener);
        this.ownerDocument.addEventListener('keydown', this, { signal, capture: true });
    }
    disconnectedCallback() {
        tooltips.delete(this);
        openTooltips.delete(this);
        __classPrivateFieldGet(this, _ToolTipElement_abortController, "f")?.abort();
    }
    async handleEvent(event) {
        if (!this.control)
            return;
        const showing = isPopoverOpen(this);
        // Ensures that tooltip stays open when hovering between tooltip and element
        // WCAG Success Criterion 1.4.13 Hoverable
        const shouldShow = event.type === 'mouseenter' ||
            // Only show tooltip on focus if running in headless browser (for tests) or if focus ring
            // is visible (i.e. if user is using keyboard navigation)
            (event.type === 'focus' && (navigator.webdriver || this.control.matches(':focus-visible')));
        const isMouseLeaveFromButton = event.type === 'mouseleave' &&
            event.relatedTarget !== this.control &&
            event.relatedTarget !== this;
        const isEscapeKeydown = event.type === 'keydown' && event.key === 'Escape';
        const isMouseDownOnButton = event.type === 'mousedown' && event.currentTarget === this.control;
        const isOpeningOtherPopover = event.type === 'beforetoggle' && event.currentTarget !== this;
        const shouldHide = isMouseLeaveFromButton || isEscapeKeydown || isMouseDownOnButton || isOpeningOtherPopover;
        if (showing && isEscapeKeydown) {
            /* eslint-disable-next-line no-restricted-syntax */
            event.stopImmediatePropagation();
            event.preventDefault();
        }
        await Promise.resolve();
        if (!showing && shouldShow && !isPopoverOpen(this)) {
            __classPrivateFieldSet(this, _ToolTipElement_showReason, event.type === 'mouseenter' ? 'mouse' : 'focus', "f");
            this.showPopover();
        }
        else if (showing && shouldHide && isPopoverOpen(this)) {
            this.hidePopover();
        }
        if (event.type === 'toggle') {
            __classPrivateFieldGet(this, _ToolTipElement_instances, "m", _ToolTipElement_update).call(this, event.newState === 'open');
        }
    }
    attributeChangedCallback(name) {
        if (!this.isConnected)
            return;
        if (name === 'id' || name === 'data-type') {
            __classPrivateFieldGet(this, _ToolTipElement_instances, "m", _ToolTipElement_updateControlReference).call(this);
        }
        else if (name === 'data-direction') {
            __classPrivateFieldGet(this, _ToolTipElement_instances, "m", _ToolTipElement_updateDirection).call(this);
        }
    }
}
_ToolTipElement_abortController = new WeakMap(), _ToolTipElement_align = new WeakMap(), _ToolTipElement_side = new WeakMap(), _ToolTipElement_allowUpdatePosition = new WeakMap(), _ToolTipElement_showReason = new WeakMap(), _ToolTipElement_instances = new WeakSet(), _ToolTipElement_update = function _ToolTipElement_update(isOpen) {
    if (isOpen) {
        openTooltips.add(this);
        this.classList.remove(TOOLTIP_SR_ONLY_CLASS);
        closeOpenTooltips(this);
        __classPrivateFieldGet(this, _ToolTipElement_instances, "m", _ToolTipElement_updatePosition).call(this);
    }
    else {
        openTooltips.delete(this);
        this.classList.remove(...DIRECTION_CLASSES);
        this.classList.add(TOOLTIP_SR_ONLY_CLASS);
    }
}, _ToolTipElement_updateControlReference = function _ToolTipElement_updateControlReference() {
    if (!this.id || !this.control)
        return;
    if (this.type === 'label') {
        let labelledBy = this.control.getAttribute('aria-labelledby');
        if (labelledBy) {
            if (!labelledBy.split(' ').includes(this.id)) {
                labelledBy = `${labelledBy} ${this.id}`;
            }
            else {
                labelledBy = `${labelledBy}`;
            }
        }
        else {
            labelledBy = this.id;
        }
        this.control.setAttribute('aria-labelledby', labelledBy);
        // Prevent duplicate accessible name announcements.
        this.setAttribute('aria-hidden', 'true');
    }
    else {
        let describedBy = this.control.getAttribute('aria-describedby');
        if (describedBy) {
            if (!describedBy.split(' ').includes(this.id)) {
                describedBy = `${describedBy} ${this.id}`;
            }
            else {
                describedBy = `${describedBy}`;
            }
        }
        else {
            describedBy = this.id;
        }
        this.control.setAttribute('aria-describedby', describedBy);
    }
}, _ToolTipElement_updateDirection = function _ToolTipElement_updateDirection() {
    this.classList.remove(...DIRECTION_CLASSES);
    const direction = this.direction;
    if (direction === 'n') {
        __classPrivateFieldSet(this, _ToolTipElement_align, 'center', "f");
        __classPrivateFieldSet(this, _ToolTipElement_side, 'outside-top', "f");
    }
    else if (direction === 'ne') {
        __classPrivateFieldSet(this, _ToolTipElement_align, 'start', "f");
        __classPrivateFieldSet(this, _ToolTipElement_side, 'outside-top', "f");
    }
    else if (direction === 'e') {
        __classPrivateFieldSet(this, _ToolTipElement_align, 'center', "f");
        __classPrivateFieldSet(this, _ToolTipElement_side, 'outside-right', "f");
    }
    else if (direction === 'se') {
        __classPrivateFieldSet(this, _ToolTipElement_align, 'start', "f");
        __classPrivateFieldSet(this, _ToolTipElement_side, 'outside-bottom', "f");
    }
    else if (direction === 's') {
        __classPrivateFieldSet(this, _ToolTipElement_align, 'center', "f");
        __classPrivateFieldSet(this, _ToolTipElement_side, 'outside-bottom', "f");
    }
    else if (direction === 'sw') {
        __classPrivateFieldSet(this, _ToolTipElement_align, 'end', "f");
        __classPrivateFieldSet(this, _ToolTipElement_side, 'outside-bottom', "f");
    }
    else if (direction === 'w') {
        __classPrivateFieldSet(this, _ToolTipElement_align, 'center', "f");
        __classPrivateFieldSet(this, _ToolTipElement_side, 'outside-left', "f");
    }
    else if (direction === 'nw') {
        __classPrivateFieldSet(this, _ToolTipElement_align, 'end', "f");
        __classPrivateFieldSet(this, _ToolTipElement_side, 'outside-top', "f");
    }
}, _ToolTipElement_updatePosition = function _ToolTipElement_updatePosition() {
    if (!this.control)
        return;
    if (!__classPrivateFieldGet(this, _ToolTipElement_allowUpdatePosition, "f") || !isPopoverOpen(this))
        return;
    const position = getAnchoredPosition(this, this.control, {
        side: __classPrivateFieldGet(this, _ToolTipElement_side, "f"),
        align: __classPrivateFieldGet(this, _ToolTipElement_align, "f"),
        anchorOffset: TOOLTIP_OFFSET,
    });
    const anchorSide = position.anchorSide;
    const align = position.anchorAlign;
    this.style.setProperty('--tool-tip-position-top', `${position.top}px`);
    this.style.setProperty('--tool-tip-position-left', `${position.left}px`);
    let direction = 's';
    if (anchorSide === 'outside-left') {
        direction = 'w';
    }
    else if (anchorSide === 'outside-right') {
        direction = 'e';
    }
    else if (anchorSide === 'outside-top') {
        if (align === 'center') {
            direction = 'n';
        }
        else if (align === 'start') {
            direction = 'ne';
        }
        else {
            direction = 'nw';
        }
    }
    else {
        if (align === 'center') {
            direction = 's';
        }
        else if (align === 'start') {
            direction = 'se';
        }
        else {
            direction = 'sw';
        }
    }
    this.classList.add(`tooltip-${direction}`);
};
ToolTipElement.observedAttributes = ['data-type', 'data-direction', 'id'];
if (!window.customElements.get('tool-tip')) {
    window.ToolTipElement = ToolTipElement;
    window.customElements.define('tool-tip', ToolTipElement);
}
