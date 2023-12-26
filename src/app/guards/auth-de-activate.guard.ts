import { CanDeactivateFn } from '@angular/router';
import { ComponentsForm } from '../ComponentsForm';



export const authDeActivateGuard: CanDeactivateFn<ComponentsForm> = (component: ComponentsForm, currentRoute, currentState, nextState) => {
    return component.verifyChangesAndConfirm();
}

