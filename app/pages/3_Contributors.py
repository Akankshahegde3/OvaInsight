import streamlit as st

st.title("Risk Contributors")

risk = st.session_state.get("risk_score", 0)

st.write("Risk breakdown:")

st.progress(risk / 100)

st.write("• BMI influence")
st.write("• Lifestyle habits")
st.write("• Hormonal indicators")

if st.button("See Personalized Suggestions"):
    st.switch_page("pages/4_Suggestions.py")