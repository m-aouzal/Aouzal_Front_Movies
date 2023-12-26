import { CanDeactivateFn } from '@angular/router';
import { RecipeEditComponent } from '../recipes/recipe-edit/recipe-edit.component';
import { ComponentsForm } from '../ComponentsForm';



export const authDeActivateGuard: CanDeactivateFn<ComponentsForm> = (component: ComponentsForm, currentRoute, currentState, nextState) => {
    return component.verifyChangesAndConfirm();
}

