# Onboarding Assistant

> AI-generated onboarding documentation for any unfamiliar codebase, powered by IBM Bob.

## Problem

When a developer joins a project, the first days usually go to reading code instead of contributing: figuring out what the system does, how the parts connect, how to run it locally, and where a newcomer can safely start. Most repositories have no clear entry point, and onboarding docs are rarely written because doing it by hand is slow and they go stale quickly.

Onboarding Assistant turns this into a repeatable workflow. Open any repo in IBM Bob, run one skill, and get an architecture overview, diagrams, a setup guide, and five grounded starter tasks, published as a single static web page.

## How It Works

The solution has three parts that work together.

### 1. The `onboarding-assistant` skill

Location: `.bob/skills/onboarding-assistant/SKILL.md`

A reusable Bob skill that encodes the full analysis workflow. When invoked, Bob:

1. Identifies the target repository and the output folder.
2. Spawns **4 parallel subagents**, each reading source files independently and producing one document:
   - `docs/architecture.md`: purpose, tech stack, key components, folder tree, data flow
   - `docs/diagrams.md`: a Mermaid class diagram and a sequence diagram using real model and endpoint names
   - `docs/setup.md`: step-by-step first-run guide with troubleshooting
   - `docs/starter-tasks.md`: 5 first tickets that point to real files
3. Verifies all four files exist and are non-empty, and re-runs any subagent that failed.
4. Runs the site generator to build `index.html`.

### 2. The `Onboarding Guide` custom mode

Location: `.bob/custom_modes.yaml`

A Bob mode that limits permissions to what documentation work needs, so source code cannot be modified by accident.

| Permission | Scope |
|---|---|
| Read | All workspace files (needed for source analysis) |
| Edit | Any `docs/` folder and any `index.html`, at any depth. Source files are write-protected |
| Skill, Todo, Subagent | Enabled for orchestration |

### 3. The static site generator

Location: `scripts/build-site.js` (template: `scripts/template.html`)

A zero-dependency Node script that turns the four markdown files into one self-contained `index.html`. It uses no AI, so rebuilding after a doc edit costs no Bobcoins and takes under a second.

```bash
# Workspace root (Galaxium Travels example)
node scripts/build-site.js

# Any other repo
node scripts/build-site.js --target examples/jobgap --title "JobGap"
```

The output is a dark-themed page with four tabs, Mermaid diagrams rendered in the browser, and URL hash links for each tab. It can be opened directly in a browser or deployed as-is to GitHub Pages or Vercel.

## Use It on Any Repo in 3 Steps

**Step 1: Open the repo in Bob.** Put the target repository in the workspace (for example under `examples/<name>/`) and switch to the **Onboarding Guide** mode in the mode picker.

**Step 2: Run the skill.** In the Bob chat, type:

```
/onboarding-assistant examples/<name>
```

Bob analyzes the codebase with 4 parallel subagents, writes the four docs, and builds the site.

**Step 3: Open the result.** Open `examples/<name>/index.html` in any browser. No server or build step is needed. If you edit a doc by hand later, rebuild with:

```bash
node scripts/build-site.js --target examples/<name> --title "<Name>"
```

## Example Outputs

The same skill was run on two repositories with very different stacks to show that it is not tied to one project.

### Example 1: Galaxium Travels (Python FastAPI + React)

- **Repo:** [github.com/IBM/galaxium-travels](https://github.com/IBM/galaxium-travels), branch `bob-learning-path-branch` (IBM's Bob tutorial app, Apache License 2.0)
- **Stack:** FastAPI backend with SQLAlchemy, React + TypeScript + Vite frontend
- **Docs:** [`docs/`](docs/)
- **Site:** [`index.html`](index.html)
- **Sample starter tasks generated:** logout button in the header, low-seats warning badge, price-range filter, booking statistics endpoint, flight duration display

### Example 2: JobGap (Next.js + TypeScript)

- **Repo:** [`examples/jobgap/`](examples/jobgap/), a skill-gap analyzer and job application tracker built by the author
- **Stack:** Next.js App Router, React, Tailwind CSS, Zod, Google Gemini API, Jest
- **Docs:** [`examples/jobgap/docs/`](examples/jobgap/docs/)
- **Site:** [`examples/jobgap/index.html`](examples/jobgap/index.html)
- **Sample starter tasks generated:** salary range field in the tracker, clearer analyzer error messages, color-coded match score badge, CSV export, retry feedback during analysis

## Impact

| Measure | Without the tool | With Onboarding Assistant |
|---|---|---|
| Producing onboarding docs for one repo | Hours of reading code and writing by hand, often skipped | One skill run: [isi waktu yang kamu ukur] minutes |
| Rebuilding the site after a doc edit | Manual formatting | Under 1 second, no AI cost |
| Starting point for a new developer | Unclear, depends on who is available to explain | 5 starter tasks that point to real files |
| Reuse on another repo | Start from scratch | Same skill, same mode, same script |

Bobcoins used for one full run on a repo: [isi dari Bob Settings, Usage].

Screenshots of every Bob task used to build this project are in [`bob_sessions/`](bob_sessions/).

## Project Structure

```
.
├── .bob/
│   ├── custom_modes.yaml          # "Onboarding Guide" mode
│   └── skills/
│       └── onboarding-assistant/
│           └── SKILL.md           # Skill instructions for Bob
├── bob_sessions/                  # Bob task session summary screenshots
├── docs/                          # Galaxium Travels docs
├── index.html                     # Galaxium Travels site
├── examples/
│   └── jobgap/
│       ├── docs/                  # JobGap docs
│       └── index.html             # JobGap site
├── galaxium-travels/              # Example repo (IBM, Apache 2.0)
├── scripts/
│   ├── build-site.js              # Zero-dependency site generator
│   └── template.html              # Page template
└── PROJECT_BRIEF.md
```

## Requirements

- **IBM Bob IDE** to run the skill, mode, and subagents
- **Node.js** (any recent version) for `scripts/build-site.js` only
- A web browser to view `index.html`

No npm packages, no framework, no database.

## Data Sources

- Galaxium Travels: [github.com/IBM/galaxium-travels](https://github.com/IBM/galaxium-travels), Apache License 2.0
- JobGap: the author's own project. Sample CV data inside it is fictional.