import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [repositories, setRepositories] = useState([]);
  const [contributors, setContributors] = useState({});
  const [firstCommitters, setFirstCommitters] = useState({});

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await axios.get(
          'https://api.github.com/orgs/PHACDataHub/repos',
          {
            headers: {
              Authorization: 'YOUR_ACCESS_TOKEN',
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
            Authorization: '',
          },
        }
      );
        console.log(commitsResponse.data[0]);
      const firstCommit = commitsResponse.data[0];
      const firstCommitter = firstCommit.committer ? firstCommit.committer.login : 'Unknown';
      setFirstCommitters((prevFirstCommitters) => ({
        ...prevFirstCommitters,
        [repoId]: firstCommitter,
      }));
    } catch (error) {
      console.error(`Error fetching contributors for ${owner}/${repo}:`, error);
      setContributors((prevContributors) => ({
        ...prevContributors,
        [repoId]: '',
      }));
      setFirstCommitters((prevFirstCommitters) => ({
        ...prevFirstCommitters,
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
            <strong>First Committer:</strong> {firstCommitters[repo.id]}<br />
            <button onClick={() => fetchContributors('PHACDataHub', repo.name, repo.id)}>Get Contributors and First Committer</button>
            <hr></hr>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
