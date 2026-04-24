# Open-Source-helper
Project Overview

OpenSource-Helper is a technical analysis tool designed to lower the barrier to entry for open-source contributions.
The Problem

Contributing to large-scale projects is intimidating. Newcomers often struggle to:
    Identify the core tech stack beyond just language tags.
    Understand the relationship between the backend and frontend in monorepos.
    Find entry-level issues that actually match their current skill set.

Solution:
The platform provides a "GPS for Repositories." By inputting a GitHub URL, the system performs a deep scan of the codebase, analyzes the architectural intent using AI, and generates a structured roadmap.

Advantages:
    Context-Aware Analysis: It don't just look at the code,It analyze the project's internal logic, dependencies, and documentation.
    System Integrity: Every AI-generated response is validated against strict Zod schemas to ensure data reliability.
    Performance First: Built with a containerized MERN stack and optimized for low-latency AI inference.

System Architecture

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

Design Decisions

    Recursive vs. Flat Crawling: "I implemented a Depth-First Search (DFS) crawler rather than a flat file-list fetch to prioritize architectural entry points (like index.ts and App.js) over deeply nested assets, optimizing the AI's token window."

    Schema Enforcement: "To prevent 'AI hallucinations' from breaking the frontend, I implemented a Zod validation layer that acts as a runtime type-check for the Gemini API response."

    Security-First Proxying: "By using Nginx as a reverse proxy within a Docker bridge network, the backend API is never directly exposed to the public internet, reducing the attack surface."
