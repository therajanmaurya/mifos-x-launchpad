# Commands Layer

> Slash command definitions for Claude Product Cycle

## Overview

This layer contains definitions for all slash commands used in the MifosLaunchpad development workflow. Each command has a dedicated markdown file that defines its purpose, usage, and implementation details.

## Available Commands

| Command | File | Purpose |
|---------|------|---------|
| `/design` | [design.md](./design.md) | Create feature specifications |
| `/implement` | [implement.md](./implement.md) | Implement wizard steps |
| `/component` | [component.md](./component.md) | Create React components |
| `/template` | [template.md](./template.md) | Create generation templates |
| `/verify` | [verify.md](./verify.md) | Validate implementations |
| `/mockup` | [mockup.md](./mockup.md) | Generate design mockups |
| `/projectstatus` | [projectstatus.md](./projectstatus.md) | Show project status |

## Command Structure

Each command file follows this structure:

```markdown
# /command-name

## Purpose
What the command does

## Usage
How to use the command

## Parameters
Command parameters

## Workflow
Step-by-step execution

## Output
What the command produces

## Examples
Usage examples
```

## How Commands Work

1. User invokes a command (e.g., `/design step-1`)
2. Claude reads the command definition file
3. Claude follows the workflow defined in the file
4. Claude produces the specified output

## Adding New Commands

1. Create a new markdown file in this directory
2. Follow the standard command structure
3. Add the command to this README
4. Add to `COMMANDS.md` quick reference

## Command Categories

### Design Commands
- `/design` - Feature specifications
- `/mockup` - Visual mockups

### Implementation Commands
- `/implement` - Feature implementation
- `/component` - UI components
- `/template` - Generation templates

### Validation Commands
- `/verify` - Implementation validation
- `/projectstatus` - Status overview

### Analysis Commands
- `/gap-analysis` - Find gaps
- `/gap-planning` - Plan improvements
