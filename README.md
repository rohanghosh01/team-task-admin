# 🏆 TeamTasker

## 📝 Overview

TeamTasker is a 📋 task management app designed to streamline 📁 project & 👥 team management. The app features 🔐 role-based access, where only an 🧑‍💼 admin can create 📂 projects & manage 👥 members.

---

## 🚀 [Live Demo](https://team-task-admin-ten.vercel.app/)

---

## 🛠️ Tech Stack

### 🎨 Frontend:

- ⚛️ Next.js
- 🎨 ShadCN UI
- 🎭 Tailwind CSS

### 🖥️ Backend:

- 🟢 Node.js
- 🍃 MongoDB

## 🔑 Authentication

- The app supports only 🔑 login authentication.
- An 🧑‍💼 admin is created via a backend 🖥️ script.
- The 🧑‍💼 admin can add 👥 members, and 🔑 passwords are automatically generated for login users.

## 🚀 Features

### 📊 Dashboard

- Displays 📈 analytics & important 🔢 counts.

### 📂 Projects

- 📜 List & ➕ add 📂 projects (Only 🧑‍💼 Admin has access).
- Inside each 📂 project, users can manage 📋 tasks & view 📄 task details.

### 👥 Members

- 📜 List, ➕ add, & ✏️ edit 👥 members.

### 📊 Analytics

- Provides 📈 insights into 📂 project & 📋 task performance.

### ⚙️ Settings

- ⚙️ Configurable options for the app.

## 🌍 Deployment

- **🎨 Frontend:** Hosted on ▲ Vercel
- **🖥️ Backend:** Hosted on ☁️ Render
- **🔗 Live URL:** [TeamTasker](https://team-task-admin-ten.vercel.app/)

## 🏗️ Environment Variables

### 🎨 Frontend (`.env.example`)

```env
NEXT_PUBLIC_API_BASE_URL=<your_backend_api_url>
NEXT_PUBLIC_CRYPTO_SECRET=<crypto_key_random>
```

### 🖥️ Backend (`.env.example`)

```env
PORT=5001
MONGO_URI="mongodb_uri"
JWT_SECRET=
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN='7h'
JWT_REFRESH_SECRET=
ENV=local
FRONTEND_URL="http://localhost:3000"
NOD_MAIL_EMAIL=
NOD_MAIL_PASS_KEY=
ADMIN_NAME="Admin"
ADMIN_PASSWORD="admin@123"
ADMIN_EMAIL="admin@email.com"
ENCRYPTION_KEY=
```

### 🔑 Notes
1. **Security**: Never expose your `.env` file in version control. Use a `.gitignore` file to exclude it.
2. **Optional Variables**: Variables such as Firebase settings are optional based on your feature set. Configure them only if required.

This should align well with your existing environment variables and provide clarity to collaborators or other developers setting up the project.

4. Run the application locally:
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`.

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Create a pull request.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- [Next.js](https://nextjs.org/)  
- [MongoDB](https://www.mongodb.com/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Node.js](https://nodejs.org/)  

---

## 📌 Repository

🐙 GitHub: [TeamTasker Repo](https://github.com/rohanghosh01/team-task-admin)
