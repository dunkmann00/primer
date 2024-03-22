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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ActionBarElement_instances, _ActionBarElement_focusZoneAbortController, _ActionBarElement_firstItem_get, _ActionBarElement_showItem, _ActionBarElement_hideItem, _ActionBarElement_menuItems_get, _ActionBarElement_eachItem;
import { controller, targets, target } from '@github/catalyst';
import { focusZone, FocusKeys } from '@primer/behaviors';
const instersectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
        const action = entry.target;
        if (entry.isIntersecting && action instanceof ActionBarElement) {
            action.update();
        }
    }
});
const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
        const action = entry.target;
        if (action instanceof ActionBarElement) {
            action.update();
        }
    }
});
// These are definitely used, but eslint is dumb apparently
// eslint-disable-next-line no-unused-vars
var ItemType;
(function (ItemType) {
    // eslint-disable-next-line no-unused-vars
    ItemType[ItemType["Item"] = 0] = "Item";
    // eslint-disable-next-line no-unused-vars
    ItemType[ItemType["Divider"] = 1] = "Divider";
})(ItemType || (ItemType = {}));
let ActionBarElement = class ActionBarElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _ActionBarElement_instances.add(this);
        _ActionBarElement_focusZoneAbortController.set(this, null);
    }
    connectedCallback() {
        // Calculate the width of all the items before hiding anything
        for (const item of this.items) {
            const width = item.getBoundingClientRect().width;
            const marginLeft = parseInt(window.getComputedStyle(item)?.marginLeft, 10);
            const marginRight = parseInt(window.getComputedStyle(item)?.marginRight, 10);
            item.setAttribute('data-offset-width', `${width + marginLeft + marginRight}`);
        }
        resizeObserver.observe(this);
        instersectionObserver.observe(this);
        requestAnimationFrame(() => {
            // This overflow visible is needed for browsers that don't support PopoverElement
            // to ensure the menu and tooltips are visible when the action bar is in a collapsed state
            // once popover is fully supported we can remove this.style.overflow = 'visible'
            this.style.overflow = 'visible';
            this.update();
        });
    }
    disconnectedCallback() {
        resizeObserver.unobserve(this);
        instersectionObserver.unobserve(this);
    }
    menuItemClick(event) {
        const currentTarget = event.currentTarget;
        const id = currentTarget?.getAttribute('data-for');
        if (id) {
            document.getElementById(id)?.click();
        }
    }
    update() {
        const firstItem = __classPrivateFieldGet(this, _ActionBarElement_instances, "a", _ActionBarElement_firstItem_get);
        if (!firstItem)
            return;
        const firstItemTop = firstItem.getBoundingClientRect().top;
        let previousItemType = null;
        __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_eachItem).call(this, (item, index, type) => {
            const itemTop = item.getBoundingClientRect().top;
            if (type === ItemType.Item) {
                if (itemTop > firstItemTop) {
                    __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_hideItem).call(this, index);
                    if (this.moreMenu.hidden) {
                        this.moreMenu.hidden = false;
                    }
                    if (previousItemType === ItemType.Divider) {
                        __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_hideItem).call(this, index - 1);
                    }
                }
                else {
                    __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_showItem).call(this, index);
                    if (index === this.items.length - 1) {
                        this.moreMenu.hidden = true;
                    }
                    if (previousItemType === ItemType.Divider) {
                        __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_showItem).call(this, index - 1);
                    }
                }
            }
            previousItemType = type;
            return true;
        });
        if (__classPrivateFieldGet(this, _ActionBarElement_focusZoneAbortController, "f")) {
            __classPrivateFieldGet(this, _ActionBarElement_focusZoneAbortController, "f").abort();
        }
        __classPrivateFieldSet(this, _ActionBarElement_focusZoneAbortController, focusZone(this, {
            bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
            focusOutBehavior: 'wrap',
            focusableElementFilter: element => {
                const idx = this.items.indexOf(element.parentElement);
                const elementIsVisibleItem = idx > -1 && this.items[idx].style.visibility === 'visible';
                const elementIsVisibleActionMenuInvoker = element === this.moreMenu.invokerElement && !this.moreMenu.hidden;
                return elementIsVisibleItem || elementIsVisibleActionMenuInvoker;
            },
        }), "f");
    }
};
_ActionBarElement_focusZoneAbortController = new WeakMap();
_ActionBarElement_instances = new WeakSet();
_ActionBarElement_firstItem_get = function _ActionBarElement_firstItem_get() {
    let foundItem = null;
    __classPrivateFieldGet(this, _ActionBarElement_instances, "m", _ActionBarElement_eachItem).call(this, (item, _index, type) => {
        if (type === ItemType.Item) {
            foundItem = item;
            return false;
        }
        return true;
    });
    return foundItem;
};
_ActionBarElement_showItem = function _ActionBarElement_showItem(index) {
    const item = this.items[index];
    const menuItem = __classPrivateFieldGet(this, _ActionBarElement_instances, "a", _ActionBarElement_menuItems_get)[index];
    if (!item || !menuItem)
        return;
    item.style.setProperty('visibility', 'visible');
    menuItem.hidden = true;
};
_ActionBarElement_hideItem = function _ActionBarElement_hideItem(index) {
    const item = this.items[index];
    const menuItem = __classPrivateFieldGet(this, _ActionBarElement_instances, "a", _ActionBarElement_menuItems_get)[index];
    if (!item || !menuItem)
        return;
    item.style.setProperty('visibility', 'hidden');
    menuItem.hidden = false;
};
_ActionBarElement_menuItems_get = function _ActionBarElement_menuItems_get() {
    return this.moreMenu.querySelectorAll('[role="menu"] > li');
};
_ActionBarElement_eachItem = function _ActionBarElement_eachItem(callback) {
    for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        const type = item.classList.contains('ActionBar-divider') ? ItemType.Divider : ItemType.Item;
        if (!callback(item, i, type)) {
            break;
        }
    }
};
__decorate([
    targets
], ActionBarElement.prototype, "items", void 0);
__decorate([
    target
], ActionBarElement.prototype, "itemContainer", void 0);
__decorate([
    target
], ActionBarElement.prototype, "moreMenu", void 0);
ActionBarElement = __decorate([
    controller
], ActionBarElement);
window.ActionBarElement = ActionBarElement;
