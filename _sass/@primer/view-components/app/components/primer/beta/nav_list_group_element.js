var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _NavListGroupElement_instances, _NavListGroupElement_parseHTML;
import { controller, target, targets } from '@github/catalyst';
let NavListGroupElement = class NavListGroupElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _NavListGroupElement_instances.add(this);
    }
    connectedCallback() {
        this.setShowMoreItemState();
    }
    get showMoreDisabled() {
        return this.showMoreItem.hasAttribute('aria-disabled');
    }
    set showMoreDisabled(value) {
        if (value) {
            this.showMoreItem.setAttribute('aria-disabled', 'true');
        }
        else {
            this.showMoreItem.removeAttribute('aria-disabled');
        }
        this.showMoreItem.classList.toggle('disabled', value);
    }
    set currentPage(value) {
        this.showMoreItem.setAttribute('data-current-page', value.toString());
    }
    get currentPage() {
        return parseInt(this.showMoreItem.getAttribute('data-current-page')) || 1;
    }
    get totalPages() {
        return parseInt(this.showMoreItem.getAttribute('data-total-pages')) || 1;
    }
    get paginationSrc() {
        return this.showMoreItem.getAttribute('src') || '';
    }
    async showMore(e) {
        e.preventDefault();
        if (this.showMoreDisabled)
            return;
        this.showMoreDisabled = true;
        let html;
        try {
            const paginationURL = new URL(this.paginationSrc, window.location.origin);
            this.currentPage++;
            paginationURL.searchParams.append('page', this.currentPage.toString());
            const response = await fetch(paginationURL);
            if (!response.ok)
                return;
            html = await response.text();
            if (this.currentPage === this.totalPages) {
                this.showMoreItem.hidden = true;
            }
        }
        catch (err) {
            // Ignore network errors
            this.showMoreDisabled = false;
            this.currentPage--;
            return;
        }
        const fragment = __classPrivateFieldGet(this, _NavListGroupElement_instances, "m", _NavListGroupElement_parseHTML).call(this, document, html);
        fragment?.querySelector('li > a')?.setAttribute('data-targets', 'nav-list-group.focusMarkers');
        const listId = e.target.closest('button').getAttribute('data-list-id');
        const list = document.getElementById(listId);
        list.append(fragment);
        this.focusMarkers.pop()?.focus();
        this.showMoreDisabled = false;
    }
    setShowMoreItemState() {
        if (!this.showMoreItem) {
            return;
        }
        if (this.currentPage < this.totalPages) {
            this.showMoreItem.hidden = false;
        }
        else {
            this.showMoreItem.hidden = true;
        }
    }
};
_NavListGroupElement_instances = new WeakSet();
_NavListGroupElement_parseHTML = function _NavListGroupElement_parseHTML(document, html) {
    const template = document.createElement('template');
    // eslint-disable-next-line github/no-inner-html
    template.innerHTML = html;
    return document.importNode(template.content, true);
};
__decorate([
    target
], NavListGroupElement.prototype, "showMoreItem", void 0);
__decorate([
    targets
], NavListGroupElement.prototype, "focusMarkers", void 0);
NavListGroupElement = __decorate([
    controller
], NavListGroupElement);
export { NavListGroupElement };
window.NavListGroupElement = NavListGroupElement;
