# Project Versioning

This project uses several mechanisms to track versions and changes:

## 1. Database Migrations

All database schema changes are tracked in `/supabase/migrations/`. Each migration file is timestamped and contains:
- A description of changes
- SQL commands to implement the changes
- SQL commands to roll back changes if needed

### Migration Naming Convention
- Timestamp prefix (YYYYMMDDHHMMSS)
- Descriptive name in kebab-case
- `.sql` extension

Example: `20250328165853_fading_water.sql`

## 2. Frontend Version Tracking

The frontend version is tracked in `package.json`. The version number follows semantic versioning:

- Major version: Breaking changes
- Minor version: New features
- Patch version: Bug fixes

Current version: 1.0.1

## 3. Documentation

Changes and updates are documented in:
- `docs/README.md`: Technical documentation
- Migration files: Database schema changes
- Component comments: Component-level changes

## 4. Deployment Tracking

Deployments are tracked through Netlify's deployment history, accessible through your Netlify dashboard.