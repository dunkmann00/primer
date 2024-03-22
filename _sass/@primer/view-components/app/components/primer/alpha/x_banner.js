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
var _XBannerElement_instances, _XBannerElement_dismissScheme_get;
import { controller, target } from '@github/catalyst';
let XBannerElement = class XBannerElement extends HTMLElement {
    constructor() {
        super(...arguments);
        _XBannerElement_instances.add(this);
    }
    dismiss() {
        const parentElement = this.parentElement;
        if (!parentElement)
            return;
        if (__classPrivateFieldGet(this, _XBannerElement_instances, "a", _XBannerElement_dismissScheme_get) === 'remove') {
            parentElement.removeChild(this);
        }
        else {
            this.hide();
        }
    }
    show() {
        this.style.setProperty('display', 'initial');
    }
    hide() {
        this.style.setProperty('display', 'none');
    }
};
_XBannerElement_instances = new WeakSet();
_XBannerElement_dismissScheme_get = function _XBannerElement_dismissScheme_get() {
    return this.getAttribute('data-dismiss-scheme');
};
__decorate([
    target
], XBannerElement.prototype, "titleText", void 0);
XBannerElement = __decorate([
    controller
], XBannerElement);
if (!window.customElements.get('x-banner')) {
    window.XBannerElement = XBannerElement;
    window.customElements.define('x-banner', XBannerElement);
}
