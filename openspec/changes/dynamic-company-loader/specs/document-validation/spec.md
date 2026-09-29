## Purpose

Validates that an uploaded XML invoice is addressed to the company the user is currently logged into, using the company catalogue as the source of truth for expected tax IDs.

## ADDED Requirements

### Requirement: Receptor id validated against catalogue
The system SHALL validate that the document's `Receptor.Identificacion.Numero` matches the `id` field of the company entry whose `codedb` equals the current session's `db` value.

#### Scenario: Document addressed to the correct company
- **WHEN** the uploaded document's receptor id matches the `id` from the active company entry in the catalogue
- **THEN** validation SHALL pass and the document SHALL be available for submission

#### Scenario: Document addressed to a different company
- **WHEN** the uploaded document's receptor id does NOT match the `id` from the active company entry
- **THEN** validation SHALL fail with an error message that includes the expected company `name`

#### Scenario: Active company not found in catalogue
- **WHEN** the session's `db` value does not match any `codedb` in the catalogue
- **THEN** validation SHALL fail with an error indicating the company configuration is invalid

### Requirement: Company name shown in validation error
When document validation fails due to a receptor mismatch, the error message SHALL include the human-readable `name` of the expected company, not its `codedb` or `id`.

#### Scenario: Validation error message content
- **WHEN** a validation error occurs for company with `codedb:"01"` and `name:"CORI MOTORS DE CENTROAMERICA S.A"`
- **THEN** the error message SHALL reference `"CORI MOTORS DE CENTROAMERICA S.A"` as the expected recipient

### Requirement: Adding a new company requires no code change
The validation logic SHALL derive all company-specific data (expected id, display name) from the catalogue at runtime. No hardcoded company identifiers SHALL exist in the validation code path.

#### Scenario: Third company added to catalogue
- **WHEN** the backend adds a third entry to the companies endpoint
- **THEN** document validation for sessions under that company SHALL work correctly without modifying the frontend codebase
