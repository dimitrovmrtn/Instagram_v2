const files = import.meta.glob('/assets/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP,CR2}', { eager: true });

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
        avatar: users[name][0] || null // Use first image as avatar
    }));
};
