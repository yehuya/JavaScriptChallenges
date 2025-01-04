const storiesContainer = document.getElementById('storiesContainer');

const createStory = (image, tags, description) => {
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
    tagsElement.textContent = tags;
    content.appendChild(tagsElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('description');
    descriptionElement.textContent = description;
    content.appendChild(descriptionElement);
    story.appendChild(content);

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
        resolve([e.target.result, formData.getAll('tags').join(' '), formData.get('description')])
    };

    reader.readAsDataURL(formData.get('image'));
});

const onFormSubmit = async (event) => {
    const data = await getStoryFormData(event);
    const story = createStory(...data);
    storiesContainer.appendChild(story);

    event.target.reset();
}

const onEditFormSubmit = async (event, editedStory) => {
    const data = await getStoryFormData(event);
    const newStory = createStory(...data);

    editedStory.parentNode.replaceChild(newStory, editedStory);
}

const clearSearch = () => {
    document.getElementById('searchInput').value = '';
    const stories = document.querySelectorAll('.story');
    stories.forEach(story => {
        story.style.display = 'block';
    });
}

const search = () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const stories = document.querySelectorAll('.story');

    stories.forEach(story => {
        const tags = story.querySelector('.tags').textContent.toLowerCase();
        const description = story.querySelector('.description').textContent.toLowerCase();

        if (tags.includes(searchInput) || description.includes(searchInput)) {
            story.style.display = 'block';
        } else {
            story.style.display = 'none';
        }
    });
}

// Edit mode for stories
function enterEditMode(story, tagsElement, descriptionElement) {
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

    editForm.addEventListener('submit', (e) => onEditFormSubmit(e, story));
    

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
        story.remove();
    });

    editForm.appendChild(deleteButton);

    // Clear the story and show the edit form
    story.innerHTML = '';
    story.appendChild(editForm);
}

document.getElementById('storyForm').addEventListener('submit', onFormSubmit);
document.getElementById('clearButton').addEventListener('click', clearSearch);
document.getElementById('searchButton').addEventListener('click', search);