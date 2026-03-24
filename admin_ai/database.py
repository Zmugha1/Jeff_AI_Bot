from __future__ import annotations

import sqlite3
from datetime import date, timedelta
from pathlib import Path
from typing import Any, Dict, Optional

import pandas as pd

from sample_data import SAMPLE_CONTACTS, SAMPLE_INTERACTIONS

DB_PATH = Path(__file__).parent / "admin_ai.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_database() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY,
                name TEXT,
                email TEXT,
                phone TEXT,
                company TEXT,
                title TEXT,
                linkedin_url TEXT,
                source TEXT,
                start_date TEXT,
                last_contact TEXT,
                last_interaction TEXT,
                objectives TEXT,
                notes TEXT,
                engagement_score INTEGER,
                follow_up_priority TEXT,
                engagement_sentiment TEXT,
                next_action TEXT,
                tags TEXT
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS interactions (
                id INTEGER PRIMARY KEY,
                contact_id INTEGER,
                date TEXT,
                type TEXT,
                channel TEXT,
                notes TEXT,
                sentiment TEXT,
                ai_summary TEXT,
                follow_up_required BOOLEAN,
                FOREIGN KEY(contact_id) REFERENCES contacts(id)
            )
            """
        )

        existing = conn.execute("SELECT COUNT(*) FROM contacts").fetchone()[0]
        if existing > 0:
            return

        for contact in SAMPLE_CONTACTS:
            conn.execute(
                """
                INSERT INTO contacts (
                    name, email, phone, company, title, linkedin_url, source,
                    start_date, last_contact, last_interaction, objectives, notes,
                    engagement_score, follow_up_priority, engagement_sentiment,
                    next_action, tags
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    contact["name"],
                    contact["email"],
                    contact["phone"],
                    contact["company"],
                    contact["title"],
                    contact["linkedin_url"],
                    contact["source"],
                    contact["start_date"],
                    contact["last_contact"],
                    contact["last_interaction"],
                    contact["objectives"],
                    contact["notes"],
                    contact["engagement_score"],
                    contact["follow_up_priority"],
                    contact["engagement_sentiment"],
                    contact["next_action"],
                    contact["tags"],
                ),
            )

        name_to_id = {
            row["name"]: row["id"] for row in conn.execute("SELECT id, name FROM contacts").fetchall()
        }
        for interaction in SAMPLE_INTERACTIONS:
            contact_id = name_to_id.get(interaction["contact_name"])
            if not contact_id:
                continue
            interaction_date = (date.today() - timedelta(days=interaction["days_ago"])).isoformat()
            conn.execute(
                """
                INSERT INTO interactions (
                    contact_id, date, type, channel, notes, sentiment, ai_summary, follow_up_required
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    contact_id,
                    interaction_date,
                    interaction["type"],
                    interaction["channel"],
                    interaction["notes"],
                    interaction["sentiment"],
                    interaction["ai_summary"],
                    1 if interaction["follow_up_required"] else 0,
                ),
            )


def get_all_contacts() -> pd.DataFrame:
    with get_connection() as conn:
        df = pd.read_sql_query("SELECT * FROM contacts ORDER BY name", conn)
    if df.empty:
        return df
    df["last_contact"] = pd.to_datetime(df["last_contact"], errors="coerce")
    df["days_since_contact"] = (pd.Timestamp.today().normalize() - df["last_contact"]).dt.days
    df["last_contact"] = df["last_contact"].dt.date.astype(str)
    return df


def get_contact_by_id(contact_id: int) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,)).fetchone()
    return dict(row) if row else None


def add_contact(data: Dict[str, Any]) -> int:
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO contacts (
                name, email, phone, company, title, linkedin_url, source,
                start_date, last_contact, last_interaction, objectives, notes,
                engagement_score, follow_up_priority, engagement_sentiment,
                next_action, tags
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                data.get("name"),
                data.get("email"),
                data.get("phone"),
                data.get("company"),
                data.get("title"),
                data.get("linkedin_url"),
                data.get("source"),
                data.get("start_date"),
                data.get("last_contact"),
                data.get("last_interaction"),
                data.get("objectives"),
                data.get("notes"),
                int(data.get("engagement_score", 50)),
                data.get("follow_up_priority", "MEDIUM"),
                data.get("engagement_sentiment", "🙂 Stable"),
                data.get("next_action", "Check in via email"),
                data.get("tags", ""),
            ),
        )
        return int(cursor.lastrowid)


def update_contact(contact_id: int, data: Dict[str, Any]) -> None:
    fields = [
        "name",
        "email",
        "phone",
        "company",
        "title",
        "linkedin_url",
        "source",
        "start_date",
        "last_contact",
        "last_interaction",
        "objectives",
        "notes",
        "engagement_score",
        "follow_up_priority",
        "engagement_sentiment",
        "next_action",
        "tags",
    ]
    assignments = ", ".join(f"{field} = ?" for field in fields)
    values = [data.get(field) for field in fields] + [contact_id]
    with get_connection() as conn:
        conn.execute(f"UPDATE contacts SET {assignments} WHERE id = ?", values)


def get_interactions(contact_id: int) -> pd.DataFrame:
    with get_connection() as conn:
        return pd.read_sql_query(
            "SELECT * FROM interactions WHERE contact_id = ? ORDER BY date DESC",
            conn,
            params=(contact_id,),
        )


def add_interaction(data: Dict[str, Any]) -> int:
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO interactions (
                contact_id, date, type, channel, notes, sentiment, ai_summary, follow_up_required
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                data["contact_id"],
                data["date"],
                data["type"],
                data.get("channel", "Manual"),
                data.get("notes", ""),
                data.get("sentiment", "Neutral"),
                data.get("ai_summary", ""),
                1 if data.get("follow_up_required", False) else 0,
            ),
        )
        return int(cursor.lastrowid)
