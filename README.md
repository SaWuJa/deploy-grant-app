# IfD Grant Writer

A grant pipeline management and AI-powered screening tool built for the **Institute for Development (IfD)**, Freetown, Sierra Leone. Track grant opportunities from discovery to submission, maintain an institutional knowledge base, and use AI to evaluate how well opportunities align with your organisation's capabilities.

## Features

### Grant Pipeline
- Track opportunities through stages: Identified, Screening, Drafting, Review, Finalising, Submitted, Awarded, Not Selected
- Table and Kanban board views
- Deadline tracking with urgency indicators
- Auto-generated grant reference numbers

### AI-Powered Screening
- Evaluate grant opportunities against your institutional knowledge base using Claude (Anthropic)
- Scores across five dimensions: Geographic fit, Thematic alignment, Capacity, Partnership potential, and Timeline feasibility
- Returns eligibility assessment, recommended approach, and risk flags
- Upload `.docx` or `.pdf` call documents for deeper analysis

### Knowledge Base
- Store and organise institutional content across categories: Past Proposals, Organisation, Projects, Templates, and References
- Tag-based organisation with full-text search
- Content is used as context for AI screening, improving results as the knowledge base grows

### Authentication & Access Control
- Supabase Auth with email/password sign-in
- Invite-based onboarding for new team members
- Password recovery flow
- Session management with automatic expiry handling

## Tech Stack

| Layer        | Technology                                                                 |
|--------------|---------------------------------------------------------------------------|
| Frontend     | Vanilla HTML/CSS/JavaScript (single `index.html`)                         |
| Backend      | [Netlify Functions](https://docs.netlify.com/functions/overview/) (serverless) |
| Database     | [Supabase](https://supabase.com) (PostgreSQL + Auth + Row Level Security) |
| AI           | [Claude API](https://docs.anthropic.com/) via `@anthropic-ai/sdk`        |
| Hosting      | [Netlify](https://netlify.com)                                            |

## Project Structure

```
deployGrantApp/
├── index.html                          # Full frontend application (UI, auth, data layer)
├── netlify/
│   └── functions/
│       └── screen-opportunity.mjs      # Serverless function — sends grant + KB data to Claude
├── netlify.toml                        # Netlify build and functions configuration
├── package.json                        # Dependencies (@anthropic-ai/sdk)
└── package-lock.json
```

## Setup

### Prerequisites
- A [Supabase](https://supabase.com) project with the following tables:
  - `profiles` — user profiles (id, full_name, role, email)
  - `knowledge_base` — KB entries (category, title, content, tags, created_by)
  - `grant_opportunities` — grant records (funder, programme_name, geographic_focus, thematic_area, funding_amount, deadline, status, notes, grant_ref, created_by)
  - `screening_results` — AI screening output (grant_id, overall_score, geographic_score, thematic_score, capacity_score, partnership_score, timeline_score, summary, eligibility, recommended_approach, risks, raw_response)
- A [Netlify](https://netlify.com) account
- An [Anthropic API key](https://console.anthropic.com/)

### Deploy

1. **Connect to Netlify** — Import this repo from GitHub in the Netlify dashboard. The build config is already in `netlify.toml`.

2. **Set environment variables** in Netlify (Site settings > Environment variables):
   - `ANTHROPIC_API_KEY` — your Anthropic API key (used by the screening function)

3. **Supabase is configured in the frontend** — the project URL and anon key are set in `index.html`. Update these if using a different Supabase project.

4. **Deploy** — push to `main` and Netlify will auto-deploy.

## How It Works

1. **Add knowledge base entries** — populate the KB with past proposals, org info, project summaries, and templates
2. **Log a grant opportunity** — enter funder, programme, theme, geography, amount, and deadline
3. **Screen with AI** — the app sends the opportunity details along with relevant KB entries to a Netlify serverless function, which calls Claude to produce a structured fitness assessment
4. **Track progress** — move opportunities through pipeline stages as you draft, review, and submit proposals

## Built with Claude Code

This project was built using [Claude Code](https://claude.ai/code), Anthropic's agentic coding tool. Claude Code was used throughout development for:

- **Architecture and design** — structuring the app as a single-page application with Supabase for data persistence and Netlify Functions for secure server-side AI calls
- **Full implementation** — writing the complete frontend (HTML, CSS, JavaScript), the serverless screening function, and all CRUD operations against Supabase
- **AI prompt engineering** — designing the structured prompt that evaluates grant opportunities across multiple dimensions and returns consistent JSON scoring
- **Deployment setup** — configuring Netlify, initialising the git repository, and pushing to GitHub

Claude Code served as a pair programmer across the entire stack, from UI layout to database integration to AI orchestration.

## License

Private project for the Institute for Development.
