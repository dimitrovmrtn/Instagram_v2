import Database from 'better-sqlite3';

const db = new Database('likes.db', { verbose: console.log });

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS likes (
    imageId TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0
  );
`);

export const initLikes = (imageIds) => {
    const checkStmt = db.prepare('SELECT count FROM likes WHERE imageId = ?');
    const insertStmt = db.prepare('INSERT INTO likes (imageId, count) VALUES (?, ?)');

    const transaction = db.transaction((ids) => {
        for (const id of ids) {
            const existing = checkStmt.get(id);
            if (!existing) {
                const randomLikes = Math.floor(Math.random() * 2500000) + 15;
                insertStmt.run(id, randomLikes);
            }
        }
    });

    transaction(imageIds);
};

export const getLikes = () => {
    const stmt = db.prepare('SELECT * FROM likes');
    return stmt.all();
};

export const getUser = (username) => {
    let user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
        // Initialize random defaults if not exists, but persist them
        const defaultFollowers = Math.floor(Math.random() * 50000) + 100;
        const defaultFollowing = Math.floor(Math.random() * 500) + 10;
        db.prepare('INSERT INTO users (username, followers, following) VALUES (?, ?, ?)').run(username, defaultFollowers, defaultFollowing);
        user = { username, followers: defaultFollowers, following: defaultFollowing };
    }
    return user;
};

export const toggleFollow = (username, isFollowing) => {
    // Ensure user exists first
    getUser(username);

    // isFollowing = true means we want to UNFOLLOW
    // isFollowing = false means we want to FOLLOW
    const change = isFollowing ? -1 : 1;

    db.prepare(`
        UPDATE users 
        SET followers = followers + ? 
        WHERE username = ?
    `).run(change, username);

    return getUser(username);
};

export const getLike = (imageId) => {
    const stmt = db.prepare('SELECT count FROM likes WHERE imageId = ?');
    return stmt.get(imageId);
};

export const incrementLike = (imageId) => {
    // Check if image already has likes
    const existing = getLike(imageId);

    if (!existing) {
        // Initialize with random count between 15 and 2,500,000
        const randomLikes = Math.floor(Math.random() * 2500000) + 15;
        const stmt = db.prepare(`
            INSERT INTO likes (imageId, count) VALUES (?, ?)
        `);
        stmt.run(imageId, randomLikes);
    } else {
        // Increment existing count
        const stmt = db.prepare(`
            UPDATE likes SET count = count + 1 WHERE imageId = ?
        `);
        stmt.run(imageId);
    }

    return getLike(imageId);
};

export const decrementLike = (imageId) => {
    const stmt = db.prepare(`
        UPDATE likes SET count = MAX(0, count - 1) WHERE imageId = ?
    `);
    stmt.run(imageId);
    return getLike(imageId);
};
