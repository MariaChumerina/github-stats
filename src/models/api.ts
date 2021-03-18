import getOptions from '../utils/optionsGithubApi';
import { sortRepos } from '../utils/sort';
import config from '../config';
import { UserData, RepoData } from '../types/apiTypes';

const TOKEN = config.token;

export const getUserData = (username: string): Promise<UserData | Error> => {
    return fetch(`https://api.github.com/users/${username}`, getOptions(TOKEN))
        .then(response => {
            if (!response.ok) throw new Error(response.status.toString());

            return response.json();
        })
        .then(data => {
            return {
                login: data.login,
                name: data.name,
                avatarUrl: data.avatar_url,
                company: data.company,
                location: data.location,
                email: data.email,
                blog: data.blog,
                repos: data.public_repos
            };
        })
        .catch(error => {
            return error;
        });
};

export const getUserRepos = (username: string): Promise<RepoData[] | Error> => {
    return fetch(`https://api.github.com/users/${username}/repos?per_page=1000`, getOptions(TOKEN))
        .then(response => {
            if (!response.ok) throw new Error(response.status.toString());

            return response.json();
        })
        .then(data => {
            const repos = data.map((item: any) => {
                return {
                    name: item.name,
                    description: item.description,
                    cloneUrl: item.clone_url,
                    sshUrl: item.ssh_url,
                    forksCount: item.forks_count,
                    updatedAt: item.updated_at,
                    stargazersCount: item.stargazers_count,
                    language: item.language,
                    url: item.html_url
                };
            });

            const reposSorted = repos.sort(sortRepos);

            return reposSorted;
        })
        .catch(error => {
            return error;
        });
};

export const getRepoContributorsCount = (userName: string, repoName: string): Promise<number | Error> => {
    return fetch(`https://api.github.com/repos/${userName}/${repoName}/contributors`)
        .then(response => {
            if (!response.ok) throw new Error(response.status.toString());

            return response.json();
        })
        .then(data => {
            return data.length;
        })
        .catch(error => {
            return error;
        });
};

export const getRepoInfo = (userName: string, repoName: string) => {
    return fetch(`https://api.github.com/repos/${userName}/${repoName}`)
        .then(response => {
            if (!response.ok) throw new Error(response.status.toString());

            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            return error;
        });
};

export const getRepoPullsList = (userName: string, repoName: string) => {
    return fetch(`https://api.github.com/repos/${userName}/${repoName}/pulls?state=all`)
        .then(response => {
            if (!response.ok) throw new Error(response.status.toString());

            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            return error;
        });
};

export const getRepoIssuesList = (userName: string, repoName: string) => {
    return fetch(`https://api.github.com/repos/${userName}/${repoName}/issues?state=all`)
        .then(response => {
            if (!response.ok) throw new Error(response.status.toString());

            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            return error;
        });
};

export const getCommitsByUser = (userName: string, userEmail: string) => {
    return fetch(`https://api.github.com/users/${userName}/events`)
        .then(response => {
            if (!response.ok) throw new Error(response.status.toString());

            return response.json();
        })
        .then(events => {
            const eventsFiltered = events.filter((event: any) => {
                return (
                    event.type === 'PushEvent' &&
                    event.payload.commits.some((commit: any) => commit.author.email === userEmail)
                );
            });

            return eventsFiltered;
        })
        .catch(error => {
            return error;
        });
};
