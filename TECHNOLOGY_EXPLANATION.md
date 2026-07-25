# Technology explanation

## Flask
Flask supplies clean server-side routes for the four pages and serves the static assets. It gives the project a Python application layer without forcing a heavy framework.

## Jinja2
Jinja2 provides template inheritance and Flask-aware URL generation. `base.html` owns the common document head, favicon, shared styles, and page script loading, so repeated HTML is removed and links keep working if routes change.

## Semantic HTML
The page content remains ordinary semantic HTML inside Jinja templates. A separate `pyhtml` package was intentionally not added because it would duplicate Jinja2, add a dependency, and make designer-edited markup harder to maintain. If “PyHTML” meant Python-generated HTML, Jinja2 is the standard Flask solution for that job.

## Python `sys`
`sys.version_info` performs an explicit Python 3.10+ runtime check at startup. It is not used in browser code because `sys` is a server-side Python module.

## TypeScript and JavaScript
TypeScript remains the editable source for interactive behaviour. The compiled JavaScript runs in the browser for the typing animation, agent status motion, About reveal, pricing conversion, and early-access form state.

## Local Tailwind CSS and page CSS
Tailwind output remains local, so the site has no CDN dependency. `shared.css` contains cross-page rules and each page keeps its own visual stylesheet to avoid unrelated CSS loading and preserve the design.

## Standard-library modules
`pathlib` creates stable absolute template/static paths. `datetime` supplies a reusable UTC year value to templates. Both avoid extra dependencies.

## Why no database yet
The early-access experience remains a frontend demonstration and does not silently store personal information. A database, email provider, CSRF protection, and privacy policy should be selected together before collecting real submissions.

## Web-app UI layer
`auth.html` models the future Google/Supabase entry point. `workspace.html` provides the app shell, navigation, composer, project list, creation modal, profile menu, and responsive mobile sidebar. The frontend demo stores projects in `localStorage`; this is clearly separated so a later Supabase/PostgreSQL repository can replace it without redesigning the interface.
