MVP for an AI video marketplace with YouTube samples, Dropbox delivery, and CCBill checkout.

## Quick start v1.0.xxx

1. Create `.env` in project root:

```
# Local dev (optional SQLite) or Neon Postgres
# DATABASE_URL="file:./dev.db"
# For Neon, paste your connection string (include ?pgbouncer=true&connect_timeout=15)
# Example:
# DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/db?sslmode=require&pgbouncer=true&connect_timeout=15"
CCBILL_CLIENT_ACCNUM=your_accnum
CCBILL_CLIENT_SUBACC=your_subacc
CCBILL_FORM_NAME=your_flex_form_name
CCBILL_DYN_SALT=your_flex_salt
DROPBOX_ACCESS_TOKEN=sl.B...  # app access token
```

2. Install and migrate

```
npm install
# For Neon (Postgres):
# npx prisma migrate dev --name init
```

3. Run

```
npm run dev
```

## Routes

- `/` list products, create via `New Product`
- `/products/[id]` detail with YouTube embed, buy button
- `/checkout/[id]` creates order then redirects to CCBill
- `/api/ccbill/return` CCBill return; marks paid and issues download token
- `/api/download/[token]` one-time redirect to Dropbox temporary link

## Notes

- This MVP trusts return redirect; for production use CCBill Datalink/IPN to verify payment server-to-server.
- Vercel deploy: set Environment Variables (DATABASE_URL, DROPBOX_ACCESS_TOKEN, CCBILL_*). Add a Build Step command `npm run deploy:migrate` (or a Vercel Postgres/Neon integration) to run schema migrations on deploy.
