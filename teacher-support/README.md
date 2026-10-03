# CVA Teacher Support Prototype

This folder contains the GitHub + Cloudflare test backend for the CVA Teacher Support system.

## Current prototype architecture
- GitHub: application source and version history
- Cloudflare Pages: hosting
- Cloudflare Pages Functions: API routes
- Cloudflare D1: shared teacher/support data

## Backend routes
- `GET /api/data?teacher_id=teacher-jordan`
- `POST /api/action`
- `GET /api/leadership`

## D1 setup
1. Create a D1 database named `cva-teacher-support`.
2. Run `schema.sql` against the database.
3. Bind the database to the Pages project using binding name `DB`.
4. If using Wrangler, replace `REPLACE_WITH_D1_DATABASE_ID` in `wrangler.toml` with the D1 database ID.

## Test identities
The seed data in `schema.sql` creates demo teacher, department lead, instructional coach, and supervisor records. This prototype intentionally uses test identities rather than production authentication.

## Next step
Connect the current teacher workspace and leadership dashboard HTML to these API routes, deploy the `teacher-support-prototype` branch through Cloudflare Pages, and test shared persistence before adding Cloudflare Access or production staff identity mapping.
