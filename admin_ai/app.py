from __future__ import annotations

from datetime import date

import pandas as pd
import streamlit as st

from ai_engine import AdminAIEngine
from config import (
    APP_SUBTITLE,
    APP_TITLE,
    DEFAULT_SETTINGS,
    INTERACTION_CHANNELS,
    INTERACTION_TYPES,
    PRIORITY_LEVELS,
    SENTIMENT_OPTIONS,
)
from database import (
    add_contact,
    add_interaction,
    get_all_contacts,
    get_connection,
    get_contact_by_id,
    get_interactions,
    init_database,
    update_contact,
)
from integrations import IntegrationManager
from utils import ensure_session_defaults, inject_styles, priority_badge, render_copy_button, render_metric_card

st.set_page_config(page_title=APP_TITLE, layout="wide")


def recalculate_contacts(engine: AdminAIEngine, contacts_df: pd.DataFrame) -> pd.DataFrame:
    if contacts_df.empty:
        return contacts_df

    refreshed = []
    for _, row in contacts_df.iterrows():
        interactions = get_interactions(int(row["id"]))
        payload = row.to_dict()
        payload["engagement_score"] = engine.calculate_engagement_score(payload, interactions)
        payload["engagement_sentiment"] = engine.analyze_engagement_sentiment(interactions)
        payload["follow_up_priority"] = engine.predict_follow_up_priority(
            int(payload["engagement_score"]),
            int(payload["days_since_contact"]),
            len(interactions),
        )
        payload["next_action"] = engine.suggest_next_action(payload, interactions)
        update_contact(int(row["id"]), payload)
        refreshed.append(payload)

    updated_df = pd.DataFrame(refreshed)
    updated_df["last_contact"] = pd.to_datetime(updated_df["last_contact"], errors="coerce")
    updated_df["days_since_contact"] = (pd.Timestamp.today().normalize() - updated_df["last_contact"]).dt.days
    updated_df["last_contact"] = updated_df["last_contact"].dt.date.astype(str)
    return updated_df


def page_dashboard(engine: AdminAIEngine, contacts_df: pd.DataFrame) -> None:
    st.markdown('<p class="main-header">Admin AI Dashboard</p>', unsafe_allow_html=True)
    st.markdown(f'<p class="sub-header">{APP_SUBTITLE}</p>', unsafe_allow_html=True)

    total_contacts = len(contacts_df)
    high_priority = int((contacts_df["follow_up_priority"] == "HIGH").sum()) if total_contacts else 0
    avg_engagement = round(float(contacts_df["engagement_score"].mean()), 0) if total_contacts else 0
    followups_due = int((contacts_df["days_since_contact"] > 7).sum()) if total_contacts else 0

    c1, c2, c3, c4 = st.columns(4)
    with c1:
        render_metric_card("Active Contacts", str(total_contacts), "linear-gradient(135deg, #667eea 0%, #5a67d8 100%)")
    with c2:
        render_metric_card("Need Attention", str(high_priority), "linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)")
    with c3:
        render_metric_card("Avg Engagement", f"{int(avg_engagement)}%", "linear-gradient(135deg, #6bcb77 0%, #5ab769 100%)")
    with c4:
        render_metric_card("Follow-ups Due", str(followups_due), "linear-gradient(135deg, #ffd93d 0%, #f9c846 100%)")

    st.subheader("AI Insights")
    for insight in engine.get_ai_insights(contacts_df):
        st.info(insight)

    st.subheader("Priority Contacts")
    priority_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    view_df = contacts_df.copy()
    view_df["sort_priority"] = view_df["follow_up_priority"].map(priority_order)
    view_df = view_df.sort_values(["sort_priority", "days_since_contact"], ascending=[True, False])
    st.dataframe(
        view_df[["name", "company", "title", "follow_up_priority", "engagement_score", "days_since_contact", "next_action"]],
        hide_index=True,
        use_container_width=True,
    )


