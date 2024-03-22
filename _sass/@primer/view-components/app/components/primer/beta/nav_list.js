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
var _NavListElement_instances, _NavListElement_findSelectedNavItemById, _NavListElement_findSelectedNavItemByHref, _NavListElement_findSelectedNavItemByCurrentLocation, _NavListElement_select, _NavListElement_deselect, _NavListElement_findParentMenu;
/* eslint-disable custom-elements/expose-class-on-global */
import { controller, targets } from '@github/catalyst';
let NavListElement = class NavListElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _NavListElement_instances.add(this);
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
        item.nextElementSibling?.removeAttribute('data-hidden');
        item.setAttribute('aria-expanded', 'true');
    }
    collapseItem(item) {
        item.nextElementSibling?.setAttribute('data-hidden', '');
        item.setAttribute('aria-expanded', 'false');
        item.focus();
    }
    itemIsExpanded(item) {
        if (item?.tagName === 'A') {
            return true;
        }
        return item?.getAttribute('aria-expanded') === 'true';
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
        /* eslint-disable-next-line no-restricted-syntax */
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
        /* eslint-disable-next-line no-restricted-syntax */
        e.stopPropagation();
    }
};
_NavListElement_instances = new WeakSet();
_NavListElement_findSelectedNavItemById = function _NavListElement_findSelectedNavItemById(itemId) {
    // First we compare the selected link to data-item-id for each nav item
    for (const navItem of this.items) {
        if (navItem.classList.contains('ActionListItem--hasSubItem')) {
            continue;
        }
        const keys = navItem.getAttribute('data-item-id')?.split(' ') || [];
        if (keys.includes(itemId)) {
            return navItem;
        }
    }
    return null;
};
_NavListElement_findSelectedNavItemByHref = function _NavListElement_findSelectedNavItemByHref(href) {
    // If we didn't find a match, we compare the selected link to the href of each nav item
    const selectedNavItem = this.querySelector(`.ActionListContent[href="${href}"]`);
    if (selectedNavItem) {
        return selectedNavItem.closest('.ActionListItem');
    }
    return null;
};
_NavListElement_findSelectedNavItemByCurrentLocation = function _NavListElement_findSelectedNavItemByCurrentLocation() {
    return __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_findSelectedNavItemByHref).call(this, window.location.pathname);
};
_NavListElement_select = function _NavListElement_select(navItem) {
    const currentlySelectedItem = this.querySelector('.ActionListItem--navActive');
    if (currentlySelectedItem)
        __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_deselect).call(this, currentlySelectedItem);
    navItem.classList.add('ActionListItem--navActive');
    if (navItem.children.length > 0) {
        navItem.children[0].setAttribute('aria-current', 'page');
    }
    const parentMenu = __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_findParentMenu).call(this, navItem);
    if (parentMenu) {
        this.expandItem(parentMenu);
        parentMenu.classList.add('ActionListContent--hasActiveSubItem');
    }
};
_NavListElement_deselect = function _NavListElement_deselect(navItem) {
    navItem.classList.remove('ActionListItem--navActive');
    if (navItem.children.length > 0) {
        navItem.children[0].removeAttribute('aria-current');
    }
    const parentMenu = __classPrivateFieldGet(this, _NavListElement_instances, "m", _NavListElement_findParentMenu).call(this, navItem);
    if (parentMenu) {
        this.collapseItem(parentMenu);
        parentMenu.classList.remove('ActionListContent--hasActiveSubItem');
    }
};
_NavListElement_findParentMenu = function _NavListElement_findParentMenu(navItem) {
    if (!navItem.classList.contains('ActionListItem--subItem'))
        return null;
    const parent = navItem.closest('li.ActionListItem--hasSubItem')?.querySelector('button.ActionListContent');
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
NavListElement = __decorate([
    controller
], NavListElement);
export { NavListElement };
