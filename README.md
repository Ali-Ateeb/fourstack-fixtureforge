# FixtureForge

Make repeatable synthetic CSV fixtures for prototypes without uploading real records. New October 22, 2026 work for Next Byte Hacks V5. This generates small test datasets; it does not anonymize private data or model a real population.

## Run

Serve this folder: `python -m http.server 8774 --bind 127.0.0.1`, then open http://127.0.0.1:8774/ . No packages, API keys or accounts are required. Core tests: `node --test core.test.mjs` (Node 18+).

Enter rows, seed and column recipes; generate; inspect the first ten rows; download CSV and a JSON recipe. The included invented order example creates 40 rows, four columns and three missing amount values with seed `next-byte-2026`. Real browser downloads are preserved in `examples/`.

## Behavior and limits

- 1–10,000 rows and 1–12 columns. Identifiers are case-insensitively unique, ASCII letters/numbers/underscores, starting with a letter or underscore.
- Types: consecutive integers, uniform integer ranges, decimal ranges at cent precision, and choices from up to 30 category strings. Numeric bounds stay within ±1 billion. A sequence with no missing values is unique within its own column.
- A versioned deterministic xorshift generator seeded by a string produces the same fixture for the same recipe and version. Changing row schema, column order, seed or algorithm version may change values. This is not cryptographic randomness.
- Missing percentages are independent sampling probabilities, not guaranteed quotas. No relational constraints, correlations, realistic distribution modeling, dates, emails, imported private records or semantic consistency are implemented.
- CSV quotes commas, newlines and quotes, uses CRLF, and represents nulls as empty fields. Category text with a common spreadsheet formula prefix is prefixed with an apostrophe; negative numbers remain numeric. This precaution does not certify every spreadsheet application as safe. JSON retains original recipe text.
- Editing invalidates preview and exports. The first ten rows are a preview, not the entire dataset.
- Inputs stay in browser memory. No persistence, analytics, external scripts or network APIs are used; ordinary hosting page requests still occur. Exports include any values you enter, so use invented categories and share deliberately.

## Attribution and verification

Codex assisted with planning, code, tests, visual layout and documentation. No AI model is integrated into the app. Original application code for this event; standard MIT license text is reused. This is separate from WindowWise, LabLedger and TraceTutor and does not reuse their application code. Personal member contributions and learning claims are not invented.

Nine core tests cover repeatability, seed changes, inclusive bounds, cent precision, missing values, CSV escaping/formula prefixes, validation and maximum-size output. Actual browser generation, both downloads, stale-result hiding and duplicate-column errors were checked. No general realism or correctness guarantee is claimed.

## Event preparation

Rules: https://next-byte-hacks-v5.devpost.com/rules
Schedule: https://next-byte-hacks-v5.devpost.com/details/dates

November 1 update: the current official schedule, overview and rules header extend the deadline to **November 8, 2026, 03:00 Pakistan time** (November 7, 22:00 UTC). This supersedes the original November 1, 02:00 PKT cutoff recorded with the receipt. The event opened October 6 at 04:00 UTC. Worldwide teams of 1–4; all supplied members fit the published age/student alternatives. Rules prohibit AI code that violates platform/tool policies; assistance is disclosed. New work only. Required description, repository, screenshots and a demo remain separate from registration. The overview asks for 1–3 minutes and rules for 2–5 minutes: target 2–3 minutes to satisfy both.

Software 1499712 / submission 1254130 was submitted October 23, 2026 after explicit final agreement confirmation. The 2:46 edited actual-capture demo at `media/demo.mp4` passed complete audio/video decoding; YouTube publication, playback, saved embed and timed English subtitles were verified: https://youtu.be/7Ef6lMVI-VQ . The saved October 25 joining confirmation adds Muhammad Anas Tahir to Ali Ateeb and Ali Zulfikar; Obaidullah remains pending his own registration and joining. This November 1 update changes documentation only. Authenticated editing and joining controls were unavailable, so no new roster change or product submission is claimed.
