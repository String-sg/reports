# Recovered Remarks Co-Pilot Quarter Figures

Recovered from public Git history on 25 October 2026. These are historical report inputs,
not a production database reconciliation. Owner verification remains pending.

[Original data at commit e096c4b](https://github.com/String-sg/reports/blob/e096c4b709d89c6fa93719f20455b622df466cd7/docs/remarkscopilot/assets/app.js) · [CSV](remarkscopilot-recovered-quarters.csv)

| Quarter | Total users as historically labelled | Remarks generated | Cost as recorded | In old dropdown |
| --- | --- | --- | --- | --- |
| 2023 Q3 | 413 | 10,546 | $3,379.48 | Yes |
| 2023 Q4 | 711 | 10,247 | $50* | Yes |
| 2024 Q1 | 833 | 2,013 | $50* | No |
| 2024 Q2 | 1,210 | 11,499 | $50* | Yes |
| 2024 Q3 | 1,460 | 10,918 | $50* | Yes |
| 2024 Q4 | 1,557 | 6,374 | $50* | Yes |
| 2025 Q1 | 1,641 | 1,991 | $50* | Yes |
| 2025 Q2 | 1,825 | 7,664 | $50* | Yes |

The eight remarks figures total **61,252**, matching the current report's all-time remarks
value. **2024 Q1** exists in the data object but is omitted from the old dropdown's quarter
list. The March 2026 migration flattened the report to a latest-quarter snapshot; the
current report retains the aggregate remarks total but not the eight-quarter breakdown.

## Verify before restoration

- Confirm what the historical Total users field measures and whether it is cumulative.
  Do not add those quarter-end totals or count registrations as meaningful product use.
- Verify the per-quarter remarks figures against original records if available, including
  the previously unselectable 2024 Q1 row and any periods missing after 2025 Q2.
- Preserve the cost asterisks exactly until their meaning is verified; do not infer an
  expense definition or sum these as a validated grant expenditure figure.
- Event participant history remains separate; this recovery does not deduplicate people.

## Excluded incorrect active-user figure

The old object also contains a mau field, including 53,894 for 2025 Q2. The inspected
historical HTML did not render that field. The March 2026 migration added it as Quarterly
active users; [commit b73c1ca](https://github.com/String-sg/reports/commit/b73c1ca516fa9e4ca9d5d6494261d4c506f67a36)
explicitly removed that metric as incorrect on 5 May 2026. It is excluded from the recovered
review CSV and must not be restored as active or unique users without a new verified definition.

No published values, application code or scheduled jobs changed during this recovery.
