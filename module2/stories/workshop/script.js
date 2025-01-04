const storiesContainer = document.getElementById('storiesContainer');

const createStory = (storyId, image, tags, description) => {
    const story = document.createElement('div');
    story.classList.add('story');

    const img = document.createElement('img');
    img.src = image;
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
        resolve([e.target.result, formData.getAll('tags'), formData.get('description')])
    };

    reader.readAsDataURL(formData.get('image'));
});

const onFormSubmit = async (event) => {
    const data = await getStoryFormData(event);
    const storyId = "Change me"; // Replace with actual ID from your database
    const story = createStory(storyId, ...data);
    storiesContainer.appendChild(story);

    event.target.reset();
}

const onEditFormSubmit = async (event, storyId, storyElement) => {
    const data = await getStoryFormData(event);
    const newStory = createStory(storyId, ...data);

    storyElement.parentNode.replaceChild(newStory, storyElement);
}

const clearFilter = () => {
    document.getElementById('filterInput').value = '';
    storiesContainer.innerHTML = '';
}

const filter = () => {
    const filterTags = [...document.getElementById('filterInput').selectedOptions].map(o => o.value);
    storiesContainer.innerHTML = '';
}

const enterEditMode = (storyEl, tagsElement, descriptionElement) => {
    const storyId = storyEl.getAttribute('data-storyId');
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
        option.selected = tagsElement.textContent.includes(tag);
        newTagsInput.appendChild(option);
    });
    editForm.appendChild(newTagsInput);

    // New description input
    const newDescriptionInput = document.createElement('textarea');
    newDescriptionInput.name = 'description';
    newDescriptionInput.rows = 3;
    newDescriptionInput.value = descriptionElement.textContent;
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
        storyEl.remove();
    });

    editForm.appendChild(deleteButton);

    // Clear the story and show the edit form
    storyEl.innerHTML = '';
    storyEl.appendChild(editForm);
}

// Example add story to the DOM
const story = createStory(1, 'https://picsum.photos/200', ['#nature', '#travel'], 'This is a description');
storiesContainer.appendChild(story);

document.getElementById('storyForm').addEventListener('submit', onFormSubmit);
document.getElementById('clearButton').addEventListener('click', clearFilter);
document.getElementById('filterButton').addEventListener('click', filter);