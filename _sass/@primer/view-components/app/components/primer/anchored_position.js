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
var _AnchoredPositionElement_anchorElement, _AnchoredPositionElement_animationFrame;
import { getAnchoredPosition } from '@primer/behaviors';
const updateWhenVisible = (() => {
    const anchors = new Set();
    let intersectionObserver = null;
    let resizeObserver = null;
    function updateVisibleAnchors() {
        for (const anchor of anchors) {
            anchor.update();
        }
    }
    return (el) => {
        // eslint-disable-next-line github/prefer-observers
        window.addEventListener('resize', updateVisibleAnchors);
        intersectionObserver || (intersectionObserver = new IntersectionObserver(entries => {
            for (const entry of entries) {
                const target = entry.target;
                if (entry.isIntersecting) {
                    target.update();
                    anchors.add(target);
                }
                else {
                    anchors.delete(target);
                }
            }
        }));
        resizeObserver || (resizeObserver = new ResizeObserver(() => {
            for (const anchor of anchors) {
                anchor.update();
            }
        }));
        resizeObserver.observe(el.ownerDocument.documentElement);
        intersectionObserver.observe(el);
    };
})();
class AnchoredPositionElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _AnchoredPositionElement_anchorElement.set(this, null);
        _AnchoredPositionElement_animationFrame.set(this, void 0);
    }
    get align() {
        const value = this.getAttribute('align');
        if (value === 'center' || value === 'end')
            return value;
        return 'start';
    }
    set align(value) {
        this.setAttribute('align', `${value}`);
    }
    get side() {
        const value = this.getAttribute('side');
        if (value === 'inside-top' ||
            value === 'inside-bottom' ||
            value === 'inside-left' ||
            value === 'inside-right' ||
            value === 'inside-center' ||
            value === 'outside-top' ||
            value === 'outside-left' ||
            value === 'outside-right') {
            return value;
        }
        return 'outside-bottom';
    }
    set side(value) {
        this.setAttribute('side', `${value}`);
    }
    get anchorOffset() {
        const alias = this.getAttribute('anchor-offset');
        if (alias === 'spacious' || alias === '8')
            return 8;
        return 4;
    }
    set anchorOffset(value) {
        this.setAttribute('anchor-offset', `${value}`);
    }
    get anchor() {
        return this.getAttribute('anchor') || '';
    }
    set anchor(value) {
        this.setAttribute('anchor', `${value}`);
    }
    get anchorElement() {
        if (__classPrivateFieldGet(this, _AnchoredPositionElement_anchorElement, "f"))
            return __classPrivateFieldGet(this, _AnchoredPositionElement_anchorElement, "f");
        const idRef = this.anchor;
        if (!idRef)
            return null;
        return this.ownerDocument.getElementById(idRef);
    }
    set anchorElement(value) {
        __classPrivateFieldSet(this, _AnchoredPositionElement_anchorElement, value, "f");
        if (!__classPrivateFieldGet(this, _AnchoredPositionElement_anchorElement, "f")) {
            this.removeAttribute('anchor');
        }
    }
    get alignmentOffset() {
        return Number(this.getAttribute('alignment-offset'));
    }
    set alignmentOffset(value) {
        this.setAttribute('alignment-offset', `${value}`);
    }
    get allowOutOfBounds() {
        return this.hasAttribute('allow-out-of-bounds');
    }
    set allowOutOfBounds(value) {
        this.toggleAttribute('allow-out-of-bounds', value);
    }
    connectedCallback() {
        this.update();
        this.addEventListener('beforetoggle', () => this.update());
        updateWhenVisible(this);
    }
    attributeChangedCallback() {
        this.update();
    }
    update() {
        if (!this.isConnected)
            return;
        cancelAnimationFrame(__classPrivateFieldGet(this, _AnchoredPositionElement_animationFrame, "f"));
        __classPrivateFieldSet(this, _AnchoredPositionElement_animationFrame, requestAnimationFrame(() => {
            const anchor = this.anchorElement;
            this.classList.toggle('not-anchored', !anchor);
            if (anchor) {
                const { left, top } = getAnchoredPosition(this, anchor, this);
                this.style.top = `${top}px`;
                this.style.left = `${left}px`;
                this.style.bottom = 'auto';
                this.style.right = 'auto';
            }
            else {
                this.style.top = '0';
                this.style.left = '0';
                this.style.bottom = '0';
                this.style.right = '0';
            }
        }), "f");
    }
}
_AnchoredPositionElement_anchorElement = new WeakMap(), _AnchoredPositionElement_animationFrame = new WeakMap();
AnchoredPositionElement.observedAttributes = ['align', 'side', 'anchor', 'alignment-offset', 'allow-out-of-bounds'];
export default AnchoredPositionElement;
if (!customElements.get('anchored-position')) {
    window.AnchoredPositionElement = AnchoredPositionElement;
    customElements.define('anchored-position', AnchoredPositionElement);
}
