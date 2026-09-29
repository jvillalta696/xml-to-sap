## 1. Local mock setup

- [x] 1.1 Create `src/mocks/companies.mock.json` with at least the two existing companies `[{codedb, name, id}]` and verify the file is importable from a Vite module
- [x] 1.2 Confirm mock data covers both `codedb:"01"` and `codedb:"02"` entries so all existing validation paths can be tested locally

## 2. Company service

- [x] 2.1 Create `src/services/company.service.js` with `getCompanies()`: the real `axios.get` call to the companies endpoint is written but commented out; the active return reads from the local mock JSON — verify the function returns the mock array when called
- [ ] 2.2 Confirm the endpoint path with the backend developer and update the commented-out URL before switching to production mode

## 3. AuthContext — company catalogue state

- [x] 3.1 Add `companies` (array, default `[]`), `companiesLoading` (boolean, default `true`), and `companiesError` (string | null, default `null`) to `AuthProvider` state
- [x] 3.2 Add a `useEffect` on mount that calls `getCompanies()`, sets `companies` on success, and sets `companiesError` on failure — verify in browser console that companies are logged on app load
- [x] 3.3 Expose `companies`, `companiesLoading`, and `companiesError` in the `AuthContext.Provider` value — verify `useAuth()` returns them in any consumer

## 4. SelectLabel — dynamic company selector

- [x] 4.1 Replace the two hardcoded `<MenuItem>` entries with a `.map()` over `companies` from `useAuth()`, using `codedb` as value and `name` as label — verify the dropdown shows the correct company names from the mock
- [x] 4.2 Disable the selector and show a loading indicator while `companiesLoading` is true — verify the selector is non-interactive during the simulated loading window
- [x] 4.3 If `companiesError` is set, render an error alert in place of the selector — verify by temporarily forcing an error in the mock

## 5. Tools.js — dynamic validaDocumento

- [x] 5.1 Update `validaDocumento` signature to `(doc, bd, companies)` and replace the hardcoded if/else blocks with a `companies.find(c => c.codedb === bd)` lookup; if no match is found the function SHALL return an error — verify the function returns no error for a document whose receptor id matches the mock entry
- [x] 5.2 Confirm the error message uses `company.name` from the catalogue, not a hardcoded string — verify by uploading a mismatched document and checking the displayed error

## 6. FileUploadView — consume catalogue

- [x] 6.1 Read `companies` from `useAuth()` and replace the hardcoded ternary header `db === "01" ? "CORIMOTORS" : "SMARTCARS"` with `companies.find(c => c.codedb === db)?.name` — verify the correct company name appears after login
- [x] 6.2 Pass `companies` as the third argument to both `validaDocumento` call sites (single-file handler and batch `useEffect` loop) — verify no runtime errors on file load

## 7. End-to-end verification (local mock)

- [ ] 7.1 Log in with each company (`01`, `02`), upload a valid XML for that company, and confirm validation passes and the document can be sent — verify success toast appears for both companies
- [ ] 7.2 Upload an XML whose receptor id belongs to the other company and confirm the validation error message includes the expected company name from the mock
- [ ] 7.3 Switch `getCompanies()` to the live endpoint (uncomment the axios call, comment out the mock return) and repeat 7.1 with the real backend to confirm end-to-end flow before merging (pendiente: confirmar path del endpoint con backend dev)
