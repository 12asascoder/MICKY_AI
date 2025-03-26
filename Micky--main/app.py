from flask import Flask, request, jsonify, render_template
import google.generativeai as genai

app = Flask(__name__, template_folder="templates")  # Your folder is named 'templetes'

# Configure Gemini API
genai.configure(api_key="AIzaSyALOHoJgriPpStLruWw4XRD584ZhfcuYco")

@app.route('/')
def index():
    return render_template("index.html")  # Your frontend remains in 'templetes/index.html'

@app.route('/micky', methods=['POST'])
def micky():
    data = request.json
    user_query = data.get("query")

    # Call Gemini API with refined prompt
    model = genai.GenerativeModel("gemini-2.0-flash")
    prompt = f"""
    You are Micky, an AI healthcare assistant inspired by Omnivital Nexus.
    - **Always give a solution FIRST** (within 1-2 lines).
    - **Avoid excessive questions** unless absolutely necessary.
    - **Be clear and actionable** (e.g., “Drink water” instead of “Do you feel thirsty?”).

    Patient Query: "{user_query}"
    Response should be **concise, direct, and helpful**.
    
    """
    response = model.generate_content(prompt)
    
    return jsonify({"response": response.text})

if __name__ == '__main__':
    app.run(debug=True)
