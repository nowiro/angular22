/**
 * Public API for the ui-material library.
 *
 * The ONE place in the workspace that imports `@angular/material` /
 * `@angular/cdk` (enforced by the `no-restricted-imports` lint gate). Field
 * wrappers implement the Signal Forms `FormValueControl` / `FormCheckboxControl`
 * contracts, so apps bind them with `[formField]`.
 *
 * @packageDocumentation
 */
export { A22ButtonComponent } from './lib/button.component';
export type { A22ButtonVariant } from './lib/button.component';
export { A22CardComponent } from './lib/card.component';
export { A22CheckboxComponent } from './lib/checkbox.component';
export { A22DateFieldComponent } from './lib/date-field.component';
export { A22DividerComponent } from './lib/divider.component';
export { errorMessage } from './lib/error-message';
export { A22FieldErrorComponent } from './lib/field-error.component';
export { A22IconComponent } from './lib/icon.component';
export { A22NotificationService } from './lib/notification.service';
export { A22NumberFieldComponent } from './lib/number-field.component';
export { A22ProgressSpinnerComponent } from './lib/progress-spinner.component';
export { A22SelectComponent } from './lib/select.component';
export { A22StepDirective } from './lib/step.directive';
export { A22TextFieldComponent } from './lib/text-field.component';
export { A22ToolbarComponent } from './lib/toolbar.component';
export { A22WizardStepperComponent } from './lib/wizard-stepper.component';
