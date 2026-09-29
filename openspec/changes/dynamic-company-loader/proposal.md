## Why

The list of companies supported by the application is currently hardcoded in three separate places. Adding a new company requires a code change and a new deployment. The backend will expose a public GET endpoint returning the company catalogue, enabling the app to load it dynamically at runtime.

## What Changes

- Add `company.service.js` with a `getCompanies()` function that fetches the companies endpoint.
- Extend `AuthContext` to fetch and expose the companies list on app load.
- Replace hardcoded `<MenuItem>` entries in `SelectLabel.jsx` with a dynamic render from the companies list.
- Replace hardcoded id comparisons in `validaDocumento` (`Tools.js`) with a dynamic lookup against the companies list.
- Replace the hardcoded company name display in `FileUploadView.jsx` with a lookup against the companies list.

## Capabilities

### New Capabilities

- `company-catalogue`: Fetches the list of available companies from a public backend endpoint and makes it available throughout the app via context.

### Modified Capabilities

- `login`: The company selector now populates dynamically from the catalogue instead of static options.
- `document-validation`: Document receptor id is validated against the company entry from the catalogue, not a hardcoded value.

## Impact

- **New file**: `src/services/company.service.js`
- **Modified files**: `src/context/auth.context.jsx`, `src/components/SelectLabel.jsx`, `src/libs/Tools.js`, `src/views/FileUploadView.jsx`
- **Backend dependency**: public GET endpoint returning `[{ codedb, name, id }]`
- **No breaking changes** to the login flow, document submission, or SAP integration
