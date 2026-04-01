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

function renderPosts() {
  const posts = getPostsFromStorage();

  document.querySelectorAll('.post-item').forEach(post => post.remove());

  posts.forEach(post => {
    blogGrid.insertAdjacentHTML('beforeend', createPostMarkup(post));
  });

  toggleEmptyState();
  updatePostsCount();
}

function addPostFromForm() {
  const title = titleInput.value.trim();
  const text = textInput.value.trim();

  if (!title || !text) {
    return;
  }

  const posts = getPostsFromStorage();

  const newPost = {
    id: Date.now().toString(),
    title,
    text,
    date: formatCurrentDate(),
  };

  posts.unshift(newPost);
  savePostsToStorage(posts);

  renderPosts();
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

blogForm.addEventListener('submit', event => {
  event.preventDefault();

  addPostFromForm();
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

renderPosts();
