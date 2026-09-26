/**
 * Trusted free learning resources for common tech and soft skills.
 * Keys are lowercase canonical skill names.
 * All URLs point to official documentation or well-known free platforms only.
 */

export interface Resource {
  title: string;
  url: string;
}

// ── Alias map: alternate names → canonical key ─────────────────────────────
const ALIASES: Record<string, string> = {
  // JavaScript
  js: "javascript",
  "node.js": "nodejs",
  node: "nodejs",
  // TypeScript
  ts: "typescript",
  // Python
  py: "python",
  // React
  reactjs: "react",
  "react.js": "react",
  // Vue
  vuejs: "vue",
  "vue.js": "vue",
  // Next.js
  nextjs: "next.js",
  next: "next.js",
  // Go
  golang: "go",
  // Kubernetes
  k8s: "kubernetes",
  // PostgreSQL
  postgres: "postgresql",
  // Machine Learning
  ml: "machine learning",
  // Deep Learning
  dl: "deep learning",
  // CI/CD
  cicd: "ci/cd",
  "ci cd": "ci/cd",
  // SQL
  mysql: "sql",
  sqlite: "sql",
  // CSS
  tailwindcss: "tailwind",
  // Soft skills
  "problem-solving": "problem solving",
  "time-management": "time management",
};

// ── Resource catalogue ─────────────────────────────────────────────────────
const RESOURCES: Record<string, Resource> = {
  javascript: {
    title: "MDN – JavaScript Guide",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
  },
  typescript: {
    title: "TypeScript – Official Handbook",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
  },
  python: {
    title: "Python – Official Tutorial",
    url: "https://docs.python.org/3/tutorial/",
  },
  react: {
    title: "React – Official Docs",
    url: "https://react.dev/learn",
  },
  "next.js": {
    title: "Next.js – Official Docs",
    url: "https://nextjs.org/docs",
  },
  vue: {
    title: "Vue.js – Official Guide",
    url: "https://vuejs.org/guide/introduction.html",
  },
  angular: {
    title: "Angular – Official Docs",
    url: "https://angular.dev/overview",
  },
  nodejs: {
    title: "Node.js – Official Guides",
    url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
  },
  go: {
    title: "Go – A Tour of Go",
    url: "https://go.dev/tour/welcome/1",
  },
  rust: {
    title: "The Rust Programming Language (Book)",
    url: "https://doc.rust-lang.org/book/",
  },
  java: {
    title: "Java – Oracle Dev Tutorials",
    url: "https://dev.java/learn/",
  },
  kotlin: {
    title: "Kotlin – Official Docs",
    url: "https://kotlinlang.org/docs/getting-started.html",
  },
  swift: {
    title: "Swift – Official Docs",
    url: "https://www.swift.org/documentation/",
  },
  php: {
    title: "PHP – Official Manual",
    url: "https://www.php.net/manual/en/getting-started.php",
  },
  sql: {
    title: "SQLZoo – Free SQL Tutorial",
    url: "https://sqlzoo.net/wiki/SQL_Tutorial",
  },
  postgresql: {
    title: "PostgreSQL – Official Tutorial",
    url: "https://www.postgresql.org/docs/current/tutorial.html",
  },
  mongodb: {
    title: "MongoDB – Free University Courses",
    url: "https://learn.mongodb.com/",
  },
  redis: {
    title: "Redis – Official Docs",
    url: "https://redis.io/docs/latest/develop/",
  },
  docker: {
    title: "Docker – Get Started Guide",
    url: "https://docs.docker.com/get-started/",
  },
  kubernetes: {
    title: "Kubernetes – Official Tutorials",
    url: "https://kubernetes.io/docs/tutorials/",
  },
  git: {
    title: "Pro Git Book (free online)",
    url: "https://git-scm.com/book/en/v2",
  },
  linux: {
    title: "Linux Journey – Free Interactive Course",
    url: "https://linuxjourney.com/",
  },
  aws: {
    title: "AWS Skill Builder – Free Tier",
    url: "https://skillbuilder.aws/",
  },
  gcp: {
    title: "Google Cloud Skills Boost – Free Courses",
    url: "https://cloudskillsboost.google/",
  },
  azure: {
    title: "Microsoft Learn – Azure",
    url: "https://learn.microsoft.com/en-us/training/azure/",
  },
  graphql: {
    title: "GraphQL – Official Learn Guide",
    url: "https://graphql.org/learn/",
  },
  "ci/cd": {
    title: "GitHub Actions – Official Docs",
    url: "https://docs.github.com/en/actions",
  },
  tailwind: {
    title: "Tailwind CSS – Official Docs",
    url: "https://tailwindcss.com/docs",
  },
  css: {
    title: "MDN – CSS First Steps",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
  },
  html: {
    title: "MDN – HTML Basics",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
  },
  "machine learning": {
    title: "fast.ai – Practical Deep Learning (free)",
    url: "https://course.fast.ai/",
  },
  "deep learning": {
    title: "fast.ai – Practical Deep Learning (free)",
    url: "https://course.fast.ai/",
  },
  tensorflow: {
    title: "TensorFlow – Official Tutorials",
    url: "https://www.tensorflow.org/tutorials",
  },
  pytorch: {
    title: "PyTorch – Official Tutorials",
    url: "https://pytorch.org/tutorials/",
  },
  "data analysis": {
    title: "Kaggle – Data Analysis Course (free)",
    url: "https://www.kaggle.com/learn/pandas",
  },
  agile: {
    title: "Atlassian – Agile Guide (free)",
    url: "https://www.atlassian.com/agile",
  },
  figma: {
    title: "Figma – Learn Design (free)",
    url: "https://www.figma.com/resources/learn-design/",
  },
  communication: {
    title: "Coursera – Improve Your English Communication Skills (audit free)",
    url: "https://www.coursera.org/specializations/improve-english",
  },
  "problem solving": {
    title: "Codecademy – Problem Solving with Algorithms (free intro)",
    url: "https://www.codecademy.com/learn/sorting-and-searching-algorithms",
  },
  "time management": {
    title: "Coursera – Work Smarter, Not Harder (audit free)",
    url: "https://www.coursera.org/learn/work-smarter-not-harder",
  },
};

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Resolve a skill name to a trusted free learning resource.
 * Normalises case, checks aliases, then looks up the catalogue.
 * Falls back to a Google search URL when no entry is found.
 */
export function resolveResource(skill: string): Resource {
  const key = skill.toLowerCase().trim();
  const canonical = ALIASES[key] ?? key;
  const resource = RESOURCES[canonical];
  if (resource) return resource;

  // Fallback: Google search for official docs / free courses
  const query = encodeURIComponent(`${skill} free course official docs`);
  return {
    title: "Search free courses",
    url: `https://www.google.com/search?q=${query}`,
  };
}
