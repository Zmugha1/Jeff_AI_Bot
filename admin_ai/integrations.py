from __future__ import annotations

import email
import imaplib
import sqlite3
from datetime import datetime, timedelta
from email.header import decode_header
from typing import Dict, List, Optional


class GmailIntegration:
    """Gmail IMAP integration for unread email follow-up detection."""

    def __init__(self, email_address: str, app_password: str) -> None:
        self.email = email_address
        self.password = app_password
        self.mail: Optional[imaplib.IMAP4_SSL] = None

    def connect(self) -> bool:
        try:
            self.mail = imaplib.IMAP4_SSL("imap.gmail.com")
            self.mail.login(self.email, self.password)
            return True
        except Exception as exc:
            print(f"Gmail connection failed: {exc}")
            return False

    def get_unread_from_contacts(
        self, contact_emails: List[str], days_back: int = 7
    ) -> List[Dict[str, str]]:
        if not self.mail:
            return []

        follow_ups: List[Dict[str, str]] = []
        date_since = (datetime.now() - timedelta(days=days_back)).strftime("%d-%b-%Y")
        self.mail.select("inbox")

        for contact_email in contact_emails:
            status, messages = self.mail.search(
                None, f'(FROM "{contact_email}" SINCE {date_since} UNSEEN)'
            )
            if status != "OK" or not messages or not messages[0]:
                continue
            for msg_id in messages[0].split():
                status, msg_data = self.mail.fetch(msg_id, "(RFC822)")
                if status != "OK":
                    continue
                msg = email.message_from_bytes(msg_data[0][1])
                subject = decode_header(msg.get("Subject", "(No subject)"))[0][0]
                if isinstance(subject, bytes):
                    subject = subject.decode(errors="ignore")
                follow_ups.append(
                    {
                        "contact_email": contact_email,
                        "subject": str(subject),
                        "date": str(msg.get("Date", datetime.now().strftime("%Y-%m-%d"))),
                        "needs_reply": "True",
                    }
                )
        return follow_ups

    def draft_reply(self, contact_name: str, email_subject: str, context: str, ai_engine) -> str:
        prompt = (
            f"Draft a professional email reply to {contact_name}. "
            f"Original subject: {email_subject}. Context: {context}. "
            "Tone: professional but warm. Length: 2 to 3 paragraphs."
        )
        return ai_engine.generate(prompt)


class LinkedInIntegration:
    """LinkedIn integration placeholder for local-first MVP."""

    def __init__(self, linkedin_username: str, linkedin_password: str) -> None:
        self.username = linkedin_username
        self.password = linkedin_password

    def get_profile_activity(self, linkedin_url: str) -> Dict[str, str]:
        return {
            "linkedin_url": linkedin_url,
            "status": "manual-import-required",
            "summary": "LinkedIn activity requires extension or manual capture for MVP.",
        }

    def suggest_connection_message(self, contact_name: str, company: str, ai_engine) -> str:
        prompt = (
            f"Draft a LinkedIn connection request to {contact_name} at {company}. "
            "Mention we met through business networking or mutual connection. "
            "Keep under 300 characters with professional friendly tone."
        )
        return ai_engine.generate(prompt)

    def track_profile_views(self) -> Dict[str, str]:
        return {"status": "premium-api-required", "summary": "Profile views tracking requires LinkedIn Premium APIs."}


class CalendarIntegration:
    """Google or Outlook calendar integration placeholder."""

    def __init__(self, calendar_type: str = "google") -> None:
        self.calendar_type = calendar_type

    def get_upcoming_meetings(self, days_ahead: int = 7) -> List[Dict[str, str]]:
        return [
            {
                "subject": "Pipeline Review",
                "date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
                "attendees": "team@company.com",
                "channel": self.calendar_type,
            }
        ]

    def suggest_meeting_follow_up(
        self, meeting_attendees: List[str], meeting_subject: str, ai_engine
    ) -> str:
        prompt = (
            f"Draft a follow-up email after meeting with {', '.join(meeting_attendees)}. "
            f"Meeting topic: {meeting_subject}. Include thank you, next steps, and availability."
        )
        return ai_engine.generate(prompt)

    def block_focus_time(self, duration_hours: int, contact_name: str) -> Dict[str, str]:
        return {
            "status": "scheduled",
            "summary": f"Reserved {duration_hours} hour focus block for {contact_name}.",
        }


class IntegrationManager:
    """Coordinates integrations and syncs data into SQLite."""

    def __init__(self, db_connection: sqlite3.Connection) -> None:
        self.db = db_connection
        self.gmail: Optional[GmailIntegration] = None
        self.linkedin: Optional[LinkedInIntegration] = None
        self.calendar: Optional[CalendarIntegration] = None

    def setup_gmail(self, email_address: str, password: str) -> bool:
        self.gmail = GmailIntegration(email_address, password)
        return self.gmail.connect()

    def setup_linkedin(self, username: str, password: str) -> None:
        self.linkedin = LinkedInIntegration(username, password)

    def setup_calendar(self, calendar_type: str) -> None:
        self.calendar = CalendarIntegration(calendar_type)

    def sync_all(self) -> Dict[str, int]:
        results = {
            "emails_checked": 0,
            "follow_ups_found": 0,
            "meetings_synced": 0,
            "new_interactions": 0,
        }

        if self.gmail:
            contact_emails = self._get_contact_emails()
            results["emails_checked"] = len(contact_emails)
            follow_ups = self.gmail.get_unread_from_contacts(contact_emails)
            results["follow_ups_found"] = len(follow_ups)
            for email_data in follow_ups:
                if self._add_interaction_from_email(email_data):
                    results["new_interactions"] += 1

        if self.calendar:
            meetings = self.calendar.get_upcoming_meetings()
            results["meetings_synced"] = len(meetings)

        return results

    def _get_contact_emails(self) -> List[str]:
        cursor = self.db.cursor()
        cursor.execute("SELECT email FROM contacts WHERE email IS NOT NULL AND email != ''")
        return [row[0] for row in cursor.fetchall()]

    def _add_interaction_from_email(self, email_data: Dict[str, str]) -> bool:
        cursor = self.db.cursor()
        cursor.execute(
            "SELECT id FROM contacts WHERE email = ?",
            (email_data["contact_email"],),
        )
        result = cursor.fetchone()
        if not result:
            return False

        contact_id = result[0]
        cursor.execute(
            """
            INSERT INTO interactions
            (contact_id, date, type, channel, notes, sentiment, ai_summary, follow_up_required)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                contact_id,
                datetime.now().strftime("%Y-%m-%d"),
                "Email",
                "Gmail",
                f"Subject: {email_data.get('subject', '(No subject)')}",
                "Neutral",
                "Auto-imported from unread Gmail thread.",
                1,
            ),
        )
        self.db.commit()
        return True
