import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AuthStore } from './auth-store';
import type { Role } from './auth.types';

/**
 * Structural directive that renders its element only when the current user holds
 * one of the required roles:
 *
 * ```html
 * <button a22-button *a22HasRole="'admin'">Admin action</button>
 * <a *a22HasRole="['admin', 'user']" routerLink="…">…</a>
 * ```
 *
 * Reactive — shows/hides as the role changes (e.g. the dev role switcher). It is
 * a UI affordance only; protect routes with `roleGuard` so a hidden control
 * cannot be reached by deep link.
 */
@Directive({ selector: '[a22HasRole]' })
export class HasRoleDirective {
  private readonly store = inject(AuthStore);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  readonly a22HasRole = input.required<Role | readonly Role[]>();

  constructor() {
    effect(() => {
      const required = this.a22HasRole();
      const roles = ([] as Role[]).concat(required);
      const allowed = this.store.hasAnyRole(...roles);
      const rendered = this.viewContainer.length > 0;
      if (allowed && !rendered) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else if (!allowed && rendered) {
        this.viewContainer.clear();
      }
    });
  }
}
