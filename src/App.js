import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
function App() {
  const [repositories, setRepositories] = useState([]);
  const [contributors, setContributors] = useState({});
  const [links, setLinks] = useState({});
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
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contributors`,
        {
          headers: {
            Authorization: '',
          },
        }
      )
      
      const contributors = response.data.map((contributor) => contributor.login);
      const links = response.data.map((contributor) => contributor.html_url);
      setContributors((prevContributors) => ({
        ...prevContributors,
        [repoId]: contributors.join(', '),
      }));
      setLinks((prevContributors) => ({
        ...prevContributors,
        [repoId]: links.join(', '),
      }));
    } catch (error) {
      console.error(`Error fetching contributors for ${owner}/${repo}:`, error);
      setContributors((prevContributors) => ({
        ...prevContributors,
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
            <strong>Description:</strong> {repo.description}<br />
            <strong>URL:</strong> <a href={repo.html_url}>{repo.html_url}</a><br />
            <strong>Contributors:</strong> {contributors[repo.id]}<br />
            <strong>URL: </strong>{links[repo.id]}<br />
            <button onClick={() => fetchContributors('PHACDataHub', repo.name, repo.id)}>Get Contributors</button>
            <hr></hr>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
