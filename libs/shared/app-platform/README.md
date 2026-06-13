# app-platform

The bootstrap spine every app shares — global error handling, runtime feature
flags, mock auth (`admin`/`user`/`guest`), router (component input binding) and
EN translations — exposed as one `provideAppPlatform({ routes, translations })`.
Apps add only their deltas (e.g. wizards bind `WIZARD_FILL_PRESETS`). Keeps the
provider list in one place instead of duplicated across three `app.config.ts`.
