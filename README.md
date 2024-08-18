# Monorepository Overview

This monorepository contains a full-stack application with a React frontend, a NestJS backend, and Docker-managed database and authentication services. The project utilizes `pnpm` for package management and is structured to facilitate development, testing, and deployment. Below is a comprehensive overview of the project's structure, configuration, and setup.

## Monorepository Structure

### 1. Frontend (React)

#### `package.json`

The `package.json` file in the frontend directory contains essential configurations and dependencies for the React application. Key sections include:

- **`scripts`**: Defines commands for various tasks related to the application lifecycle.

  - **`start:prod`**: Starts the application in production mode.
  - **`dev`**: Launches the development server with hot reloading.
  - **`build`**: Compiles the application into static files for production.
  - **`lint`**: Runs ESLint to identify and fix issues in the code.
  - **`format`**: Uses Prettier to format the code according to defined styles.
  - **`clean`**: Removes build artifacts and temporary files.

- **`lint-staged`**: Configures tools to lint and format files before committing changes.

  - **`src/**/\*.{js,jsx,ts,tsx,json}`**: Applies ESLint and Prettier to JavaScript, TypeScript, and JSON files in the `src` directory.
  - **`./*.{js,ts,json}`**: Applies ESLint and Prettier to JavaScript, TypeScript, and JSON files in the root directory.

- **`dependencies`**: Lists libraries required at runtime, including UI components, state management, and HTTP request handling.

- **`devDependencies`**: Lists tools needed during development and build processes, such as linters, formatters, and testing libraries.

#### Environment Variables

The frontend uses the following environment variables defined in `.env`:

- **`PORT`**: Specifies the port number for the frontend server (default: `3000`).
- **`VITE_URL_API_BASE`**: Base URL for the backend API endpoints (default: `http://localhost:3002/api`).

### 2. Backend (NestJS)

#### `package.json`

The `package.json` file in the backend directory contains configurations and dependencies for the NestJS application. Key sections include:

- **`scripts`**: Defines commands for building, running, and testing the application.

  - **`start:prod`**: Launches the application in production mode.
  - **`dev`**: Starts the development server with hot reloading.
  - **`build`**: Compiles the NestJS application into JavaScript.
  - **`lint`**: Runs ESLint to identify and correct code issues.
  - **`format`**: Uses Prettier to format code.
  - **`test`**: Executes unit and integration tests.

- **`lint-staged`**: Configures linting and formatting of staged files before committing.

  - **`src/**/\*.{js,ts}`**: Applies ESLint and Prettier to JavaScript and TypeScript files in the `src` directory.

- **`dependencies`**: Lists runtime dependencies required for server-side functionality, including database drivers, HTTP handling libraries, and authentication packages.

- **`devDependencies`**: Lists development tools needed for building, testing, and linting the backend.

### 3. Environment Configuration

#### `.env`

The `.env` file contains environment-specific settings and credentials for different services:

- **Server Configuration**

  - **`PORT`**: Port number on which the backend server runs.
  - **`NODE_ENV`**: Specifies the environment, e.g., `development`, `production`.

- **MySQL Configuration**

  - **`DB_HOST`**: Hostname of the MySQL database server.
  - **`DB_PORT`**: Port number for connecting to the MySQL database.
  - **`DB_USERNAME`**: Username for authenticating with the MySQL database.
  - **`DB_PASSWORD`**: Password for the MySQL database user.
  - **`DB_NAME`**: Name of the database to use.

- **Cognito Configuration**

  - **`AWS_COGNITO_USER_POOL_ID`**: AWS Cognito User Pool ID.
  - **`AWS_COGNITO_CLIENT_ID`**: AWS Cognito Client ID.
  - **`AWS_COGNITO_AUTHORITY`**: Authority URL for AWS Cognito.
  - **`AWS_COGNITO_ENDPOINT`**: Endpoint URL for accessing AWS Cognito.
  - **`AWS_COGNITO_REGION`**: AWS region for Cognito.
  - **`AWS_COGNITO_ACCESS_KEY`**: Access key for AWS Cognito.
  - **`AWS_COGNITO_SECRET_KEY`**: Secret key for AWS Cognito.
  - **`COGNITO_LOCAL_PATH`**: Path to local data for Cognito.
  - **`COGNITO_POOL_TYPE`**: Type of Cognito pool (e.g., `development`).

- **USDA API Configuration**

  - **`USDA_API_KEY`**: API key for accessing USDA data.

- **Docker Configuration**

  - **`DOCKER_ENV`**: Indicates whether Docker is being used for deployment (`true`/`false`).

### 4. Docker Configuration

#### `docker-compose.yml`

This file defines the services and configuration for Docker containers:

- **`version: '3'`**: Specifies the version of Docker Compose file format.

- **`services`**: Defines the services used in the application:

  - **`db`**: MySQL database service.

    - **`image`**: Uses the official MySQL image.
    - **`environment`**:
      - **`MYSQL_ROOT_PASSWORD`**: Root password for MySQL.
      - **`MYSQL_DATABASE`**: Name of the initial database to create.
    - **`ports`**:
      - **`${DB_PORT}:3306`**: Maps local port to MySQL port inside the container.
    - **`volumes`**:
      - **`./data/mysql/:/var/lib/mysql`**: Mounts local directory for MySQL data persistence.

  - **`cognito`**: Local mock Cognito service.
    - **`image`**: Uses a custom or local image for mocking Cognito.
    - **`ports`**:
      - **`9229:9229`**: Maps local port to Cognito service port.
    - **`volumes`**:
      - **`./data/docker/volumes/cognito:/app/.cognito`**: Mounts local directory for Cognito data persistence.

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/nahuelRosas/personal_nutri_dash
   ```

2. **Install Dependencies**

   Navigate to the directory and install dependencies using `pnpm`:

   ```bash
   cd web
   pnpm install
   ```

3. **Start Services**

   Use `pnpm` to run the development server and start services:

   ```bash
   pnpm run dev
   ```

4. **Access the Application**

   Open your browser and navigate to `http://localhost:3000` to view the React frontend application.

   - The backend services are typically accessible at `http://localhost:3002`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
