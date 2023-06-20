import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

function App() {
  const [repositories, setRepositories] = useState([]);
  //const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await axios.get(
          'https://api.github.com/orgs/PHACDataHub/repos'
        );
        setRepositories(response.data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    };

    /*const fetchProjects = async () => {
      try {
        const response = await axios.get(
          'https://api.github.com/orgs/PHACDataHub/projects'
        );
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };*/

    fetchRepositories();
    //fetchProjects();
  }, []);

	const fetchContributors = async (owner, repo) => {
		try {
			const response = await axios.get(
				`https://api.github.com/repos/${owner}/${repo}/contributors`
				//`https://api.github.com/repos/${owner}/:${repo}/contributors?`
				//https://stackoverflow.com/questions/39042347/how-to-get-list-of-contributors-of-particular-organisation-in-github-api
				//https://github.com/miohtama/sphinxcontrib.contributors/blob/master/src/sphinxcontrib/contributors/contributors.js
			);
			const contributors = response.data.map(contributor => contributor.login);
			return contributors.join(', ');
		} catch (error) {
			console.error(`Error fetching contributors for ${owner}/${repo}:`, error);
			return '';
		}
	};

  const handleExportCSV = async () => {
    const contributorsPromises = repositories.map(async repo => {
      const contributors = await fetchContributors('PHACDataHub', repo.name);
      return {
        Name: repo.name,
        Description: repo.description,
        URL: repo.html_url,
        Contributors: contributors,
      };
    });

    const contributorsData = await Promise.all(contributorsPromises);

    const csvData = Papa.unparse(contributorsData, {
      header: true,
    });

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'repositories.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>GitHub Repositories</h1>
      <button onClick={handleExportCSV}>Export to CSV</button>
      <h2>Repositories</h2>
      <ul>
        {repositories.map(repo => (
          <li key={repo.id}>
            <strong>Name:</strong> {repo.name}<br />
            <strong>Description:</strong> {repo.description}<br />
            <strong>URL:</strong> <a href={repo.html_url}>{repo.html_url}</a><br />
            <strong>Contributors:</strong> {repo.contributors}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
