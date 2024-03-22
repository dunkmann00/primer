var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { controller, target } from '@github/catalyst';
let ToggleSwitchElement = class ToggleSwitchElement extends HTMLElement {
    constructor() {
        super(...arguments);
        this.toggling = false;
    }
    get src() {
        const src = this.getAttribute('src');
        if (!src)
            return null;
        const link = this.ownerDocument.createElement('a');
        link.href = src;
        return link.href;
    }
    get csrf() {
        const csrfElement = this.querySelector('[data-csrf]');
        return this.getAttribute('csrf') || (csrfElement instanceof HTMLInputElement && csrfElement.value) || null;
    }
    get csrfField() {
        // the authenticity token is passed into the element and is not generated in js land
        return this.getAttribute('csrf-field') || 'authenticity_token';
    }
    isRemote() {
        return this.src != null;
    }
    async toggle() {
        if (this.toggling)
            return;
        this.toggling = true;
        if (this.isDisabled()) {
            return;
        }
        if (!this.isRemote()) {
            this.performToggle();
            this.toggling = false;
            return;
        }
        // toggle immediately to tell screen readers the switch was clicked
        this.performToggle();
        this.setLoadingState();
        try {
            await this.submitForm();
        }
        catch (error) {
            if (error instanceof Error) {
                // because we toggle immediately when the switch is clicked, toggle back to the
                // old state on failure
                this.setErrorState(error.message || 'An error occurred, please try again.');
                this.performToggle();
            }
            return;
        }
        finally {
            this.toggling = false;
        }
        this.setSuccessState();
    }
    turnOn() {
        if (this.isDisabled()) {
            return;
        }
        this.switch.setAttribute('aria-pressed', 'true');
        this.classList.add('ToggleSwitch--checked');
    }
    turnOff() {
        if (this.isDisabled()) {
            return;
        }
        this.switch.setAttribute('aria-pressed', 'false');
        this.classList.remove('ToggleSwitch--checked');
    }
    isOn() {
        return this.switch.getAttribute('aria-pressed') === 'true';
    }
    isOff() {
        return !this.isOn();
    }
    isDisabled() {
        return this.switch.getAttribute('disabled') != null;
    }
    disable() {
        this.switch.setAttribute('disabled', 'disabled');
    }
    enable() {
        this.switch.removeAttribute('disabled');
    }
    performToggle() {
        if (this.isOn()) {
            this.turnOff();
        }
        else {
            this.turnOn();
        }
    }
    setLoadingState() {
        this.errorIcon.setAttribute('hidden', 'hidden');
        this.loadingSpinner.removeAttribute('hidden');
        const event = new CustomEvent('toggleSwitchLoading', { bubbles: true });
        this.dispatchEvent(event);
    }
    setSuccessState() {
        const event = new CustomEvent('toggleSwitchSuccess', { bubbles: true });
        this.dispatchEvent(event);
        this.setFinishedState(false);
    }
    setErrorState(message) {
        const event = new CustomEvent('toggleSwitchError', { bubbles: true, detail: message });
        this.dispatchEvent(event);
        this.setFinishedState(true);
    }
    setFinishedState(error) {
        if (error) {
            this.errorIcon.removeAttribute('hidden');
        }
        this.loadingSpinner.setAttribute('hidden', 'hidden');
    }
    async submitForm() {
        const body = new FormData();
        if (this.csrf) {
            body.append(this.csrfField, this.csrf);
        }
        body.append('value', this.isOn() ? '1' : '0');
        if (!this.src)
            throw new Error('invalid src');
        let response;
        try {
            response = await fetch(this.src, {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    'Requested-With': 'XMLHttpRequest',
                },
                body,
            });
        }
        catch (error) {
            throw new Error('A network error occurred, please try again.');
        }
        if (!response.ok) {
            throw new Error(await response.text());
        }
    }
};
__decorate([
    target
], ToggleSwitchElement.prototype, "switch", void 0);
__decorate([
    target
], ToggleSwitchElement.prototype, "loadingSpinner", void 0);
__decorate([
    target
], ToggleSwitchElement.prototype, "errorIcon", void 0);
ToggleSwitchElement = __decorate([
    controller
], ToggleSwitchElement);
if (!window.customElements.get('toggle-switch')) {
    window.ToggleSwitchElement = ToggleSwitchElement;
    window.customElements.define('toggle-switch', ToggleSwitchElement);
}
