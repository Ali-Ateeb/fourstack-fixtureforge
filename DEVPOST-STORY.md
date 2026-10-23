## Inspiration

Prototype teams need data to exercise their tables, exports and empty states. Copying real records into a demo is unnecessary for many of these checks. FixtureForge makes small, repeatable fixtures from an explicit recipe.

## What it does

Set a seed, choose 1–10,000 rows and define up to twelve sequence, integer, decimal or category columns. Set an optional missing-value probability for each column. Generate, preview the first ten rows, and download CSV plus the recipe JSON. Editing hides previous results so an outdated export cannot be mistaken for the new recipe.

The sample orders are invented. This is test-data generation, not anonymization or realistic population simulation. There are no accounts, paid APIs or integrated AI models.

## How it was built and AI assistance

New October 22, 2026 work for Next Byte Hacks V5 using JavaScript, HTML and CSS. Codex assisted with planning, implementation, testing, styling and documentation. No application code from WindowWise, TraceTutor or LabLedger was reused. The MIT license uses standard text. Team members must review and understand the implementation; personal contribution or learning stories are not fabricated.

A string seed initializes a small deterministic xorshift generator. All column recipes are validated before generation. Integer and cent-based ranges are inclusive. Missing percentages sample probabilities rather than promise exact counts. CSV export quotes delimiters and newlines, doubles embedded quotes, and prefixes common spreadsheet formula markers in category text with an apostrophe.

## Verification

Nine core tests cover repeatability, different seeds, inclusive bounds, decimal precision, missing-value extremes, category membership, CSV edge cases, invalid inputs and 10,000-row output. Actual browser downloads of the sample fixture and recipe were inspected: forty rows, four columns, expected first record and three missing amounts. Changing a column invalidates output; duplicate names produce a readable error.

## Limits and next steps

The prototype does not enforce relationships across columns, produce correlated real-world data, read private datasets, or use cryptographic randomness. Decimal values support two decimal places. Exported files contain user-entered categories, so use invented values. Recipe JSON preserves original text; CSV formula-prefix handling is a precaution, not a universal spreadsheet security guarantee. Future work could add recipe import, date types and explicit cross-column constraints; none is currently implemented.


## Demo production

The finished 2:46 demonstration is an edited walkthrough of actual browser captures with invented order data and synthetic Windows text-to-speech narration. Codex assisted with demo preparation. It is not a continuous screen recording. Transcript and timed captions are included in the public repository.
