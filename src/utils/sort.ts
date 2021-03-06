import { RepoInfo } from '../types/apiTypes';

export function sortRepos(a: RepoInfo, b: RepoInfo) {
    const stargazersCountA = a.stargazerCount;
    const stargazersCountB = b.stargazerCount;

    if (stargazersCountA === stargazersCountB) {
        const dateUpdateA = new Date(a.updatedAt).getTime();
        const dateUpdateB = new Date(b.updatedAt).getTime();

        return dateUpdateB - dateUpdateA;
    }

    return stargazersCountB - stargazersCountA;
}
