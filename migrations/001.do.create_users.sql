CREATE TABLE IF NOT EXISTS "users" (
    "user_id" bigserial UNIQUE NOT NULL,
    "friend_code", text NOT NULL,
);