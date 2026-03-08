# Conventions

## 1. Design & UX

See [UI/UX spec](ui-ux.md) for details.

## 2. Error Handling

- **API failures** — Toast notification informing the user, with a retry option.
- **Storage issues** — Toast notification alerting the user (e.g., "Storage issue detected. Some data may not be saved.").
- **Unexpected crashes** — Global error boundary catching unhandled errors, showing a "Something went wrong" fallback with a reload option.

## 3. Browser Support

- **Modern evergreen only** — Latest versions of Chrome, Firefox, Safari, Edge. No IE, no legacy.
