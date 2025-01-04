import { addNewStory, getAllStories, searchStoriesByTag, getStoryById, updateStory, deleteStory } from './db.js';

const storiesContainer = document.getElementById('storiesContainer');

const createStory = (storyId, image, tags, description) => {
    const story = document.createElement('div');
    story.classList.add('story');

    const img = document.createElement('img');
    img.src = image && URL.createObjectURL(image);
    story.appendChild(img);

    const editIcon = document.createElement('button');
    editIcon.textContent = '✏';
    editIcon.classList.add('edit-icon');
    story.appendChild(editIcon);

    const content = document.createElement('div');
    content.classList.add('content');

    const tagsElement = document.createElement('p');
    tagsElement.classList.add('tags');
    tagsElement.textContent = tags?.join(' ');
    content.appendChild(tagsElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('description');
    descriptionElement.textContent = description;
    content.appendChild(descriptionElement);
    story.appendChild(content);
    story.setAttribute('data-storyId', storyId);

    editIcon.addEventListener('click', () => enterEditMode(story, tagsElement, descriptionElement));

    return story;
}

const getStoryFormData = (event) => new Promise((resolve) => {
    event.preventDefault();

    // Get form data
    const form = event.target;
    const formData = new FormData(form);

    // Create story
    const reader = new FileReader();

    reader.onload = function (e) {
        const blob = e.target.result.byteLength ? new Blob([e.target.result], { type: formData.get('image').type }) : undefined;
        resolve([blob, formData.getAll('tags'), formData.get('description')])
    };

    reader.readAsArrayBuffer(formData.get('image'));
});

const onFormSubmit = async (event) => {
    const data = await getStoryFormData(event);
    const storyId = await addNewStory(...data);
    const story = createStory(storyId, ...data);
    storiesContainer.appendChild(story);

    event.target.reset();
}

const onEditFormSubmit = async (event, storyId, storyElement) => {
    const [image, tags, description] = await getStoryFormData(event);
    const data = { tags, description };
    if(image) {
        data.image = image;
    }

    const story = await updateStory(storyId, data);
    const newStory = createStory(storyId, story.image, story.tags, story.description);

    storyElement.parentNode.replaceChild(newStory, storyElement);
}

const clearFilter = () => {
    document.getElementById('filterInput').value = '';
    storiesContainer.innerHTML = '';
    loadStories();
}

const filter = async () => {
    const filterTags = [...document.getElementById('filterInput').selectedOptions].map(o => o.value);
    storiesContainer.innerHTML = '';

    for (const story of await searchStoriesByTag(filterTags)) {
        const storyElement = createStory(story.id, story.image, story.tags, story.description);
        storiesContainer.appendChild(storyElement);
    }
}

const enterEditMode = async (storyEl) => {
    const storyId = storyEl.getAttribute('data-storyId');
    const {description, tags} = await getStoryById(storyId)
    const editForm = document.createElement('form');
    editForm.classList.add('story-form');

    // New image input
    const newImageInput = document.createElement('input');
    newImageInput.type = 'file';
    newImageInput.name = 'image';
    newImageInput.accept = 'image/*';
    editForm.appendChild(newImageInput);

    // New tags input
    const newTagsInput = document.createElement('select');
    newTagsInput.name = 'tags';
    newTagsInput.multiple = true;
    ['#nature', '#travel', '#food', '#sports', '#art'].forEach(tag => {
        const option = document.createElement('option');
        option.textContent = tag;
        option.selected = tags.includes(tag);
        newTagsInput.appendChild(option);
    });
    editForm.appendChild(newTagsInput);

    // New description input
    const newDescriptionInput = document.createElement('textarea');
    newDescriptionInput.name = 'description';
    newDescriptionInput.rows = 3;
    newDescriptionInput.value = description;
    editForm.appendChild(newDescriptionInput);

    // Update button
    const updateButton = document.createElement('button');
    updateButton.type = 'submit';
    updateButton.textContent = 'Update';
    editForm.appendChild(updateButton);

    editForm.addEventListener('submit', (e) => onEditFormSubmit(e, storyId, storyEl));
    

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        deleteStory(storyId);
        storyEl.remove();
    });

    editForm.appendChild(deleteButton);

    // Clear the story and show the edit form
    storyEl.innerHTML = '';
    storyEl.appendChild(editForm);
}

const loadStories = async () => {
    for (const story of await getAllStories()) {
        const storyElement = createStory(story.id, story.image, story.tags, story.description);
        storiesContainer.appendChild(storyElement);
    }
}

document.getElementById('storyForm').addEventListener('submit', onFormSubmit);
document.getElementById('clearButton').addEventListener('click', clearFilter);
document.getElementById('filterButton').addEventListener('click', filter);
loadStories();