def page_contacts(engine: AdminAIEngine, contacts_df: pd.DataFrame) -> None:
    st.title("Contacts")
    query = st.text_input("Search contacts", placeholder="Name, company, objective, tags")
    priority_filter = st.multiselect("Filter by follow-up priority", PRIORITY_LEVELS, default=PRIORITY_LEVELS)

    filtered = contacts_df[contacts_df["follow_up_priority"].isin(priority_filter)]
    if query:
        q = query.lower()
        mask = (
            filtered["name"].str.lower().str.contains(q)
            | filtered["company"].fillna("").str.lower().str.contains(q)
            | filtered["objectives"].fillna("").str.lower().str.contains(q)
            | filtered["tags"].fillna("").str.lower().str.contains(q)
        )
        filtered = filtered[mask]

    st.dataframe(
        filtered[
            ["id", "name", "company", "title", "email", "source", "engagement_score", "follow_up_priority", "engagement_sentiment", "days_since_contact"]
        ],
        hide_index=True,
        use_container_width=True,
    )

    st.markdown("---")
    st.subheader("Add New Contact")
    with st.form("add_contact_form"):
        c1, c2 = st.columns(2)
        with c1:
            name = st.text_input("Name")
            email = st.text_input("Email")
            phone = st.text_input("Phone")
            company = st.text_input("Company")
            title = st.text_input("Title")
            linkedin_url = st.text_input("LinkedIn URL")
        with c2:
            source = st.text_input("Source", value="Referral")
            start_date = st.date_input("Start Date", value=date.today())
            last_contact = st.date_input("Last Contact", value=date.today())
            last_interaction = st.date_input("Last Interaction", value=date.today())
            objectives = st.text_area("Objectives")
            tags = st.text_input("Tags (comma-separated)")
            engagement_score = st.slider("Engagement Score", 0, 100, 50)
        notes = st.text_area("Notes")
        submitted = st.form_submit_button("Add Contact")
        if submitted and name:
            priority = engine.predict_follow_up_priority(engagement_score, 0, 1)
            add_contact(
                {
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "company": company,
                    "title": title,
                    "linkedin_url": linkedin_url,
                    "source": source,
                    "start_date": start_date.isoformat(),
                    "last_contact": last_contact.isoformat(),
                    "last_interaction": last_interaction.isoformat(),
                    "objectives": objectives,
                    "notes": notes,
                    "engagement_score": engagement_score,
                    "follow_up_priority": priority,
                    "engagement_sentiment": "🙂 Stable",
                    "next_action": "Check in via email",
                    "tags": tags,
                }
            )
            st.success("Contact added.")
            st.rerun()

    st.markdown("---")
    st.subheader("Contact Detail View")
    selected_id = st.selectbox(
        "Select contact",
        options=contacts_df["id"],
        format_func=lambda cid: f"{contacts_df[contacts_df['id'] == cid]['name'].iloc[0]}",
    )
    contact = get_contact_by_id(int(selected_id))
    if contact:
        lcol, rcol = st.columns(2)
        with lcol:
            st.write(f"**Name:** {contact['name']}")
            st.write(f"**Company:** {contact['company']}")
            st.write(f"**Title:** {contact['title']}")
            st.write(f"**Email:** {contact['email']}")
            st.write(f"**Phone:** {contact['phone']}")
            st.write(f"**LinkedIn:** {contact['linkedin_url']}")
            st.write(f"**Objectives:** {contact['objectives']}")
            st.write(f"**Tags:** {contact['tags']}")
        with rcol:
            st.markdown(f"**Follow-up Priority:** {priority_badge(contact['follow_up_priority'])}", unsafe_allow_html=True)
            st.write(f"**Engagement Score:** {contact['engagement_score']}")
            st.write(f"**Engagement Sentiment:** {contact['engagement_sentiment']}")
            st.write(f"**Source:** {contact['source']}")
            st.write(f"**Last Contact:** {contact['last_contact']}")
            st.write(f"**Last Interaction:** {contact['last_interaction']}")
            st.write(f"**Next Action:** {contact['next_action']}")

        interactions = get_interactions(int(selected_id))
        st.write("**Interactions**")
        st.dataframe(interactions, use_container_width=True, hide_index=True)

        with st.form("add_interaction_form"):
            i1, i2 = st.columns(2)
            with i1:
                interaction_date = st.date_input("Interaction Date", value=date.today())
                interaction_type = st.selectbox("Interaction Type", INTERACTION_TYPES)
                channel = st.selectbox("Channel", INTERACTION_CHANNELS)
            with i2:
                sentiment = st.selectbox("Sentiment", SENTIMENT_OPTIONS)
                notes = st.text_area("Interaction Notes")
                follow_up_required = st.checkbox("Follow-up required", value=False)
            submitted_interaction = st.form_submit_button("Add Interaction")
            if submitted_interaction:
                add_interaction(
                    {
                        "contact_id": int(selected_id),
                        "date": interaction_date.isoformat(),
                        "type": interaction_type,
                        "channel": channel,
                        "notes": notes,
                        "sentiment": sentiment,
                        "ai_summary": engine.summarize_interaction(notes, interaction_type),
                        "follow_up_required": follow_up_required,
                    }
                )
                st.success("Interaction added.")
                st.rerun()


