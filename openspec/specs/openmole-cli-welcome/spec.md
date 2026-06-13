# openmole-cli-welcome

OpenMole CLI welcome screen before interactive init.

## Requirements

### Requirement: CLI displays welcome screen before interactive init

When run in a TTY without explicit `--ides`, the OpenMole CLI SHALL display a welcome screen before IDE selection. The welcome screen SHALL include a blinking **R** logo using teal/cyan accent colors (reference RGB 38,166,154), framework title **Welcome to OpenMole**, tagline **Bad smell Driven Refactoring**, configuration summary, and a Quick start list of `/mole-*` commands.

#### Scenario: Bare openmole command shows welcome

- **WHEN** the user runs `openmole` with no subcommand in a TTY
- **THEN** the CLI SHALL display the welcome screen
- **AND** after the user presses Enter SHALL proceed to interactive `init` including IDE multiselect

#### Scenario: openmole init shows welcome before IDE select

- **WHEN** the user runs `openmole init` in a TTY without `--ides`
- **THEN** the CLI SHALL display the welcome screen before the IDE multiselect

#### Scenario: Non-interactive skips welcome

- **WHEN** the user runs `openmole init --ides cursor` or stdin is not a TTY
- **THEN** the CLI SHALL skip the welcome screen

### Requirement: Welcome screen includes Quick start command hints

The welcome screen SHALL list the five OpenMole slash commands with one-line descriptions matching README: explore, analyze, plan, apply, archive.

#### Scenario: Quick start content

- **WHEN** the welcome screen is displayed
- **THEN** the user SHALL see `/mole-explore`, `/mole-plan`, `/mole-verify`, `/mole-apply`, and `/mole-archive` with phase descriptions

### Requirement: Welcome prompts Enter to continue

After rendering welcome content, the CLI SHALL prompt the user to press Enter before showing the IDE selection checklist.

#### Scenario: Enter continues to IDE list

- **WHEN** the user presses Enter at the welcome prompt
- **THEN** the CLI SHALL display the AI IDE multiselect checklist
