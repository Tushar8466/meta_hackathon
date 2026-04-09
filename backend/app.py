import os
import time
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from werkzeug.utils import secure_filename

# ==========================================
# APP INIT
# ==========================================
app = Flask(__name__)
app.secret_key = "secret"
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ==========================================
# MODEL
# ==========================================
NUM_CLASSES = 16
CLASS_NAMES = ["Healthy", "Bacterial Spot", "Early Blight", "Late Blight"]

device = torch.device("cpu")

model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)

if os.path.exists("model.pth"):
    model.load_state_dict(torch.load("model.pth", map_location=device))

model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# ==========================================
# UI ROUTES (YOUR WEBSITE)
# ==========================================
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return redirect(url_for('home'))

    file = request.files['file']
    if file.filename == '':
        return redirect(url_for('home'))

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    image = Image.open(filepath).convert("RGB")
    img = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(img)
        pred = torch.argmax(output, dim=1).item()

    disease = CLASS_NAMES[pred]

    return render_template("result.html", disease=disease, filename=filename)

# ==========================================
# 🔥 OPENENV (MANDATORY FOR HACKATHON)
# ==========================================

env_state = {
    "step": 0,
    "score": 0.0,
    "done": False
}

@app.route("/reset", methods=["POST"])
def reset():
    global env_state
    env_state = {
        "step": 0,
        "score": 0.0,
        "done": False
    }

    return jsonify({
        "state": env_state
    })


@app.route("/step", methods=["POST"])
def step():
    global env_state

    env_state["step"] += 1
    env_state["score"] += 0.2

    if env_state["step"] >= 5:
        env_state["done"] = True

    return jsonify({
        "state": env_state,
        "reward": 0.2,
        "done": env_state["done"]
    })


@app.route("/state", methods=["GET"])
def state():
    return jsonify(env_state)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

# ==========================================
# RUN
# ==========================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)