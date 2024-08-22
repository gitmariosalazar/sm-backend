import {request, gql} from "graphql-request";
import {json2csv} from "json-2-csv";
import path from "path";
import fs from "fs";
import {fileURLToPath} from "url";
import {createTokenGitHub} from "../libs/jwt.js";
import Token from "../models/token.model.js";
import moment from "moment";
import {TOKEN_SECRET} from "../config.js";
import jwt from "jsonwebtoken";

// Obtén el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let repo = [];
// Define la función para buscar repositorios por lenguaje

export const searchRepositoriesByLanguage = async (req, res) => {
    const tok = req.cookies.jwt;
    const decoded = jwt.verify(tok, TOKEN_SECRET);
    const token_find = await findTokenrOne(decoded.token_name);
    const {language, quantity} = req.params;
    const endpoint = "https://api.github.com/graphql";
    const token = token_find.token_github; // Tu token de GitHub

    const query = gql`
    query SearchRepositories($queryString: String!, $quantity: Int!) {
      search(query: $queryString, type: REPOSITORY, first: $quantity) {
        repositoryCount
        nodes {
          ... on Repository {
            owner {
              login
            }
            name
            nameWithOwner
            description
            url
            primaryLanguage {
              name
            }
            forkCount
            stargazerCount
            watchers {
              totalCount
            }
            licenseInfo {
              name
            }
            defaultBranchRef {
              name
              target {
                ... on Commit {
                  history(first: 10) {
                    edges {
                      node {
                        oid
                        message
                        committedDate
                        author {
                          name
                          email
                        }
                      }
                    }
                  }
                }
              }
            }
            branches: refs(refPrefix: "refs/heads/", first: 5) {
              nodes {
                name
                target {
                  ... on Commit {
                    oid
                    message
                    committedDate
                    author {
                      name
                      email
                    }
                  }
                }
              }
            }
            releases(first: 10) {
              nodes {
                name
                tagName
                publishedAt
              }
            }
            languages(first: 10) {
              edges {
                node {
                  name
                }
                size
              }
            }
            createdAt
          }
        }
      }
    }
  `;

    const variables = {
        queryString: `language:${language} sort:stars-desc`,
        quantity: parseInt(quantity, 10),
    };

    try {
        const response = await request(endpoint, query, variables, {
            Authorization: `Bearer ${token}`,
        });

        const repositories = response.search.nodes;
        console.log(repositories.length);

        if (repositories && repositories.length > 0) {
            return res.json({
                error: null,
                repositories,
                message: `Repositories written in ${language} found successfully`,
            });
        } else {
            return res.json({
                error: null,
                repositories: [],
                message: `No repositories found for language ${language}`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: "The limit is too high; use a smaller quantity!",
            message: "Error occurred!",
            repositories: null,
        });
    }
};

export const searchRepositoriesByLanguages = async (req, res) => {
    const tok = req.cookies.jwt;
    const decoded = jwt.verify(tok, TOKEN_SECRET);
    const token_find = await findTokenrOne(decoded.token_name);
    const languages = req.query.languages; // Obtenemos los lenguajes desde los parámetros de consulta

    // Asegurarse de que `languages` sea un array
    const languagesArray = Array.isArray(languages) ? languages : [languages];

    const endpoint = "https://api.github.com/graphql";
    const token = token_find.token_github;

    // Preparar las consultas para cada lenguaje
    const queries = languagesArray.map(lang => ({
        language: lang,
        query: gql`
        query SearchRepositories($queryString: String!) {
          search(query: $queryString, type: REPOSITORY, first: 5) {
            nodes {
              ... on Repository {
                forkCount
                stargazerCount
                watchers {
                  totalCount
                }
              }
            }
          }
        }
      `,
        variables: {
            queryString: `language:${lang} sort:stars-desc`
        }
    }));

    try {
        const results = await Promise.all(queries.map(q =>
            request(endpoint, q.query, q.variables, {
                Authorization: `Bearer ${token}`,
            })
        ));

        const response = [
            {
                language: "Forks",
                data: results.map((result, index) => {
                    const repos = result.search.nodes;
                    const totalForks = repos.reduce((sum, repo) => sum + repo.forkCount, 0);
                    const averageForks = repos.length > 0 ? totalForks / repos.length : 0;
                    return {
                        name: languagesArray[index],
                        value: averageForks
                    };
                })
            },
            {
                language: "Watches",
                data: results.map((result, index) => {
                    const repos = result.search.nodes;
                    const totalWatches = repos.reduce((sum, repo) => sum + repo.watchers.totalCount, 0);
                    const averageWatches = repos.length > 0 ? totalWatches / repos.length : 0;
                    return {
                        name: languagesArray[index],
                        value: averageWatches
                    };
                })
            },
            {
                language: "Stars",
                data: results.map((result, index) => {
                    const repos = result.search.nodes;
                    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazerCount, 0);
                    const averageStars = repos.length > 0 ? totalStars / repos.length : 0;
                    return {
                        name: languagesArray[index],
                        value: averageStars
                    };
                })
            }
        ];

        return res.json({
            error: null,
            response,
            message: `Repositories data for languages found successfully`,
        });
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred!",
            message: "Error occurred!",
            response: null,
        });
    }
};


