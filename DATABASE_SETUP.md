# PostgreSQL & Prisma Setup Guide

This guide will walk you through setting up PostgreSQL with Prisma for your Discord bot.

## Option 1: Local PostgreSQL Installation (Recommended for Development)

### Windows Setup

1. **Download PostgreSQL**
   - Visit [postgresql.org](https://www.postgresql.org/download/windows/)
   - Download PostgreSQL 15+ for Windows
   - Run the installer

2. **Installation Steps**
   - Accept defaults or customize installation path
   - Set a password for the `postgres` superuser (remember this!)
   - Port: Keep default `5432`
   - Locale: Select your locale
   - Finish installation

3. **Verify Installation**

   ```bash
   psql --version
   ```

4. **Create a Database**

   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # In the psql shell, create your bot database
   CREATE DATABASE sarp_bot;
   CREATE USER botuser WITH PASSWORD 'your_secure_password';
   ALTER ROLE botuser SET client_encoding TO 'utf8';
   ALTER ROLE botuser SET default_transaction_isolation TO 'read committed';
   ALTER ROLE botuser SET default_transaction_deferrable TO on;
   ALTER ROLE botuser SET default_transaction_read_only TO off;
   ALTER ROLE botuser SET timezone TO 'UTC';
   GRANT ALL PRIVILEGES ON DATABASE sarp_bot TO botuser;
   \q
   ```

5. **Update .env File**
   ```env
   DATABASE_URL="postgresql://botuser:your_secure_password@localhost:5432/sarp_bot"
   ```

### Mac Setup

1. **Install via Homebrew (Recommended)**

   ```bash
   brew install postgresql
   brew services start postgresql
   ```

2. **Create Database and User**

   ```bash
   psql postgres

   CREATE DATABASE sarp_bot;
   CREATE USER botuser WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE sarp_bot TO botuser;
   \q
   ```

3. **Update .env File**
   ```env
   DATABASE_URL="postgresql://botuser:your_secure_password@localhost:5432/sarp_bot"
   ```

### Linux Setup

1. **Install PostgreSQL**

   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create Database and User**

   ```bash
   sudo -u postgres psql

   CREATE DATABASE sarp_bot;
   CREATE USER botuser WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE sarp_bot TO botuser;
   \q
   ```

3. **Update .env File**
   ```env
   DATABASE_URL="postgresql://botuser:your_secure_password@localhost:5432/sarp_bot"
   ```

## Option 2: Prisma Postgres (Quick Cloud Option)

1. **Create Free Prisma Postgres Database**
   ```bash
   npx create-db
   ```
   This will automatically update your `.env` with the DATABASE_URL

## Initializing the Database with Prisma

### 1. Push Schema to Database

```bash
npm run db:push
```

Or use migrations:

```bash
npm run db:migrate
```

### 2. Verify Schema Creation

```bash
npm run db:studio
```

This opens Prisma Studio - a GUI to view/manage your database

## Understanding the Schema

The bot uses three main models:

### GuildConfig

Stores per-guild settings:

- `guildId`: Discord server ID (unique)
- `prefix`: Command prefix (default: `!`)
- `modLogChannelId`: Channel for moderation logs (optional)

### CommandCooldown

Tracks command cooldowns to prevent spam:

- `userId`: Discord user ID
- `commandName`: Command name
- `expiresAt`: When cooldown expires

### User

Stores user statistics:

- `userId`: Discord user ID (unique)
- `infractions`: Number of infractions
- `warnings`: Number of warnings

## Using the Guild Config Service

### Get Guild Prefix

```typescript
import { GuildConfigService } from "./services/GuildConfigService";

const prefix = await GuildConfigService.getPrefix(guildId);
```

### Update Guild Settings

```typescript
await GuildConfigService.setPrefix(guildId, "!");
await GuildConfigService.setModLogChannel(guildId, channelId);
```

### Get Mod Log Channel

```typescript
const channelId = await GuildConfigService.getModLogChannel(guildId);
```

## Common Issues

### Connection Refused

- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Verify username/password

### Port Already in Use

- PostgreSQL default port is 5432
- To change: Modify DATABASE_URL or PostgreSQL config

### Migration Errors

- Reset database: `npx prisma migrate reset`
- Warning: This deletes all data!

## Running the Bot

```bash
# Development with auto-reload
npm run dev

# Build for production
npm run build

# Run production version
npm start
```

## Database Backup & Restore

### Backup

```bash
pg_dump -U botuser -d sarp_bot > backup.sql
```

### Restore

```bash
psql -U botuser -d sarp_bot < backup.sql
```

## Additional Resources

- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Prisma Studio](https://www.prisma.io/studio)
