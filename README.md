---
# Scores Dashboard (React)

A modern, responsive analytics dashboard for visualizing student performance with multi-language support.
---

![Vietnamese](/src/gscores-frontend/pics/pic1.png)

![English version and searching for Student ID](/src/gscores-frontend/pics/pic2.png)
---

## 🔄 User Flow
1. **Dashboard View:** User sees a global distribution chart and a Top 10 ranking sidebar.
2. **Search:** User enters a Student ID (SBD).
3. **Data Fetch:** React sends a request to the Spring Boot API via Axios.
4. **State Update:** The UI updates with individual scores and performance color-coding.
5. **Localization:** User toggles between English (EN) and Vietnamese (VI).

---

## 🏗️ Component Structure

| Component | Purpose |
| :--- | :--- |
| **App.js** | The main hub managing global state, translations, and API orchestration. |
| **ScoreCard** | Displays subject scores with dynamic colors based on grade. |
| **Sidebar** | Navigation and branding (G-Scores Identity). |
| **ChartSection** | Visualizes score distributions using **Chart.js**. |

---

## 🐳 Docker & Deployment
* **Docker:** Multi-stage build using `node:20-alpine` and `nginx:stable-alpine`.
* **API Integration:** Configured to point to the production Backend URL on Render.
* **Styling:** Built with **Tailwind CSS** for a fully responsive mobile/desktop experience.

---

## 🛠️ Tech Stack
* **Framework:** React 18
* **Icons:** Lucide-React
* **Charts:** Chart.js
* **HTTP Client:** Axios
* **Translation:** i18next (Multi-language)

Clone this repo and run Docker command
```docker
docker compose up -d
```