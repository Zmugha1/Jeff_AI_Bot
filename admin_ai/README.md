# Admin AI Dashboard

Admin AI is a local-first relationship intelligence dashboard designed for SMB operators and founders. It connects fragmented workflows across Gmail, LinkedIn, and Calendar into one last-mile integration layer.

## What It Solves

- Disconnected communication and relationship tools
- Missed follow-ups and stale contacts
- Inconsistent context between inbox, meetings, and outreach

## Core Features

- Contact management with engagement scoring
- Follow-up priority prediction (HIGH, MEDIUM, LOW)
- AI follow-up message drafts with copy/send actions
- Integrations page for Gmail, LinkedIn, and Calendar setup
- Unified interaction timeline and analytics dashboard
- Local SQLite storage, local-first operation

## Project Structure

```text
admin_ai/
├── app.py
├── config.py
├── database.py
├── ai_engine.py
├── integrations.py
├── sample_data.py
├── utils.py
├── requirements.txt
├── README.md
├── SETUP_GUIDE.md
└── assets/
    └── demo_video_script.md
```

## Installation

```bash
pip install -r requirements.txt
```

## Run

```bash
streamlit run app.py
```

## Last-Mile Integration Positioning

Admin AI is the missing integration layer between your inbox, calendar, social relationships, and internal follow-up systems. Instead of switching tools all day, you get one dashboard with actionable priorities.

## Local-First Data Model

- SQLite database file: `admin_ai.db`
- Data remains on your machine by default
- Integrations run under your local credentials

## Pricing Suggestions

- Starter local deployment: **$500 - $900**
- Integrations-ready package: **$1,000 - $1,800**
- Premium team workflow package: **$1,900 - $2,500**
