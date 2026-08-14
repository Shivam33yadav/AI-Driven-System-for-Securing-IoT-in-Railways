# 🚆 AI-Driven System for Securing IoT in Railways

> **An internship project developed during my internship at Uttar Pradesh Metro Rail Corporation (UPMRC)**

## 📌 Overview

The **AI-Driven System for Securing IoT in Railways** is a web-based security monitoring platform designed to provide a centralized interface for monitoring and managing security-related events in railway and metro IoT environments.

Modern railway and metro systems rely heavily on interconnected IoT devices, sensors, communication systems, and control infrastructure. While these technologies improve operational efficiency, they also introduce cybersecurity challenges.

This project focuses on providing a **centralized security dashboard** through which authorized users can monitor system activity, view alerts, and manage security-related information.

The project was developed as part of my **UPMRC internship**, with a focus on applying web development concepts to a real-world railway/metro security scenario.

---

## 🎯 Objectives

* 🔐 Provide a centralized interface for IoT security monitoring.
* 🚨 Display and manage security alerts.
* 📊 Provide a dashboard for monitoring important system information.
* 👤 Implement user authentication and role-based access.
* 🛡️ Provide separate functionality for regular users and administrators.
* 🚆 Demonstrate how web technologies can support cybersecurity monitoring in railway IoT environments.
* 💡 Create a foundation that can be extended with real-time IoT data and AI-based threat detection.

---

## ✨ Key Features

### 📊 Security Dashboard

A centralized dashboard provides users with an overview of the system and security-related information.

### 🚨 Alert Monitoring

The application provides an alerts section for displaying and monitoring security events.

### 🔐 Authentication

The system includes user-oriented authentication functionality to restrict access to protected sections.

### 👨‍💼 Admin Panel

Administrative functionality is separated from regular user functionality, allowing authorized administrators to access additional system capabilities.

### 🧭 Client-Side Routing

The application uses JavaScript-based routing to manage different sections of the web application without requiring multiple HTML pages.

### 💾 Browser Storage

Browser-based storage is used for maintaining relevant application/session information during interaction with the frontend.

### 📱 Responsive Interface

The interface is designed to provide a clean and accessible experience across different screen sizes.

---

## 🏗️ Project Architecture

```text
AI-Driven-System-for-Securing-IoT-in-Railways
│
├── index.html          # Main application interface
├── style.css           # Application styling
├── app.js              # Application logic and functionality
└── README.md           # Project documentation
```

---

## 🛠️ Technologies Used

| Technology       | Purpose                                 |
| ---------------- | --------------------------------------- |
| **HTML5**        | Structure of the web application        |
| **CSS3**         | Styling and responsive interface        |
| **JavaScript**   | Application logic and interactivity     |
| **Browser APIs** | Client-side state/storage functionality |
| **Git & GitHub** | Version control and project management  |
| **VS Code**      | Development environment                 |

---

## 🔄 Application Flow

```text
                 ┌─────────────────────┐
                 │      User Visits    │
                 │      Application    │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Authentication    │
                 └──────────┬──────────┘
                            │
                  ┌─────────┴─────────┐
                  │                   │
                  ▼                   ▼
           ┌─────────────┐     ┌─────────────┐
           │    User     │     │    Admin    │
           │ Dashboard   │     │ Dashboard   │
           └──────┬──────┘     └──────┬──────┘
                  │                   │
                  ▼                   ▼
           ┌─────────────┐     ┌─────────────┐
           │   Alerts    │     │   System    │
           │ Monitoring  │     │ Management  │
           └─────────────┘     └─────────────┘
```

---

## 🚆 Railway & Metro IoT Security Context

Railway and metro infrastructure increasingly depends on interconnected systems such as:

* IoT sensors
* Monitoring devices
* Communication systems
* Control systems
* Network-connected equipment
* Operational monitoring platforms

A compromise of connected infrastructure can potentially affect system availability, data integrity, and operational safety.

This project demonstrates the concept of a **centralized security monitoring interface** that can serve as a foundation for integrating real-time railway IoT security data.

---

## 🤖 Future AI Integration

The platform can be extended with AI/ML-based cybersecurity capabilities such as:

