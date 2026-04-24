## Project Overview

OpenSource-Helper is a technical analysis engine designed to bridge the gap between complex codebases and new contributors.
### The Problem

Contributing to large-scale projects is often intimidating. Newcomers frequently struggle to:

    Identify the true tech stack beyond simple GitHub language tags.

    Decipher architectural relationships between backend and frontend logic in monorepos.

    Find "Good First Issues" that actually align with their specific skill level.

### The Solution

Our platform acts as a "GPS for Repositories." By processing a GitHub URL through a specialized pipeline, the system:

    Performs a recursive deep scan of the codebase.

    Analyzes the architectural intent using Gemini 2.5 Flash-Lite.

    Generates a structured roadmap with actionable contribution steps.

3. System Architecture (Visualized)

Make sure your Mermaid block is wrapped in ```mermaid so GitHub renders the actual diagram instead of showing the code.
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

4. Design Decisions

##  Design Decisions

   * **Recursive DFS vs. Flat Crawling** I implemented a **Depth-First Search (DFS) crawler** rather than a standard flat file-list fetch. This allows the system to prioritize architectural entry points...

  * **Schema Enforcement via Zod** To mitigate "AI hallucinations," I implemented a **Zod validation layer**...

  * **Security-First Reverse Proxy
    By using Nginx as a reverse proxy within a Docker bridge network, I’ve ensured that the Node.js runtime is never directly exposed. This architecture allows for centralized SSL termination and protects the internal API logic from common external vulnerabilities.
