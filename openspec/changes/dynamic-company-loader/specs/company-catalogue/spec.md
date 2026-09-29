## Purpose

Fetches the list of available companies from a public backend endpoint and makes it available throughout the app so that no company data needs to be hardcoded.

## ADDED Requirements

### Requirement: Load company catalogue on startup
The system SHALL fetch the company list from the public companies endpoint when the application loads, before any user interaction is possible.

#### Scenario: Successful load
- **WHEN** the app initializes
- **THEN** the system fetches `GET /api/companies` and stores the resulting array in the application context

#### Scenario: Endpoint returns empty list
- **WHEN** the endpoint responds with an empty array
- **THEN** the login form SHALL be disabled and SHALL display a message indicating no companies are available

#### Scenario: Endpoint unavailable
- **WHEN** the fetch fails (network error or non-2xx response)
- **THEN** the system SHALL display an error message in the login view and SHALL prevent the user from logging in until a successful load occurs

### Requirement: Company catalogue shape
The system SHALL treat each company entry as an object with exactly three fields: `codedb` (string, company selector value), `name` (string, human-readable label), and `id` (string, tax identification number used for document validation).

#### Scenario: Valid catalogue entry
- **WHEN** the endpoint returns `[{ "codedb": "01", "name": "CORI MOTORS DE CENTROAMERICA S.A", "id": "3101568373" }]`
- **THEN** the system SHALL make `codedb`, `name`, and `id` available for all dependent features

### Requirement: Company catalogue available via context
The company list SHALL be accessible to all components via the existing `AuthContext` without additional prop-passing.

#### Scenario: Component reads company list
- **WHEN** any component calls `useAuth()`
- **THEN** it SHALL receive the `companies` array populated from the catalogue endpoint
