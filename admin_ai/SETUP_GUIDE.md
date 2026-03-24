# Admin AI Setup Guide

## 1) Python Environment

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## 2) Launch App

```bash
streamlit run app.py
```

## 3) Gmail Integration (IMAP)

1. Turn on IMAP in Gmail settings.
2. Enable 2-step verification for your Google account.
3. Create a Gmail app password.
4. In Admin AI, open `Integrations` and enter Gmail address + app password.
5. Click `Connect Gmail`, then `Sync All Now`.

## 4) LinkedIn Integration

- Current version uses local MVP mode.
- Add credentials in `Integrations` to activate placeholder tracking and AI message drafting.
- For production-grade sync, pair with a browser extension or approved API workflow.

## 5) Calendar Integration

- Choose `google` or `outlook` in the Integrations page.
- Click `Connect Calendar`.
- Use `Sync All Now` to pull upcoming meeting context.

## 6) Data and Privacy

- Contact data is stored in local SQLite (`admin_ai.db`).
- AI drafts use local template mode unless provider settings are changed.
- No automatic cloud upload is configured in this build.
