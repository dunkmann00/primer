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
var _NavListElement_instances, _NavListElement_parseHTML, _NavListElement_findSelectedNavItemById, _NavListElement_findSelectedNavItemByHref, _NavListElement_findSelectedNavItemByCurrentLocation, _NavListElement_select, _NavListElement_deselect, _NavListElement_findParentMenu;
/* eslint-disable custom-elements/expose-class-on-global */
import { controller, target, targets } from '@github/catalyst';
let NavListElement = class NavListElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _NavListElement_instances.add(this);
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
    selectItemById(itemId) {
        if (!itemId)
            return false;
        const selectedItem = __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_findSelectedNavItemById).call(this, itemId);
        if (selectedItem) {
            __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_select).call(this, selectedItem);
            return true;
        }
        return false;
    }
    selectItemByHref(href) {
        if (!href)
            return false;
        const selectedItem = __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_findSelectedNavItemByHref).call(this, href);
        if (selectedItem) {
            __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_select).call(this, selectedItem);
            return true;
        }
        return false;
    }
    selectItemByCurrentLocation() {
        const selectedItem = __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_findSelectedNavItemByCurrentLocation).call(this);
        if (selectedItem) {
            __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_select).call(this, selectedItem);
            return true;
        }
        return false;
    }
    // expand collapsible item onClick
    expandItem(item) {
        var _a;
        (_a = item.nextElementSibling) === null || _a === void 0 ? void 0 : _a.removeAttribute('data-hidden');
        item.setAttribute('aria-expanded', 'true');
    }
    collapseItem(item) {
        var _a;
        (_a = item.nextElementSibling) === null || _a === void 0 ? void 0 : _a.setAttribute('data-hidden', '');
        item.setAttribute('aria-expanded', 'false');
        item.focus();
    }
    itemIsExpanded(item) {
        if ((item === null || item === void 0 ? void 0 : item.tagName) === 'A') {
            return true;
        }
        return (item === null || item === void 0 ? void 0 : item.getAttribute('aria-expanded')) === 'true';
    }
    // expand/collapse item
    handleItemWithSubItemClick(e) {
        const el = e.target;
        if (!(el instanceof HTMLElement))
            return;
        const button = el.closest('button');
        if (!button)
            return;
        if (this.itemIsExpanded(button)) {
            this.collapseItem(button);
        }
        else {
            this.expandItem(button);
        }
        e.stopPropagation();
    }
    // collapse item
    handleItemWithSubItemKeydown(e) {
        const el = e.currentTarget;
        if (!(el instanceof HTMLElement))
            return;
        let button = el.closest('button');
        if (!button) {
            const button_id = el.getAttribute('aria-labelledby');
            if (button_id) {
                button = document.getElementById(button_id);
            }
            else {
                return;
            }
        }
        if (this.itemIsExpanded(button) && e.key === 'Escape') {
            this.collapseItem(button);
        }
        e.stopPropagation();
    }
    async showMore(e) {
        var _a, _b;
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
        const fragment = __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_parseHTML).call(this, document, html);
        (_a = fragment === null || fragment === void 0 ? void 0 : fragment.querySelector('li > a')) === null || _a === void 0 ? void 0 : _a.setAttribute('data-targets', 'nav-list.focusMarkers');
        const listId = e.target.closest('button').getAttribute('data-list-id');
        const list = document.getElementById(listId);
        list.append(fragment);
        (_b = this.focusMarkers.pop()) === null || _b === void 0 ? void 0 : _b.focus();
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
_NavListElement_instances = new WeakSet(), _NavListElement_parseHTML = function _NavListElement_parseHTML(document, html) {
    const template = document.createElement('template');
    // eslint-disable-next-line github/no-inner-html
    template.innerHTML = html;
    return document.importNode(template.content, true);
}, _NavListElement_findSelectedNavItemById = function _NavListElement_findSelectedNavItemById(itemId) {
    var _a;
    // First we compare the selected link to data-item-id for each nav item
    for (const navItem of this.items) {
        if (navItem.classList.contains('ActionListItem--hasSubItem')) {
            continue;
        }
        const keys = ((_a = navItem.getAttribute('data-item-id')) === null || _a === void 0 ? void 0 : _a.split(' ')) || [];
        if (keys.includes(itemId)) {
            return navItem;
        }
    }
    return null;
}, _NavListElement_findSelectedNavItemByHref = function _NavListElement_findSelectedNavItemByHref(href) {
    // If we didn't find a match, we compare the selected link to the href of each nav item
    const selectedNavItem = this.querySelector(`.ActionListContent[href="${href}"]`);
    if (selectedNavItem) {
        return selectedNavItem.closest('.ActionListItem');
    }
    return null;
}, _NavListElement_findSelectedNavItemByCurrentLocation = function _NavListElement_findSelectedNavItemByCurrentLocation() {
    return __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_findSelectedNavItemByHref).call(this, window.location.pathname);
}, _NavListElement_select = function _NavListElement_select(navItem) {
    const currentlySelectedItem = this.querySelector('.ActionListItem--navActive');
    if (currentlySelectedItem)
        __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_deselect).call(this, currentlySelectedItem);
    navItem.classList.add('ActionListItem--navActive');
    const parentMenu = __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_findParentMenu).call(this, navItem);
    if (parentMenu) {
        this.expandItem(parentMenu);
        parentMenu.classList.add('ActionListContent--hasActiveSubItem');
    }
}, _NavListElement_deselect = function _NavListElement_deselect(navItem) {
    navItem.classList.remove('ActionListItem--navActive');
    const parentMenu = __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_findParentMenu).call(this, navItem);
    if (parentMenu) {
        this.collapseItem(parentMenu);
        parentMenu.classList.remove('ActionListContent--hasActiveSubItem');
    }
}, _NavListElement_findParentMenu = function _NavListElement_findParentMenu(navItem) {
    var _a;
    if (!navItem.classList.contains('ActionListItem--subItem'))
        return null;
    const parent = (_a = navItem.closest('li.ActionListItem--hasSubItem')) === null || _a === void 0 ? void 0 : _a.querySelector('button.ActionListContent');
    if (parent) {
        return parent;
    }
    else {
        return null;
    }
};
__decorate([
    targets
], NavListElement.prototype, "items", void 0);
__decorate([
    target
], NavListElement.prototype, "showMoreItem", void 0);
__decorate([
    targets
], NavListElement.prototype, "focusMarkers", void 0);
NavListElement = __decorate([
    controller
], NavListElement);
export { NavListElement };
