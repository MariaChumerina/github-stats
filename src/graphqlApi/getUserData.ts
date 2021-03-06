import { gql } from '@apollo/client';

export const GET_USER_DATA = gql`
    query GetUserData($login: String!) {
        user(login: $login) {
            login
            name
            avatarUrl
            company
            location
            email
            bio
            websiteUrl
            repositories(first: 100, ownerAffiliations: OWNER, orderBy: { field: STARGAZERS, direction: DESC }) {
                edges {
                    node {
                        id
                        name
                        owner {
                            login
                            avatarUrl
                        }
                        description
                        sshUrl
                        url
                        forkCount
                        stargazerCount
                        languages(first: 20) {
                            nodes {
                                color
                                name
                            }
                        }
                        pushedAt
                        isFork
                        createdAt
                        updatedAt
                        defaultBranchRef {
                            target {
                                ... on Commit {
                                    history(first: 60) {
                                        edges {
                                            node {
                                                ... on Commit {
                                                    committedDate
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
