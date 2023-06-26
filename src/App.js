import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [repositories, setRepositories] = useState([]);
  const [contributors, setContributors] = useState({});
  const [firstAuthors, setFirstAuthors] = useState({});

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await axios.get(
          'https://api.github.com/orgs/PHACDataHub/repos',
          {
            headers: {
              Authorization: '',
            },
          }
        );
        setRepositories(response.data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    };

    fetchRepositories();
  }, []);

  const fetchContributors = async (owner, repo, repoId) => {
    try {
      const contributorsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contributors`,
        {
          headers: {
            Authorization: '',
          },
        }
      );

      const contributors = contributorsResponse.data.map((contributor) => contributor.login);
      setContributors((prevContributors) => ({
        ...prevContributors,
        [repoId]: contributors.join(', '),
      }));

      const commitsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits`,
        {
          headers: {
            Authorization: 'YOUR_ACCESS_TOKEN',
          },
        }
      );

      const firstCommit = commitsResponse.data[0];
      const firstAuthor = firstCommit.author ? firstCommit.author.login : 'Unknown';
      setFirstAuthors((prevFirstAuthors) => ({
        ...prevFirstAuthors,
        [repoId]: firstAuthor,
      }));
    } catch (error) {
      console.error(`Error fetching contributors for ${owner}/${repo}:`, error);
      setContributors((prevContributors) => ({
        ...prevContributors,
        [repoId]: '',
      }));
      setFirstAuthors((prevFirstAuthors) => ({
        ...prevFirstAuthors,
        [repoId]: '',
      }));
    }
  };

  return (
    <div>
      <h1>GitHub Repositories</h1>
      <h2>Repositories</h2>
      <ul>
        {repositories.map((repo) => (
          <li key={repo.id}>
            <strong>Name:</strong> {repo.name}<br />
            <strong>URL:</strong> <a href={repo.html_url}>{repo.html_url}</a><br />
            <strong>Contributors:</strong> {contributors[repo.id]}<br />
            <strong>First Commit:</strong> {firstAuthors[repo.id]}<br />
            <button onClick={() => fetchContributors('PHACDataHub', repo.name, repo.id)}>Get Contributors and First Author</button>
            <hr></hr>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
