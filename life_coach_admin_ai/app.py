from __future__ import annotations

import json
from datetime import date

import pandas as pd
import streamlit as st
import streamlit.components.v1 as components

from ai_engine import (
    analyze_mood_trend,
    calculate_engagement_score,
    generate_follow_up_message,
    generate_weekly_report,
    get_ai_insights,
    predict_churn_risk,
)
from database import (
    add_client,
    add_interaction,
    get_all_clients,
    get_client_by_id,
    get_interactions,
    init_database,
    update_client,
)

st.set_page_config(page_title="Admin AI Dashboard", layout="wide")


def inject_styles() -> None:
    st.markdown(
        """
        <style>
            .stApp { background-color: #f8f9fa; }
            .metric-card {
                border-radius: 14px;
                color: white;
                padding: 16px;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                margin-bottom: 10px;
            }
            .metric-value { font-size: 1.8rem; font-weight: 700; margin: 6px 0; }
            .metric-label { font-size: 0.9rem; opacity: 0.95; }
            .risk-badge-high, .risk-badge-medium, .risk-badge-low {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 999px;
                font-size: 0.78rem;
                font-weight: 700;
                color: #1f2937;
            }
            .risk-badge-high { background: #FF6B6B; color: #ffffff; }
            .risk-badge-medium { background: #FFD93D; }
            .risk-badge-low { background: #6BCB77; color: #0b3d1c; }
            .message-box {
                background: #edf4ff;
                border-left: 4px solid #667eea;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 8px;
            }
            .footer {
                text-align: center;
                font-size: 0.9rem;
                color: #6b7280;
                margin-top: 30px;
                padding: 14px 0;
            }
        </style>
        """,
        unsafe_allow_html=True,
    )


