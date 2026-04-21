import streamlit as st

st.title("Personalized Suggestions")

st.write("Diet Recommendations:")
st.write("- Add flax seeds")
st.write("- Eat leafy vegetables")
st.write("- Reduce refined sugar")

st.write("Lifestyle:")
st.write("- 30 min daily walking")
st.write("- Sleep 7-8 hours")

if st.button("View Recommended Exercises"):
    st.switch_page("pages/5_Exercises.py")