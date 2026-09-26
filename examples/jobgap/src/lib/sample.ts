import type { JdForm } from "./jdSchema";


export const SAMPLE_CV = `Budi Santoso
Fresh Graduate – Informatics Engineering, Universitas Indonesia (2024)
budi.santoso@email.com | github.com/budisantoso

EDUCATION
Bachelor of Informatics Engineering – GPA 3.61/4.00
Universitas Indonesia, Jakarta, 2020–2024

TECHNICAL SKILLS
Languages: JavaScript, Python, HTML, CSS
Frameworks: React, Express.js, Flask
Tools: Git, VS Code, Postman
Databases: MySQL, basic MongoDB

PROJECTS
• TugasKu – task management web app (React + Express + MySQL). Deployed on Railway.
• SentimentIn – Twitter sentiment classifier using Naive Bayes (Python, scikit-learn).

EXPERIENCE
Intern – Web Developer, PT Digital Maju, Jakarta (Jan–Mar 2024)
  - Built and maintained internal dashboard using React and REST APIs.
  - Wrote unit tests with Jest; reduced bug reports by ~30%.

CERTIFICATIONS
- Dicoding: Belajar Dasar Pemrograman Web (2022)
- Coursera: Python for Everybody (2023)`;

export const SAMPLE_JD = `Job Title: Junior Full-Stack Engineer
Company: TechStartup.id, Jakarta (Hybrid)

About the Role
We are looking for a motivated junior engineer to join our 10-person product team.
You will build and maintain customer-facing features for our SaaS platform.

Requirements
- Proficient in TypeScript (mandatory)
- Experience with Next.js or similar SSR framework
- Familiarity with RESTful API design and integration
- Basic knowledge of CI/CD pipelines (GitHub Actions preferred)
- Experience with containerisation (Docker)
- Comfortable writing unit and integration tests
- Good understanding of relational databases (PostgreSQL preferred)
- Ability to work in an Agile/Scrum environment

Nice to Have
- Exposure to cloud platforms (AWS or GCP)
- Knowledge of Redis or other caching strategies
- Open-source contributions

What We Offer
- Competitive entry-level salary (IDR 7–10 jt/month)
- Mentorship from senior engineers
- Flexible hybrid work arrangement`;


export const SAMPLE_JD_FORM: JdForm = {
  jobTitle:     "Junior Full-Stack Engineer",
  company:      "TechStartup.id, Jakarta (Hybrid)",
  requirements: `- Proficient in TypeScript (mandatory)
- Experience with Next.js or similar SSR framework
- Familiarity with RESTful API design and integration
- Basic knowledge of CI/CD pipelines (GitHub Actions preferred)
- Experience with containerisation (Docker)
- Comfortable writing unit and integration tests
- Good understanding of relational databases (PostgreSQL preferred)
- Ability to work in an Agile/Scrum environment`,
  description:  `We are looking for a motivated junior engineer to join our 10-person product team.
You will build and maintain customer-facing features for our SaaS platform.

Nice to Have
- Exposure to cloud platforms (AWS or GCP)
- Knowledge of Redis or other caching strategies
- Open-source contributions`,
  workingHours: "Monday–Friday, 09:00–18:00 WIB (flexible / hybrid)",
  benefits:     "Competitive entry-level salary (IDR 7–10 jt/month), mentorship from senior engineers, flexible hybrid arrangement",
  otherInfo:    "",
};
