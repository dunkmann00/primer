var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ActionMenuElement_instances, _ActionMenuElement_abortController, _ActionMenuElement_originalLabel, _ActionMenuElement_inputName, _ActionMenuElement_invokerBeingClicked, _ActionMenuElement_softDisableItems, _ActionMenuElement_potentiallyDisallowActivation, _ActionMenuElement_isKeyboardActivation, _ActionMenuElement_isKeyboardActivationViaEnter, _ActionMenuElement_isKeyboardActivationViaSpace, _ActionMenuElement_isMouseActivation, _ActionMenuElement_isActivation, _ActionMenuElement_handleInvokerActivated, _ActionMenuElement_handleDialogItemActivated, _ActionMenuElement_handleItemActivated, _ActionMenuElement_activateItem, _ActionMenuElement_handleIncludeFragmentReplaced, _ActionMenuElement_handleFocusOut, _ActionMenuElement_show, _ActionMenuElement_hide, _ActionMenuElement_isOpen, _ActionMenuElement_setDynamicLabel, _ActionMenuElement_updateInput, _ActionMenuElement_firstItem_get;
import { controller, target } from '@github/catalyst';
import '@oddbird/popover-polyfill';
const validSelectors = ['[role="menuitem"]', '[role="menuitemcheckbox"]', '[role="menuitemradio"]'];
const menuItemSelectors = validSelectors.map(selector => `:not([hidden]) > ${selector}`);
let ActionMenuElement = class ActionMenuElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _ActionMenuElement_instances.add(this);
        _ActionMenuElement_abortController.set(this, void 0);
        _ActionMenuElement_originalLabel.set(this, '');
        _ActionMenuElement_inputName.set(this, '');
        _ActionMenuElement_invokerBeingClicked.set(this, false);
    }
    get selectVariant() {
        return this.getAttribute('data-select-variant');
    }
    set selectVariant(variant) {
        if (variant) {
            this.setAttribute('data-select-variant', variant);
        }
        else {
            this.removeAttribute('variant');
        }
    }
    get dynamicLabelPrefix() {
        const prefix = this.getAttribute('data-dynamic-label-prefix');
        if (!prefix)
            return '';
        return `${prefix}:`;
    }
    set dynamicLabelPrefix(value) {
        this.setAttribute('data-dynamic-label', value);
    }
    get dynamicLabel() {
        return this.hasAttribute('data-dynamic-label');
    }
    set dynamicLabel(value) {
        this.toggleAttribute('data-dynamic-label', value);
    }
    get popoverElement() {
        return this.invokerElement?.popoverTargetElement || null;
    }
    get invokerElement() {
        const id = this.querySelector('[role=menu]')?.id;
        if (!id)
            return null;
        for (const el of this.querySelectorAll(`[aria-controls]`)) {
            if (el.getAttribute('aria-controls') === id) {
                return el;
            }
        }
        return null;
    }
    get invokerLabel() {
        if (!this.invokerElement)
            return null;
        return this.invokerElement.querySelector('.Button-label');
    }
    get selectedItems() {
        const selectedItems = this.querySelectorAll('[aria-checked=true]');
        const results = [];
        for (const selectedItem of selectedItems) {
            const labelEl = selectedItem.querySelector('.ActionListItem-label');
            results.push({
                label: labelEl?.textContent,
                value: selectedItem?.getAttribute('data-value'),
                element: selectedItem,
            });
        }
        return results;
    }
    connectedCallback() {
        const { signal } = (__classPrivateFieldSet(this, _ActionMenuElement_abortController, new AbortController(), "f"));
        this.addEventListener('keydown', this, { signal });
        this.addEventListener('click', this, { signal });
        this.addEventListener('mouseover', this, { signal });
        this.addEventListener('focusout', this, { signal });
        this.addEventListener('mousedown', this, { signal });
        this.popoverElement?.addEventListener('toggle', this, { signal });
        __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_setDynamicLabel).call(this);
        __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_updateInput).call(this);
        __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_softDisableItems).call(this);
        if (this.includeFragment) {
            this.includeFragment.addEventListener('include-fragment-replaced', this, {
                signal,
            });
        }
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _ActionMenuElement_abortController, "f").abort();
    }
    handleEvent(event) {
        const targetIsInvoker = this.invokerElement?.contains(event.target);
        const eventIsActivation = __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_isActivation).call(this, event);
        if (event.type === 'toggle' && event.newState === 'open') {
            __classPrivateFieldGet(this, _ActionMenuElement_instances, "a", _ActionMenuElement_firstItem_get)?.focus();
        }
        if (targetIsInvoker && event.type === 'mousedown') {
            __classPrivateFieldSet(this, _ActionMenuElement_invokerBeingClicked, true, "f");
            return;
        }
        // Prevent safari bug that dismisses menu on mousedown instead of allowing
        // the click event to propagate to the button
        if (event.type === 'mousedown') {
            event.preventDefault();
            return;
        }
        if (targetIsInvoker && eventIsActivation) {
            __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_handleInvokerActivated).call(this, event);
            __classPrivateFieldSet(this, _ActionMenuElement_invokerBeingClicked, false, "f");
            return;
        }
        if (event.type === 'focusout') {
            if (__classPrivateFieldGet(this, _ActionMenuElement_invokerBeingClicked, "f"))
                return;
            // Give the browser time to focus the next element
            requestAnimationFrame(() => {
                if (!this.contains(document.activeElement) || document.activeElement === this.invokerElement) {
                    __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_handleFocusOut).call(this);
                }
            });
            return;
        }
        const item = event.target.closest(menuItemSelectors.join(','));
        const targetIsItem = item !== null;
        if (targetIsItem && eventIsActivation) {
            if (__classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_potentiallyDisallowActivation).call(this, event))
                return;
            const dialogInvoker = item.closest('[data-show-dialog-id]');
            if (dialogInvoker) {
                const dialog = this.ownerDocument.getElementById(dialogInvoker.getAttribute('data-show-dialog-id') || '');
                if (dialog && this.contains(dialogInvoker) && this.contains(dialog)) {
                    __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_handleDialogItemActivated).call(this, event, dialog);
                    return;
                }
            }
            __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_activateItem).call(this, event, item);
            __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_handleItemActivated).call(this, item);
            // Pressing the space key on a button or link will cause the page to scroll unless preventDefault()
            // is called. While calling preventDefault() appears to have no effect on link navigation, it skips
            // form submission. The code below therefore only calls preventDefault() if the button has been
            // activated by the space key, and manually submits the form if the button is a submit button.
            if (__classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_isKeyboardActivationViaSpace).call(this, event)) {
                event.preventDefault();
                if (item.getAttribute('type') === 'submit') {
                    item.closest('form')?.submit();
                }
            }
            return;
        }
        if (event.type === 'include-fragment-replaced') {
            __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_handleIncludeFragmentReplaced).call(this);
        }
    }
    get items() {
        return Array.from(this.querySelectorAll(menuItemSelectors.join(',')));
    }
    getItemById(itemId) {
        return this.querySelector(`li[data-item-id="${itemId}"`);
    }
    isItemDisabled(item) {
        if (item) {
            return item.classList.contains('ActionListItem--disabled');
        }
        else {
            return false;
        }
    }
    disableItem(item) {
        if (item) {
            item.classList.add('ActionListItem--disabled');
            item.querySelector('.ActionListContent').setAttribute('aria-disabled', 'true');
        }
    }
    enableItem(item) {
        if (item) {
            item.classList.remove('ActionListItem--disabled');
            item.querySelector('.ActionListContent').removeAttribute('aria-disabled');
        }
    }
    isItemHidden(item) {
        if (item) {
            return item.hasAttribute('hidden');
        }
        else {
            return false;
        }
    }
    hideItem(item) {
        if (item) {
            item.setAttribute('hidden', 'hidden');
        }
    }
    showItem(item) {
        if (item) {
            item.removeAttribute('hidden');
        }
    }
    isItemChecked(item) {
        if (item) {
            return item.querySelector('.ActionListContent').getAttribute('aria-checked') === 'true';
        }
        else {
            return false;
        }
    }
    checkItem(item) {
        if (item && (this.selectVariant === 'single' || this.selectVariant === 'multiple')) {
            const itemContent = item.querySelector('.ActionListContent');
            const ariaChecked = itemContent.getAttribute('aria-checked') === 'true';
            if (!ariaChecked) {
                __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_handleItemActivated).call(this, itemContent);
            }
        }
    }
    uncheckItem(item) {
        if (item && (this.selectVariant === 'single' || this.selectVariant === 'multiple')) {
            const itemContent = item.querySelector('.ActionListContent');
            const ariaChecked = itemContent.getAttribute('aria-checked') === 'true';
            if (ariaChecked) {
                __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_handleItemActivated).call(this, itemContent);
            }
        }
    }
};
_ActionMenuElement_abortController = new WeakMap();
_ActionMenuElement_originalLabel = new WeakMap();
_ActionMenuElement_inputName = new WeakMap();
_ActionMenuElement_invokerBeingClicked = new WeakMap();
_ActionMenuElement_instances = new WeakSet();
_ActionMenuElement_softDisableItems = function _ActionMenuElement_softDisableItems() {
    const { signal } = __classPrivateFieldGet(this, _ActionMenuElement_abortController, "f");
    for (const item of this.querySelectorAll(validSelectors.join(','))) {
        item.addEventListener('click', __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_potentiallyDisallowActivation).bind(this), { signal });
        item.addEventListener('keydown', __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_potentiallyDisallowActivation).bind(this), { signal });
    }
};
_ActionMenuElement_potentiallyDisallowActivation = function _ActionMenuElement_potentiallyDisallowActivation(event) {
    if (!__classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_isActivation).call(this, event))
        return false;
    const item = event.target.closest(menuItemSelectors.join(','));
    if (!item)
        return false;
    if (item.getAttribute('aria-disabled')) {
        event.preventDefault();
        /* eslint-disable-next-line no-restricted-syntax */
        event.stopPropagation();
        /* eslint-disable-next-line no-restricted-syntax */
        event.stopImmediatePropagation();
        return true;
    }
    return false;
};
_ActionMenuElement_isKeyboardActivation = function _ActionMenuElement_isKeyboardActivation(event) {
    return __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_isKeyboardActivationViaEnter).call(this, event) || __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_isKeyboardActivationViaSpace).call(this, event);
};
_ActionMenuElement_isKeyboardActivationViaEnter = function _ActionMenuElement_isKeyboardActivationViaEnter(event) {
    return (event instanceof KeyboardEvent &&
        event.type === 'keydown' &&
        !(event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) &&
        event.key === 'Enter');
};
_ActionMenuElement_isKeyboardActivationViaSpace = function _ActionMenuElement_isKeyboardActivationViaSpace(event) {
    return (event instanceof KeyboardEvent &&
        event.type === 'keydown' &&
        !(event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) &&
        event.key === ' ');
};
_ActionMenuElement_isMouseActivation = function _ActionMenuElement_isMouseActivation(event) {
    return event instanceof MouseEvent && event.type === 'click';
};
_ActionMenuElement_isActivation = function _ActionMenuElement_isActivation(event) {
    return __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_isMouseActivation).call(this, event) || __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_isKeyboardActivation).call(this, event);
};
_ActionMenuElement_handleInvokerActivated = function _ActionMenuElement_handleInvokerActivated(event) {
    event.preventDefault();
    /* eslint-disable-next-line no-restricted-syntax */
    event.stopPropagation();
    if (__classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_isOpen).call(this)) {
        __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_hide).call(this);
    }
    else {
        __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_show).call(this);
    }
};
_ActionMenuElement_handleDialogItemActivated = function _ActionMenuElement_handleDialogItemActivated(event, dialog) {
    this.querySelector('.ActionListWrap').style.display = 'none';
    const dialog_controller = new AbortController();
    const { signal } = dialog_controller;
    const handleDialogClose = () => {
        dialog_controller.abort();
        this.querySelector('.ActionListWrap').style.display = '';
        if (__classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_isOpen).call(this)) {
            __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_hide).call(this);
        }
        const activeElement = this.ownerDocument.activeElement;
        const lostFocus = this.ownerDocument.activeElement === this.ownerDocument.body;
        const focusInClosedMenu = this.contains(activeElement);
        if (lostFocus || focusInClosedMenu) {
            setTimeout(() => this.invokerElement?.focus(), 0);
        }
    };
    // a modal <dialog> element will close all popovers
    dialog.addEventListener('close', handleDialogClose, { signal });
    dialog.addEventListener('cancel', handleDialogClose, { signal });
};
_ActionMenuElement_handleItemActivated = function _ActionMenuElement_handleItemActivated(item) {
    // Hide popover after current event loop to prevent changes in focus from
    // altering the target of the event. Not doing this specifically affects
    // <a> tags. It causes the event to be sent to the currently focused element
    // instead of the anchor, which effectively prevents navigation, i.e. it
    // appears as if hitting enter does nothing. Curiously, clicking instead
    // works fine.
    if (this.selectVariant !== 'multiple') {
        setTimeout(() => {
            if (__classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_isOpen).call(this)) {
                __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_hide).call(this);
            }
        });
    }
    // The rest of the code below deals with single/multiple selection behavior, and should not
    // interfere with events fired by menu items whose behavior is specified outside the library.
    if (this.selectVariant !== 'multiple' && this.selectVariant !== 'single')
        return;
    const ariaChecked = item.getAttribute('aria-checked');
    const checked = ariaChecked !== 'true';
    if (this.selectVariant === 'single') {
        // Only check, never uncheck here. Single-select mode does not allow unchecking a checked item.
        if (checked) {
            item.setAttribute('aria-checked', 'true');
        }
        for (const checkedItem of this.querySelectorAll('[aria-checked]')) {
            if (checkedItem !== item) {
                checkedItem.setAttribute('aria-checked', 'false');
            }
        }
        __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_setDynamicLabel).call(this);
    }
    else {
        // multi-select mode allows unchecking a checked item
        item.setAttribute('aria-checked', `${checked}`);
    }
    __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_updateInput).call(this);
    this.dispatchEvent(new CustomEvent('itemActivated', {
        detail: { item: item.parentElement, checked: this.isItemChecked(item.parentElement) },
    }));
};
_ActionMenuElement_activateItem = function _ActionMenuElement_activateItem(event, item) {
    const eventWillActivateByDefault = (event instanceof MouseEvent && event.type === 'click') ||
        (event instanceof KeyboardEvent &&
            event.type === 'keydown' &&
            !(event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) &&
            event.key === 'Enter');
    // if the event will result in activating the current item by default, i.e. is a
    // mouse click or keyboard enter, bail out
    if (eventWillActivateByDefault)
        return;
    // otherwise, event will not result in activation by default, so we stop it and
    // simulate a click
    /* eslint-disable-next-line no-restricted-syntax */
    event.stopPropagation();
    const elem = item;
    elem.click();
};
_ActionMenuElement_handleIncludeFragmentReplaced = function _ActionMenuElement_handleIncludeFragmentReplaced() {
    if (__classPrivateFieldGet(this, _ActionMenuElement_instances, "a", _ActionMenuElement_firstItem_get))
        __classPrivateFieldGet(this, _ActionMenuElement_instances, "a", _ActionMenuElement_firstItem_get).focus();
    __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_softDisableItems).call(this);
};
_ActionMenuElement_handleFocusOut = function _ActionMenuElement_handleFocusOut() {
    __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_hide).call(this);
};
_ActionMenuElement_show = function _ActionMenuElement_show() {
    this.popoverElement?.showPopover();
};
_ActionMenuElement_hide = function _ActionMenuElement_hide() {
    this.popoverElement?.hidePopover();
};
_ActionMenuElement_isOpen = function _ActionMenuElement_isOpen() {
    return this.popoverElement?.matches(':popover-open');
};
_ActionMenuElement_setDynamicLabel = function _ActionMenuElement_setDynamicLabel() {
    if (!this.dynamicLabel)
        return;
    const invokerLabel = this.invokerLabel;
    if (!invokerLabel)
        return;
    __classPrivateFieldSet(this, _ActionMenuElement_originalLabel, __classPrivateFieldGet(this, _ActionMenuElement_originalLabel, "f") || (invokerLabel.textContent || ''), "f");
    const itemLabel = this.querySelector('[aria-checked=true] .ActionListItem-label');
    if (itemLabel && this.dynamicLabel) {
        const prefixSpan = document.createElement('span');
        prefixSpan.classList.add('color-fg-muted');
        const contentSpan = document.createElement('span');
        prefixSpan.textContent = this.dynamicLabelPrefix;
        contentSpan.textContent = itemLabel.textContent || '';
        invokerLabel.replaceChildren(prefixSpan, contentSpan);
    }
    else {
        invokerLabel.textContent = __classPrivateFieldGet(this, _ActionMenuElement_originalLabel, "f");
    }
};
_ActionMenuElement_updateInput = function _ActionMenuElement_updateInput() {
    if (this.selectVariant === 'single') {
        const input = this.querySelector(`[data-list-inputs=true] input`);
        if (!input)
            return;
        const selectedItem = this.selectedItems[0];
        if (selectedItem) {
            input.value = (selectedItem.value || selectedItem.label || '').trim();
            input.removeAttribute('disabled');
        }
        else {
            input.setAttribute('disabled', 'disabled');
        }
    }
    else if (this.selectVariant !== 'none') {
        // multiple select variant
        const inputList = this.querySelector('[data-list-inputs=true]');
        if (!inputList)
            return;
        const inputs = inputList.querySelectorAll('input');
        if (inputs.length > 0) {
            __classPrivateFieldSet(this, _ActionMenuElement_inputName, __classPrivateFieldGet(this, _ActionMenuElement_inputName, "f") || inputs[0].name, "f");
        }
        for (const selectedItem of this.selectedItems) {
            const newInput = document.createElement('input');
            newInput.setAttribute('data-list-input', 'true');
            newInput.type = 'hidden';
            newInput.autocomplete = 'off';
            newInput.name = __classPrivateFieldGet(this, _ActionMenuElement_inputName, "f");
            newInput.value = (selectedItem.value || selectedItem.label || '').trim();
            inputList.append(newInput);
        }
        for (const input of inputs) {
            input.remove();
        }
    }
};
_ActionMenuElement_firstItem_get = function _ActionMenuElement_firstItem_get() {
    return this.querySelector(menuItemSelectors.join(','));
};
__decorate([
    target
], ActionMenuElement.prototype, "includeFragment", void 0);
ActionMenuElement = __decorate([
    controller
], ActionMenuElement);
export { ActionMenuElement };
if (!window.customElements.get('action-menu')) {
    window.ActionMenuElement = ActionMenuElement;
    window.customElements.define('action-menu', ActionMenuElement);
}
