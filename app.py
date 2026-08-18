from flask import Flask, render_template, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Initialize the NLP sentiment pipeline on startup
print("Loading AI Model...")
sentiment_model = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
print("AI Model loaded successfully!")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    
    if not data or "text" not in data or not data["text"].strip():
        return jsonify({"error": "Please provide non-empty text to analyze."}), 400

    text_to_analyze = data["text"].strip()

    try:
        results = sentiment_model(text_to_analyze[:512])[0]
        
        label = results["label"]
        confidence = round(results["score"] * 100, 2)

        return jsonify({
            "status": "success",
            "label": label,
            "confidence": f"{confidence}%",
            "raw_score": confidence
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    app.run(host="0.0.0.0", port=port)
