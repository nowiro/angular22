/**
 * Generic dashboard-tile descriptor shared by both wizard dashboards.
 *
 * Each wizard defines its own concrete step-index union (`1 | 2 | 3 | 4 | 5`
 * for the individual wizard, `1 | … | 6` for business) so consumers don't
 * widen back to `number`.
 */
export interface WizardTileDescriptor<TStepIndex extends number> {
  /** 1-indexed step number — matches the URL segment in `/wizard/:step`. */
  readonly step: TStepIndex;
  /** Material icon name. */
  readonly icon: string;
  /** Tile heading. */
  readonly title: string;
  /** One-line description below the heading. */
  readonly subtitle: string;
}
