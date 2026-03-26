"""
Up At Dawn - Marketing Dashboard POC
Built for Jeffrey Kirk and Up At Dawn LLC
Powered by DR Data Decision Intelligence
"""

import ast

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

PAGE_DECISION_ENGINE = "📋 Decision Engine"

# Page configuration
st.set_page_config(
    page_title="Up At Dawn - Marketing Dashboard",
    page_icon="🌅",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for professional styling
st.markdown("""
<style>
    /* Main styling */
    .main {
        background-color: #f8fafc;
    }
    
    /* Header styling */
    .dashboard-header {
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        padding: 2rem;
        border-radius: 12px;
        color: white;
        margin-bottom: 2rem;
    }
    
    /* KPI Card styling */
    .kpi-card {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        border: 1px solid #e5e7eb;
    }
    
    .kpi-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
    }
    
    .kpi-label {
        font-size: 0.875rem;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .trend-up {
        color: #10b981;
        font-weight: 600;
    }
    
    .trend-down {
        color: #ef4444;
        font-weight: 600;
    }
    
    /* Status badges */
    .status-on_track {
        background-color: #d1fae5;
        color: #065f46;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 600;
    }
    
    .status-attention {
        background-color: #fef3c7;
        color: #92400e;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 600;
    }
    
    .status-action_required {
        background-color: #fee2e2;
        color: #991b1b;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 600;
    }
    
    /* Client card styling */
    .client-card {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        border: 1px solid #e5e7eb;
        margin-bottom: 1rem;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .client-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    /* Section headers */
    .section-header {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e5e7eb;
    }
    
    /* ROI Calculator styling */
    .roi-highlight {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
    }
    
    .roi-number {
        font-size: 3.5rem;
        font-weight: 800;
    }
    .powered-by {
        font-size: 0.8rem;
        color: #9ca3af;
        margin: 0 0 1.25rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Load data
@st.cache_data
def load_data():
    clients = pd.read_csv('data/clients.csv')
    metrics = pd.read_csv('data/metrics.csv')
    feedback = pd.read_csv('data/feedback.csv')
    summary = pd.read_csv('data/client_summary.csv')
    
    # Convert date columns
    metrics['date'] = pd.to_datetime(metrics['date'])
    feedback['date'] = pd.to_datetime(feedback['date'])
    
    return clients, metrics, feedback, summary


def _compute_decision_engine_insights(
    summary_df: pd.DataFrame, _metrics_df: pd.DataFrame, _clients_df: pd.DataFrame
) -> dict:
    """Deterministic rules from loaded CSVs only (no external calls)."""
    priority: list[str] = []
    sorted_h = summary_df.sort_values("health_score", ascending=True)
    for _, r in sorted_h.head(3).iterrows():
        nm = str(r["client_name"])
        hs = int(r["health_score"])
        st_tr = float(r["session_trend"])
        if hs < 50:
            priority.append(
                f"Assign an owner and recovery playbook for **{nm}** (health {hs}/100); "
                f"sessions {st_tr:+.1f}% vs prior period—escalate within 48 hours."
            )
        elif hs < 70:
            priority.append(
                f"Hold a diagnostic sync on **{nm}** (health {hs}/100); "
                f"align on traffic ({st_tr:+.1f}%) and conversion levers before the next client touchpoint."
            )
        else:
            priority.append(
                f"Keep **{nm}** on cadence (health {hs}/100); document wins, risks, "
                f"and the next 30-day priorities for the account lead."
            )
    while len(priority) < 3:
        priority.append(
            "Refresh scorecards for all accounts and circulate a one-page internal brief to the team."
        )

    attention = summary_df[summary_df["health_score"] < 70].sort_values("health_score")
    moved = summary_df.sort_values("session_trend", ascending=False)[
        ["client_name", "session_trend", "health_score"]
    ]
    worst = summary_df.sort_values("session_trend", ascending=True).iloc[0]
    next_call = (
        f"**{worst['client_name']}** — largest session momentum change ({float(worst['session_trend']):+.1f}% vs prior). "
        "Schedule a decision call with the primary contact and the channel owner."
    )
    return {
        "priority_actions": priority[:3],
        "attention": attention,
        "moved": moved,
        "next_call": next_call,
    }


def _compute_team_actions_week(
    summary_df: pd.DataFrame, metrics_df: pd.DataFrame, clients_df: pd.DataFrame
) -> list[str]:
    """Three concrete team actions from current client data (deterministic)."""
    actions: list[str] = []

    pf = clients_df[clients_df["name"].str.contains("Premier Fence", na=False)]
    if len(pf):
        cid = str(pf.iloc[0]["id"])
        sub = metrics_df[metrics_df["client_id"] == cid].sort_values("date")
        if len(sub) >= 3:
            s0, s1, s2 = (
                float(sub["sessions"].iloc[-3]),
                float(sub["sessions"].iloc[-2]),
                float(sub["sessions"].iloc[-1]),
            )
            mom1 = (s1 - s0) / s0 * 100 if s0 else 0.0
            mom2 = (s2 - s1) / s1 * 100 if s1 else 0.0
            if mom1 < 0 and mom2 < 0:
                actions.append(
                    f"Call **Premier Fence** — sessions down {abs(mom2):.1f}% vs prior month, "
                    "second consecutive monthly decline; confirm root cause and remediation dates."
                )
            else:
                row = summary_df[summary_df["client_id"] == cid].iloc[0]
                actions.append(
                    f"Call **Premier Fence** — health {int(row['health_score'])}/100; "
                    f"sessions {float(row['session_trend']):+.1f}% vs prior period; align on next steps."
                )

    eh = summary_df[summary_df["client_name"].str.contains("Elite HVAC", na=False)]
    if len(eh):
        e = eh.iloc[0]
        actions.append(
            f"Prepare **Elite HVAC** renewal materials — contract review window in the next 30 days, "
            f"health score {int(e['health_score'])}; lead with ROI proof and a clear scope option."
        )

    gr = summary_df[summary_df["client_name"].str.contains("Green Roofing", na=False)]
    if len(gr):
        g = gr.iloc[0]
        actions.append(
            f"Request **Green Roofing** feedback — conversions {float(g['conversion_trend']):+.1f}% vs prior period; "
            "engagement is at risk; pair the ask with a short wins recap."
        )

    return actions[:3]


# Load all data
clients_df, metrics_df, feedback_df, summary_df = load_data()
DE_INSIGHTS = _compute_decision_engine_insights(summary_df, metrics_df, clients_df)
TEAM_ACTIONS_WEEK = _compute_team_actions_week(summary_df, metrics_df, clients_df)

if 'selected_client' not in st.session_state:
    st.session_state.selected_client = None

# Sidebar navigation
st.sidebar.markdown("""
<div style="text-align: center; padding: 1rem 0;">
    <h2 style="color: #1e3a8a; margin: 0;">🌅 Up At Dawn</h2>
    <p style="color: #6b7280; font-size: 0.875rem;">Marketing Dashboard</p>
</div>
""", unsafe_allow_html=True)

st.sidebar.markdown("---")

# Navigation
page = st.sidebar.radio(
    "Navigation",
    [
        "🏠 Executive Dashboard",
        "👥 Client Management",
        PAGE_DECISION_ENGINE,
        "📊 ROI Calculator",
        "⚙️ Settings",
    ],
)

if page == PAGE_DECISION_ENGINE:
    st.sidebar.markdown(
        '<p class="powered-by">Powered by Dr. Data Decision Intelligence</p>',
        unsafe_allow_html=True,
    )

st.sidebar.markdown("---")

# Client selector for individual views
st.sidebar.markdown("### Quick Client View")
selected_client_name = st.sidebar.selectbox(
    "Select a client",
    ["All Clients"] + list(clients_df['name'].values)
)

if selected_client_name != "All Clients":
    st.session_state.selected_client = clients_df[clients_df['name'] == selected_client_name].iloc[0]
else:
    st.session_state.selected_client = None

# Main content based on page selection
if page == "🏠 Executive Dashboard":
    # Header
    st.markdown("""
    <div class="dashboard-header">
        <h1>Executive Dashboard</h1>
        <p>Welcome back, Jeff! Here's what's happening across all your clients.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Top KPIs
    col1, col2, col3, col4 = st.columns(4)
    
    total_clients = len(clients_df)
    active_campaigns = sum(
        len(ast.literal_eval(s)) if isinstance(s, str) else len(s)
        for s in clients_df["services"]
    )
    total_monthly_revenue = clients_df['monthly_retainer'].sum()
    avg_health = summary_df['health_score'].mean()
    
    with col1:
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-label">Total Clients</div>
            <div class="kpi-value">{total_clients}</div>
            <div class="trend-up">↑ 3 new this quarter</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-label">Active Campaigns</div>
            <div class="kpi-value">{active_campaigns}</div>
            <div class="trend-up">↑ 2 this month</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-label">Monthly Revenue</div>
            <div class="kpi-value">${total_monthly_revenue:,}</div>
            <div class="trend-up">↑ 8% vs last month</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        trend_class = "trend-up" if avg_health >= 70 else "trend-down"
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-label">Avg Health Score</div>
            <div class="kpi-value">{avg_health:.0f}</div>
            <div class="{trend_class}">{'↑' if avg_health >= 70 else '↓'} {avg_health - 75:.0f} points</div>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    st.markdown('<div class="section-header">Team Actions This Week</div>', unsafe_allow_html=True)
    st.caption(
        "Concrete next steps for your team from current client metrics—so they can decide without waiting on you."
    )
    for i, action in enumerate(TEAM_ACTIONS_WEEK, start=1):
        st.markdown(f"{i}. {action}")
    st.markdown(
        '<p class="powered-by">Powered by Dr. Data Decision Intelligence</p>',
        unsafe_allow_html=True,
    )
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Client Performance Matrix
    st.markdown('<div class="section-header">Client Performance Matrix</div>', unsafe_allow_html=True)
    
    # Filter options
    col1, col2, col3 = st.columns([2, 2, 1])
    with col1:
        status_filter = st.selectbox("Filter by Status", ["All", "On Track", "Needs Attention", "Action Required"])
    with col2:
        industry_filter = st.selectbox("Filter by Industry", ["All"] + list(clients_df['industry'].unique()))
    with col3:
        st.markdown("<br>", unsafe_allow_html=True)
        refresh = st.button("🔄 Refresh Data")
    
    # Apply filters
    filtered_summary = summary_df.copy()
    if status_filter != "All":
        status_map = {"On Track": "on_track", "Needs Attention": "attention", "Action Required": "action_required"}
        filtered_summary = filtered_summary[filtered_summary['status'] == status_map.get(status_filter, status_filter)]
    if industry_filter != "All":
        filtered_summary = filtered_summary[filtered_summary['industry'] == industry_filter]
    
    # Display client cards in a grid
    cols = st.columns(3)
    for idx, (_, client) in enumerate(filtered_summary.iterrows()):
        with cols[idx % 3]:
            status_class = f"status-{client['status']}"
            status_text = client['status'].replace('_', ' ').title()
            
            # Determine trend indicators
            session_trend_icon = "↑" if client['session_trend'] > 0 else "↓" if client['session_trend'] < 0 else "→"
            session_trend_class = "trend-up" if client['session_trend'] > 0 else "trend-down" if client['session_trend'] < 0 else ""
            
            st.markdown(f"""
            <div class="client-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h4 style="margin: 0; color: #1f2937;">{client['client_name']}</h4>
                    <span class="{status_class}">{status_text}</span>
                </div>
                <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem;">{client['industry']}</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <div style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase;">Sessions</div>
                        <div style="font-size: 1.25rem; font-weight: 700; color: #1f2937;">{client['latest_sessions']:,}</div>
                        <div class="{session_trend_class}" style="font-size: 0.875rem;">{session_trend_icon} {abs(client['session_trend']):.1f}%</div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase;">Health Score</div>
                        <div style="font-size: 1.25rem; font-weight: 700; color: #1f2937;">{client['health_score']}</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">/ 100</div>
                    </div>
                </div>
                
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase;">ROI</div>
                            <div style="font-size: 1rem; font-weight: 600; color: #10b981;">{client['roi_percentage']}%</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase;">Retainer</div>
                            <div style="font-size: 1rem; font-weight: 600; color: #1f2937;">${client['monthly_retainer']:,}</div>
                        </div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
    
    # Alerts Section
    st.markdown('<div class="section-header">Alerts & Action Items</div>', unsafe_allow_html=True)
    
    # Find clients needing attention
    attention_clients = summary_df[summary_df['status'].isin(['attention', 'action_required'])]
    
    if len(attention_clients) > 0:
        for _, client in attention_clients.iterrows():
            alert_color = "#ef4444" if client['status'] == 'action_required' else "#f59e0b"
            alert_icon = "🔴" if client['status'] == 'action_required' else "🟡"
            
            st.markdown(f"""
            <div style="background: white; padding: 1rem; border-radius: 8px; border-left: 4px solid {alert_color}; margin-bottom: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-size: 1.25rem; margin-right: 0.5rem;">{alert_icon}</span>
                        <strong>{client['client_name']}</strong>
                        <span style="color: #6b7280; margin-left: 1rem;">{client['industry']}</span>
                    </div>
                    <div>
                        <button style="background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">View Details</button>
                    </div>
                </div>
                <div style="margin-top: 0.5rem; color: #4b5563;">
                    {f"Sessions down {abs(client['session_trend']):.1f}%" if client['session_trend'] < 0 else f"Conversions down {abs(client['conversion_trend']):.1f}%" if client['conversion_trend'] < 0 else "Performance metrics need review"}
                </div>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.success("✅ All clients are on track! No immediate action required.")
    
    # Performance Overview Charts
    st.markdown('<div class="section-header">Performance Overview</div>', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Total sessions trend
        total_sessions_by_month = metrics_df.groupby('month_year')['sessions'].sum().reset_index()
        total_sessions_by_month = total_sessions_by_month.sort_values('month_year')
        
        fig = px.line(
            total_sessions_by_month, 
            x='month_year', 
            y='sessions',
            title='Total Website Sessions (All Clients)',
            markers=True
        )
        fig.update_layout(
            xaxis_title="Month",
            yaxis_title="Sessions",
            height=350,
            plot_bgcolor='white',
            paper_bgcolor='white'
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        # Conversions trend
        total_conversions_by_month = metrics_df.groupby('month_year')['conversions'].sum().reset_index()
        total_conversions_by_month = total_conversions_by_month.sort_values('month_year')
        
        fig = px.bar(
            total_conversions_by_month,
            x='month_year',
            y='conversions',
            title='Total Conversions (All Clients)',
            color_discrete_sequence=['#10b981']
        )
        fig.update_layout(
            xaxis_title="Month",
            yaxis_title="Conversions",
            height=350,
            plot_bgcolor='white',
            paper_bgcolor='white'
        )
        st.plotly_chart(fig, use_container_width=True)

elif page == "👥 Client Management":
    if st.session_state.selected_client is not None:
        client = st.session_state.selected_client
        client_summary = summary_df[summary_df['client_id'] == client['id']].iloc[0]
        client_metrics = metrics_df[metrics_df['client_id'] == client['id']].sort_values('date')
        client_feedback = feedback_df[feedback_df['client_id'] == client['id']].sort_values('date', ascending=False)
        
        # Client header
        st.markdown(f"""
        <div class="dashboard-header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1>{client['name']}</h1>
                    <p>{client['industry']} | {client['location']}</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 2rem; font-weight: 700;">${client['monthly_retainer']:,}</div>
                    <div style="font-size: 0.875rem;">Monthly Retainer</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Client KPIs
        col1, col2, col3, col4 = st.columns(4)
        
        latest_metrics = client_metrics.iloc[-1]
        
        with col1:
            st.markdown(f"""
            <div class="kpi-card">
                <div class="kpi-label">Website Visitors</div>
                <div class="kpi-value">{latest_metrics['sessions']:,}</div>
                <div class="trend-up">↑ {client_summary['session_trend']:.1f}% vs last month</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown(f"""
            <div class="kpi-card">
                <div class="kpi-label">Google Clicks</div>
                <div class="kpi-value">{latest_metrics['clicks']:,}</div>
                <div class="trend-up">↑ {np.random.uniform(5, 15):.1f}% vs last month</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col3:
            avg_time = f"{latest_metrics['avg_session_duration'] // 60}m {latest_metrics['avg_session_duration'] % 60}s"
            st.markdown(f"""
            <div class="kpi-card">
                <div class="kpi-label">Avg Time on Site</div>
                <div class="kpi-value">{avg_time}</div>
                <div class="trend-up">↑ {np.random.uniform(5, 20):.1f}% vs last month</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col4:
            st.markdown(f"""
            <div class="kpi-card">
                <div class="kpi-label">Conversions</div>
                <div class="kpi-value">{latest_metrics['conversions']}</div>
                <div class="trend-up">↑ {client_summary['conversion_trend']:.1f}% vs last month</div>
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        # Tabs for different views
        tab1, tab2, tab3, tab4 = st.tabs(["📈 Performance", "🔍 Search Visibility", "⭐ Reviews", "💬 Feedback"])
        
        with tab1:
            col1, col2 = st.columns(2)
            
            with col1:
                # Sessions over time
                fig = px.line(
                    client_metrics,
                    x='month_year',
                    y='sessions',
                    title='Website Sessions Over Time',
                    markers=True
                )
                fig.update_layout(height=350)
                st.plotly_chart(fig, use_container_width=True)
            
            with col2:
                # Conversions over time
                fig = px.bar(
                    client_metrics,
                    x='month_year',
                    y='conversions',
                    title='Conversions Over Time',
                    color_discrete_sequence=['#3b82f6']
                )
                fig.update_layout(height=350)
                st.plotly_chart(fig, use_container_width=True)
            
            # Engagement metrics
            st.markdown("<br>", unsafe_allow_html=True)
            st.markdown('<div class="section-header">Engagement Metrics</div>', unsafe_allow_html=True)
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                fig = px.pie(
                    values=[latest_metrics['bounce_rate'], 100 - latest_metrics['bounce_rate']],
                    names=['Bounce', 'Stay'],
                    title='Bounce Rate',
                    color_discrete_sequence=['#ef4444', '#10b981']
                )
                fig.update_layout(height=250)
                st.plotly_chart(fig, use_container_width=True)
            
            with col2:
                fig = px.line(
                    client_metrics,
                    x='month_year',
                    y='pages_per_session',
                    title='Pages Per Session',
                    markers=True,
                    color_discrete_sequence=['#8b5cf6']
                )
                fig.update_layout(height=250)
                st.plotly_chart(fig, use_container_width=True)
            
            with col3:
                fig = px.bar(
                    client_metrics,
                    x='month_year',
                    y='avg_session_duration',
                    title='Avg Session Duration (seconds)',
                    color_discrete_sequence=['#f59e0b']
                )
                fig.update_layout(height=250)
                st.plotly_chart(fig, use_container_width=True)
        
        with tab2:
            col1, col2 = st.columns(2)
            
            with col1:
                # Search impressions and clicks
                fig = make_subplots(specs=[[{"secondary_y": True}]])
                
                fig.add_trace(
                    go.Scatter(
                        x=client_metrics['month_year'],
                        y=client_metrics['impressions'],
                        name="Impressions",
                        line=dict(color="#3b82f6")
                    ),
                    secondary_y=False
                )
                
                fig.add_trace(
                    go.Scatter(
                        x=client_metrics['month_year'],
                        y=client_metrics['clicks'],
                        name="Clicks",
                        line=dict(color="#10b981")
                    ),
                    secondary_y=True
                )
                
                fig.update_layout(
                    title_text="Search Impressions vs Clicks",
                    height=400
                )
                
                st.plotly_chart(fig, use_container_width=True)
            
            with col2:
                # CTR trend
                fig = px.line(
                    client_metrics,
                    x='month_year',
                    y='ctr',
                    title='Click-Through Rate (CTR)',
                    markers=True,
                    color_discrete_sequence=['#8b5cf6']
                )
                fig.update_layout(height=400)
                st.plotly_chart(fig, use_container_width=True)
            
            # Search position
            st.markdown("<br>", unsafe_allow_html=True)
            fig = px.area(
                client_metrics,
                x='month_year',
                y='position',
                title='Average Search Position (Lower is Better)',
                color_discrete_sequence=['#f59e0b']
            )
            fig.update_layout(height=350)
            st.plotly_chart(fig, use_container_width=True)
        
        with tab3:
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                st.markdown(f"""
                <div class="kpi-card" style="text-align: center;">
                    <div class="kpi-label">Average Rating</div>
                    <div class="kpi-value" style="color: #f59e0b;">⭐ {latest_metrics['avg_rating']}</div>
                    <div style="color: #6b7280;">out of 5</div>
                </div>
                """, unsafe_allow_html=True)
            
            with col2:
                st.markdown(f"""
                <div class="kpi-card" style="text-align: center;">
                    <div class="kpi-label">Total Reviews</div>
                    <div class="kpi-value">{latest_metrics['review_count']}</div>
                    <div class="trend-up">↑ {latest_metrics['new_reviews']} this month</div>
                </div>
                """, unsafe_allow_html=True)
            
            with col3:
                response_rate = np.random.randint(85, 98)
                st.markdown(f"""
                <div class="kpi-card" style="text-align: center;">
                    <div class="kpi-label">Response Rate</div>
                    <div class="kpi-value">{response_rate}%</div>
                    <div style="color: #6b7280;">to reviews</div>
                </div>
                """, unsafe_allow_html=True)
            
            with col4:
                st.markdown(f"""
                <div class="kpi-card" style="text-align: center;">
                    <div class="kpi-label">Review Velocity</div>
                    <div class="kpi-value">{latest_metrics['new_reviews']}</div>
                    <div style="color: #6b7280;">per month</div>
                </div>
                """, unsafe_allow_html=True)
            
            st.markdown("<br>", unsafe_allow_html=True)
            
            # Review trend
            fig = px.line(
                client_metrics,
                x='month_year',
                y=['review_count', 'avg_rating'],
                title='Review Count & Rating Trend',
                markers=True
            )
            fig.update_layout(height=400)
            st.plotly_chart(fig, use_container_width=True)
        
        with tab4:
            st.markdown('<div class="section-header">Client Feedback Loop</div>', unsafe_allow_html=True)
            
            # Feedback summary
            total_feedback_value = client_feedback['value'].sum()
            feedback_count = len(client_feedback)
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.metric("Total Feedback Entries", feedback_count)
            
            with col2:
                st.metric("Attributed Revenue", f"${total_feedback_value:,}")
            
            with col3:
                roi = (total_feedback_value / (client['monthly_retainer'] * 12)) * 100
                st.metric("ROI", f"{roi:.0f}%")
            
            st.markdown("<br>", unsafe_allow_html=True)
            
            # Display feedback entries
            for _, feedback in client_feedback.iterrows():
                feedback_date = feedback['date'].strftime('%b %d, %Y')
                feedback_type_emoji = "💰" if feedback['type'] in ['lead', 'sale'] else "⚠️" if feedback['type'] == 'complaint' else "💬"
                
                st.markdown(f"""
                <div style="background: white; padding: 1rem; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <span style="font-size: 1.25rem; margin-right: 0.5rem;">{feedback_type_emoji}</span>
                            <strong>{feedback['type'].title()}</strong>
                            <span style="color: #6b7280; margin-left: 1rem; font-size: 0.875rem;">{feedback_date}</span>
                        </div>
                        <div style="font-weight: 700; color: #10b981;">
                            ${feedback['value']:,}
                        </div>
                    </div>
                    <div style="margin-top: 0.5rem; color: #4b5563;">
                        {feedback['description']}
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280;">
                        Recorded by: {feedback['recorded_by']}
                    </div>
                </div>
                """, unsafe_allow_html=True)
            
            # Add feedback button
            st.markdown("<br>", unsafe_allow_html=True)
            if st.button("➕ Add New Feedback", type="primary"):
                st.info("In the full version, this would open a form to add new client feedback.")
    
    else:
        st.info("👈 Select a client from the sidebar to view their detailed dashboard.")
        
        # Show all clients list
        st.markdown('<div class="section-header">All Clients</div>', unsafe_allow_html=True)
        
        for _, client in clients_df.iterrows():
            client_summary = summary_df[summary_df['client_id'] == client['id']].iloc[0]
            status_class = f"status-{client_summary['status']}"
            status_text = client_summary['status'].replace('_', ' ').title()
            
            col1, col2, col3, col4, col5 = st.columns([3, 2, 2, 2, 2])
            
            with col1:
                st.write(f"**{client['name']}**")
                st.caption(f"{client['industry']}")
            
            with col2:
                st.markdown(f"<span class='{status_class}'>{status_text}</span>", unsafe_allow_html=True)
            
            with col3:
                st.write(f"${client['monthly_retainer']:,}")
                st.caption("Monthly")
            
            with col4:
                st.write(f"{client_summary['health_score']}/100")
                st.caption("Health Score")
            
            with col5:
                st.write(f"{client_summary['roi_percentage']}%")
                st.caption("ROI")
            
            st.markdown("---")

elif page == PAGE_DECISION_ENGINE:
    st.markdown(
        """
    <div class="dashboard-header">
        <h1>Decision Engine</h1>
        <p>Structured priorities from your portfolio metrics—deterministic decision intelligence from the same data as the rest of this dashboard.</p>
    </div>
    """,
        unsafe_allow_html=True,
    )
    st.markdown(
        '<p class="powered-by">Powered by Dr. Data Decision Intelligence</p>',
        unsafe_allow_html=True,
    )

    st.markdown(
        '<div class="section-header">This Week\'s Priority Actions</div>',
        unsafe_allow_html=True,
    )
    for bullet in DE_INSIGHTS["priority_actions"]:
        st.markdown(f"- {bullet}")

    st.markdown(
        '<div class="section-header">Clients Needing Your Attention</div>',
        unsafe_allow_html=True,
    )
    st.caption("Accounts with health score under 70.")
    att = DE_INSIGHTS["attention"]
    if len(att) == 0:
        st.success("No accounts below the health threshold.")
    else:
        for _, row in att.iterrows():
            st.markdown(
                f"- **{row['client_name']}** — health **{int(row['health_score'])}/100**; "
                f"sessions {float(row['session_trend']):+.1f}%; conversions {float(row['conversion_trend']):+.1f}%."
            )

    st.markdown(
        '<div class="section-header">What Moved This Week</div>',
        unsafe_allow_html=True,
    )
    st.caption("Session trend vs prior period (from loaded metrics).")
    for _, row in DE_INSIGHTS["moved"].iterrows():
        trend = float(row["session_trend"])
        if trend > 0:
            direction = "up"
        elif trend < 0:
            direction = "down"
        else:
            direction = "flat"
        st.markdown(
            f"- **{row['client_name']}**: sessions **{direction}** ({trend:+.1f}%), health {int(row['health_score'])}."
        )

    st.markdown(
        '<div class="section-header">Recommended Next Call</div>',
        unsafe_allow_html=True,
    )
    st.markdown(DE_INSIGHTS["next_call"])
    st.markdown(
        '<p class="powered-by">Powered by Dr. Data Decision Intelligence</p>',
        unsafe_allow_html=True,
    )

elif page == "📊 ROI Calculator":
    st.markdown("""
    <div class="dashboard-header">
        <h1>📊 ROI Calculator</h1>
        <p>See the real value this dashboard delivers to your agency.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Current State
    st.markdown('<div class="section-header">Your Current State</div>', unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        hours_per_week = st.number_input("Hours/week on reporting", value=11, min_value=0, max_value=40)
    
    with col2:
        hourly_value = st.number_input("Your hourly value ($)", value=150, min_value=50, max_value=500)
    
    with col3:
        num_clients = st.number_input("Number of clients", value=8, min_value=1, max_value=50)
    
    # Calculate current costs
    weekly_cost = hours_per_week * hourly_value
    annual_cost = weekly_cost * 52
    
    st.markdown(f"""
    <div style="background: #fee2e2; padding: 1.5rem; border-radius: 12px; margin: 2rem 0;">
        <h4 style="color: #991b1b; margin-top: 0;">💸 Current Annual Cost: ${annual_cost:,}</h4>
        <p style="color: #7f1d1d; margin-bottom: 0;">
            You're spending {hours_per_week} hours/week × ${hourly_value}/hour × 52 weeks = <strong>${annual_cost:,}</strong> annually on reporting
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # With Dashboard
    st.markdown('<div class="section-header">With Dashboard Solution</div>', unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        new_hours = st.number_input("New hours/week on reporting", value=2, min_value=0, max_value=20)
    
    with col2:
        retention_improvement = st.slider("Retention improvement (%)", 0, 50, 10)
    
    with col3:
        new_clients = st.number_input("Additional clients/year", value=2, min_value=0, max_value=20)
    
    # Calculate savings and gains
    new_weekly_cost = new_hours * hourly_value
    new_annual_cost = new_weekly_cost * 52
    time_savings = annual_cost - new_annual_cost
    
    avg_retainer = clients_df['monthly_retainer'].mean()
    retention_value = (retention_improvement / 100) * num_clients * avg_retainer * 12
    new_client_value = new_clients * avg_retainer * 12
    
    total_value = time_savings + retention_value + new_client_value
    
    # Dashboard investment
    dashboard_cost = 2500 * 12  # Monthly fee
    
    net_benefit = total_value - dashboard_cost
    roi_percentage = (net_benefit / dashboard_cost) * 100
    
    # Display results
    st.markdown("<br>", unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown(f"""
        <div class="roi-highlight">
            <div style="font-size: 1rem; margin-bottom: 0.5rem;">ANNUAL VALUE CREATED</div>
            <div class="roi-number">${total_value:,}</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 2rem; border-radius: 12px; text-align: center;">
            <div style="font-size: 1rem; margin-bottom: 0.5rem;">NET ROI</div>
            <div style="font-size: 3.5rem; font-weight: 800;">{roi_percentage:.0f}%</div>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Breakdown
    st.markdown('<div class="section-header">Value Breakdown</div>', unsafe_allow_html=True)
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Time Savings", f"${time_savings:,}", f"{((time_savings/annual_cost)*100):.0f}% reduction")
    
    with col2:
        st.metric("Retention Value", f"${retention_value:,}", f"+{retention_improvement}%")
    
    with col3:
        st.metric("New Client Value", f"${new_client_value:,}", f"+{new_clients} clients")
    
    with col4:
        st.metric("Dashboard Cost", f"-${dashboard_cost:,}", "Annual investment")
    
    # Final net benefit
    st.markdown("<br>", unsafe_allow_html=True)
    
    st.markdown(f"""
    <div style="background: #d1fae5; padding: 2rem; border-radius: 12px; text-align: center;">
        <h3 style="color: #065f46; margin-top: 0;">🎯 Net Annual Benefit: ${net_benefit:,}</h3>
        <p style="color: #047857; margin-bottom: 0; font-size: 1.1rem;">
            For every $1 you invest in the dashboard, you get ${(total_value/dashboard_cost):.2f} back in value
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # What you get section
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown('<div class="section-header">What You Get</div>', unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        **⏰ Time Savings**
        • 80-90% reduction in reporting time
        • No more manual report creation
        • Automated data collection
        • Instant client insights
        """)
    
    with col2:
        st.markdown("""
        **💼 Business Growth**
        • Higher client retention
        • Easier new client acquisition
        • Tangible differentiator
        • Premium pricing justification
        """)
    
    with col3:
        st.markdown("""
        **🎯 Operational Excellence**
        • Team makes better decisions
        • Proactive client management
        • Data-driven strategies
        • Scalable processes
        """)

elif page == "⚙️ Settings":
    st.markdown("""
    <div class="dashboard-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your dashboard preferences and integrations.</p>
    </div>
    """, unsafe_allow_html=True)
    
    tab1, tab2, tab3 = st.tabs(["🔌 Integrations", "👥 Team Management", "🔔 Notifications"])
    
    with tab1:
        st.markdown('<div class="section-header">Connected Data Sources</div>', unsafe_allow_html=True)
        
        # Google Analytics
        col1, col2, col3 = st.columns([3, 1, 1])
        with col1:
            st.write("**Google Analytics 4**")
            st.caption("Primary website traffic data")
        with col2:
            st.markdown("<span style='color: #10b981; font-weight: 600;'>● Connected</span>", unsafe_allow_html=True)
        with col3:
            st.button("Configure", key="ga4_config")
        
        st.markdown("---")
        
        # Google Search Console
        col1, col2, col3 = st.columns([3, 1, 1])
        with col1:
            st.write("**Google Search Console**")
            st.caption("Search performance and visibility")
        with col2:
            st.markdown("<span style='color: #10b981; font-weight: 600;'>● Connected</span>", unsafe_allow_html=True)
        with col3:
            st.button("Configure", key="gsc_config")
        
        st.markdown("---")
        
        # Google Business Profile
        col1, col2, col3 = st.columns([3, 1, 1])
        with col1:
            st.write("**Google Business Profile**")
            st.caption("Reviews and local SEO")
        with col2:
            st.markdown("<span style='color: #f59e0b; font-weight: 600;'>● Partial</span>", unsafe_allow_html=True)
        with col3:
            st.button("Configure", key="gbp_config")
        
        st.markdown("---")
        
        # Call Tracking
        col1, col2, col3 = st.columns([3, 1, 1])
        with col1:
            st.write("**CallRail (Call Tracking)**")
            st.caption("Phone call attribution")
        with col2:
            st.markdown("<span style='color: #6b7280; font-weight: 600;'>○ Not Connected</span>", unsafe_allow_html=True)
        with col3:
            st.button("Connect", key="callrail_config")
    
    with tab2:
        st.markdown('<div class="section-header">Team Members</div>', unsafe_allow_html=True)
        
        team_members = [
            {"name": "Jeff Kirk", "role": "Owner", "email": "jeff@upatdawn.com", "status": "Active"},
            {"name": "Team Member 1", "role": "Campaign Manager", "email": "team1@upatdawn.com", "status": "Active"},
            {"name": "Team Member 2", "role": "SEO Specialist", "email": "team2@upatdawn.com", "status": "Active"},
        ]
        
        for member in team_members:
            col1, col2, col3, col4 = st.columns([2, 2, 2, 1])
            with col1:
                st.write(f"**{member['name']}**")
            with col2:
                st.write(member['role'])
            with col3:
                st.write(member['email'])
            with col4:
                st.write(member['status'])
            st.markdown("---")
        
        if st.button("➕ Add Team Member"):
            st.info("In the full version, this would open a form to add new team members.")
    
    with tab3:
        st.markdown('<div class="section-header">Notification Preferences</div>', unsafe_allow_html=True)
        
        st.checkbox("📉 Traffic drop alerts (>20%)", value=True)
        st.checkbox("📈 Conversion spike alerts (>50%)", value=True)
        st.checkbox("⚠️ Client health score drops below 60", value=True)
        st.checkbox("📧 Weekly summary email (Mondays)", value=True)
        st.checkbox("📊 Monthly performance report (1st of month)", value=True)
        st.checkbox("💬 New client feedback notifications", value=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        if st.button("Save Preferences"):
            st.success("Preferences saved!")

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #6b7280; padding: 2rem 0;">
    <p><strong>Up At Dawn Marketing Dashboard</strong> | Powered by DR Data Decision Intelligence</p>
    <p style="font-size: 0.875rem;">© 2026 Up At Dawn LLC. All rights reserved.</p>
</div>
""", unsafe_allow_html=True)
