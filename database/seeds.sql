UPDATE users
SET role_id = 1
WHERE email = 'monique@test.com';

SELECT id, name, email, role_id, is_active
FROM users
WHERE email = 'monique@test.com';

ALTER TABLE user_books
ADD COLUMN progress INT DEFAULT 0;