# 🤖 Instructions for AI Coding Agents

> This file is automatically loaded and injected into your system instructions. You MUST strictly adhere to these rules for all operations on this codebase.

## 📐 Architecture & Structural Guidelines

1. **Architecture Hexagonale (Strict DDD)**:
   - Separate code into clean layers: `domain`, `usecases`, `infrastructure`, `hooks`, and `ui`.
   - The UI components (`ui/`) MUST NOT contain any network code or business logic; they should consume clean hooks and props.
   - Domain logic must be pure TypeScript (no imports of React, Axios, or browser/storage APIs).

2. **🚫 File Size Limit (Absolute & Non-Negotiable)**:
   - **Maximum 105 lines per file** for all active components, hooks, use cases, models, and helper files.
   - If a file is approaching 80 lines, you MUST proactively decompose it (e.g., extract sub-components, custom hooks, helper utilities).
   - *Exception*: Static mock data or static definition files (e.g., `*Data.ts`, `*Mock.ts`) are allowed up to **200 lines maximum**.

3. **Validation & Verification**:
   - Always run `npm run lint` and `npm run build` after changes to verify syntax and type safety.
   - Adhere to the ESLint guidelines configured in `eslint.config.js`.

---

## 🚀 How to align existing/new features:
- Refer to the comprehensive architectural guidelines inside `/skill.md` at the root of this project for detailed code patterns, folder structure templates, performance rules, and git/commit conventions.
