import os
import torch
from openai import OpenAI
from dataset import CropDataset
from models import get_model

# ================================
# ENV VARIABLES (MANDATORY)
# ================================
API_BASE_URL = os.getenv("API_BASE_URL")
MODEL_NAME = os.getenv("MODEL_NAME")
HF_TOKEN = os.getenv("HF_TOKEN")

# ================================
# INIT OPENAI CLIENT
# ================================
client = OpenAI(
    base_url=API_BASE_URL,
    api_key=HF_TOKEN
)

print("[START]")
print("task: crop_advisory_inference")

try:
    # ================================
    # LOAD DATA + MODEL
    # ================================
    print("[STEP] loading_model")

    dataset = CropDataset("dataset/")
    device = torch.device("cpu")

    model = get_model(len(dataset.classes)).to(device)
    model.load_state_dict(torch.load("model.pth", map_location=device))
    model.eval()

    # ================================
    # GET SAMPLE INPUT
    # ================================
    print("[STEP] preparing_input")

    sample = dataset[0]  # first image
    image = sample.unsqueeze(0).to(device)

    # ================================
    # MODEL PREDICTION
    # ================================
    print("[STEP] running_prediction")

    with torch.no_grad():
        output = model(image)
        pred_class = torch.argmax(output, dim=1).item()
        disease = dataset.classes[pred_class]

    print(f"[STEP] detected_disease: {disease}")

    # ================================
    # CALL LLM FOR ADVISORY
    # ================================
    print("[STEP] calling_llm")

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

    print("[STEP] advisory_output:")
    print(advice)

    # ================================
    # SUCCESS END
    # ================================
    print("[END]")
    print("status: success")

except Exception as e:
    print("[STEP] error:")
    print(str(e))

    print("[END]")
    print("status: failed")