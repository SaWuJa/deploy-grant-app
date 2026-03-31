# IfD Grant Writer

A grant pipeline management and AI-powered screening tool built for the **IfD**, Freetown, Sierra Leone. Track grant opportunities from discovery to submission, maintain an institutional knowledge base, and use AI to evaluate how well opportunities align with IfD's capabilities.

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

## How It Works

1. **Add knowledge base entries** — populate the KB with past proposals, org info, project summaries, and templates
2. **Log a grant opportunity** — enter funder, programme, theme, geography, amount, and deadline
3. **Screen with AI** — the app sends the opportunity details along with relevant KB entries to a Netlify serverless function, which calls Claude to produce a structured fitness assessment
4. **Track progress** — move opportunities through pipeline stages as you draft, review, and submit proposals

## Claude Code served as a pair programmer across the entire stack
