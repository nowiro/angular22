import type { ElementRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import type { FeatureId } from '@angular22/shared-config';
import { ElementLoader, FeatureFlagsStore } from '@angular22/shared-config';
import { A22TranslatePipe, I18nStore } from '@angular22/shared-i18n';
import { A22IconComponent } from '@angular22/ui-material';

type EmbedState = 'loading' | 'ready' | 'error';

/**
 * Hosts a wizard as a web component inside the portal: lazily loads the
 * element bundle declared in `config.json`, instantiates the custom tag
 * (header hidden — the element renders the shell in embedded mode) and keeps
 * the element's language in sync with the portal switcher via the `lang`
 * attribute.
 */
@Component({
  selector: 'a22-embed-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22IconComponent, A22TranslatePipe, RouterLink],
  templateUrl: './embed-host.component.html',
  styleUrl: './embed-host.component.scss',
})
export class EmbedHostComponent {
  private readonly flags = inject(FeatureFlagsStore);
  private readonly loader = inject(ElementLoader);
  private readonly i18n = inject(I18nStore);
  private readonly destroyRef = inject(DestroyRef);

  /** Bound from route `data.featureId` via `withComponentInputBinding()`. */
  readonly featureId = input.required<FeatureId>();

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private element: HTMLElement | null = null;

  protected readonly homeLink = ['/'];
  protected readonly state = signal<EmbedState>('loading');

  protected standaloneUrl(): string {
    return this.flags.feature(this.featureId()).standaloneUrl;
  }

  constructor() {
    // Mount the web component once the host container and route input exist.
    effect(() => {
      const container = this.host().nativeElement;
      const id = this.featureId();
      void this.mount(id, container);
    });

    // Push the portal's active language into the embedded Angular runtime.
    effect(() => {
      const lang = this.i18n.language();
      this.element?.setAttribute('lang', lang);
    });

    this.destroyRef.onDestroy(() => {
      this.element?.remove();
      this.element = null;
    });
  }

  private async mount(id: FeatureId, container: HTMLElement): Promise<void> {
    const elementConfig = this.flags.feature(id).element;
    if (elementConfig === undefined) {
      this.state.set('error');
      return;
    }
    try {
      await this.loader.load(elementConfig);
      if (this.element !== null) return; // double-run guard (effect re-fires)
      const element = document.createElement(elementConfig.tagName);
      element.setAttribute('lang', this.i18n.language());
      container.append(element);
      this.element = element;
      this.state.set('ready');
    } catch {
      this.state.set('error');
    }
  }
}
