# Contributing to Social Profile Intelligence

Thanks for taking the time to contribute.

## Getting Started

1. Fork the repo
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/social-profile-intelligence.git`
3. Run `setup.bat` (Windows) or follow the manual setup in [README.md](README.md)
4. Create a branch: `git checkout -b feat/your-feature-name`

## What to Work On

Check the [Issues](../../issues) tab. Good first issues are labeled `good first issue`.

Common contribution areas:
- **New platforms** — add to `backend/app/core/platforms.py`
- **Username variant patterns** — extend `backend/app/services/username_variants.py`
- **UI improvements** — components in `frontend/src/components/`
- **Bug fixes** — see open bug reports

## Adding a New Platform

Each platform entry in `platforms.py` needs:

```python
{
    "name": "PlatformName",
    "url": "https://platformname.com/{}",   # {} = username placeholder
    "category": "Social",                   # Social | Tech | Gaming | Creative | Professional | Writing
}
```

Test that the URL format is correct and the platform returns a detectable 404 for non-existent users.

## Pull Request Process

1. Keep PRs focused — one feature or fix per PR
2. Test your changes locally before submitting
3. Fill out the PR template
4. PRs require at least one review before merge

## Code Style

- **Frontend**: standard React/JSX, Tailwind utility classes, no inline styles
- **Backend**: follow existing FastAPI patterns, async where possible
- No new dependencies without discussion in an issue first

## Reporting Bugs

Use the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) template. Include:
- OS and Python/Node versions
- Steps to reproduce
- Expected vs actual behavior
- Relevant log output

## Ethics Reminder

This tool works with publicly available data only. Contributions must not:
- Bypass authentication on any platform
- Scrape private or gated content
- Add features designed to harass or stalk individuals

See [docs/ethics.md](docs/ethics.md).
