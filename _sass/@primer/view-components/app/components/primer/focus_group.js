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
var _FocusGroupElement_instances, _FocusGroupElement_abortController, _FocusGroupElement_items_get;
import '@oddbird/popover-polyfill';
const menuItemSelector = '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]';
const popoverSelector = (() => {
    try {
        document.querySelector(':open');
        return ':open';
    }
    catch (_a) {
        return '.\\:open';
    }
})();
const getMnemonicFor = (item) => { var _a; return (_a = item.textContent) === null || _a === void 0 ? void 0 : _a.trim()[0].toLowerCase(); };
const printable = /^\S$/;
export default class FocusGroupElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _FocusGroupElement_instances.add(this);
        _FocusGroupElement_abortController.set(this, null);
    }
    get nowrap() {
        return this.hasAttribute('nowrap');
    }
    set nowrap(value) {
        this.toggleAttribute('nowrap', value);
    }
    get direction() {
        if (this.getAttribute('direction') === 'horizontal')
            return 'horizontal';
        return 'vertical';
    }
    set direction(value) {
        this.setAttribute('direction', `${value}`);
    }
    get retain() {
        return this.hasAttribute('retain');
    }
    set retain(value) {
        this.toggleAttribute('retain', value);
    }
    get mnemonics() {
        return this.hasAttribute('mnemonics');
    }
    connectedCallback() {
        __classPrivateFieldSet(this, _FocusGroupElement_abortController, new AbortController(), "f");
        const { signal } = __classPrivateFieldGet(this, _FocusGroupElement_abortController, "f");
        this.addEventListener('keydown', this, { signal });
        this.addEventListener('click', this, { signal });
        this.addEventListener('mouseover', this, { signal });
        this.addEventListener('focusin', this, { signal });
    }
    disconnectedCallback() {
        var _a;
        (_a = __classPrivateFieldGet(this, _FocusGroupElement_abortController, "f")) === null || _a === void 0 ? void 0 : _a.abort();
    }
    handleEvent(event) {
        const { direction, nowrap } = this;
        if (event.type === 'focusin') {
            if (this.retain && event.target instanceof Element && event.target.matches(menuItemSelector)) {
                for (const item of __classPrivateFieldGet(this, _FocusGroupElement_instances, "a", _FocusGroupElement_items_get)) {
                    item.setAttribute('tabindex', item === event.target ? '0' : '-1');
                }
            }
        }
        else if (event instanceof KeyboardEvent) {
            const items = Array.from(__classPrivateFieldGet(this, _FocusGroupElement_instances, "a", _FocusGroupElement_items_get));
            let index = items.indexOf(event.target);
            const key = event.key;
            if (key === 'Up' || key === 'ArrowUp') {
                if (direction === 'vertical' || direction === 'both') {
                    index -= index < 0 ? 0 : 1;
                }
            }
            else if (key === 'Down' || key === 'ArrowDown') {
                if (direction === 'vertical' || direction === 'both') {
                    index += 1;
                }
            }
            else if (event.key === 'Left' || event.key === 'ArrowLeft') {
                if (direction === 'horizontal' || direction === 'both') {
                    index -= 1;
                }
            }
            else if (event.key === 'Right' || event.key === 'ArrowRight') {
                if (direction === 'horizontal' || direction === 'both') {
                    index += 1;
                }
            }
            else if (event.key === 'Home' || event.key === 'PageUp') {
                index = 0;
            }
            else if (event.key === 'End' || event.key === 'PageDown') {
                index = items.length - 1;
            }
            else if (this.mnemonics && printable.test(key)) {
                const mnemonic = key.toLowerCase();
                const offset = index > 0 && getMnemonicFor(event.target) === mnemonic ? index : 0;
                index = items.findIndex((item, i) => i > offset && getMnemonicFor(item) === mnemonic);
                if (index < 0 && !nowrap) {
                    index = items.findIndex(item => getMnemonicFor(item) === mnemonic);
                }
            }
            else {
                return;
            }
            if (nowrap && index < 0)
                index = 0;
            if (!nowrap && index >= items.length)
                index = 0;
            const focusEl = items.at(Math.min(index, items.length - 1));
            {
                let el = focusEl;
                do {
                    el = el.closest(`[popover]:not(${popoverSelector})`);
                    if ((el === null || el === void 0 ? void 0 : el.popover) === 'auto') {
                        el.showPopover();
                    }
                    else {
                        el = (el === null || el === void 0 ? void 0 : el.parentElement) || null;
                    }
                } while (el);
            }
            focusEl === null || focusEl === void 0 ? void 0 : focusEl.focus();
        }
    }
}
_FocusGroupElement_abortController = new WeakMap(), _FocusGroupElement_instances = new WeakSet(), _FocusGroupElement_items_get = function _FocusGroupElement_items_get() {
    return this.querySelectorAll(menuItemSelector);
};
if (!customElements.get('focus-group')) {
    window.FocusGroupElement = FocusGroupElement;
    customElements.define('focus-group', FocusGroupElement);
}
