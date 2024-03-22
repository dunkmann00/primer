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
var _FocusGroupElement_instances, _FocusGroupElement_retainSignal, _FocusGroupElement_abortController, _FocusGroupElement_items_get;
import '@oddbird/popover-polyfill';
const validSelectors = ['[role="menuitem"]', '[role="menuitemcheckbox"]', '[role="menuitemradio"]'];
const menuItemSelector = validSelectors.map(selector => `:not([hidden]) > ${selector}`).join(', ');
const getMnemonicFor = (item) => item.textContent?.trim()[0].toLowerCase();
const printable = /^\S$/;
class FocusGroupElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _FocusGroupElement_instances.add(this);
        _FocusGroupElement_retainSignal.set(this, null);
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
        __classPrivateFieldGet(this, _FocusGroupElement_abortController, "f")?.abort();
    }
    handleEvent(event) {
        const { direction, nowrap } = this;
        if (event.type === 'focusin') {
            if (this.retain && event.target instanceof Element && event.target.matches(menuItemSelector)) {
                __classPrivateFieldGet(this, _FocusGroupElement_retainSignal, "f")?.abort();
                const { signal } = (__classPrivateFieldSet(this, _FocusGroupElement_retainSignal, new AbortController(), "f"));
                for (const item of __classPrivateFieldGet(this, _FocusGroupElement_instances, "a", _FocusGroupElement_items_get)) {
                    item.setAttribute('tabindex', item === event.target ? '0' : '-1');
                    const popover = event.target.closest('[popover]');
                    if (item === event.target && popover?.popover === 'auto' && popover.closest('focus-group') === this) {
                        popover.addEventListener('toggle', (toggleEvent) => {
                            if (!(toggleEvent.target instanceof Element))
                                return;
                            if (toggleEvent.newState === 'closed') {
                                __classPrivateFieldGet(this, _FocusGroupElement_retainSignal, "f")?.abort();
                                item.setAttribute('tabindex', '-1');
                                if (popover.id) {
                                    const invoker = this.querySelector(`[popovertarget="${popover.id}"]`);
                                    if (invoker) {
                                        invoker.setAttribute('tabindex', '0');
                                    }
                                    else {
                                        __classPrivateFieldGet(this, _FocusGroupElement_instances, "a", _FocusGroupElement_items_get)[0]?.setAttribute('tabindex', '0');
                                    }
                                }
                            }
                        }, { signal });
                    }
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
                    event.preventDefault();
                }
            }
            else if (key === 'Down' || key === 'ArrowDown') {
                if (direction === 'vertical' || direction === 'both') {
                    index += 1;
                    event.preventDefault();
                }
            }
            else if (event.key === 'Left' || event.key === 'ArrowLeft') {
                if (direction === 'horizontal' || direction === 'both') {
                    index -= 1;
                    event.preventDefault();
                }
            }
            else if (event.key === 'Right' || event.key === 'ArrowRight') {
                if (direction === 'horizontal' || direction === 'both') {
                    index += 1;
                    event.preventDefault();
                }
            }
            else if (event.key === 'Home' || event.key === 'PageUp') {
                index = 0;
                event.preventDefault();
            }
            else if (event.key === 'End' || event.key === 'PageDown') {
                index = items.length - 1;
                event.preventDefault();
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
                    el = el.closest(`[popover]:not(:popover-open)`);
                    if (el?.popover === 'auto' && !['ArrowRight', 'ArrowLeft'].includes(event.key)) {
                        el.showPopover();
                    }
                    el = el?.parentElement || null;
                } while (el);
            }
            focusEl?.focus();
        }
    }
}
_FocusGroupElement_retainSignal = new WeakMap(), _FocusGroupElement_abortController = new WeakMap(), _FocusGroupElement_instances = new WeakSet(), _FocusGroupElement_items_get = function _FocusGroupElement_items_get() {
    return this.querySelectorAll(menuItemSelector);
};
export default FocusGroupElement;
if (!customElements.get('focus-group')) {
    window.FocusGroupElement = FocusGroupElement;
    customElements.define('focus-group', FocusGroupElement);
}
