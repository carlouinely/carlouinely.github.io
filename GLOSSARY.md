# carlouinely

The portfolio site behind the wordmark `carlouinely`: a single recruiter-facing home page, plus one page per Project. Prerendered to static HTML and served from GitHub Pages.

## Language

**Wordmark**:
The site's brand name, rendered as `carlouinely`. It is the only name the site uses; the owner's legal name appears nowhere.
_Avoid_: Logo, handle, username, brand

**Project**:
Something the owner built and shipped, listed on the home page. Every Project has exactly one Case Study.
_Avoid_: Work, portfolio piece, side project

**Case Study**:
The long-form page describing one Project, at `/projects/<slug>`. It is what a home page card links to.
_Avoid_: Project page, article, post

**Article**:
Standalone writing not tied to a single Project. Articles are planned but not part of v1 — there is no Article surface yet, and the term is reserved here so Case Studies don't drift into it.
_Avoid_: Blog, blog post, note

**Placeholder**:
A stand-in shipped in place of a real value or asset, always marked where it appears and listed in `PLACEHOLDERS.md`. In code the marker is a `TODO` comment.
_Avoid_: Dummy, lorem, stub, mock
