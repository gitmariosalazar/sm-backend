import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Especificación OpenAPI
const swaggerOptions = {
    swaggerDefinition: {
        "openapi": "3.0.0",
        "info": {
            "title": "API Node JS & Mongo DB",
            "description": "Hi, my name is Mario Salazar, The next project is about users and Tasks (CRUD) and Login users.",
            "termsOfService": "http://swagger.io/terms/",
            "contact": {
                "email": "mariosalazar.ms.10@gmail.com",
                "phone": "0994532438"
            },
            "license": {
                "name": "ISC",
                "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
            },
            "version": "1.0.0"
        },
        "externalDocs": {
            "description": "Find out more about Project's Mario Salazar",
            "url": "https://www.mssalazar.com"
        },
        "servers": [

            {
                "url": ""
            }, {
                "url": "http://localhost:4000"
            },
            {
                "url": "https://backend-auth-node.vercel.app"
            }
        ],
        "tags": [
            {
                "name": "github",
                "description": "Everything about your Programming Languages of Git Hub",
                "externalDocs": {
                    "description": "Find out more",
                    "url": "http://swagger.io"
                }
            },

        ],
        "paths": {
            "/search/searchrepository/{language}/{quantity}": {
                "get": {
                    "description": "Get or serach github repository by language name",
                    "summary": "Get repository by language name ✅",
                    "tags": ["github"],
                    "parameters": [
                        {
                            "name": "language",
                            "in": "path",
                            "required": true,
                            "schema": {
                                "type": "string",
                                "default": "GraphQL"
                            }
                        },
                        {
                            "name": "quantity",
                            "in": "path",
                            "required": true,
                            "schema": {
                                "type": "integer",
                                "default": "20"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "403": {
                            "description": "Forbidden"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                },
            },
            "/search/average/{languages}": {
                "get": {
                    "description": "Get or search GitHub repository statistics by language with average values.",
                    "summary": "Get repository statistics by language with average values",
                    "tags": ["github"],
                    "parameters": [
                        {
                            "name": "languages",
                            "in": "query",
                            "required": true,
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                },
                                "example": ["Python", "Go"]
                            },
                            "description": "Comma-separated list of programming languages (e.g., Python,Go)"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Successful response with average statistics",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "error": {
                                                "type": "string",
                                                "example": "null"
                                            },
                                            "response": {
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "language": {
                                                            "type": "string",
                                                            "example": "Forks"
                                                        },
                                                        "data": {
                                                            "type": "array",
                                                            "items": {
                                                                "type": "object",
                                                                "properties": {
                                                                    "name": {
                                                                        "type": "string",
                                                                        "example": "Python"
                                                                    },
                                                                    "value": {
                                                                        "type": "number",
                                                                        "example": 9800
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            "message": {
                                                "type": "string",
                                                "example": "Repositories written in Python found successfully"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "403": {
                            "description": "Forbidden"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }

            },
            "/search/components/{owner}/{repo}/{branch}": {
                "get": {
                    "description": "Get or serach components",
                    "summary": "Get components ✅",
                    "tags": ["github"],
                    "parameters": [
                        {
                            "name": "owner",
                            "in": "path",
                            "required": true,
                            "schema": {
                                "type": "string",
                                "default": "bstraehle"
                            }
                        },
                        {
                            "name": "repo",
                            "in": "path",
                            "required": true,
                            "schema": {
                                "type": "string",
                                "default": "aws-appsync"
                            }
                        },
                        {
                            "name": "branch",
                            "in": "path",
                            "required": true,
                            "schema": {
                                "type": "string",
                                "default": "master"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "403": {
                            "description": "Forbidden"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/search/addtoken": {
                "post": {
                    "tags": ["github"],
                    "summary": "Register new token Git Hub ✅",
                    "description": "Register a new token to access search repositories.",
                    "operationId": "setToken",
                    "requestBody": {
                        "description": "Created new token Git Hub",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/SetToken"
                                }
                            },
                            "application/xml": {
                                "schema": {
                                    "$ref": "#/components/schemas/SetToken"
                                }
                            },
                            "application/x-www-form-urlencoded": {
                                "schema": {
                                    "$ref": "#/components/schemas/SetToken"
                                }
                            }
                        }
                    },

                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "400": {
                            "description": "Bad Request"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },

            "/search/gettoken/{id}": {
                "get": {
                    "description": "Get or serach components",
                    "summary": "Get components ✅",
                    "tags": ["github"],
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "schema": {
                                "type": "string",
                                "default": "66c37acb0281fe079d0b44a8"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "403": {
                            "description": "Forbidden"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/search/findall": {
                "get": {
                    "description": "Get Tokens",
                    "summary": "Get tokens ✅",
                    "tags": ["github"],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "403": {
                            "description": "Forbidden"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                },
            },
            "/search/verify": {
                "get": {
                    "description": "Get Token enable",
                    "summary": "Get token enable ✅",
                    "tags": ["github"],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "403": {
                            "description": "Forbidden"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                },
            },
            "/search/clear": {
                "get": {
                    "description": "Clear Token enable",
                    "summary": "Clear token enable ✅",
                    "tags": ["github"],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "403": {
                            "description": "Forbidden"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                },
            },
            "/search/settoken/{id}": {
                "get": {
                    "description": "Get or serach components",
                    "summary": "Get components ✅",
                    "tags": ["github"],
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "schema": {
                                "type": "string",
                                "default": "66c37acb0281fe079d0b44a8"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "403": {
                            "description": "Forbidden"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }
            },
            "/search/deletetoken/{id}": {
                "delete": {
                    "description": "Delete a Token",
                    "summary": "Remove Token ✅",
                    "tags": ["github"],
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "schema": {
                                "type": "string",
                                "default": "66c37acb0281fe079d0b44a8"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "403": {
                            "description": "Forbidden"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                }

            },
            "/search/updatetoken/{id}": {
                "put": {
                    "description": "Update Token",
                    "summary": "Update Token ✅",
                    "tags": ["github"],
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": true,
                            "schema": {
                                "type": "string",
                                "default": "66c37acb0281fe079d0b44a8"
                            }
                        }
                    ],
                    "requestBody": {
                        "description": "Update token object",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/UpdateToken"
                                }
                            },
                            "application/xml": {
                                "schema": {
                                    "$ref": "#/components/schemas/UpdateToken"
                                }
                            },
                            "application/x-www-form-urlencoded": {
                                "schema": {
                                    "$ref": "#/components/schemas/UpdateToken"
                                }
                            }
                        }
                    },
                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "403": {
                            "description": "Forbidden"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                },
            },
            "/search/revokeall": {
                "put": {
                    "description": "Update Token",
                    "summary": "Update Token ✅",
                    "tags": ["github"],

                    "responses": {
                        "200": {
                            "description": "OK"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "403": {
                            "description": "Forbidden"
                        },
                        "404": {
                            "description": "Not Found"
                        },
                        "500": {
                            "description": "Internal Server Error"
                        }
                    }
                },
            }
        },
        "components": {
            "schemas": {
                "SearchLanguage": {
                    "type": "object",
                    "properties": {
                        "language": {
                            "type": "string",
                            "format": "string",
                            "example": "Python"
                        },
                    },
                    "xml": {
                        "name": "SearchLanguage"
                    }
                },
                "UpdateToken": {
                    "type": "object",
                    "properties": {
                        "status": {
                            "type": "string",
                            "format": "string",
                            "example": "active"
                        },
                    },
                    "xml": {
                        "name": "SearchLanguage"
                    }
                },
                "SearchComponent": {
                    "type": "object",
                    "properties": {
                        "owner": {
                            "type": "string",
                            "format": "string",
                            "example": "bstraehle"
                        },
                        "repo": {
                            "type": "string",
                            "format": "string",
                            "example": "aws-appsync"
                        },
                        "branch": {
                            "type": "string",
                            "format": "string",
                            "example": "master"
                        },
                    },
                    "xml": {
                        "name": "SearchComponent"
                    }
                },
                "SetToken": {
                    "type": "object",
                    "properties": {
                        "token_name": {
                            "type": "string",
                            "format": "string",
                            "example": "My token name"
                        },
                        "token_github": {
                            "type": "string",
                            "format": "string",
                            "example": "bceggggggggggg"
                        },
                        "expire_days": {
                            "type": "integer",
                            "format": "int32",
                            "example": "25"
                        },
                    },
                    "xml": {
                        "name": "SetToken"
                    }
                },
                "ApiResponse": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "integer",
                            "format": "int32"
                        },
                        "type": {
                            "type": "string"
                        },
                        "message": {
                            "type": "string"
                        }
                    },
                    "xml": {
                        "name": "##default"
                    }
                }
            },
            "requestBodies": {


                "UserArray": {
                    "description": "List of user object",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/User"
                                }
                            }
                        }
                    }
                }
            },
            "securitySchemes": {
                "jwt": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT"
                }
            }
        },
        "security": [
            {
                "jwt": []
            }
        ]
    },
    apis: ['./routes/auth.routes.js', './routes/tasks.routes.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export {swaggerSpec, swaggerUi};
