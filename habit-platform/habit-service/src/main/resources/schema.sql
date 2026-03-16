CREATE TABLE IF NOT EXISTS habit (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    last_completed_date DATE,
    streak_count INTEGER NOT NULL DEFAULT 0
);
