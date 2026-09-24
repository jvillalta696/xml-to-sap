## Purpose

Authenticates the user against a specific company database, with the company list driven by the catalogue endpoint rather than hardcoded options.

## ADDED Requirements

### Requirement: Company selector populated from catalogue
The company dropdown in the login form SHALL render one option per entry in the company catalogue, using `codedb` as the value and `name` as the display label.

#### Scenario: Catalogue loaded with two companies
- **WHEN** the catalogue contains `[{codedb:"01", name:"CORI MOTORS..."}, {codedb:"02", name:"SMART CARS..."}]`
- **THEN** the selector SHALL display exactly two options with those labels

#### Scenario: Catalogue loaded with a new company
- **WHEN** the catalogue contains a third entry
- **THEN** the selector SHALL display three options without any code change

#### Scenario: Catalogue not yet loaded
- **WHEN** the catalogue fetch is in progress
- **THEN** the selector SHALL be disabled until the list is available

### Requirement: Login submits selected codedb
The system SHALL send the `codedb` value of the selected company as `CodeDB` in the login request body.

#### Scenario: User selects a company and submits
- **WHEN** the user selects a company and clicks login
- **THEN** the POST to `/api/login/authenticate` SHALL include `CodeDB` equal to the selected entry's `codedb`
