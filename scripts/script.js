const STORAGE_KEY = 'blog-posts';

const formSection = document.getElementById('blog-form-section');
const openFormButton = document.getElementById('open-post-form');
const cancelFormButton = document.getElementById('cancel-post-form');
const blogForm = document.getElementById('blog-form');
const emptyMessage = document.getElementById('blog-empty');

const openStatsButton = document.getElementById('open-stats');
const closeStatsButton = document.getElementById('close-stats');
const statsDialog = document.getElementById('stats-dialog');
const postsCountElement = document.getElementById('posts-count');

const blogGrid = document.getElementById('blog-grid');
const titleInput = document.getElementById('post-title');
const textInput = document.getElementById('post-text');

const blogLoader = document.getElementById('blog-loader');

function showForm() {
  formSection.classList.add('is-open');
  formSection.setAttribute('aria-hidden', 'false');
}

function hideForm() {
  formSection.classList.remove('is-open');
  formSection.setAttribute('aria-hidden', 'true');
}

function resetAndHideForm() {
  blogForm.reset();
  hideForm();
}

function formatCurrentDate() {
  const now = new Date();

  return now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getPostsFromStorage() {
  const posts = localStorage.getItem(STORAGE_KEY);

  return posts ? JSON.parse(posts) : [];
}

function savePostsToStorage(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function getPostsCount() {
  return document.querySelectorAll('.post-item').length;
}

function toggleEmptyState() {
  emptyMessage.style.display = getPostsCount() === 0 ? 'block' : 'none';
}

function updatePostsCount() {
  postsCountElement.textContent = getPostsCount();
}

function openStatsDialog() {
  updatePostsCount();
  statsDialog.showModal();
}

function closeStatsDialog() {
  statsDialog.close();
}

function setFormDisabled(isDisabled) {
  openFormButton.disabled = isDisabled;
  cancelFormButton.disabled = isDisabled;

  titleInput.disabled = isDisabled;
  textInput.disabled = isDisabled;

  blogForm.querySelector('[type="submit"]').disabled = isDisabled;
}

function showLoader() {
  blogLoader.hidden = false;
}

function hideLoader() {
  blogLoader.hidden = true;
}

function createPostMarkup(post) {
  return `
    <article class="blog-card post-item" data-id="${post.id}">
      <button
        class="post-delete-button"
        type="button"
        aria-label="Удалить статью"
        title="Удалить статью"
      >
        ×
      </button>

      <div class="blog-image small"></div>
      <h4>${post.title}</h4>
      <p class="blog-card-text">${post.text}</p>
      <span class="blog-date">${post.date}</span>
    </article>
  `;
}

async function renderPosts(withDelay = true) {
  if (withDelay) {
    showLoader();
    setFormDisabled(true);

    await new Promise(resolve => setTimeout(resolve, 1200));
  }

  const posts = getPostsFromStorage();

  document.querySelectorAll('.post-item').forEach(post => post.remove());

  posts.forEach(post => {
    blogGrid.insertAdjacentHTML('beforeend', createPostMarkup(post));
  });

  toggleEmptyState();
  updatePostsCount();

  hideLoader();
  setFormDisabled(false);
}

async function addPostFromForm() {
  const title = titleInput.value.trim();
  const text = textInput.value.trim();

  if (!title || !text) {
    return;
  }

  setFormDisabled(true);

  const posts = getPostsFromStorage();

  const newPost = {
    id: Date.now().toString(),
    title,
    text,
    date: formatCurrentDate(),
  };

  posts.unshift(newPost);
  savePostsToStorage(posts);

  await renderPosts(true);
}

function deletePost(targetButton) {
  const postElement = targetButton.closest('.post-item');

  if (!postElement) {
    return;
  }

  const postId = postElement.dataset.id;

  const updatedPosts = getPostsFromStorage().filter(
    post => post.id !== postId
  );

  savePostsToStorage(updatedPosts);
  renderPosts();
}

openFormButton.addEventListener('click', showForm);

cancelFormButton.addEventListener('click', () => {
  resetAndHideForm();
});

openStatsButton.addEventListener('click', openStatsDialog);
closeStatsButton.addEventListener('click', closeStatsDialog);

statsDialog.addEventListener('click', event => {
  const rect = statsDialog.getBoundingClientRect();

  const isOutside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (isOutside) {
    closeStatsDialog();
  }
});

blogForm.addEventListener('submit', async event => {
  event.preventDefault();

  await addPostFromForm();

  blogForm.reset();
  hideForm();
});

document.addEventListener('click', event => {
  const deleteButton = event.target.closest('.post-delete-button');

  if (!deleteButton) {
    return;
  }

  deletePost(deleteButton);
});

renderPosts(true);