* 🔎 Anomaly detection
* 🚨 Intelligent threat detection
* 📡 Real-time IoT network monitoring
* 🧠 Machine-learning-based attack classification
* 📈 Predictive security analytics
* ⚠️ Automated threat prioritization
* 🔔 Real-time security notifications
* 📊 Security event visualization

A future architecture could integrate an ML service with the web application:

```text
IoT Devices
     │
     ▼
Sensor / Network Data
     │
     ▼
Data Processing
     │
     ▼
AI / ML Threat Detection
     │
     ▼
Security Backend
     │
     ▼
Web Dashboard
     │
     ├── Security Alerts
     ├── Threat Analysis
     ├── System Monitoring
     └── Admin Controls
```

---

## ▶️ How to Run the Project

### Prerequisites

You only need:

* A modern web browser
* Visual Studio Code
* Live Server extension for VS Code

### Step 1: Clone the Repository

```bash
git clone https://github.com/Shivam33yadav/AI-Driven-System-for-Securing-IoT-in-Railways.git
```

### Step 2: Open the Project

```bash
cd AI-Driven-System-for-Securing-IoT-in-Railways
```

Open the folder in **Visual Studio Code**.

### Step 3: Run the Application

Right-click `index.html` and select:

**Open with Live Server**

The application will open in your browser.

---

## 🔐 Security Considerations

This project is primarily a frontend prototype demonstrating the concept of an IoT security monitoring platform.

For production deployment, additional security mechanisms should be implemented, including:

* Secure backend authentication
* Password hashing
* Role-based authorization
* HTTPS/TLS
* Secure API communication
* Input validation and sanitization
* Database security
* Audit logging
* Real-time event processing
* Secure IoT device authentication
* Network monitoring and intrusion detection

---

## 📈 Future Scope

The project can be further developed into a complete railway IoT cybersecurity platform by adding:

1. **Real-time IoT device connectivity**
2. **Backend API using Node.js/Express**
3. **MongoDB-based data storage**
4. **AI-powered anomaly detection**
5. **Real-time WebSocket alerts**
6. **IoT device health monitoring**
7. **Network intrusion detection**
8. **Security event logging**
9. **Role-based access control**
10. **Deployment using Docker and cloud infrastructure**

---

## 👨‍💻 Internship Project

### Uttar Pradesh Metro Rail Corporation (UPMRC)

This project was developed as part of my **IT internship at UPMRC**, providing practical exposure to applying software development and cybersecurity concepts to a railway/metro infrastructure context.

The project helped strengthen my understanding of:

* Web application development
* JavaScript-based application architecture
* User authentication concepts
* Dashboard development
* Security monitoring concepts
* IoT cybersecurity challenges
* Real-world software development workflow

---

## 📚 Learning Outcomes

Through this project, I gained practical experience in:

* Developing a structured web application
* Building interactive dashboards
* Implementing client-side application logic
* Managing application state
* Designing user and admin interfaces
* Understanding IoT security requirements
* Translating a real-world infrastructure problem into a software solution
* Using Git and GitHub for version control

---

## 🔮 Vision

The long-term vision of this project is to evolve it from a web-based monitoring prototype into an **AI-powered cybersecurity platform for railway and metro IoT infrastructure**, capable of detecting abnormal behavior, analyzing security events, and providing actionable alerts to authorized personnel.

---

## 👤 Author

**Shivam Yadav**

🎓 B.Tech — Computer Science & Engineering
🏢 Internship Project — Uttar Pradesh Metro Rail Corporation (UPMRC)

### Connect With Me

* **GitHub:** [Shivam33yadav](https://github.com/Shivam33yadav)
* **LinkedIn:** [Shivam Yadav](https://www.linkedin.com/in/shivam-yadav6387/)
* **LeetCode:** [Shivam Yadav](https://leetcode.com/u/Shivamyadav33/)

---

## ⭐ Acknowledgement

I would like to express my gratitude to **Uttar Pradesh Metro Rail Corporation (UPMRC)** for providing the opportunity to work on a practical technology-oriented project and gain valuable industry exposure.

---

## 📄 License

This project is developed for **educational and internship purposes**.
