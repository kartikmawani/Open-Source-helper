## Project Overview
## Project Overview
**OpenSource-Helper** is a technical analysis engine designed to bridge the gap between complex codebases and new contributors.

###  The Problem
Contributing to large-scale projects is often intimidating. Newcomers frequently struggle to:
* **Identify the true tech stack** beyond simple GitHub language tags.
* **Decipher architectural relationships** between backend and frontend logic in monorepos.
* **Find "Good First Issues"** that actually align with their specific skill level.

### The Solution
OpenSource-Helper acts as a **"GPS for Repositories."** By processing a GitHub URL through a specialized pipeline, the system:
1. Performs a **recursive deep scan** of the codebase.
2. Analyzes the **architectural intent** using Gemini 2.5 Flash-Lite.
3. Generates a **structured roadmap** with actionable contribution steps.

## System Architecture

```mermaid
graph LR
    subgraph Client_Tier [Client Tier]
        A[React Frontend] --> B[Vite / Tailwind CSS]
    end

    subgraph Proxy_Layer [Proxy Layer]
        C[Nginx Reverse Proxy]
    end

    subgraph Logic_Tier [Logic Tier]
        D[Express.js Backend]
        E[GitHub DFS Crawler]
        F[Zod Validation Layer]
    end

    subgraph Data_Services [Data & AI Services]
        G[(MongoDB)]
        H[Gemini 2.5 Flash-Lite]
        I[GitHub REST API]
    end

    Client_Tier --- C
    C --- Logic_Tier
    Logic_Tier --- G
    Logic_Tier --- H
    Logic_Tier --- I
```

##  Design Decisions

   * **Recursive DFS vs. Flat Crawling** I implemented a **Depth-First Search (DFS) crawler** rather than a standard flat file-list fetch. This allows the system to prioritize architectural entry points...

  * **Schema Enforcement via Zod** To mitigate "AI hallucinations," I implemented a **Zod validation layer**...

  * **Security-First Reverse Proxy**
    By using Nginx as a reverse proxy within a Docker bridge network, I’ve ensured that the Node.js runtime is never directly exposed. This architecture allows for centralized SSL termination and protects the internal API logic from common external vulnerabilities.

## 🛠️ Built With

###  Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

###  Backend & AI
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Gemini](https://img.shields.io/badge/google_gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)

### Infrastructure & DB
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

##  Getting Started

To get a local copy up and running, follow these steps.
### Prerequisites
    Docker & Docker Compose
    GitHub Personal Access Token (Classic)
    Google Gemini API Key

### Installation & Setup

    Clone the repo

    git clone https://github.com/kartikmanwani/OpenSource-Helper.git

    Configure Environment Variables
    Create a .env file in the root directory:
    Code snippet

    GEMINI_API_KEY=your_key_here
    GITHUB_TOKEN=your_pat_here
    MONGO_URI=mongodb://helper-db:27017/opensource-helper

    docker-compose up --build

    The app will be available at http://localhost via the Nginx proxy.

##  Testing

* testing suite using Playwright to ensure the reliability of the analysis pipeline and the stability of the UI.
### API Integration Testing

The core analysis logic is validated through end-to-end API tests. This includes:

   * Successful Analysis: Validating that the DFS crawler and Gemini AI return a 200 OK within the 100s timeout window.
     
   * Schema Validation: Ensuring the AI's JSON output perfectly matches our Zod definitions.
     
   * Error Handling: Verifying 404 responses for non-existent repositories.

### Running Tests 
Run all tests in a serial environment to prevent DB collisions     

     npx playwright test --workers=1
 

## Usage

   * GitHub Authentication: Login via GitHub to grant the system read-access to your repository metadata and structure.

  *Repository Selection: From your personalized dashboard, select any repository from your GitHub list to initiate a deep scan.

  *Automated Analysis: The system performs a recursive DFS crawl and utilizes Gemini 2.5 Flash-Lite to determine your technical level and suggest          repositories to find  issues that matches user's skill level .

  *Issue Suitability (Gemini Tab): Navigate to the Gemini Tab and paste a specific GitHub Issue URL.

  *Roadmap Generation: Receive an AI-driven assessment of whether the issue matches your skill level, along with a step-by-step roadmap to implement the fix.
 
