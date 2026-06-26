# 🏘️ Resident Issue Reporting System

> A full-stack community management platform enabling residents to report, track, and resolve local issues — with role-based access for both residents and administrators.
## 🌐 Live Demo

**[→ resident-issue-reporting-system.vercel.app](https://resident-issue-reporting-system.vercel.app/)**

---

## 📌 What It Does

Real communities face a common problem: residents have no structured way to report broken infrastructure, noise complaints, or safety concerns — and administrators have no single place to manage them. This platform solves both sides.

**Residents can:**
- Submit new issues with category, description, and priority
- Track the real-time status of their submitted issues
- Receive status updates as admins act on reports

**Administrators can:**
- View all submitted issues in a centralized dashboard
- Categorize, prioritize, and assign resolution status
- Update issue states (Open → In Progress → Resolved)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, CSS |
| Backend | Node.js, Express.js |
| Database | SQL (relational schema) |
| Deployment | Vercel |

---

## ✨ Key Features

- **Role-Based Access Control (RBAC)** — separate resident and admin views with protected routes
- **Real-time Status Tracking** — issue states update and reflect immediately
- **Persistent Database Storage** — all issues survive sessions; no data loss
- **RESTful API** — clean backend endpoints for CRUD operations and auth
- **Responsive UI** — works across mobile and desktop

---

## 🗂️ Project Structure

```
resident-issue-reporting-system/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Route-level pages (resident, admin)
│   │   └── App.js
├── server/                  # Express backend
│   ├── routes/              # API route handlers
│   ├── controllers/         # Business logic
│   ├── models/              # DB schema/models
│   └── index.js
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- A running SQL database instance

## 💡 What I Learned

- Designing and implementing **RBAC** from scratch — thinking through permission layers at the route and UI level
- Structuring a **REST API** with clean separation between routes, controllers, and models
- Managing **real-time state** across a React frontend connected to a live backend
- Handling **database schema design** for relational issue tracking (status transitions, user roles)

---

## 👤 Author

**Parth Kaushik**
- GitHub: [@Kaushikparth0](https://github.com/Kaushikparth0)
- LinkedIn: [linkedin.com/in/parth-kaushik-](https://www.linkedin.com/in/parth-kaushik-)
- Email: kaushikparth394@gmail.com
