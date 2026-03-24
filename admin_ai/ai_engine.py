from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Dict, List

import pandas as pd


class AdminAIEngine:
    """AI engine for general business relationship management."""

    def __init__(self, use_local: bool = True) -> None:
        self.use_local = use_local

    def generate(self, prompt: str) -> str:
        # Local template fallback for offline demo mode.
        return (
            "Draft generated in local mode:\n"
            f"{prompt.strip()}\n\n"
            "Suggested next step: confirm priorities and send within one business day."
        )

    def predict_follow_up_priority(
        self, engagement_score: int, days_since_contact: int, interaction_count: int
    ) -> str:
        if engagement_score < 40 or days_since_contact > 14 or interaction_count == 0:
            return "HIGH"
        if engagement_score < 70 or days_since_contact > 7:
            return "MEDIUM"
        return "LOW"

    def calculate_engagement_score(self, contact_data: Dict, interactions: pd.DataFrame) -> int:
        score = 50
        days_since = int(contact_data.get("days_since_contact", 30))

        if days_since <= 3:
            score += 25
        elif days_since <= 7:
            score += 15
        elif days_since <= 14:
            score += 5
        elif days_since > 21:
            score -= 20
        elif days_since > 14:
            score -= 10

        if not interactions.empty:
            interactions = interactions.copy()
            interactions["date"] = pd.to_datetime(interactions["date"], errors="coerce")
            recent_cutoff = datetime.now() - timedelta(days=30)
            recent = interactions[interactions["date"] >= recent_cutoff]
            score += min(len(recent) * 5, 20)
            positive = (recent["sentiment"].str.lower() == "positive").sum()
            negative = (recent["sentiment"].str.lower() == "negative").sum()
            score += int(positive - negative) * 5

        return max(0, min(100, int(score)))

    def generate_follow_up_message(
        self, contact_name: str, days_since: int, objectives: str, priority: str
    ) -> List[str]:
        templates = {
            "HIGH": [
                f"Hi {contact_name}, I noticed we have not connected in {days_since} days regarding {objectives}. I know things get busy, just checking in to see how things are going and how I can help.",
                f"Hey {contact_name}, thinking about your priorities around {objectives}. No pressure, I wanted to make sure you have what you need to move forward.",
                f"Hello {contact_name}, quick note to reconnect on {objectives}. If helpful, we can do a short call this week to align next steps.",
            ],
            "MEDIUM": [
                f"Hi {contact_name}, hope you are doing well. Checking in on progress with {objectives} and seeing if any support would be useful.",
                f"Hello {contact_name}, wanted to follow up on {objectives}. Would you like a brief update or next-step summary by email?",
                f"Hey {contact_name}, circling back on {objectives}. Happy to share options to keep momentum steady.",
            ],
            "LOW": [
                f"Hi {contact_name}, great connecting recently. Nice progress on {objectives}, keep it going.",
                f"Hello {contact_name}, just wanted to celebrate the momentum around {objectives}. Looking forward to the next milestone.",
                f"Hey {contact_name}, positive update from your side lately on {objectives}. Let me know when you are ready for the next step.",
            ],
        }
        return templates.get(priority, templates["MEDIUM"])

    def summarize_interaction(self, notes: str, interaction_type: str) -> str:
        if not notes:
            return f"{interaction_type} captured. No detailed notes yet."
        return f"{interaction_type} summary: {notes[:140]}"

    def suggest_next_action(self, contact_data: Dict, recent_interactions: pd.DataFrame) -> str:
        if contact_data["follow_up_priority"] == "HIGH":
            return "Schedule call within 48 hours"
        if recent_interactions.empty:
            return "Send introductory email"
        if int(contact_data["engagement_score"]) > 80:
            return "Share valuable resource"
        return "Check in via email"

    def get_ai_insights(self, contacts_df: pd.DataFrame) -> List[str]:
        if contacts_df.empty:
            return ["No contacts available for insights yet."]
        high = int((contacts_df["follow_up_priority"] == "HIGH").sum())
        medium = int((contacts_df["follow_up_priority"] == "MEDIUM").sum())
        avg = round(float(contacts_df["engagement_score"].mean()), 1)
        max_gap_row = contacts_df.sort_values("days_since_contact", ascending=False).iloc[0]
        return [
            f"{high} contacts are marked HIGH priority and need immediate attention.",
            f"{medium} contacts are MEDIUM priority and should receive check-ins this week.",
            f"Average engagement is {avg}%, monitor accounts below 60%.",
            f"{max_gap_row['name']} has the longest gap at {int(max_gap_row['days_since_contact'])} days.",
        ]

    def analyze_engagement_sentiment(self, interactions: pd.DataFrame) -> str:
        if interactions.empty:
            return "🙂 Stable"
        top = interactions["sentiment"].str.lower().value_counts().idxmax()
        mapping = {
            "positive": "😊 Strong",
            "negative": "😟 Declining",
            "mixed": "😐 Mixed",
            "neutral": "🙂 Stable",
        }
        return mapping.get(top, "🙂 Stable")

    def generate_weekly_report(self, contacts_df: pd.DataFrame) -> str:
        if contacts_df.empty:
            return "No data available for weekly report."
        total = len(contacts_df)
        high = int((contacts_df["follow_up_priority"] == "HIGH").sum())
        medium = int((contacts_df["follow_up_priority"] == "MEDIUM").sum())
        low = int((contacts_df["follow_up_priority"] == "LOW").sum())
        avg = round(float(contacts_df["engagement_score"].mean()), 1)
        return (
            f"Weekly Admin AI Report ({date.today().isoformat()})\n\n"
            f"Executive summary: {total} active contacts are tracked with average engagement at {avg}%.\n"
            f"Key metrics: HIGH {high}, MEDIUM {medium}, LOW {low} follow-up priority.\n"
            "Recommendations: prioritize HIGH contacts in 48 hours, run MEDIUM status check-ins, and maintain LOW priority momentum with value-added outreach."
        )
