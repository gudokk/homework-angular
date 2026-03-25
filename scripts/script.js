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

function getPostsCount() {
  return document.querySelectorAll('.post-item').length;
}

function toggleEmptyState() {
  const postsCount = getPostsCount();

  if (postsCount === 0) {
    emptyMessage.style.display = 'block';
  } else {
    emptyMessage.style.display = 'none';
  }
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

function formatCurrentDate() {
  const now = new Date();

  return now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function createPostMarkup(title, text) {
  return `
    <article class="blog-card post-item">
      <button class="post-delete-button" type="button" aria-label="Удалить статью" title="Удалить статью">
        ×
      </button>
      <div class="blog-image small"></div>
      <h4>${title}</h4>
      <p class="blog-card-text">${text}</p>
      <span class="blog-date">${formatCurrentDate()}</span>
    </article>
  `;
}

function addPostFromForm() {
  const title = titleInput.value.trim();
  const text = textInput.value.trim();

  if (!title || !text) {
    return;
  }

  const newPost = createPostMarkup(title, text);
  blogGrid.insertAdjacentHTML('afterbegin', newPost);

  updatePostsCount();
  toggleEmptyState();
}

function deletePost(targetButton) {
  const post = targetButton.closest('.post-item');

  if (!post) {
    return;
  }

  post.remove();
  updatePostsCount();
  toggleEmptyState();
}

openFormButton.addEventListener('click', showForm);

cancelFormButton.addEventListener('click', () => {
  resetAndHideForm();
});

openStatsButton.addEventListener('click', openStatsDialog);
closeStatsButton.addEventListener('click', closeStatsDialog);

statsDialog.addEventListener('click', (event) => {
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

blogForm.addEventListener('submit', (event) => {
  event.preventDefault();

  addPostFromForm();
  blogForm.reset();
  hideForm();
});

document.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.post-delete-button');

  if (!deleteButton) {
    return;
  }

  deletePost(deleteButton);
});

updatePostsCount();
toggleEmptyState();