const formSection = document.getElementById('blog-form-section');
const openFormButton = document.getElementById('open-post-form');
const cancelFormButton = document.getElementById('cancel-post-form');
const blogForm = document.getElementById('blog-form');

const openStatsButton = document.getElementById('open-stats');
const closeStatsButton = document.getElementById('close-stats');
const statsDialog = document.getElementById('stats-dialog');
const postsCountElement = document.getElementById('posts-count');

const blogGrid = document.querySelector('.blog-grid');

function showForm() {
  formSection.classList.add('is-open');
  formSection.setAttribute('aria-hidden', 'false');
}

function hideForm() {
  formSection.classList.remove('is-open');
  formSection.setAttribute('aria-hidden', 'true');
}

function getPostsCount() {
  return document.querySelectorAll('.blog-card').length + 1; 
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

function formatMockDate() {
  return 'Mar 24, 2026';
}

function addMockPost() {
  const newPost = `
    <article class="blog-card">
      <div class="blog-image small"></div>
      <h4>Новая тестовая статья</h4>
      <span class="blog-date">${formatMockDate()}</span>
    </article>
  `;

  blogGrid.insertAdjacentHTML('afterbegin', newPost);
  updatePostsCount();
}

openFormButton.addEventListener('click', showForm);
cancelFormButton.addEventListener('click', hideForm);

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

  addMockPost();
  hideForm();
  blogForm.reset();
});

updatePostsCount();