def page_integrations(manager: IntegrationManager) -> None:
    st.title("Integrations")
    st.markdown("### Connect Your Tools")

    with st.expander("Gmail", expanded=True):
        gmail_email = st.text_input("Gmail Address", key="gmail_email")
        gmail_password = st.text_input("App Password", type="password", key="gmail_password")
        if st.button("Connect Gmail"):
            if gmail_email and gmail_password:
                connected = manager.setup_gmail(gmail_email, gmail_password)
                st.session_state["gmail_connected"] = connected
                if connected:
                    st.success("Gmail connected. Ready to sync unread threads.")
                else:
                    st.error("Gmail connection failed. Verify app password and IMAP access.")
            else:
                st.warning("Enter both Gmail address and app password.")

    with st.expander("LinkedIn"):
        li_username = st.text_input("LinkedIn Username", key="li_username")
        li_password = st.text_input("LinkedIn Password", type="password", key="li_password")
        if st.button("Connect LinkedIn"):
            manager.setup_linkedin(li_username, li_password)
            st.session_state["linkedin_connected"] = True
            st.info("LinkedIn integration is configured for MVP local tracking mode.")

    with st.expander("Google Calendar"):
        calendar_type = st.selectbox("Calendar Type", ["google", "outlook"], key="calendar_type")
        if st.button("Connect Calendar"):
            manager.setup_calendar(calendar_type)
            st.session_state["calendar_connected"] = True
            st.success("Calendar integration configured.")

    st.markdown("### Sync Status")
    c1, c2, c3 = st.columns(3)
    c1.metric("Gmail", "Connected" if st.session_state.get("gmail_connected") else "Not Connected")
    c2.metric("LinkedIn", "Connected" if st.session_state.get("linkedin_connected") else "Not Connected")
    c3.metric("Calendar", "Connected" if st.session_state.get("calendar_connected") else "Not Connected")

    if st.button("Sync All Now"):
        with st.spinner("Syncing integrations..."):
            results = manager.sync_all()
        st.success("Sync complete.")
        sc1, sc2, sc3, sc4 = st.columns(4)
        sc1.metric("Emails Checked", str(results["emails_checked"]))
        sc2.metric("Follow-ups Found", str(results["follow_ups_found"]))
        sc3.metric("Meetings Synced", str(results["meetings_synced"]))
        sc4.metric("New Interactions", str(results["new_interactions"]))


def page_ai_messages(engine: AdminAIEngine, contacts_df: pd.DataFrame) -> None:
    st.title("AI Messages")
    contact_id = st.selectbox(
        "Select contact",
        options=contacts_df["id"],
        format_func=lambda cid: f"{contacts_df[contacts_df['id'] == cid]['name'].iloc[0]}",
    )
    contact = contacts_df[contacts_df["id"] == contact_id].iloc[0]
    st.markdown(
        f"""
        **Contact Context**
        - Follow-up Priority: `{contact['follow_up_priority']}`
        - Days Since Contact: `{int(contact['days_since_contact'])}`
        - Objectives: `{contact['objectives']}`
        """
    )

    if st.button("Generate 3 Follow-up Message Options", type="primary"):
        messages = engine.generate_follow_up_message(
            contact["name"],
            int(contact["days_since_contact"]),
            contact["objectives"],
            contact["follow_up_priority"],
        )
        for idx, message in enumerate(messages, start=1):
            st.markdown(f"<div class='message-box'><b>Option {idx}</b><br>{message}</div>", unsafe_allow_html=True)
            c1, c2 = st.columns(2)
            with c1:
                render_copy_button(message, key=f"{contact_id}-{idx}")
            with c2:
                if st.button(f"Send Option {idx}", key=f"send-{contact_id}-{idx}"):
                    st.success("Message sent (placeholder action).")


