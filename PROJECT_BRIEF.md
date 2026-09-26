# Onboarding Assistant: AI-generated onboarding docs for an unfamiliar codebase

## Problem
New developers spend 30-50% of their time understanding code before they can
contribute. Legacy or unfamiliar codebases have no clear entry point.

## Target repo
Galaxium Travels demo app (IBM's own reference repo).

## Deliverable (single pass, no iteration loops)
A static site (plain HTML/CSS/JS, Mermaid.js via CDN, no build step) with 4
sections, each populated from a separate markdown file Bob generates:
1. Architecture Overview (purpose, tech stack, key components)
2. Diagrams (Mermaid: class diagram + sequence diagram)
3. Setup Guide (step-by-step, first run)
4. Starter Tasks (5 suggested first tickets, with file pointers)

## Out of scope
No React/Next.js, no backend, no tests, no database. Static content only.
Must be deployable as-is to GitHub Pages or Vercel with zero config.

## Rules for Bob
- Use subagents for the 4 analysis tasks so the main conversation stays small.
- One task at a time. Report cost after each task.
- If Bobcoins remaining drop below 8, stop and report status immediately.