
# **Sports Analytics Platform (NFL)**  
A full‑stack NFL analytics project that loads real game data, builds useful features, trains a machine learning model, and serves predictions through a FastAPI backend.

---

## **Overview**
This project predicts NFL game outcomes using real data and a simple machine learning pipeline. It includes:

- Data loading  
- Feature engineering  
- Model training  
- API endpoint for predictions  

Built as part of my Computer Science program to demonstrate ML and backend development skills.

---

## **Machine Learning**
The model uses **supervised machine learning**, specifically **Logistic Regression**, to predict whether the home team will win.

This model is fast, easy to train, and works well with engineered sports features.

---

## **Features Used**
The model learns from several effective features:

- Score differential  
- Home‑field indicator  
- Team win percentage  
- Rolling 3‑game point differential  

These features capture team strength, momentum, and basic game context.

---

## **Tech Stack**
**ML & Data:** Python, scikit‑learn, pandas, nfl_data_py  
**Backend:** FastAPI, Uvicorn  
**Frontend:** React 19, Create React App\
**Tools:** VS Code, GitHub 

---

## **Frontend Dashboard**

The React dashboard brings the prediction API into a simple game-day interface:

- **Current-week game ticker:** Loads the NFL schedule from the backend and
  displays each matchup with its date and kickoff time.
- **Game predictions:** Choose two teams from the selectors and request a
  prediction from the FastAPI backend. The result shows the matchup, the first
  team's win probability, a visual probability bar, and which team is favored.
- **Interactive and accessible states:** The prediction card can be dragged,
  the Predict button is disabled until both teams are selected, and loading
  and error messages are exposed to assistive technologies.
- **Frontend tests:** React Testing Library tests cover the dashboard and the
  schedule ticker's loading, empty, success, and retryable states.

The frontend calls the backend at `http://127.0.0.1:8000`; run both servers
locally as described in [Requirements and Local Setup](#requirements-and-local-setup).

---

## **Project Structure**
```
sports-analytics-project/
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── GameTicker.js
│   │   └── PredictionForm.js
│   ├── package.json
│   └── package-lock.json
│
├── analytics/
│   ├── train.py
│   ├── model.py
│   ├── features.py
│   ├── nfl_data_loader.py
│   └── nfl_model.pkl
│
├── backend/
│   └── main.py
│
└── README.md
```

---

## **How It Works**

### **1. Load Data**  
Pull NFL schedules and scores using `nfl_data_py`.

### **2. Build Features**  
Add win percentages, rolling averages, score differences, and home‑field flags.

### **3. Train Model**  
Run:

```
py -3.11 analytics/train.py
```

This creates `nfl_model.pkl`.

### **4. Make Predictions**  
Start the API:

```
uvicorn backend.main:app --reload
```

Call:

```
/nfl/predict?team1=Packers&team2=Bears
```

---

## **Example Response**
```json
{
  "team1": "Packers",
  "team2": "Bears",
  "probability": 0.6421
}
```

---

## **Future Improvements**
- Include Vegas spread    
- Add MLB support  

---

## **Current Progress**
The project includes an NFL data and machine-learning pipeline, a FastAPI backend
for game predictions and current-week schedules, and a React dashboard that
connects to the API. The dashboard presents upcoming matchups and lets users
compare teams using the model's predicted win probability.



[Watch Milestone 1 on YouTube](https://youtu.be/Wqn1CApZlu8)


## **Author**
**Jack D**  
Computer Science Student — University of Wisconsin–River Falls  

---

## **Requirements and Local Setup**

To run the complete dashboard on your own machine, install:

- **Python 3.11** for the FastAPI backend and analytics code.
- **Node.js and npm** for the frontend. The project does not pin a Node.js
  version; use a current Node.js LTS release.
- **Git** to clone the project and a modern web browser.
- An internet connection so the backend can retrieve NFL schedule data using
  `nfl_data_py`.

The frontend uses **React `^19.3.0`** and Create React App (`react-scripts`
5.0.1). Install its locked dependencies with `npm ci`.

### **1. Get the project**

Clone the repository and open its root directory:

```bash
git clone https://github.com/dehnedev/sports-analytics-platform.git
cd sports-analytics-platform
```

### **2. Install and start the backend**

From the project root, create a Python 3.11 virtual environment:

```bash
py -3.11 -m venv .venv
```

Activate it in Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

On macOS or Linux, create and activate the environment with:

```bash
python3.11 -m venv .venv
source .venv/bin/activate
```

Install the required Python packages:

```bash
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn nfl_data_py pandas scikit-learn joblib
```

Start the API from the project root and leave this terminal running:

```bash
python -m uvicorn backend.main:app --reload
```

The API is available at `http://127.0.0.1:8000`; its interactive docs are at
[`http://127.0.0.1:8000/docs`](http://127.0.0.1:8000/docs).

The trained model is included at `analytics/nfl_model.pkl`, so you do not need
to train it for a normal run. To train or recreate the model, use the activated
Python environment from the project root:

```bash
py -3.11 analytics/train.py
```

On macOS or Linux, run `python3.11 analytics/train.py` instead.

### **3. Install and start the frontend**

Open a second terminal and change to the frontend directory:

```bash
cd frontend
npm ci
npm start
```

The dashboard opens at [`http://localhost:3000`](http://localhost:3000). Keep
both the frontend and backend terminals running while using it.

To run frontend tests or create a production build, use these commands from
the `frontend` directory:

```bash
npm test
npm run build
```
