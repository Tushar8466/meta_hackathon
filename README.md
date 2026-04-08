# 🌱 CropAI — AI-Powered Crop Advisory Agent

An intelligent crop advisory system that uses **Deep Learning + Reinforcement Learning** to detect plant diseases and provide actionable insights for farmers.

---

## 🚀 Features

* 🌿 **Crop Disease Detection** using image input
* 🤖 **AI Advisory System** powered by RL environment (`step() / reset() / state()`)
* 📊 **Confidence-based Predictions**
* 🌍 **Farmer-Friendly UI** (with future Hindi support 🇮🇳)
* 🐳 **Dockerized Backend** for easy deployment
* ⚡ **FastAPI Backend + Next.js Frontend**

---

## 🧠 Tech Stack

* **Frontend:** Next.js, Tailwind CSS
* **Backend:** FastAPI, Python
* **ML/DL:** PyTorch, Torchvision
* **Deployment:** Docker, Render
* **AI Concepts:** Reinforcement Learning (OpenEnv)

---

## 📂 Project Structure

```
crop-advise/
│
├── backend/
│   ├── app.py              # FastAPI server
│   ├── inference.py        # Model inference logic
│   ├── model.pth           # Trained model
│   ├── dataset/            # Dataset (not pushed if large)
│   ├── Dockerfile          # Docker config
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── components/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone the repo

```bash
git clone https://github.com/your-username/crop_agent.git
cd crop_agent/backend
```

---

### 🔹 2. Run using Docker (Recommended)
<<<<<<< HEAD

```bash
docker build -t crop-ai .
docker run -p 10000:10000 crop-ai
```

---

### 🔹 3. Access API

Open in browser:

```
http://localhost:10000/docs
```

---

## 📡 API Endpoints

| Method | Endpoint   | Description             |
| ------ | ---------- | ----------------------- |
| GET    | `/`        | Health check            |
| POST   | `/predict` | Crop disease prediction |

---

## 🧪 Example Response

```json
{
  "disease": "Tomato Leaf Blight",
  "confidence": 0.92,
  "advice": "Use fungicide and remove infected leaves"
}
```

---

## 🧩 OpenEnv (RL Environment)

This project includes a custom environment:

* `step(action, confidence)`
* `reset()`
* `state()`

Used for training intelligent advisory agents.

---

## ⚠️ Important Notes

* `.env` file is **not included** (for security reasons)
* Dataset may not be uploaded due to size limits
* Add your own HuggingFace / API keys in environment variables

---

## 🌍 Future Improvements

* 🌐 Multi-language support (Hindi 🇮🇳)
* 📱 Mobile-friendly UI
* ☁️ Cloud deployment scaling
* 🧠 Better model accuracy

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first.

---

## 📜 License

This project is open-source and available under the MIT License.

---

## 👨💻 Author

**Tushar**
AI Developer | OpenEnv Hackathon Participant 🚀

---

⭐ If you like this project, don't forget to star the repo!

=======

```bash
docker build -t crop-ai .
docker run -p 10000:10000 crop-ai
```

---

### 🔹 3. Access API

Open in browser:

```
http://localhost:10000/docs
```

---

## 📡 API Endpoints

| Method | Endpoint   | Description             |
| ------ | ---------- | ----------------------- |
| GET    | `/`        | Health check            |
| POST   | `/predict` | Crop disease prediction |

---

## 🧪 Example Response

```json
{
  "disease": "Tomato Leaf Blight",
  "confidence": 0.92,
  "advice": "Use fungicide and remove infected leaves"
}
```

---

## 🧩 OpenEnv (RL Environment)

This project includes a custom environment:

* `step(action, confidence)`
* `reset()`
* `state()`

Used for training intelligent advisory agents.

---

## ⚠️ Important Notes

* `.env` file is **not included** (for security reasons)
* Dataset may not be uploaded due to size limits
* Add your own HuggingFace / API keys in environment variables

---

## 🌍 Future Improvements

* 🌐 Multi-language support (Hindi 🇮🇳)
* 📱 Mobile-friendly UI
* ☁️ Cloud deployment scaling
* 🧠 Better model accuracy

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first.

---

## 📜 License

This project is open-source and available under the MIT License.

---

## 👨💻 Author

**Tushar**
AI Developer | OpenEnv Hackathon Participant 🚀

---

⭐ If you like this project, don't forget to star the repo!
>>>>>>> 5db1e4b (feat: implement FastAPI backend with inference logic and containerize with Docker)
