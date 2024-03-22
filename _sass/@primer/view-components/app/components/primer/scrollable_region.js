var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { controller, attr } from '@github/catalyst';
let ScrollableRegionElement = class ScrollableRegionElement extends HTMLElement {
    constructor() {
        super(...arguments);
        this.hasOverflow = false;
        this.labelledBy = '';
    }
    connectedCallback() {
        this.style.overflow = 'auto';
        this.observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                this.hasOverflow =
                    entry.target.scrollHeight > entry.target.clientHeight || entry.target.scrollWidth > entry.target.clientWidth;
            }
        });
        this.observer.observe(this);
    }
    disconnectedCallback() {
        this.observer.disconnect();
    }
    attributeChangedCallback(name) {
        if (name === 'data-has-overflow') {
            if (this.hasOverflow) {
                this.setAttribute('aria-labelledby', this.labelledBy);
                this.setAttribute('role', 'region');
                this.setAttribute('tabindex', '0');
            }
            else {
                this.removeAttribute('aria-labelledby');
                this.removeAttribute('role');
                this.removeAttribute('tabindex');
            }
        }
    }
};
__decorate([
    attr
], ScrollableRegionElement.prototype, "hasOverflow", void 0);
__decorate([
    attr
], ScrollableRegionElement.prototype, "labelledBy", void 0);
ScrollableRegionElement = __decorate([
    controller
], ScrollableRegionElement);
export { ScrollableRegionElement };
window.ScrollableRegionElement = ScrollableRegionElement;