def render_metric_card(title: str, value: str, gradient: str) -> None:
    st.markdown(
        f"""
        <div class="metric-card" style="background: {gradient};">
            <div class="metric-label">{title}</div>
            <div class="metric-value">{value}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_copy_button(text: str, key: str) -> None:
    escaped_text = json.dumps(text)
    components.html(
        f"""
        <button
            onclick="navigator.clipboard.writeText({escaped_text});document.getElementById('copy-{key}').innerText='Copied';"
            style="background:#667eea;color:white;border:none;border-radius:6px;padding:6px 10px;cursor:pointer;"
        >
            Copy
        </button>
        <span id="copy-{key}" style="margin-left:8px;color:#475569;font-size:12px;"></span>
        """,
        height=38,
    )


def recalculate_clients(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return df
    updated_rows = []
    for _, row in df.iterrows():
        interactions = get_interactions(int(row["id"]))
        score = calculate_engagement_score(row.to_dict(), interactions)
        days_since = int(row["days_since_last_contact"])
        risk = predict_churn_risk(score, days_since)
        mood = analyze_mood_trend(interactions)
        payload = row.to_dict()
        payload["engagement_score"] = score
        payload["churn_risk"] = risk
        payload["mood_trend"] = mood
        update_client(int(row["id"]), payload)
        updated_rows.append(payload)
    fresh = pd.DataFrame(updated_rows)
    fresh["last_contact"] = pd.to_datetime(fresh["last_contact"], errors="coerce")
    fresh["days_since_last_contact"] = (pd.Timestamp.today().normalize() - fresh["last_contact"]).dt.days
    fresh["last_contact"] = fresh["last_contact"].dt.date.astype(str)
    return fresh


def page_dashboard(clients_df: pd.DataFrame) -> None:
    st.title("Admin AI Dashboard for Life Coaches")
    total_clients = len(clients_df)
    at_risk = int((clients_df["churn_risk"] == "HIGH").sum())
    avg_engagement = round(float(clients_df["engagement_score"].mean()), 1) if total_clients else 0
    follow_up = int((clients_df["days_since_last_contact"] >= 7).sum())

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        render_metric_card("Total Active Clients", f"{total_clients}", "linear-gradient(120deg, #667eea, #7f90ff)")
    with col2:
        render_metric_card("At-Risk Clients", f"{at_risk}", "linear-gradient(120deg, #ff6b6b, #ff8b8b)")
    with col3:
        render_metric_card("Average Engagement Score", f"{avg_engagement}%", "linear-gradient(120deg, #6bcb77, #88dd92)")
    with col4:
        render_metric_card("Need Follow-up", f"{follow_up}", "linear-gradient(120deg, #ffd93d, #ffe678)")

    st.subheader("AI Insights")
    for insight in get_ai_insights(clients_df):
        st.info(insight)

    st.subheader("Priority Clients")
    priority_df = clients_df.copy()
    risk_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    priority_df["risk_sort"] = priority_df["churn_risk"].map(risk_order)
    priority_df = priority_df.sort_values(["risk_sort", "days_since_last_contact"], ascending=[True, False])
    st.dataframe(
        priority_df[
            ["name", "churn_risk", "engagement_score", "days_since_last_contact", "next_action"]
        ].rename(columns={"days_since_last_contact": "days_since_contact"}),
        use_container_width=True,
        hide_index=True,
    )


def page_clients(clients_df: pd.DataFrame) -> None:
    st.title("Client Management")
    search_text = st.text_input("Search clients", placeholder="Type client name, goal, or note")
    risk_filter = st.multiselect("Filter by risk", ["HIGH", "MEDIUM", "LOW"], default=["HIGH", "MEDIUM", "LOW"])

    filtered = clients_df[clients_df["churn_risk"].isin(risk_filter)]
    if search_text:
        q = search_text.lower()
        mask = (
            filtered["name"].str.lower().str.contains(q)
            | filtered["goals"].str.lower().str.contains(q)
            | filtered["notes"].str.lower().str.contains(q)
        )
        filtered = filtered[mask]

    st.dataframe(
        filtered[
            ["id", "name", "email", "phone", "engagement_score", "churn_risk", "mood_trend", "days_since_last_contact"]
        ],
        use_container_width=True,
        hide_index=True,
    )

    st.markdown("---")
    st.subheader("Add New Client")
    with st.form("add_client_form"):
        c1, c2 = st.columns(2)
        with c1:
            name = st.text_input("Name")
            email = st.text_input("Email")
            phone = st.text_input("Phone")
            start_date = st.date_input("Start Date", value=date.today())
            last_contact = st.date_input("Last Contact Date", value=date.today())
        with c2:
            last_session = st.date_input("Last Session Date", value=date.today())
            goals = st.text_area("Goals")
            notes = st.text_area("Notes")
            next_action = st.text_input("Next Action", value="Schedule next check-in.")
            engagement = st.slider("Engagement Score", 0, 100, 50)
        submitted = st.form_submit_button("Add Client")
        if submitted and name:
            risk = predict_churn_risk(engagement, 0)
            add_client(
                {
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "start_date": start_date.isoformat(),
                    "last_contact": last_contact.isoformat(),
                    "last_session": last_session.isoformat(),
                    "goals": goals,
                    "notes": notes,
                    "engagement_score": engagement,
                    "churn_risk": risk,
                    "mood_trend": "😐 Neutral",
                    "next_action": next_action,
                }
            )
            st.success(f"Added {name}. Refreshing dashboard data.")
            st.rerun()

    st.markdown("---")
    st.subheader("Client Detail View")
    client_id = st.selectbox("Select client", options=clients_df["id"], format_func=lambda cid: get_client_by_id(int(cid))["name"])
    client = get_client_by_id(int(client_id))
    if client:
        left, right = st.columns(2)
        with left:
            st.write(f"**Name:** {client['name']}")
            st.write(f"**Email:** {client['email']}")
            st.write(f"**Phone:** {client['phone']}")
            st.write(f"**Goals:** {client['goals']}")
            st.write(f"**Notes:** {client['notes']}")
        with right:
            days_since = (pd.Timestamp.today().normalize() - pd.to_datetime(client["last_contact"])).days
            badge_class = {
                "HIGH": "risk-badge-high",
                "MEDIUM": "risk-badge-medium",
                "LOW": "risk-badge-low",
            }.get(client["churn_risk"], "risk-badge-medium")
            st.markdown(
                f"**Risk:** <span class='{badge_class}'>{client['churn_risk']}</span>",
                unsafe_allow_html=True,
            )
            st.write(f"**Engagement Score:** {client['engagement_score']}")
            st.write(f"**Mood Trend:** {client['mood_trend']}")
            st.write(f"**Days Since Last Contact:** {days_since}")
            st.write(f"**Next Action:** {client['next_action']}")

        interactions = get_interactions(int(client_id))
        st.write("**Interactions**")
        st.dataframe(interactions, use_container_width=True, hide_index=True)

        with st.form("add_interaction_form"):
            i1, i2 = st.columns(2)
            with i1:
                interaction_date = st.date_input("Interaction Date", value=date.today())
                interaction_type = st.selectbox("Interaction Type", ["Session", "Email", "Check-in"])
            with i2:
                sentiment = st.selectbox("Sentiment", ["Positive", "Neutral", "Mixed", "Negative"])
                note = st.text_input("Interaction Notes")
            submit_interaction = st.form_submit_button("Add Interaction")
            if submit_interaction:
                add_interaction(
                    {
                        "client_id": int(client_id),
                        "date": interaction_date.isoformat(),
                        "type": interaction_type,
                        "notes": note,
                        "sentiment": sentiment,
                    }
                )
                st.success("Interaction added.")
                st.rerun()


def page_ai_messages(clients_df: pd.DataFrame) -> None:
    st.title("AI Message Generator")
    selected_id = st.selectbox(
        "Select client",
        options=clients_df["id"],
        format_func=lambda cid: clients_df[clients_df["id"] == cid]["name"].iloc[0],
    )
    client = clients_df[clients_df["id"] == selected_id].iloc[0]
    days_since = int(client["days_since_last_contact"])
    risk = client["churn_risk"]
    goals = client["goals"]

    st.markdown(
        f"""
        **Client Context**  
        - Risk Level: `{risk}`  
        - Days Since Last Contact: `{days_since}`  
        - Goals: `{goals}`
        """
    )

    if st.button("Generate 3 AI Follow-up Messages", type="primary"):
        messages = generate_follow_up_message(client["name"], days_since, goals, risk)
        for idx, msg in enumerate(messages, start=1):
            st.markdown(f"<div class='message-box'><b>Option {idx}</b><br>{msg}</div>", unsafe_allow_html=True)
            c1, c2 = st.columns([1, 1])
            with c1:
                render_copy_button(msg, key=f"{selected_id}-{idx}")
            with c2:
                if st.button(f"Send Option {idx}", key=f"send-{selected_id}-{idx}"):
                    st.success("Message queued and sent successfully (demo placeholder).")


def page_analytics(clients_df: pd.DataFrame) -> None:
    st.title("Analytics")
    c1, c2 = st.columns(2)
    with c1:
        st.subheader("Engagement Distribution")
        bins = pd.cut(
            clients_df["engagement_score"],
            bins=[0, 40, 70, 100],
            labels=["0-40", "41-70", "71-100"],
            include_lowest=True,
        )
        engagement_dist = bins.value_counts().sort_index()
        st.bar_chart(engagement_dist)

    with c2:
        st.subheader("Churn Risk Breakdown")
        risk_counts = clients_df["churn_risk"].value_counts().reindex(["HIGH", "MEDIUM", "LOW"]).fillna(0)
        st.bar_chart(risk_counts)

    c3, c4 = st.columns(2)
    with c3:
        st.subheader("Mood Trends")
        mood_group = (
            clients_df["mood_trend"]
            .fillna("😐 Neutral")
            .str.split(" ", n=1, expand=True)[1]
            .fillna("Neutral")
            .value_counts()
        )
        st.bar_chart(mood_group)

    with c4:
        st.subheader("Days Since Last Contact")
        day_bins = pd.cut(
            clients_df["days_since_last_contact"],
            bins=[0, 3, 7, 14, 999],
            labels=["0-3", "4-7", "8-14", "15+"],
            include_lowest=True,
        )
        histogram = day_bins.value_counts().sort_index()
        st.bar_chart(histogram)

    st.subheader("AI Weekly Report")
    st.text_area("Auto-generated report", value=generate_weekly_report(clients_df), height=220)


def page_settings() -> None:
    st.title("Settings")
    st.write("Configure dashboard behavior and AI preferences.")

    ai_provider = st.selectbox("AI Provider", ["Local Template Engine", "Ollama", "OpenAI"])
    low_threshold = st.slider("Low to Medium Risk Threshold (engagement)", 0, 100, 70)
    high_threshold = st.slider("Medium to High Risk Threshold (engagement)", 0, 100, 40)
    notify_email = st.checkbox("Enable email notifications", value=True)
    notify_followups = st.checkbox("Enable follow-up reminders", value=True)
    notify_digest = st.checkbox("Enable weekly digest", value=True)

    st.session_state["settings"] = {
        "ai_provider": ai_provider,
        "low_threshold": low_threshold,
        "high_threshold": high_threshold,
        "notify_email": notify_email,
        "notify_followups": notify_followups,
        "notify_digest": notify_digest,
    }

    st.success("Settings saved for this session.")


def main() -> None:
    inject_styles()
    init_database()
    clients_df = recalculate_clients(get_all_clients())

    with st.sidebar:
        st.header("Navigation")
        page = st.radio("Go to", ["Dashboard", "Clients", "AI Messages", "Analytics", "Settings"])

    if page == "Dashboard":
        page_dashboard(clients_df)
    elif page == "Clients":
        page_clients(clients_df)
    elif page == "AI Messages":
        page_ai_messages(clients_df)
    elif page == "Analytics":
        page_analytics(clients_df)
    else:
        page_settings()

    st.markdown("<div class='footer'>Built with ❤️ by Admin AI</div>", unsafe_allow_html=True)


if __name__ == "__main__":
    main()
