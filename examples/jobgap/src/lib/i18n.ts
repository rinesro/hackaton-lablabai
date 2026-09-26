/**
 * i18n dictionary.
 * All UI strings live here. Keys are shared; values differ per locale.
 * Add new keys to BOTH en and id — the key-parity test will catch mismatches.
 */

export type Locale = "en" | "id";

export const dict = {
  en: {
    // ── Nav ──────────────────────────────────────────────────────────────
    nav_analyzer: "Analyzer",
    nav_tracker: "Tracker",

    // ── Analyzer page ─────────────────────────────────────────────────────
    analyzer_title: "Skill Gap Analyzer",
    analyzer_subtitle:
      "Upload or paste your CV and fill in the job description to see how well you match.",
    btn_try_sample: "Try sample",
    btn_analyze: "Analyze",
    btn_analyzing: "Analyzing…",

    // ── CV Upload ─────────────────────────────────────────────────────────
    cv_label: "Your CV",
    cv_upload_btn: "Upload your CV (PDF or DOCX, max 2 MB)",
    cv_drag_drop: "or drag & drop",
    cv_paste_manually: "Write or paste manually",
    cv_extracting: "Extracting text…",
    cv_upload_instead: "Upload PDF or DOCX instead",
    cv_replace_file: "Replace file",
    cv_placeholder: "Paste your CV text here (English or Indonesian)…",
    cv_upload_error_default: "Upload failed. Please try again.",
    cv_network_error: "Network error — please try again.",

    // ── JD Form ───────────────────────────────────────────────────────────
    jd_label: "Job Description",
    jd_upload_image: "Upload job posting image",
    jd_extracting: "Extracting…",
    jd_replace_image: "Replace image",
    jd_not_found_in_image: "· not found in image",
    jd_extract_error_default: "Image extraction failed. Please try again.",
    jd_network_error: "Network error — please try again.",

    jd_field_job_title: "Job Title",
    jd_field_company: "Company",
    jd_field_requirements: "Requirements / Required Skills",
    jd_field_description: "Job Description",
    jd_field_working_hours: "Working Hours",
    jd_field_benefits: "Benefits",
    jd_field_other_info: "Other Info",

    jd_placeholder_job_title: "e.g. Junior Full-Stack Engineer",
    jd_placeholder_company: "e.g. TechStartup.id",
    jd_placeholder_requirements: "Paste the required skills, qualifications, and experience here…",
    jd_placeholder_description: "About the role, responsibilities, nice-to-have…",
    jd_placeholder_working_hours: "e.g. Mon–Fri 09:00–18:00, hybrid",
    jd_placeholder_benefits: "e.g. BPJS, remote work, bonus",
    jd_placeholder_other_info: "Anything else relevant (location, language requirements…)",

    // ── Validation messages (keys returned by validateJd) ─────────────────
    val_requirements_too_short:
      "Please fill in the requirements, e.g. required skills, education, experience.",
    val_requirements_same_as_cv:
      "The requirements look very similar to your CV. Please paste the actual job requirements, not your CV.",
    val_warn_few_skills:
      "Some skills may not be recognized. The analysis will still run.",

    // ── Errors (analyzer page) ────────────────────────────────────────────
    err_generic: "Something went wrong. Please try again.",
    err_network: "Network error — check your connection and try again.",

    // ── Analysis result ───────────────────────────────────────────────────
    result_match_score: "Match Score",
    result_matched_skills: "Matched Skills",
    result_missing_skills: "Missing Skills",
    result_none_found: "None found",
    result_none_missing: "None — great match!",
    result_learning_plan: "Learning Plan",
    priority_high: "high",
    priority_medium: "medium",
    priority_low: "low",

    // ── Tracker page ──────────────────────────────────────────────────────
    tracker_title: "Application Tracker",
    tracker_subtitle: "Track every application in one place. Data is stored locally in your browser.",

    // ── Dashboard ─────────────────────────────────────────────────────────
    dashboard_title: "Dashboard",
    dashboard_overall_rate: "overall response rate",
    dashboard_applications: "applications",
    dashboard_chart_label: "Response rate by CV version",

    // ── AppForm ───────────────────────────────────────────────────────────
    form_company: "Company",
    form_role: "Role",
    form_date_applied: "Date Applied",
    form_cv_version: "CV Version",
    form_status: "Status",
    form_add: "Add",
    form_placeholder_company: "e.g. TechStartup.id",
    form_placeholder_role: "e.g. Junior Engineer",
    form_placeholder_cv_version: "e.g. v1, v2-tailored",

    // ── AppTable ──────────────────────────────────────────────────────────
    table_company: "Company",
    table_role: "Role",
    table_date_applied: "Date Applied",
    table_cv_version: "CV Version",
    table_status: "Status",
    table_delete: "Delete",
    table_empty: "No applications yet. Add one above.",
  },

  id: {
    // ── Nav ──────────────────────────────────────────────────────────────
    nav_analyzer: "Analisis",
    nav_tracker: "Pelacak",

    // ── Analyzer page ─────────────────────────────────────────────────────
    analyzer_title: "Analisis Kesenjangan Skill",
    analyzer_subtitle:
      "Upload atau tempel CV kamu dan isi deskripsi pekerjaan untuk melihat seberapa cocok kamu.",
    btn_try_sample: "Coba contoh",
    btn_analyze: "Analisis",
    btn_analyzing: "Menganalisis…",

    // ── CV Upload ─────────────────────────────────────────────────────────
    cv_label: "CV Kamu",
    cv_upload_btn: "Upload CV kamu (PDF atau DOCX, maks 2 MB)",
    cv_drag_drop: "atau seret & lepas",
    cv_paste_manually: "Tulis atau tempel langsung",
    cv_extracting: "Mengekstrak teks…",
    cv_upload_instead: "Upload PDF atau DOCX",
    cv_replace_file: "Ganti file",
    cv_placeholder: "Tempel teks CV kamu di sini (Bahasa Inggris atau Indonesia)…",
    cv_upload_error_default: "Upload gagal. Coba lagi.",
    cv_network_error: "Kesalahan jaringan — coba lagi.",

    // ── JD Form ───────────────────────────────────────────────────────────
    jd_label: "Deskripsi Pekerjaan",
    jd_upload_image: "Upload gambar lowongan",
    jd_extracting: "Mengekstrak…",
    jd_replace_image: "Ganti gambar",
    jd_not_found_in_image: "· tidak ditemukan di gambar",
    jd_extract_error_default: "Ekstraksi gambar gagal. Coba lagi.",
    jd_network_error: "Kesalahan jaringan — coba lagi.",

    jd_field_job_title: "Judul Pekerjaan",
    jd_field_company: "Perusahaan",
    jd_field_requirements: "Persyaratan / Keahlian yang Dibutuhkan",
    jd_field_description: "Deskripsi Pekerjaan",
    jd_field_working_hours: "Jam Kerja",
    jd_field_benefits: "Tunjangan",
    jd_field_other_info: "Info Lainnya",

    jd_placeholder_job_title: "cth. Junior Full-Stack Engineer",
    jd_placeholder_company: "cth. TechStartup.id",
    jd_placeholder_requirements: "Tempel keahlian, kualifikasi, dan pengalaman yang dibutuhkan…",
    jd_placeholder_description: "Tentang peran, tanggung jawab, nilai tambah…",
    jd_placeholder_working_hours: "cth. Senin–Jumat 09:00–18:00, hybrid",
    jd_placeholder_benefits: "cth. BPJS, kerja jarak jauh, bonus",
    jd_placeholder_other_info: "Info lain yang relevan (lokasi, syarat bahasa…)",

    // ── Validation messages (keys returned by validateJd) ─────────────────
    val_requirements_too_short:
      "Isi kolom persyaratan, misalnya keahlian, pendidikan, dan pengalaman yang dibutuhkan.",
    val_requirements_same_as_cv:
      "Persyaratan terlihat sangat mirip dengan CV kamu. Tempel persyaratan pekerjaan yang sebenarnya, bukan CV.",
    val_warn_few_skills:
      "Beberapa keahlian mungkin tidak dikenali. Analisis tetap akan berjalan.",

    // ── Errors (analyzer page) ────────────────────────────────────────────
    err_generic: "Terjadi kesalahan. Coba lagi.",
    err_network: "Kesalahan jaringan — periksa koneksimu dan coba lagi.",

    // ── Analysis result ───────────────────────────────────────────────────
    result_match_score: "Skor Kecocokan",
    result_matched_skills: "Keahlian yang Cocok",
    result_missing_skills: "Keahlian yang Kurang",
    result_none_found: "Tidak ada",
    result_none_missing: "Tidak ada — cocok sekali!",
    result_learning_plan: "Rencana Belajar",
    priority_high: "tinggi",
    priority_medium: "sedang",
    priority_low: "rendah",

    // ── Tracker page ──────────────────────────────────────────────────────
    tracker_title: "Pelacak Lamaran",
    tracker_subtitle: "Pantau semua lamaran di satu tempat. Data tersimpan di browser kamu.",

    // ── Dashboard ─────────────────────────────────────────────────────────
    dashboard_title: "Dasbor",
    dashboard_overall_rate: "tingkat respons keseluruhan",
    dashboard_applications: "lamaran",
    dashboard_chart_label: "Tingkat respons per versi CV",

    // ── AppForm ───────────────────────────────────────────────────────────
    form_company: "Perusahaan",
    form_role: "Posisi",
    form_date_applied: "Tanggal Melamar",
    form_cv_version: "Versi CV",
    form_status: "Status",
    form_add: "Tambah",
    form_placeholder_company: "cth. TechStartup.id",
    form_placeholder_role: "cth. Junior Engineer",
    form_placeholder_cv_version: "cth. v1, v2-disesuaikan",

    // ── AppTable ──────────────────────────────────────────────────────────
    table_company: "Perusahaan",
    table_role: "Posisi",
    table_date_applied: "Tanggal Melamar",
    table_cv_version: "Versi CV",
    table_status: "Status",
    table_delete: "Hapus",
    table_empty: "Belum ada lamaran. Tambahkan di atas.",
  },
} as const;

export type DictKey = keyof typeof dict.en;
