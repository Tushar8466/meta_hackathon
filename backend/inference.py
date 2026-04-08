import os
import torch
from flask import Flask, request, jsonify
from openai import OpenAI
from dataset import CropDataset
from models import get_model

app = Flask(__name__)

# ================================
# ENV VARIABLES (MANDATORY)
# ================================
API_BASE_URL = os.getenv("API_BASE_URL")
MODEL_NAME = os.getenv("MODEL_NAME")
HF_TOKEN = os.getenv("HF_TOKEN")

# ================================
# INIT OPENAI CLIENT
# ================================
client = OpenAI(base_url=API_BASE_URL, api_key=HF_TOKEN)

# ================================
# LOAD MODEL ONCE AT STARTUP
# ================================
dataset = CropDataset("dataset/")
device = torch.device("cpu")
model = get_model(len(dataset.classes)).to(device)
model.load_state_dict(torch.load("model.pth", map_location=device))
model.eval()

# ================================
# REQUIRED: /reset endpoint
# ================================
@app.route("/reset", methods=["POST"])
def reset():
    return jsonify({"status": "ok"})

# ================================
# MAIN: /predict endpoint
# ================================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        sample = dataset[0]
        image = sample.unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(image)
            pred_class = torch.argmax(output, dim=1).item()
            disease = dataset.classes[pred_class]

        prompt = f"""
        A crop leaf is diagnosed with {disease}.
        Provide:
        1. Cause of disease
        2. Treatment
        3. Prevention tips
        Keep it short and practical for farmers.
        """

        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are an expert agricultural advisor."},
                {"role": "user", "content": prompt}
            ]
        )

        advice = response.choices[0].message.content

        return jsonify({
            "status": "success",
            "disease": disease,
            "advisory": advice
        })

    except Exception as e:
        return jsonify({"status": "failed", "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)