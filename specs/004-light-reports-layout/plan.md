# Implementation Plan: Light Reports layout

Use the approved homepage as the visual baseline. Share the existing String header, content width, gutters, light palette, spacing and panel primitives across the detail route and Changelog. Keep the existing period hook and shared select. Style the Events list, product metrics, contributor and update lists, and Shapes chart and table with the same surfaces. Leave the canonical footer in the root layout.

Preserve the single static product route and its data boundaries. Keep the concurrent overview and data work separate. Run typechecking, build and repository tests. Use the production build to check the 13 public routes, period controls, focus, local overflow, fallback states and the footer. Attach desktop and mobile screenshots to the review handoff.

Constitution check. This change uses shared brand and period primitives (IV), keeps the existing catalogue and route (V), and retains the public aggregate and source boundaries (I–III).
