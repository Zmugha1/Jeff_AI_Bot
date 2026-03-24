from __future__ import annotations

APP_TITLE = "Admin AI Dashboard"
APP_SUBTITLE = "The last-mile integration for your business relationships"

PRIORITY_LEVELS = ["HIGH", "MEDIUM", "LOW"]
INTERACTION_TYPES = ["Email", "Call", "Meeting", "LinkedIn", "Note"]
INTERACTION_CHANNELS = ["Gmail", "LinkedIn", "Calendar", "Manual"]
SENTIMENT_OPTIONS = ["Positive", "Neutral", "Mixed", "Negative"]

DEFAULT_SETTINGS = {
    "ai_provider": "Local Template Engine",
    "calendar_type": "google",
    "gmail_connected": False,
    "linkedin_connected": False,
    "calendar_connected": False,
}
