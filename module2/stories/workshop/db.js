const DB_VERSION = 1;

/*
    Schema:
        stories
            - id (Primary key, auto increment)
            - image
            - tags (Index)
            - description
            - created
            - updated
*/

const openConnection = () => new Promise((resolve, reject) => {});

const db = await openConnection();

export const addNewStory = (image, tags, description) => new Promise((resolve, reject) => {}); // Return story.id

export const getAllStories = () => new Promise((resolve, reject) => {});

export const deleteStory = (id) => new Promise((resolve, reject) => {});

export const getStoryById = (id) => new Promise((resolve, reject) => {});

export const updateStory = (id, data) => new Promise(async (resolve, reject) => {}); // Return the updated story

export const searchStoriesByTag = (tags) => new Promise((resolve, reject) => {});