export const ConvertCSV = async (req, res) => {
    try {
        const jsonData = repo;

        if (!jsonData || !Array.isArray(jsonData)) {
            return res.status(400).json({
                error: "Invalid input data. JSON array required.",
                message: "Please provide a valid JSON array for conversion.",
            });
        }

        const fields = [
            "owner.login",
            "name",
            "nameWithOwner",
            "description",
            "url",
            "primaryLanguage.name",
            "forkCount",
            "createdAt",
        ];

        const csv = await json2csv(jsonData, {fields});
        const filePath = path.resolve(__dirname, "repositories.csv");
        console.log(filePath);
        fs.mkdirSync(path.dirname(filePath), {recursive: true});
        fs.writeFileSync(filePath, csv);
        res.setHeader(
            "Content-disposition",
            "attachment; filename=repositories.csv"
        );
        res.set("Content-Type", "text/csv");
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Error occurred while converting JSON to CSV.",
        });
    }
};

export const getTokens = async (req, res) => {
    try {
        const tokens = await Token.find();

        if (tokens && tokens.length > 0) {
            return res.json({
                error: null,
                token: tokens,
                message: "Tokens found successfully",
            });
        } else {
            return res.json({
                error: null,
                token: tokens,
                message: "Tokens is empty!",
            });
        }
    } catch (error) {
        return res
            .status(500)
            .json({error: error.message, message: "Error ocurred!", token: null});
    }
};

export const findTokenrOne = async (token_name) => {
    let token = await Token.findOne({token_name: token_name});
    if (!token) {
        return null;
    }
    return token;
};

// status: active, revoked, expired, disabled
export const createToken = async (req, res) => {
    try {
        const {token_name, token_github, expire_days} = req.body;
        const expirationDate = moment().add(expire_days, "days").toISOString();
        console.log(token_github);
        const token = new Token({
            token_name: token_name,
            token_github: token_github,
            description: "This token wil used to search repositories projects.",
            expire_days: expire_days,
            expire_date: expirationDate,
            status: "disabled",
        });
        const saveToken = await token.save();
        res.json({
            error: null,
            token: saveToken,
            message: "Create token successfully",
        });
    } catch (error) {
        return res
            .status(500)
            .json({
                error: error.message,
                token: null,
                message: "Create token failed",
            });
    }
};

export const getToken = async (req, res) => {
    try {
        const token = await Token.findById(req.params.id);
        console.log(token);
        if (!token) {
            return res
                .status(404)
                .json({error: null, token: token, message: "Token not found"});
        }
        res.json({
            error: null,
            token: token,
            message: "Token was found successfully",
        });
    } catch (error) {
        return res
            .status(500)
            .json({error: error.message, token: null, message: "Get Token failed"});
    }
};

