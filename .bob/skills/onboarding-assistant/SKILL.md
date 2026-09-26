---
name: onboarding-assistant
description: Use when the user wants to generate onboarding documentation for any repo in the workspace. Produces an architecture overview, diagrams, a setup guide, and starter tasks, then builds a static index.html site with scripts/build-site.js.
---

# Onboarding Assistant

Analyze the target repository and produce four markdown docs plus a browsable static site. Follow every step in order.

## Step 0: Identify the target repo and output folder

1. Call `list_files` on the workspace root to find the repository directory (look for a folder containing source code: `package.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`, `pom.xml`, etc.).
2. If the user named a folder (for example `examples/<name>/`), use it. If more than one repo candidate exists and the user did not name one, use `ask_followup_question` to confirm which one to analyze.
3. Decide the output folder `<out>`:
   - If the target repo is under `examples/`, then `<out>` is that repo folder (for example `examples/jobgap`).
   - Otherwise `<out>` is the workspace root (`.`).
4. Read the repo's `README.md` (if present) and `AGENTS.md` (if present) so you have baseline context before spawning subagents.

## Step 1: Spawn 4 parallel analysis subagents

Call `spawn_subagent` four times **in the same turn** (they run in parallel). Pass each subagent:
- The absolute workspace path so it can resolve file paths.
- The repo directory identified in Step 0.
- The exact output path (`<out>/docs/<file>.md`) and required heading structure below.
- The instruction: **do not write any file other than the one assigned**. If the subagent cannot write files, it must return the full file content so you can write it.

Do not use em dashes or en dashes in any generated document. Use colons, commas, or parentheses instead.

### Subagent A: `<out>/docs/architecture.md`

Explore `<repo>/` and write `architecture.md` with these sections **in this order**:

```
# Architecture: <Repo Name>
## Purpose
## Tech Stack         (table: Layer | Technology | Notes)
## Key Components     (frontend, backend, DB, each as a subsection)
## Folder Structure   (annotated tree)
## Data Flow          (prose: primary happy-path request from UI to DB and back)
```

Files to read: `README.md`, main server or entry-point file, ORM models or schema file, directory listings of `src/` and backend root.

### Subagent B: `<out>/docs/diagrams.md`

Explore `<repo>/` and write `diagrams.md` with **exactly two Mermaid diagrams** in ` ```mermaid ` fences:

```
# Diagrams: <Repo Name>
## Diagram 1: Class Diagram
<mermaid classDiagram block: key models and relationships from actual model files>
## Diagram 2: Sequence Diagram
<mermaid sequenceDiagram block: primary user flow with real endpoint names>
```

Files to read: model or schema files, main server or router file (for endpoint names), frontend pages or routes.
Use only standard `classDiagram` and `sequenceDiagram` Mermaid syntax. Verify syntax is valid before writing.

### Subagent C: `<out>/docs/setup.md`

Explore `<repo>/` and write `setup.md` with these sections:

```
# Setup Guide: <Repo Name>
## Prerequisites      (exact versions, check commands, download links)
## 1. Clone the Repository
## 2. Backend Setup   (venv, dependencies, env vars)
## 3. Frontend Setup  (npm install, .env file)
## 4. Run the Application  (quick-start script and manual option)
## 5. Verify It Works (URLs table and smoke-test steps)
## Troubleshooting    (symptom and fix table for 3 to 5 common errors)
## Running Tests
```

Note Windows vs macOS/Linux differences where they exist. Use code blocks for all commands. Skip sections that do not apply (for example, no separate backend) and say so in one line.

### Subagent D: `<out>/docs/starter-tasks.md`

Explore `<repo>/` and write `starter-tasks.md` with exactly **5 tasks** in this format:

```
# Starter Tasks: <Repo Name>
### Task N: <Short title>
**Difficulty:** Easy | Medium
**Why it's a good first task:** (1 to 2 sentences)
**Files to touch:**
- `path/to/file`: why
**What to do:** (3 to 5 bullet points)
```

Then a closing section:
```
## How to Pick Your First Task
(table: preference and task number)
**General workflow:** (numbered steps)
```

Tasks must be grounded in actual files found during exploration. Do not invent paths. Spread tasks across frontend and backend where both exist. Range from Easy to Medium.

## Step 2: Verify outputs

After all four subagents complete:
1. Use `list_files` to confirm all four files exist under `<out>/docs/`.
2. Use `read_file` to spot-check that each file starts with the expected `# <Section>: <Repo Name>` heading and is non-empty.
3. If any file is missing or empty, re-run that subagent alone.

## Step 3: Build index.html with the script

Do **not** write the HTML yourself. Run the site generator, which costs no AI tokens:

```
node scripts/build-site.js --target <out> --title "<Repo Name>"
```

Examples:
- `node scripts/build-site.js` (workspace root, Galaxium Travels)
- `node scripts/build-site.js --target examples/jobgap --title "JobGap"`

Confirm the command prints a line ending with `written (<size> KB)`. If it fails, report the error and stop. Do not attempt to hand-write index.html.

## Step 4: Report

Summarize what was produced:
- List the 5 output files (`<out>/docs/*.md` and `<out>/index.html`) with their sizes.
- List the main source files each subagent read.
- Note any sections that required assumptions (for example, the repo had no README).
- Remind the user to open `<out>/index.html` directly in a browser to verify the diagrams render.