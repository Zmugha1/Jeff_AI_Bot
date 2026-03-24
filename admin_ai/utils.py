from __future__ import annotations

import json
from typing import Dict

import streamlit as st
import streamlit.components.v1 as components


def inject_styles() -> None:
    st.markdown(
        """
        <style>
            .stApp { background-color: #f8f9fa; }
            .main-header {
                font-size: 2rem;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 0.1rem;
            }
            .sub-header {
                font-size: 1rem;
                color: #6b7280;
                margin-bottom: 1.2rem;
            }
            .metric-card {
                background: linear-gradient(135deg, #667eea 0%, #5a67d8 100%);
                border-radius: 14px;
                color: white;
                padding: 16px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                margin-bottom: 10px;
            }
            .metric-value { font-size: 1.8rem; font-weight: 700; margin: 2px 0; }
            .metric-label { font-size: 0.88rem; opacity: 0.94; }
            .priority-high, .priority-medium, .priority-low {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 999px;
                font-size: 0.76rem;
                font-weight: 700;
            }
            .priority-high { background: #FF6B6B; color: #fff; }
            .priority-medium { background: #FFD93D; color: #1f2937; }
            .priority-low { background: #6BCB77; color: #0b3d1c; }
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
            <div class="metric-value">{value}</div>
            <div class="metric-label">{title}</div>
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


def priority_badge(priority: str) -> str:
    css = {
        "HIGH": "priority-high",
        "MEDIUM": "priority-medium",
        "LOW": "priority-low",
    }.get(priority, "priority-medium")
    return f"<span class='{css}'>{priority}</span>"


def ensure_session_defaults(defaults: Dict) -> None:
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value
