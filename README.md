# 🗳️ Political Feedback & Campaign Web App Template

A customizable political portfolio and feedback website built using **ReactJS** (frontend) and **Flask** (backend).

This template can be reused for multiple candidates by simply changing:
- Colors (based on political party)
- Candidate name, vision, objectives, and photos
- Starting vote count (e.g., 7,000 baseline votes)
- Slideshow images and footer contact details

---

## 🧩 Features

✅ Public homepage styled using React + Tailwindcss  
✅ Feedback form referencing the **2027 General Elections**  
✅ Yes/No voting system with:
   - ❤️ emoji for “Yes” votes  
   - Text reason input for “No” votes  
   - Configurable starting number of votes (e.g., start from 7,000)  
✅ Admin login and logout  
✅ Admin dashboard to view feedback and total votes  
✅ Slideshow image uploads by admin  
✅ Responsive footer (contact info, socials, etc.)

---

## 🏗 Folder Overview

| Folder/File | Description |
|--------------|-------------|
| `frontend/` | React app (UI, feedback form, admin login, slideshow) |
| `backend/` | Flask backend (API, authentication, database) |
| `uploads/` | Stores slideshow images |
| `models.py` | Defines Admin, Feedback, and Slide models |
| `app.py` | Handles API routes, feedback submission, and admin data |
| `README.md` | Documentation and setup instructions |

---

## ⚙️ Setup

### Frontend (React)
```bash
cd frontend
npm install
npm run dev