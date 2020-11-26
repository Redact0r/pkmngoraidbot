BEGIN;

TRUNCATE "users";

INSERT INTO "users" ("user_id", "friend_code") 
VALUES (298190703857500171, '1111-2222-3333');

COMMIT;