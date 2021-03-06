import {
    UserData,
    UserInfo as UserInfoType,
    RepoInfo,
    RepositoriesCollabGraphQl,
    RepositoriesCollabNode
} from '../types/apiTypes';
import {
    LanguageStats,
    CommitedDatesNumbers,
    Months,
    DateTimeFormatOptions,
    CollaborationStats,
    Collaborator
} from '../types/appTypes';
import { sortRepos } from '../utils/sort';

function parseUserInfo(userData: UserData): UserInfoType {
    return {
        login: userData.login,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
        company: userData.company,
        location: userData.location,
        email: userData.email,
        websiteUrl: userData.websiteUrl
    };
}

function parseRepos(userData: UserData): RepoInfo[] {
    const repositories = userData.repositories.edges.map(item => item.node);

    return repositories.sort((a, b) => sortRepos(a, b));
}

function getPercentLanguages(languageStats: LanguageStats, numberLanguages: number) {
    const languageNames = Object.keys(languageStats);
    const languagesStatsInPercents = [];

    for (const languageName of languageNames) {
        const percent = Math.round((languageStats[languageName] / numberLanguages) * 100);
        languagesStatsInPercents.push({
            name: languageName,
            percent: percent
        });
    }

    return languagesStatsInPercents;
}

function getStatsLanguages(repos: RepoInfo[]) {
    const languageStats: LanguageStats = {};
    let numberLanguages = 0;

    for (const repo of repos) {
        for (const language of repo.languages.nodes) {
            numberLanguages++;

            if (languageStats[language.name]) {
                languageStats[language.name]++;
            } else {
                languageStats[language.name] = 1;
            }
        }
    }

    return getPercentLanguages(languageStats, numberLanguages);
}

function getStatsLanguagesTop(repos: RepoInfo[], maxCount: number) {
    const languagesInPercents = getStatsLanguages(repos);
    languagesInPercents.sort((a, b) => b.percent - a.percent);

    return languagesInPercents.slice(0, maxCount);
}

function getCommitedDates(repos: RepoInfo[]) {
    const commitedDates = [];

    for (const repo of repos) {
        if (!repo.defaultBranchRef) continue;

        const enges = repo.defaultBranchRef.target.history.edges;

        for (const enge of enges) {
            commitedDates.push(enge.node.committedDate);
        }
    }

    return commitedDates;
}

function getCommitsGroupMonth(commitedDates: string[]) {
    const commitsByMonth: CommitedDatesNumbers = {};

    for (const commitedDate of commitedDates) {
        const yearAndMonth = commitedDate.substring(5, 7);

        if (commitsByMonth[yearAndMonth]) {
            commitsByMonth[yearAndMonth]++;
        } else {
            commitsByMonth[yearAndMonth] = 1;
        }
    }

    return commitsByMonth;
}

function getCommitedDatesFormatedChart(commitedDates: CommitedDatesNumbers) {
    const yearsAndmonths = Object.keys(commitedDates);
    const commitedDatesFormatedChart = [];

    const months: Months = {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec'
    };

    for (const yearAndMonth of yearsAndmonths) {
        commitedDatesFormatedChart.push({
            monthNum: yearAndMonth,
            month: months[yearAndMonth],
            number: commitedDates[yearAndMonth]
        });
    }

    return commitedDatesFormatedChart;
}

function getCommitFrequency(repos: RepoInfo[]) {
    const commitedDates = getCommitedDates(repos);

    const commitedDatesGroupMonth = getCommitsGroupMonth(commitedDates);

    const commitedDatesFormatedChart = getCommitedDatesFormatedChart(commitedDatesGroupMonth);

    commitedDatesFormatedChart.sort((a, b) => a.monthNum.localeCompare(b.monthNum));

    return commitedDatesFormatedChart;
}

function parseDatetime(datetimeString: string) {
    const datetime = new Date(datetimeString);

    const dateOptions: DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };

    return datetime.toLocaleString('ru', dateOptions);
}

function getCollaborationStats(repositoryNodes: RepositoriesCollabNode[]) {
    const statsCollaborations: CollaborationStats = {};

    for (const repositoryNode of repositoryNodes) {
        const assignableUsers = repositoryNode.node.assignableUsers.edges;

        for (const userNode of assignableUsers) {
            const user = userNode.node;

            if (statsCollaborations[user.login]) {
                statsCollaborations[user.login].countRepositories++;
            } else {
                statsCollaborations[user.login] = {
                    name: user.name,
                    avatarUrl: user.avatarUrl,
                    countRepositories: 1
                };
            }
        }
    }

    return statsCollaborations;
}

function getListCollaborators(collaborationStats: CollaborationStats) {
    const collaborators: Collaborator[] = [];

    const collaboratorLogins = Object.keys(collaborationStats);

    for (const login of collaboratorLogins) {
        collaborators.push({
            ...collaborationStats[login],
            login: login
        });
    }

    return collaborators;
}

function getCollaboratorsTop10(repositories: RepositoriesCollabGraphQl) {
    const collaborationStats = getCollaborationStats(repositories.edges);
    const collaborators = getListCollaborators(collaborationStats);
    collaborators.sort((a, b) => b.countRepositories - a.countRepositories);

    return collaborators.slice(1, 11);
}

export { parseUserInfo, parseRepos, getStatsLanguagesTop, getCommitFrequency, parseDatetime, getCollaboratorsTop10 };
