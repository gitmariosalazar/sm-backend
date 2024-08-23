import {request, gql} from 'graphql-request';

const endpoint = 'https://api.github.com/graphql';
const token = 'Your Token';

export async function searchRepositories (queryString) {
  const query = gql`
    query SearchRepositories($queryString: String!) {
      search(query: $queryString, type: REPOSITORY, first: 100) {
        nodes {
          ... on Repository {
            nameWithOwner
            description
            primaryLanguage {
              name
            }
            forkCount
            createdAt
            url
            owner {
              login
            }
            stargazerCount
            queries: object(expression: "master:queries.graphql") {
              ... on Blob {
                text
              }
            }
            mutations: object(expression: "master:mutations.graphql") {
              ... on Blob {
                text
              }
            }
            resolvers: object(expression: "master:resolvers.js") {
              ... on Blob {
                text
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    queryString
  };

  try {
    const response = await request(endpoint, query, variables, {
      Authorization: `Bearer ${token}`
    });

    return response.search.nodes.map(repo => ({
      nameWithOwner: repo.nameWithOwner,
      description: repo.description,
      primaryLanguage: repo.primaryLanguage,
      forkCount: repo.forkCount,
      createdAt: repo.createdAt,
      url: repo.url,
      owner: repo.owner,
      stargazerCount: repo.stargazerCount,
      queries: repo.queries ? repo.queries.text : null,
      mutations: repo.mutations ? repo.mutations.text : null,
      resolvers: repo.resolvers ? repo.resolvers.text : null,
    }));
  } catch (error) {
    throw new Error(Error, `searching repositories: ${error}`);
  }
}