# Product Management System API

This is a simple Express API with Typescript for managing products.

# Installation

To run this project, you need to have Node.js and npm (Node Package Manager) installed on your system. Follow these steps to get started:

1. Clone the project repository or download the source code.

2. Open a terminal and navigate to the project directory.

3. Install the required dependencies by running the following command:

   ```shell
   npm install
    ```

# Script Execution

This project provides several scripts that can be executed using the npm (Node Package Manager) command-line tool. The scripts are defined in the `package.json` file. Below are the available scripts:

- **start**: Starts the server by running the `server.ts` file using the `ts-node` TypeScript execution engine. This script is typically used in production environments.
- **start:dev**: Starts the server by running the `server.ts` file using the `ts-node-dev` TypeScript execution engine which restarts a process when any of the required files change. This script is typically used in development environments.
  - **--respawn**: Keep watching for changes after the script has exited.
  - **src/server.ts**: This is the application's entry file.

To execute a script, open a terminal or command prompt in the project's root directory and run the following command:

   ```shell
  npm run <script-name>
```


Replace `<script-name>` with the name of the script you want to execute. For example, to start the server, run:

   ```shell
  npm run start (or) npm run start:dev
```

# API Endpoints

This API provides the following endpoints for managing products.

## Product Management

- `GET /api/products`: Get all products.
- `GET /api/products/:id`: Get a specific product by ID.
- `POST /api/products`: Create a new product.
- `PUT /api/products/:id`: Update a product by ID.
- `DELETE /api/products/:id`: Delete a product by ID.

## License
This project is licensed under the MIT License. You can find the license information in the LICENSE file.