def page_analytics(engine: AdminAIEngine, contacts_df: pd.DataFrame) -> None:
    st.title("Analytics")
    c1, c2 = st.columns(2)
    with c1:
        st.subheader("Engagement Distribution")
        bins = pd.cut(
            contacts_df["engagement_score"],
            bins=[0, 40, 70, 100],
            labels=["0-40", "41-70", "71-100"],
            include_lowest=True,
        )
        st.bar_chart(bins.value_counts().sort_index())

    with c2:
        st.subheader("Follow-up Priority Breakdown")
        priority_counts = contacts_df["follow_up_priority"].value_counts().reindex(PRIORITY_LEVELS).fillna(0)
        st.bar_chart(priority_counts)

    c3, c4 = st.columns(2)
    with c3:
        st.subheader("Engagement Sentiment")
        mood = (
            contacts_df["engagement_sentiment"]
            .fillna("🙂 Stable")
            .str.split(" ", n=1, expand=True)[1]
            .fillna("Stable")
            .value_counts()
        )
        st.bar_chart(mood)
    with c4:
        st.subheader("Days Since Contact")
        buckets = pd.cut(
            contacts_df["days_since_contact"],
            bins=[0, 3, 7, 14, 999],
            labels=["0-3", "4-7", "8-14", "15+"],
            include_lowest=True,
        )
        st.bar_chart(buckets.value_counts().sort_index())

    st.subheader("AI Weekly Report")
    st.text_area("Auto-generated report", value=engine.generate_weekly_report(contacts_df), height=220)


def page_settings() -> None:
    st.title("Settings")
    st.write("Configure provider preferences and follow-up behavior.")
    ai_provider = st.selectbox("AI Provider", ["Local Template Engine", "Ollama", "OpenAI"])
    high_threshold = st.slider("High Priority Threshold", 0, 100, 40)
    medium_threshold = st.slider("Medium Priority Threshold", 0, 100, 70)
    notify_email = st.checkbox("Enable email notifications", value=True)
    notify_summary = st.checkbox("Enable weekly summary", value=True)

    st.session_state["app_settings"] = {
        "ai_provider": ai_provider,
        "high_threshold": high_threshold,
        "medium_threshold": medium_threshold,
        "notify_email": notify_email,
        "notify_summary": notify_summary,
    }
    st.success("Settings saved for this session.")

    st.markdown(
        """
### Admin AI: The Last-Mile Integration

**The Problem**  
Most businesses use many tools that do not sync context across inbox, calendar, and relationship channels.

**The Solution**  
Admin AI is the missing integration layer that connects Gmail, Calendar, LinkedIn, and CRM-style workflows into one local dashboard.

**Your Data Stays Local**  
Admin AI runs on your machine. Your contact intelligence stays under your control.

**Core Capabilities**
- Gmail sync for unread follow-up detection
- Calendar awareness for post-meeting actions
- LinkedIn tracking in local MVP mode
- AI-powered priority scoring and messaging
- Unified interaction timeline and analytics
"""
    )


def main() -> None:
    ensure_session_defaults(DEFAULT_SETTINGS)
    inject_styles()
    init_database()

    engine = AdminAIEngine()
    contacts_df = recalculate_contacts(engine, get_all_contacts())

    if "integration_manager" not in st.session_state:
        st.session_state["integration_manager"] = IntegrationManager(get_connection())
    manager = st.session_state["integration_manager"]

    page = st.sidebar.radio(
        "Go to:",
        ["Dashboard", "Contacts", "Integrations", "AI Messages", "Analytics", "Settings"],
    )

    if page == "Dashboard":
        page_dashboard(engine, contacts_df)
    elif page == "Contacts":
        page_contacts(engine, contacts_df)
    elif page == "Integrations":
        page_integrations(manager)
    elif page == "AI Messages":
        page_ai_messages(engine, contacts_df)
    elif page == "Analytics":
        page_analytics(engine, contacts_df)
    else:
        page_settings()

    st.markdown("<div class='footer'>Built with ❤️ by Admin AI</div>", unsafe_allow_html=True)


if __name__ == "__main__":
    main()
