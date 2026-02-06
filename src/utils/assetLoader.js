const files = import.meta.glob('/assets/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP,CR2}', { eager: true });

// User bio data
const USER_BIOS = {
    'Richard Branson': 'I like islands',
    'Donald J Trump': 'I like big business and small children.',
    'Bill Gates': "Secret profile. Don't tell Melinda",
    'Prince Andrew': 'Royal gooner',
    'Jeff Epstein': 'No comment',
    'Bill Clinton': 'Former president. Eternal gooner.',
    'Chris Tucker': 'I make jokes and I crack youngilngs.',
    'Henry Jarecki': 'I do a bit of everything, including kids.',
    'Michael Jackson': 'HEE HEE',
    'Ghislaine Maxwell': 'The coordinator'
};


export const getAssets = () => {
    const assets = {
        feed: [],
        users: {}
    };

    for (const path in files) {
        const parts = path.split('/');
        // Expected format: /assets/FolderName/ImageName
        // parts: ['', 'assets', 'FolderName', 'ImageName']

        // Check if valid path structure
        if (parts.length < 4) continue;

        const folderName = parts[2];
        const image = files[path].default || path; // Handle default export vs input string

        // Decode URI because folder names might have spaces (e.g. "Bill%20Clinton")
        const decodedFolder = decodeURIComponent(folderName);

        if (decodedFolder === 'Feed') {
            assets.feed.push(image);
        } else {
            if (!assets.users[decodedFolder]) {
                assets.users[decodedFolder] = [];
            }
            assets.users[decodedFolder].push(image);
        }
    }

    return assets;
};

// Helper to get formatted users list
export const getUsers = () => {
    const { users } = getAssets();
    return Object.keys(users).map(name => ({
        name,
        avatar: users[name][0] || null, // Use first image as avatar
        bio: USER_BIOS[name] || 'Official account.'
    }));
};

// Helper to get all user posts for the feed
export const getAllUserPosts = () => {
    const { users } = getAssets();
    const allPosts = [];

    Object.entries(users).forEach(([username, images]) => {
        images.forEach(img => {
            allPosts.push({
                img,
                user: {
                    name: username,
                    avatar: images[0] || null // Using first image as avatar
                }
            });
        });
    });

    // Shuffle posts for variety
    return allPosts.sort(() => Math.random() - 0.5);
};

// Helper to get user bio
export const getUserBio = (username) => {
    return USER_BIOS[username] || 'Official account.';
};

