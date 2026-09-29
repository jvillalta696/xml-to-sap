## Context

See proposal.md — Why for motivation. The app is React + Vite + MUI with a flat component structure. State shared across the app flows through `AuthContext`. The backend URL and port are centralised in `src/libs/Tools.js`.

## Goals / Non-Goals

**Goals:**
- Single fetch of the company list per app load, available to all consumers
- No prop-drilling: components read companies from `useAuth()`
- `validaDocumento` remains a pure utility function (no React dependency)

**Non-Goals:**
- Caching or background refresh of the company list
- Pagination or filtering of companies
- Any change to the login HTTP request structure or SAP submission flow

## Decisions

### 1. Companies live in `AuthContext`

The list is fetched once when `AuthProvider` mounts and stored as `companies` state. All consumers — `SelectLabel`, `FileUploadView`, and `validaDocumento` call sites — read it via `useAuth()`.

**Alternative considered:** Fetch in `SelectLabel` locally.
**Rejected because:** `FileUploadView` also needs the company name for the header display, and `validaDocumento` needs the company `id`. Fetching in each component means multiple requests and divergent loading states.

### 2. New `company.service.js` for the fetch

A dedicated service file keeps `user.service.js` focused on authentication. The function signature is `getCompanies(): Promise<Company[]>`.

**Alternative considered:** Add `getCompanies` to `user.service.js`.
**Rejected because:** Single responsibility — company catalogue has no relation to session auth.

### 3. `validaDocumento` receives `companies` as a parameter

The function signature changes from `(doc, bd)` to `(doc, bd, companies)`. It looks up the matching company by `codedb` and uses its `id` for comparison.

**Alternative considered:** Import `useAuth` inside `Tools.js`.
**Rejected because:** `Tools.js` is a pure utility module with no React dependency. Introducing a hook there would break that contract and make unit testing harder.

### 4. `FileUploadView` header uses catalogue lookup

The hardcoded ternary `db === "01" ? "CORIMOTORS" : "SMARTCARS"` is replaced with `companies.find(c => c.codedb === db)?.name`.

### 5. Loading and error states in the login view

Because the endpoint is public and called before login, the `LoginForm` needs to handle two states from context: `companiesLoading` (boolean) and `companiesError` (string | null). The company selector is disabled while loading and replaced with an error alert on failure.

## Risks / Trade-offs

- **Endpoint latency on cold load** → The login page renders immediately; the selector is disabled with a loading indicator until the fetch resolves. No skeleton or spinner beyond the disabled state is needed given the payload is tiny.
- **Endpoint down** → Users cannot log in. Mitigation: surface a clear error with a retry mechanism (reload page). There is no offline fallback by design — a stale hardcoded list would be worse than a clear failure.
- **`validaDocumento` call sites** → The function is called in two places inside `FileUploadView` (single file and batch loop). Both already have access to `companies` via `useAuth()`, so the extra parameter adds no complexity.

## Open Questions

- What is the exact path of the companies endpoint? (e.g., `/api/companies`, `/api/login/companies`). The implementation uses a constant that can be updated once confirmed with the backend developer.
