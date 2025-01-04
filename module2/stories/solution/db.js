const DB_VERSION = 1;

const openConnection = () => new Promise((resolve, reject) => {
    const request = window.indexedDB.open("stories", DB_VERSION);

    request.onerror = (event) => {
        console.error("Error opening database:", event.target.errorCode);
        reject(event.target.errorCode);
    }

    request.onsuccess = (event) => {
        resolve(event.target.result);
    } 

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore("stories", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("tags", "tags", { unique: false, multiEntry: true, });
    }
});

const db = await openConnection();

export const addNewStory = (image, tags, description) => new Promise((resolve, reject) => {
    const request = db
        .transaction(["stories"], "readwrite")
        .objectStore("stories")
        .add({image, tags, description, created: new Date()});

    request.onsuccess = () => resolve(request.result);
    request.onerror = reject;
});

export const getAllStories = () => new Promise((resolve, reject) => {
    const request = db
        .transaction(["stories"], "readonly")
        .objectStore("stories")
        .getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = reject;
});

export const deleteStory = (id) => new Promise((resolve, reject) => {
    const request = db
        .transaction(["stories"], "readwrite")
        .objectStore("stories")
        .delete(Number(id));
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = reject;
});

export const getStoryById = (id) => new Promise((resolve, reject) => {
    const request = db
        .transaction(["stories"], "readonly")
        .objectStore("stories")
        .get(Number(id));
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = reject;
});

export const updateStory = (id, data) => new Promise(async (resolve, reject) => {
    const story = await getStoryById(id);
    if (!story) {
        reject("Story not found");
        return;
    }

    const request = db
        .transaction(["stories"], "readwrite")
        .objectStore("stories")
        .put({...story, ...data, id: Number(id), updated: new Date()});
    
    request.onsuccess = async (event) => {
        // return the new object from the db 
        const storyId = event.target.result;
        const story = await getStoryById(storyId);
        resolve(story);
    }
    request.onerror = reject;
});

export const searchStoriesByTag = (tags) => new Promise((resolve, reject) => {
    const results = [];
    const request = db
        .transaction(["stories"], "readonly")
        .objectStore("stories")
        .index("tags")
        .openCursor(tags[0]);
    
    request.onsuccess = (event) => {
        const cursor = event.target.result;

        if (cursor) {
            const story = cursor.value;

            if (tags.every(t => story.tags.includes(t))) {
                results.push(story);
            }

            cursor.continue();
        } else {
            resolve(results);
        }
    }

    request.onerror = reject;
});