export const deleteToken = async (req, res) => {
    try {
        const aux = req.cookies.jwt;
        if (!aux) {
            const token = await Token.findByIdAndDelete(req.params.id);
            if (!token) {
                return res
                    .status(404)
                    .json({error: null, token: token, message: "Task not found"});
            }
            return res.json({
                error: null,
                token: null,
                message: "Token delete successfully",
            });
        } else {
            const secretkey = TOKEN_SECRET;
            const decoded = jwt.verify(aux, secretkey);
            console.log(decoded);
            const token = await Token.findByIdAndDelete(req.params.id);
            if (!token) {
                return res
                    .status(404)
                    .json({error: null, token: token, message: "Task not found"});
            } else if (token._id == decoded._id) {
                res.cookie("jwt", "", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    expires: new Date(0), // Fecha de expiración en el pasado
                });
                return res.json({
                    error: 0,
                    token: null,
                    message: "Token delete successfully",
                });
            } else {
                return res.json({
                    error: null,
                    token: null,
                    message: "Token delete successfully",
                });
            }
        }
    } catch (error) {
        return res
            .status(500)
            .json({
                error: error.message,
                token: null,
                message: "Token delete error",
            });
    }
};

export const updateToken = async (req, res) => {
    try {
        const token = await Token.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!token) {
            return res
                .status(404)
                .json({error: null, token: token, message: "Token not found"});
        }
        res.json({
            error: null,
            token: token,
            message: "Token updated successfully!",
        });
    } catch (error) {
        return res
            .status(500)
            .json({
                error: error.message,
                token: null,
                message: "Token updated successfully!",
            });
    }
};

// status: enabled, revoked, expired, disabled
export const updateManyTokens = async (req, res) => {
    try {
        const filter = {status: {$in: ["enabled", "disabled"]}};

        const result = await Token.updateMany(filter, {status: "revoked"});
        res.json({error: null, message: `tokens updated successfully!`});
    } catch (error) {
        return res
            .status(500)
            .json({error: error.message, message: "Failed to update tokens"});
    }
};

export const setToken = async (req, res) => {
    try {
        const filter = {status: {$in: ["enabled"]}};

        await Token.updateMany(filter, {status: "disabled"});

        const find_token = await Token.findByIdAndUpdate(
            req.params.id,
            {status: "enabled"},
            {
                new: true,
            }
        );
        if (find_token != null) {
            res.cookie("jwt", "", {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                expires: new Date(0), // Fecha de expiración en el pasado
            });
            const token = createTokenGitHub(
                find_token._id,
                find_token.token_github,
                find_token.token_name,
                find_token.expire_days
            );
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 3600000,
            });
            res.status(200).json({
                error: null,
                token: find_token,
                message: "Set github token was successfully!",
            });
        } else {
            res.status(201).json({
                error: null,
                token: null,
                message: "Create github token failed!",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message,
            token: null,
            message: "Error, failed to set token github",
        });
    }
};

export const tokenEnable = async (req, res) => {
    const token = req.cookies.jwt;
    try {
        if (!token) {
            return res
                .status(403)
                .json({error: null, token: null, message: "No token provided"});
        }
        const secretkey = TOKEN_SECRET;
        const decoded = jwt.verify(token, secretkey);
        const token_find = await findTokenrOne(decoded.token_name);
        res.status(200).json({
            error: null,
            token: token_find,
            message: "Token enabled found successfully!",
        });
    } catch (error) {
        return res
            .status(401)
            .json({error: error.message, token: null, message: "Failed"});
    }
};

export const clearToken = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res
                .status(403)
                .json({error: null, token: null, message: "No token provided"});
        } else {
            const secretkey = TOKEN_SECRET;
            const decoded = jwt.verify(token, secretkey);
            console.log(decoded);
            const find_token = await Token.findByIdAndUpdate(
                decoded._id,
                {status: "disabled"},
                {
                    new: true,
                }
            );
            res.cookie("jwt", "", {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                expires: new Date(0), // Fecha de expiración en el pasado
            });
            res.status(200).json({
                error: null,
                token: null,
                message: "Token was removed successfully!",
            });
        }
    } catch (error) {
        return res
            .status(401)
            .json({error: error.message, token: null, message: "Error"});
    }
};
