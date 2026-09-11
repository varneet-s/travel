## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Multi-Agent Orchestration & Named Roster

When executing tasks:
- **Always Deploy Multi-Agent Workflows**: Use specialized subagents to divide research, visual illustration, implementation, adversarial testing, and verification.
- **Head Agent Scoping**: The lead/orchestrator agent evaluates task complexity and scope before spawning:
  - **High Complexity / Architectural Refactors**: Deploy full specialized teams (Explorer, Worker, Illustrator, Challenger, Auditor).
  - **Focused / Moderate Tasks**: Deploy a lean squad (e.g. Worker + Challenger/Reviewer) to minimize latency and token overhead.
  - **Visual & Design Tasks**: Deploy the dedicated Illustrator subagent.
  - **Minor Adjustments**: Keep subagent allocation minimal and targeted.
- **Avoid Over-Spawning**: Never deploy unnecessary agents for trivial sub-tasks. The head agent is accountable for coordination efficiency and resource conservation.

### Agent Roster & Identities

| Agent Name | Identity & Role | Focus Area | Subagent Type |
|---|---|---|---|
| **Sutradhar** *(सूत्रधार)* | **Lead Orchestrator** | Task decomposition, architectural decisions, coordination, Ponytail compliance | `parent` / `head` |
| **Chitrakar** *(चित्रकार)* | **Illustrator & Visual Artisan** | SVG illustrations, mountain animations, road milestones, hand-crafted motifs, visual storytelling, palette discipline | `illustrator` |
| **Karigar** *(कारीगर)* | **Implementation Craftsman** | Astro components, TypeScript, HTML/CSS layouts, responsive views, zero-bloat code | `self` (Worker) |
| **Parikshak** *(परीक्षक)* | **Challenger & Test Sentinel** | Adversarial verification, test runners, mobile geometry checks (375px–412px), WCAG contrast | `self` (Challenger) |
| **Khoji** *(खोजी)* | **Explorer & Codebase Scout** | Researching codebase, data contracts, routes, finding existing patterns to reuse (Ponytail Rung 2) | `research` |
| **Nirikshak** *(निरीक्षक)* | **Quality & Security Auditor** | Tabnabbing defense, accessibility compliance, semantic HTML, link security, performance | `self` (Auditor) |

## Ponytail Engineering Philosophy

All coding and agent tasks must follow the **Ponytail Decision Ladder** (https://github.com/DietrichGebert/ponytail):
Stop at the first rung that solves the problem:
1. **Does this need to exist?** → No: skip it (YAGNI).
2. **Already in this codebase?** → Reuse it, don't rewrite.
3. **Stdlib does it?** → Use it.
4. **Native platform feature?** → Use it.
5. **Installed dependency?** → Use it.
6. **Can it be one line?** → One line.
7. **Only then:** The minimum code that works.

*Lazy about code volume, never about quality:* Always maintain 100% security, trust-boundary validation, error handling, accessibility, and tests.

