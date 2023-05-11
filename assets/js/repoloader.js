const markup = ({
  hidden,
  username,
  repo,
  link,
  description,
  stars,
  forks,
  topics,
}) => {
  return `
<div class="repo-card mt-20 font-mono w-full" style="height:200px;">
  <div class="flex flex-row justify-between w-full">
    <div class="text-blue-700 uppercase ml-10 flex flex-row justify-center items-center space-x-2">
      <svg class="inline-block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M10.6319 1.87859C11.1577 0.707136 12.8208 0.707139 13.3466 1.87859L15.9147 7.60055L22.1502 8.2748C23.4268 8.41284 23.9408 9.9946 22.9891 10.8566L18.3408 15.0672L19.6264 21.2059C19.8896 22.4627 18.5441 23.4403 17.4302 22.8016L11.9893 19.6819L6.54831 22.8016C5.43439 23.4403 4.08887 22.4627 4.35207 21.2059L5.6377 15.0672L0.989383 10.8566C0.0377377 9.99459 0.551685 8.41284 1.82827 8.2748L8.06378 7.60055L10.6319 1.87859ZM11.9893 3.7387L9.76817 8.68742C9.55183 9.16946 9.09606 9.50059 8.57077 9.55739L3.1779 10.1405L7.19806 13.7821C7.58965 14.1368 7.76374 14.6726 7.65543 15.1898L6.54354 20.4989L11.2492 17.8008C11.7076 17.538 12.2709 17.538 12.7293 17.8008L17.435 20.4989L16.3231 15.1898C16.2148 14.6726 16.3888 14.1369 16.7804 13.7821L20.8006 10.1405L15.4077 9.55739C14.8824 9.50059 14.4267 9.16946 14.2103 8.68742L11.9893 3.7387Z"
          fill="currentColor" />
      </svg>
      <p class="inline text-base">${stars} Stars</p>
    </div>
    <div class="text-blue-700 uppercase mr-10 flex flex-row justify-center items-center space-x-2">
      <svg class="inline-block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none">
        <circle cx="6" cy="6" r="3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
          stroke-width="2" />
        <circle cx="18" cy="6" r="3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
          stroke-width="2" />
        <circle cx="12" cy="18" r="3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
          stroke-width="2" />
        <path stroke="currentColor" stroke-width="2" d="M6 9v1a2 2 0 0 0 2 2h4m6-3v1a2 2 0 0 1-2 2h-4m0 0v3" />
      </svg>
      <p class="inline text-base">${forks} Forks</p>
    </div>
  </div>

  <br>

  <a target="_blank" rel="noopener noreferrer" href="${link}" class="text-text-primary text-2xl uppercase font-semibold">
    ${username}/${repo}
  </a>
  <p class="text-text-secondary text-base">
    ${description || "No description provided."}
  </p>

  <br>

  <div class="inline text-sm">
    ${topics.slice(0, 5).map(topic => '<p class="relative inline bg-blue-accent-subtle text-blue-accent-emphasis rounded-2xl px-1">' + topic + '</p>')}
  </div>

  <br><br>
</div>
`;
};

class GitHubAPI {
  constructor() {
    this.baseURL = "https://api.github.com/users/flancast90/repos?per_page=100&sort=latest";
    this.orgURL = "https://api.github.com/orgs/finned-tech/repos?per_page=100&sort=latest";
    this.username, this.repo, this.description, this.topics, this.stars, this.forks;
  }

  async getRepos() {
    const response = await fetch(this.baseURL);
    const orgResponse = await fetch(this.orgURL);
    const data = await response.json();
    const orgData = await orgResponse.json();
    return [...data, ...orgData];
  }

  parseRepoData(data) {
    this.username = data.owner.login;
    this.link = data.html_url;
    this.repo = data.name;
    this.description = data.description;
    this.topics = data.topics;
    this.stars = data.stargazers_count;
    this.forks = data.forks_count;
  }

  displayRepo() {
    const elem = document.querySelector('#repos');
    const html = markup({
      username: this.username,
      link: this.link,
      repo: this.repo,
      description: this.description,
      topics: this.topics,
      stars: this.stars,
      forks: this.forks
    });
    elem.innerHTML += html;
  }
}

window.onload = async () => {
  const api = new GitHubAPI();
  let repos = await api.getRepos();
  // filter to show repos that have the most stars first
  repos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  let i = 0;

  repos.forEach(repo => {
    const data = api.parseRepoData(repo);
    api.displayRepo();
  });

  let cards = document.querySelectorAll('.repo-card');
  document.getElementById('prev').addEventListener('click', () => {
    if (i === 0) i = cards.length - 1;
    else i--;
    cards.forEach(card => { card.style.display = 'none' });
    cards[i].style.display = 'block';
  });
  document.getElementById('next').addEventListener('click', () => {
    if (i === cards.length - 1) i = 0;
    else i++;
    cards.forEach(card => { card.style.display = 'none' });
    cards[i].style.display = 'block';
  });
};