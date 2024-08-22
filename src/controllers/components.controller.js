import fetch from 'node-fetch';

const getRepositoryFiles = async (owner, repo, branch = 'main') => {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/?ref=${branch}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch repository contents: ${response.statusText}`);
    }
    return response.json();
};

const extractSchemaFragment = (content) => {
    const schemaRegex = /schema\s*\{\s*((?:[a-zA-Z_][\w]*\s*:\s*[^\s\}\s]+(?:\s*@[\w]+)?\s*)+)\}/s;
    const match = content.match(schemaRegex);
    if (match) {
        const schemaFields = {};
        const fieldRegex = /([a-zA-Z_][\w]*)\s*:\s*([^\s\}\s]+)(?:\s*@[\w]+)?/g;
        let fieldMatch;
        while ((fieldMatch = fieldRegex.exec(match[1])) !== null) {
            schemaFields[fieldMatch[1]] = fieldMatch[2];
        }
        return {
            schema: schemaFields
        };
    }
    return null;
};


const getFileContent = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.statusText}`);
    }
    return response.text();
};

const searchInFiles = async (files, searchTerms) => {
    for (const file of files) {
        if (file.type === 'file' && (file.name.endsWith('.graphql') || file.name.endsWith('.gql') || file.name.endsWith('.js') || file.name.endsWith('.ts'))) {
            const content = await getFileContent(file.download_url);
            const schemaFragment = extractSchemaFragment(content);
            if (schemaFragment) {
                return schemaFragment;
            }
        }
    }
    return null;
};
export const analyzeRepository = async (req, res) => {
    try {
        const {owner, repo, branch} = req.params;
        //console.log(`Fetching files for repository ${owner}/${repo} on branch ${branch}...`);
        const files = await getRepositoryFiles(owner, repo, branch);
        //console.log('Files fetched successfully.');

        //console.log(`Searching for GraphQL schema in repository ${owner}/${repo}...`);
        const schemaFragment = await searchInFiles(files);

        if (schemaFragment) {
            //console.log(`Found GraphQL schema fragment:`);
            //console.log(JSON.stringify(schemaFragment, null, 2)); // Log for debugging
            return res.status(200).json({
                error: null,
                message: "Components found successfully!",
                response: schemaFragment
            });
        } else {
            //console.log(`No GraphQL schema fragment found in the repository ${repo}.`);
            return res.json({
                error: null,
                message: `No GraphQL schema fragment found in the repository ${repo}.`,
                response: null
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: "Error occurred!",
            response: null
        });
    }
};



