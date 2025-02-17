# **Proflow Backend**  

## **Overview**  
The **Proflow Backend** is the server-side application that powers the **Proflow** project management system. It provides APIs for managing projects, tasks, users, and authentication.  

## **Project Status**  
Proflow Backend is currently in the **beta stage** and was developed as a portfolio project.  

## **Technology Stack**  
- **Backend Framework:** Node.js with Express  
- **Database:** PostgreSQL  
- **Authentication:** JWT with access and refresh tokens  
- **Deployment:** Render  

## **Key Features**  
- **Project & Task Management:** Handle project creation, task assignments, and status updates.  
- **User Authentication:** Secure login system using JWT (access & refresh tokens).  
- **Tag System:** Supports tagging tasks to indicate urgency and progress.  

## **Installation & Setup**  
To run Proflow Backend locally, follow these steps:  

1. Clone the repository:  
   ```sh
   git clone https://github.com/joeebw/project-management-api.git
   cd project-management-api
   ```  
2. Install dependencies (choose one):  
   ```sh
   # Using pnpm (recommended)
   pnpm install  

   # Using npm
   npm install  

   # Using yarn
   yarn install  
   ```  
3. Start the server:  
   ```sh
   pnpm start  # or npm start or yarn start  
   ```  

## **Deployment**  
Proflow Backend is deployed on **Render**.  

## **Contributing**  
Currently, contributions are not open.  
