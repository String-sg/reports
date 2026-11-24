# Plan

Use a single read-only count across completion references to produce the public total, Singapore-date buckets and an undated count. Store daily aggregates on the existing Shapes metric and derive the two chart and table views from them. Use a native selector with Week as the default. Run source validation, type checks, the production build and the repository’s browser checks in CI. Open a preview PR for owner review.
