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
var _ModalDialogElement_instances, _ModalDialogElement_focusAbortController, _ModalDialogElement_overlayBackdrop_get, _ModalDialogElement_keydown;
import { focusTrap } from '@primer/behaviors';
import { getFocusableChild } from '@primer/behaviors/utils';
function focusIfNeeded(elem) {
    if (document.activeElement !== elem) {
        elem?.focus();
    }
}
const overlayStack = [];
function clickHandler(event) {
    const target = event.target;
    const button = target?.closest('button');
    if (!button || button.hasAttribute('disabled') || button.getAttribute('aria-disabled') === 'true')
        return;
    // If the user is clicking a valid dialog trigger
    let dialogId = button?.getAttribute('data-show-dialog-id');
    if (dialogId) {
        /* eslint-disable-next-line no-restricted-syntax */
        event.stopPropagation();
        const dialog = document.getElementById(dialogId);
        if (dialog instanceof ModalDialogElement) {
            dialog.openButton = button;
            dialog.show();
            // A buttons default behaviour in some browsers it to send a pointer event
            // If the behaviour is allowed through the dialog will be shown but then
            // quickly hidden- as if it were never shown. This prevents that.
            event.preventDefault();
            return;
        }
    }
    if (!overlayStack.length)
        return;
    dialogId = button.getAttribute('data-close-dialog-id') || button.getAttribute('data-submit-dialog-id');
    if (dialogId) {
        const dialog = document.getElementById(dialogId);
        if (dialog instanceof ModalDialogElement) {
            const dialogIndex = overlayStack.findIndex(ele => ele.id === dialogId);
            overlayStack.splice(dialogIndex, 1);
            dialog.close(button.hasAttribute('data-submit-dialog-id'));
        }
    }
}
function keydownHandler(event) {
    if (!(event instanceof KeyboardEvent) ||
        event.type !== 'keydown' ||
        event.key !== 'Enter' ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.shiftKey)
        return;
    clickHandler(event);
}
function mousedownHandler(event) {
    const target = event.target;
    if (target?.closest('button'))
        return;
    // Find the top level dialog that is open.
    const topLevelDialog = overlayStack[overlayStack.length - 1];
    if (!topLevelDialog)
        return;
    // Check if the mousedown happened outside the boundary of the top level dialog
    const mouseDownOutsideDialog = !target.closest(`#${topLevelDialog.getAttribute('id')}`);
    // Only close dialog if it's a click outside the dialog and the dialog has a button?
    if (mouseDownOutsideDialog) {
        target.ownerDocument.addEventListener('mouseup', (upEvent) => {
            if (upEvent.target === target) {
                overlayStack.pop();
                topLevelDialog.close();
            }
        }, { once: true });
    }
}
export class ModalDialogElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _ModalDialogElement_instances.add(this);
        //TODO: Do we remove the abortController from focusTrap?
        _ModalDialogElement_focusAbortController.set(this, new AbortController());
    }
    get open() {
        return this.hasAttribute('open');
    }
    set open(value) {
        if (value) {
            if (this.open)
                return;
            this.setAttribute('open', '');
            this.setAttribute('aria-disabled', 'false');
            document.body.style.paddingRight = `${window.innerWidth - document.body.clientWidth}px`;
            document.body.style.overflow = 'hidden';
            __classPrivateFieldGet(this, _ModalDialogElement_instances, "a", _ModalDialogElement_overlayBackdrop_get)?.classList.remove('Overlay--hidden');
            if (__classPrivateFieldGet(this, _ModalDialogElement_focusAbortController, "f").signal.aborted) {
                __classPrivateFieldSet(this, _ModalDialogElement_focusAbortController, new AbortController(), "f");
            }
            focusTrap(this, this.querySelector('[autofocus]'), __classPrivateFieldGet(this, _ModalDialogElement_focusAbortController, "f").signal);
            overlayStack.push(this);
        }
        else {
            if (!this.open)
                return;
            this.removeAttribute('open');
            this.setAttribute('aria-disabled', 'true');
            __classPrivateFieldGet(this, _ModalDialogElement_instances, "a", _ModalDialogElement_overlayBackdrop_get)?.classList.add('Overlay--hidden');
            document.body.style.paddingRight = '0';
            document.body.style.overflow = 'initial';
            __classPrivateFieldGet(this, _ModalDialogElement_focusAbortController, "f").abort();
            // if #openButton is a child of a menu, we need to focus a suitable child of the menu
            // element since it is expected for the menu to close on click
            const menu = this.openButton?.closest('details') || this.openButton?.closest('action-menu');
            if (menu) {
                focusIfNeeded(getFocusableChild(menu));
            }
            else {
                focusIfNeeded(this.openButton);
            }
            this.openButton = null;
        }
    }
    get showButtons() {
        // Dialogs may also be opened from any arbitrary button with a matching show-dialog-id data attribute
        return document.querySelectorAll(`button[data-show-dialog-id='${this.id}']`);
    }
    connectedCallback() {
        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'dialog');
        document.addEventListener('click', clickHandler);
        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('mousedown', mousedownHandler);
        this.addEventListener('keydown', e => __classPrivateFieldGet(this, _ModalDialogElement_instances, "m", _ModalDialogElement_keydown).call(this, e));
    }
    show() {
        this.open = true;
    }
    close(closedNotCancelled = false) {
        if (this.open === false)
            return;
        const eventType = closedNotCancelled ? 'close' : 'cancel';
        const dialogEvent = new Event(eventType);
        this.dispatchEvent(dialogEvent);
        this.open = false;
    }
}
_ModalDialogElement_focusAbortController = new WeakMap(), _ModalDialogElement_instances = new WeakSet(), _ModalDialogElement_overlayBackdrop_get = function _ModalDialogElement_overlayBackdrop_get() {
    if (this.parentElement?.hasAttribute('data-modal-dialog-overlay')) {
        return this.parentElement;
    }
    return null;
}, _ModalDialogElement_keydown = function _ModalDialogElement_keydown(event) {
    if (!(event instanceof KeyboardEvent))
        return;
    if (event.isComposing)
        return;
    if (!this.open)
        return;
    switch (event.key) {
        case 'Escape':
            this.close();
            event.preventDefault();
            /* eslint-disable-next-line no-restricted-syntax */
            event.stopPropagation();
            break;
        case 'Enter': {
            const target = event.target;
            if (target.getAttribute('data-close-dialog-id') === this.id) {
                /* eslint-disable-next-line no-restricted-syntax */
                event.stopPropagation();
            }
            break;
        }
    }
};
if (!window.customElements.get('modal-dialog')) {
    window.ModalDialogElement = ModalDialogElement;
    window.customElements.define('modal-dialog', ModalDialogElement);
}
