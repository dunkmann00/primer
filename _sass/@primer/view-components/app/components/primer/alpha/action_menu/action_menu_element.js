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
var _ActionMenuElement_instances, _ActionMenuElement_abortController, _ActionMenuElement_originalLabel, _ActionMenuElement_inputName, _ActionMenuElement_setDynamicLabel, _ActionMenuElement_updateInput, _ActionMenuElement_isEnterKeydown, _ActionMenuElement_firstItem_get;
import '@github/include-fragment-element';
const popoverSelector = (() => {
    try {
        document.querySelector(':open');
        return ':open';
    }
    catch (_a) {
        return '.\\:open';
    }
})();
const menuItemSelectors = ['[role="menuitem"]', '[role="menuitemcheckbox"]', '[role="menuitemradio"]'];
export class ActionMenuElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _ActionMenuElement_instances.add(this);
        _ActionMenuElement_abortController.set(this, void 0);
        _ActionMenuElement_originalLabel.set(this, '');
        _ActionMenuElement_inputName.set(this, '');
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
        return this.querySelector('[popover]');
    }
    get invokerElement() {
        var _a;
        const id = (_a = this.querySelector('[role=menu]')) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            return null;
        for (const el of this.querySelectorAll(`[aria-controls]`)) {
            if (el.getAttribute('aria-controls') === id)
                return el;
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
                label: labelEl === null || labelEl === void 0 ? void 0 : labelEl.textContent,
                value: selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.getAttribute('data-value'),
                element: selectedItem
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
        __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_setDynamicLabel).call(this);
        __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_updateInput).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _ActionMenuElement_abortController, "f").abort();
    }
    handleEvent(event) {
        var _a, _b, _c, _d;
        if (event.target === this.invokerElement && __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_isEnterKeydown).call(this, event)) {
            if (__classPrivateFieldGet(this, _ActionMenuElement_instances, "a", _ActionMenuElement_firstItem_get)) {
                event.preventDefault();
                (_a = this.popoverElement) === null || _a === void 0 ? void 0 : _a.showPopover();
                __classPrivateFieldGet(this, _ActionMenuElement_instances, "a", _ActionMenuElement_firstItem_get).focus();
                return;
            }
        }
        if (!((_b = this.popoverElement) === null || _b === void 0 ? void 0 : _b.matches(popoverSelector)))
            return;
        if (event.type === 'focusout' && !this.contains(event.relatedTarget)) {
            (_c = this.popoverElement) === null || _c === void 0 ? void 0 : _c.hidePopover();
        }
        else if (__classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_isEnterKeydown).call(this, event) || (event instanceof MouseEvent && event.type === 'click')) {
            const item = (_d = event.target.closest(menuItemSelectors.join(','))) === null || _d === void 0 ? void 0 : _d.closest('li');
            if (!item)
                return;
            const ariaChecked = item.getAttribute('aria-checked');
            const checked = ariaChecked !== 'true';
            item.setAttribute('aria-checked', `${checked}`);
            if (this.selectVariant === 'single') {
                const selector = menuItemSelectors.map(s => `li[aria-checked] ${s}`).join(',');
                for (const checkedItemContent of this.querySelectorAll(selector)) {
                    const checkedItem = checkedItemContent.closest('li');
                    if (checkedItem !== item) {
                        checkedItem.setAttribute('aria-checked', 'false');
                    }
                }
                __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_setDynamicLabel).call(this);
            }
            __classPrivateFieldGet(this, _ActionMenuElement_instances, "m", _ActionMenuElement_updateInput).call(this);
            if (event instanceof KeyboardEvent && event.target instanceof HTMLButtonElement) {
                // prevent buttons from being clicked twice
                event.preventDefault();
            }
            // Hide popover after current event loop to prevent changes in focus from
            // altering the target of the event. Not doing this specifically affects
            // <a> tags. It causes the event to be sent to the currently focused element
            // instead of the anchor, which effectively prevents navigation, i.e. it
            // appears as if hitting enter does nothing. Curiously, clicking instead
            // works fine.
            if (this.selectVariant !== 'multiple') {
                setTimeout(() => { var _a; return (_a = this.popoverElement) === null || _a === void 0 ? void 0 : _a.hidePopover(); });
            }
        }
    }
}
_ActionMenuElement_abortController = new WeakMap(), _ActionMenuElement_originalLabel = new WeakMap(), _ActionMenuElement_inputName = new WeakMap(), _ActionMenuElement_instances = new WeakSet(), _ActionMenuElement_setDynamicLabel = function _ActionMenuElement_setDynamicLabel() {
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
}, _ActionMenuElement_updateInput = function _ActionMenuElement_updateInput() {
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
}, _ActionMenuElement_isEnterKeydown = function _ActionMenuElement_isEnterKeydown(event) {
    return (event instanceof KeyboardEvent &&
        event.type === 'keydown' &&
        !(event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) &&
        event.key === 'Enter');
}, _ActionMenuElement_firstItem_get = function _ActionMenuElement_firstItem_get() {
    return this.querySelector(menuItemSelectors.join(','));
};
if (!window.customElements.get('action-menu')) {
    window.ActionMenuElement = ActionMenuElement;
    window.customElements.define('action-menu', ActionMenuElement);
}
