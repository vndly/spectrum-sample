# Security Considerations

## Media Provider API Token

The media provider read access token is stored in a `.env` file as `VITE_MEDIA_PROVIDER_TOKEN`. Because the `VITE_` prefix causes Vite to embed the value into the client-side bundle, the token is visible to anyone who inspects the built JavaScript.

**Risk:** Low. The token is a read-only API key that grants access to public media provider data (movie metadata, images, trending lists). It cannot modify media provider data or access private accounts. Revoking and rotating the token is straightforward via the media provider's developer dashboard.

**Mitigations:**

- The token is never stored in localStorage or exposed in the UI.
- `.env` is gitignored to prevent accidental commits.
- The production bundle is minified, which provides light obfuscation (not security).

If token secrecy ever becomes a requirement (e.g., usage-based billing on a different API), a backend proxy would be needed to keep the token server-side.

## XSS Prevention

User-provided strings flow into the app through search queries and library entry fields such as notes and tags.

**Defenses:**

1. **Vue template escaping** — Vue's `{{ }}` interpolation HTML-escapes all values by default. User strings rendered in templates are never interpreted as HTML. The app does not use `v-html`.
2. **Input trimming and sanitization** — All user-provided strings are trimmed before storage or use in API calls (see [Conventions § Validation](./conventions.md#3-validation)).
3. **Zod schema validation** — All data read from localStorage is parsed through Zod schemas. Malformed or injected data that doesn't match the expected shape is rejected on read.

No additional sanitization library (e.g., DOMPurify) is needed because user strings are never inserted as raw HTML.

## localStorage Trust Model

All user data (library entries, tags, and settings) is stored in the browser's localStorage.

**Properties:**

- **Unencrypted** — Data is stored as plain JSON. Anyone with access to the browser's developer tools can read, modify, or delete it.
- **No authentication** — There are no user accounts or access controls. The app trusts whatever is in localStorage after Zod validation passes.
- **Same-origin only** — Browser same-origin policy prevents other sites from reading the app's localStorage. However, browser extensions and local scripts can access it.
- **No integrity checking** — Beyond Zod schema validation (which catches structural issues), there is no checksum or signature to detect tampering.

This trust model is appropriate for a personal, single-user app with no sensitive data. Library entries contain only provider IDs, user ratings, tags, and notes — no passwords, payment info, or PII.
