import streamlit as st

st.title("PCOS Risk Result")

if "risk_score" not in st.session_state:
    st.warning("Complete assessment first.")
    st.stop()

risk = st.session_state.risk_score

st.metric("Predicted Risk %", f"{risk}%")

if risk < 30:
    st.success("Low Risk")
elif risk < 60:
    st.warning("Moderate Risk")
else:
    st.error("High Risk")

if st.button("See Risk Contributors"):
    st.switch_page("pages/3_Contributors.py")