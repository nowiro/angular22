import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { A22TranslatePipe } from '@angular22/shared-i18n';
import { A22IconComponent } from '@angular22/ui-material';

import { errorDescriptor, isRetryable } from './error-catalog';
import type { A22ErrorKind } from './error-kind';

/**
 * Shared full-page error screen — one component for every {@link A22ErrorKind}.
 * The kind (bound from route `data.kind` via `withComponentInputBinding()`)
 * resolves a descriptor from {@link A22_ERROR_CATALOG}: icon, tone, title,
 * message and HTTP code. A primary "home" link is always shown; server/network/
 * unexpected kinds also offer a reload action.
 */
@Component({
  selector: 'a22-error-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22IconComponent, A22TranslatePipe, RouterLink],
  templateUrl: './error-screen.component.html',
  styleUrl: './error-screen.component.scss',
})
export class A22ErrorScreenComponent {
  // NOTE: every input is optional and resolved through a computed fallback.
  // `withComponentInputBinding()` overwrites any input a route does NOT supply
  // with `undefined`, which would otherwise defeat an `input('default')`.
  /** Which error to render — bound from route `data.kind`. */
  readonly kind = input.required<A22ErrorKind>();
  /** RouterLink command array for the primary "home" action (default `/`). */
  readonly homeLink = input<string[] | undefined>(undefined);
  readonly homeLabel = input<string | undefined>(undefined);
  /** Optional overrides — fall back to the catalogue entry when absent. */
  readonly title = input<string | undefined>(undefined);
  readonly message = input<string | undefined>(undefined);

  protected readonly descriptor = computed(() => errorDescriptor(this.kind()));
  protected readonly resolvedTitle = computed(() => this.title() ?? this.descriptor().title);
  protected readonly resolvedMessage = computed(() => this.message() ?? this.descriptor().message);
  protected readonly resolvedHomeLink = computed(() => this.homeLink() ?? ['/']);
  protected readonly resolvedHomeLabel = computed(() => this.homeLabel() ?? 'Wróć do strony głównej');
  protected readonly canRetry = computed(() => isRetryable(this.kind()));

  protected reload(): void {
    globalThis.location?.reload();
  }
}
