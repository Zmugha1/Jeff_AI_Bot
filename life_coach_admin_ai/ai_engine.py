from __future__ import annotations

from datetime import date
from typing import Dict, List

import pandas as pd


def predict_churn_risk(engagement_score: int, days_since_contact: int) -> str:
    if engagement_score < 40 or days_since_contact > 14:
        return "HIGH"
    if engagement_score < 70 or days_since_contact > 7:
        return "MEDIUM"
    return "LOW"


def calculate_engagement_score(client_data: Dict, interactions: pd.DataFrame) -> int:
    last_contact = pd.to_datetime(client_data.get("last_contact"), errors="coerce")
    days_since_contact = 30
    if pd.notna(last_contact):
        days_since_contact = (pd.Timestamp.today().normalize() - last_contact.normalize()).days

    score = 50
    if days_since_contact <= 3:
        score += 20
    elif days_since_contact <= 7:
        score += 10
    elif days_since_contact > 14:
        score -= 20
    else:
        score -= 10

    if not interactions.empty:
        interactions = interactions.copy()
        interactions["date"] = pd.to_datetime(interactions["date"], errors="coerce")
        cutoff = pd.Timestamp.today().normalize() - pd.Timedelta(days=30)
        recent = interactions[interactions["date"] >= cutoff]
        positive_count = (recent["sentiment"].str.lower() == "positive").sum()
        negative_count = (recent["sentiment"].str.lower() == "negative").sum()
        score += int(positive_count) * 10
        score -= int(negative_count) * 10

    return int(max(0, min(100, score)))


def generate_follow_up_message(
    client_name: str, days_since: int, goals: str, risk_level: str
) -> List[str]:
    goal_focus = goals.strip().rstrip(".")
    if risk_level == "HIGH":
        return [
            f"Hi {client_name}, I know it has been {days_since} days since we last connected. No pressure at all, I just wanted to check in and support your progress on {goal_focus}.",
            f"Hey {client_name}, I have been thinking about your goals around {goal_focus}. If this week has felt heavy, we can restart with one small step together.",
            f"{client_name}, you are not behind. If it helps, reply with one quick win or obstacle from this week and I will help you build the next move on {goal_focus}.",
        ]
    if risk_level == "MEDIUM":
        return [
            f"Hi {client_name}, quick check-in since our last touchpoint {days_since} days ago. How is your momentum with {goal_focus} this week?",
            f"Hey {client_name}, I would love a short update on your progress with {goal_focus}. Want to set one clear goal for the next few days?",
            f"Hi {client_name}, you have made solid progress. What is one area in {goal_focus} where a focused nudge from me would help most right now?",
        ]
    return [
        f"Hi {client_name}, great work staying consistent with {goal_focus}. I am excited about your progress and ready for your next milestone.",
        f"Hey {client_name}, your momentum has been strong. Let us keep the energy up and turn your next step on {goal_focus} into a quick win.",
        f"Hi {client_name}, celebrating your consistency lately. If you want, we can map the next stretch goal for {goal_focus} together this week.",
    ]


def analyze_mood_trend(interactions: pd.DataFrame) -> str:
    if interactions.empty or "sentiment" not in interactions.columns:
        return "😐 Neutral"
    counts = interactions["sentiment"].str.lower().value_counts()
    top = counts.idxmax() if not counts.empty else "neutral"
    mapping = {
        "positive": "😊 Positive",
        "negative": "😕 Concerned",
        "mixed": "😐 Mixed",
        "neutral": "🙂 Stable",
    }
    return mapping.get(top, "😐 Neutral")


def get_ai_insights(clients_df: pd.DataFrame) -> List[str]:
    if clients_df.empty:
        return ["No client data available yet."]
    high_risk = clients_df[clients_df["churn_risk"] == "HIGH"]
    medium_risk = clients_df[clients_df["churn_risk"] == "MEDIUM"]
    avg_engagement = round(float(clients_df["engagement_score"].mean()), 1)
    longest_gap = clients_df.sort_values("days_since_last_contact", ascending=False).iloc[0]

    insights = [
        f"{len(high_risk)} high-risk clients need immediate follow-up this week.",
        f"Average engagement is {avg_engagement}%, focus on moving medium-risk clients upward.",
        f"{longest_gap['name']} has the longest contact gap at {int(longest_gap['days_since_last_contact'])} days.",
    ]
    if len(medium_risk) > 0:
        insights.append(
            "Target medium-risk clients with short progress check-ins to prevent churn."
        )
    return insights


def generate_weekly_report(clients_df: pd.DataFrame) -> str:
    if clients_df.empty:
        return "No data available for weekly report."

    total = len(clients_df)
    high = int((clients_df["churn_risk"] == "HIGH").sum())
    medium = int((clients_df["churn_risk"] == "MEDIUM").sum())
    low = int((clients_df["churn_risk"] == "LOW").sum())
    avg = round(float(clients_df["engagement_score"].mean()), 1)
    today = date.today().isoformat()

    return (
        f"Weekly AI Report ({today})\n\n"
        f"Executive summary: You currently support {total} active clients with an average engagement score of {avg}%.\n"
        f"Key metrics: HIGH risk {high}, MEDIUM risk {medium}, LOW risk {low}.\n"
        "Recommendations: Prioritize outreach to HIGH risk clients in the next 48 hours, "
        "then run structured progress check-ins for MEDIUM risk clients to sustain retention."
    )
