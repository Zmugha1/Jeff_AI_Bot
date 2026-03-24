from __future__ import annotations

import sqlite3
from datetime import date, timedelta
from pathlib import Path
from typing import Any, Dict, Optional

import pandas as pd

from sample_data import SAMPLE_CLIENTS, SAMPLE_INTERACTIONS

DB_PATH = Path(__file__).parent / "life_coach_admin_ai.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_database() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                start_date TEXT,
                last_contact TEXT,
                last_session TEXT,
                goals TEXT,
                notes TEXT,
                engagement_score INTEGER,
                churn_risk TEXT,
                mood_trend TEXT,
                next_action TEXT
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS interactions (
                id INTEGER PRIMARY KEY,
                client_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                type TEXT,
                notes TEXT,
                sentiment TEXT,
                FOREIGN KEY(client_id) REFERENCES clients(id)
            )
            """
        )

        existing_count = conn.execute("SELECT COUNT(*) FROM clients").fetchone()[0]
        if existing_count > 0:
            return

        for client in SAMPLE_CLIENTS:
            conn.execute(
                """
                INSERT INTO clients (
                    name, email, phone, start_date, last_contact, last_session,
                    goals, notes, engagement_score, churn_risk, mood_trend, next_action
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    client["name"],
                    client["email"],
                    client["phone"],
                    client["start_date"],
                    client["last_contact"],
                    client["last_session"],
                    client["goals"],
                    client["notes"],
                    client["engagement_score"],
                    client["churn_risk"],
                    client["mood_trend"],
                    client["next_action"],
                ),
            )

        name_to_id = {
            row["name"]: row["id"] for row in conn.execute("SELECT id, name FROM clients").fetchall()
        }
        for interaction in SAMPLE_INTERACTIONS:
            client_id = name_to_id.get(interaction["client_name"])
            if not client_id:
                continue
            interaction_date = (date.today() - timedelta(days=interaction["days_ago"])).isoformat()
            conn.execute(
                """
                INSERT INTO interactions (client_id, date, type, notes, sentiment)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    client_id,
                    interaction_date,
                    interaction["type"],
                    interaction["notes"],
                    interaction["sentiment"],
                ),
            )


def get_all_clients() -> pd.DataFrame:
    with get_connection() as conn:
        df = pd.read_sql_query("SELECT * FROM clients ORDER BY name", conn)
    if df.empty:
        return df
    df["last_contact"] = pd.to_datetime(df["last_contact"], errors="coerce")
    df["days_since_last_contact"] = (pd.Timestamp.today().normalize() - df["last_contact"]).dt.days
    df["last_contact"] = df["last_contact"].dt.date.astype(str)
    return df


def get_client_by_id(client_id: int) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM clients WHERE id = ?", (client_id,)).fetchone()
    return dict(row) if row else None


def add_client(data: Dict[str, Any]) -> int:
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO clients (
                name, email, phone, start_date, last_contact, last_session,
                goals, notes, engagement_score, churn_risk, mood_trend, next_action
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                data.get("name"),
                data.get("email"),
                data.get("phone"),
                data.get("start_date"),
                data.get("last_contact"),
                data.get("last_session"),
                data.get("goals"),
                data.get("notes"),
                int(data.get("engagement_score", 50)),
                data.get("churn_risk", "MEDIUM"),
                data.get("mood_trend", "😐 Neutral"),
                data.get("next_action", "Schedule next check-in."),
            ),
        )
        return int(cursor.lastrowid)


def update_client(client_id: int, data: Dict[str, Any]) -> None:
    fields = [
        "name",
        "email",
        "phone",
        "start_date",
        "last_contact",
        "last_session",
        "goals",
        "notes",
        "engagement_score",
        "churn_risk",
        "mood_trend",
        "next_action",
    ]
    assignments = ", ".join(f"{field} = ?" for field in fields)
    values = [data.get(field) for field in fields]
    values.append(client_id)
    with get_connection() as conn:
        conn.execute(f"UPDATE clients SET {assignments} WHERE id = ?", values)


def get_interactions(client_id: int) -> pd.DataFrame:
    with get_connection() as conn:
        interactions = pd.read_sql_query(
            "SELECT * FROM interactions WHERE client_id = ? ORDER BY date DESC",
            conn,
            params=(client_id,),
        )
    return interactions


def add_interaction(data: Dict[str, Any]) -> int:
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO interactions (client_id, date, type, notes, sentiment)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                data["client_id"],
                data["date"],
                data["type"],
                data["notes"],
                data["sentiment"],
            ),
        )
        return int(cursor.lastrowid)
