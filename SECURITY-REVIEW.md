# CVA website security checklist

## Before merging security changes
- Confirm GitHub passkeys or phishing-resistant MFA are enabled for all maintainers.
- Review collaborators, deploy keys, GitHub Apps, and active sessions.
- Set up branch protection/rulesets where the GitHub plan supports enforcement; keep the interactives repository private.
- Restrict Cloudflare API tokens to the intended account and Pages project where supported. Rotate tokens if potentially exposed.
- Check that Pages production deploys only from the intended workflow/project and review deployment history.
- Turn on GitHub Dependabot alerts, secret scanning and push protection wherever available.
- Restrict allowed GitHub Actions to trusted publishers/actions as appropriate.
- Inspect any third-party JavaScript before adding it; prefer bundled, pinned, reviewed dependencies.
- Review changed external script URLs and iframe URLs during code review.
- Validate CTLS iframe behavior before applying CSP or X-Frame-Options.
- Test rollback from a known-good deployment.

## Important
CVA Interactives currently uses inline JavaScript and is intentionally embedded in CTLS. Do **not** enable a blanket CSP banning inline scripts or a blanket frame-ancestors 'none' policy. First inventory required origins and test a report-only policy.

Cloudflare Pages supports HTTP response headers through public/_headers. GitHub Pages does not use a Cloudflare-style _headers file; any response-level security policy for Teacher Resources needs to be configured at its hosting layer or through a carefully tested HTML policy.

No secrets, API keys or student records should be placed in client-side HTML/JavaScript.
