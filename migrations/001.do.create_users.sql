CREATE TABLE IF NOT EXISTS "users" (
    "user_id" text UNIQUE NOT NULL,
    "friend_code" text NOT NULL,
    );