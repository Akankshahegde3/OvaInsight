import streamlit as st

st.set_page_config(page_title="OvaInsight", page_icon="🩺")

st.title("🩺 OvaInsight - PCOS Risk Platform")

# Simple login system
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if not st.session_state.logged_in:
    st.subheader("Login to Continue")

    username = st.text_input("Username")
    password = st.text_input("Password", type="password")

    if st.button("Login"):
        if username == "admin" and password == "1234":
            st.session_state.logged_in = True
            st.success("Login Successful ✅")
            st.switch_page("pages/1_Assessment.py")
        else:
            st.error("Invalid Credentials")

else:
    st.success("You are already logged in.")
    st.switch_page("pages/1_Assessment.py")