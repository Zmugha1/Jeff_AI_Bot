# Life Coach Admin AI Dashboard

A local-first Streamlit dashboard that helps life coaches track engagement, identify churn risk, and draft personalized follow-up messages.

## Features

- Dashboard overview with four KPI cards and AI insights
- Client management with search, filters, add client form, and detail view
- AI message generator with three personalized follow-up drafts per client
- Analytics page with engagement, risk, mood, and contact-gap charts
- Settings page for AI provider, risk thresholds, and notification preferences
- SQLite persistence with pre-loaded demo clients and interactions

## Tech Stack

- Python 3.8+
- Streamlit
- SQLite
- Pandas
- Optional local AI provider integration path (Ollama/OpenAI placeholders)

## Project Structure

```text
life_coach_admin_ai/
├── app.py
├── database.py
├── ai_engine.py
├── sample_data.py
├── requirements.txt
├── README.md
└── assets/
```

## Installation

```bash
pip install -r requirements.txt
```

## Run the Dashboard

```bash
streamlit run app.py
```

## Demo Script for Client Presentation

1. Open the Dashboard tab and explain total active clients, at-risk clients, and follow-up pipeline.
2. Show Priority Clients and point out who needs immediate outreach.
3. Go to Clients tab, filter by HIGH risk, and open one client profile.
4. Add a new interaction to show live updates in the workflow.
5. Move to AI Messages, generate three personalized drafts, then use Copy and Send actions.
6. Open Analytics to review engagement distribution, churn risk levels, mood trends, and contact gaps.
7. Finish on Settings to show adaptable AI provider and notification controls.

## Pricing Suggestions

- Starter build: **$500 - $900**
- Enhanced workflow version: **$1,000 - $1,800**
- Premium branded package with deployment support: **$1,900 - $2,500**

## Notes

- This build is demo-ready and runs locally.
- Data is seeded on first run and stored in `life_coach_admin_ai.db`.
- Send actions are placeholders that display confirmation in the UI.
