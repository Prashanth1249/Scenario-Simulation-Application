# Scenario-Simulation-Application

This project is a React.js application that allows users to create, display, update, and delete scenarios and vehicles. Users can simulate scenarios with moving vehicles based on specified parameters.

## Project Live here

[Live Demo](https://scenariosimulation.netlify.app/)

## Sample Youtube Video

[Watch on YouTube](https://youtu.be/gUiUgB_fJPE?si=25h43TCEgCnmqdBg)

## Features

- Create, display, update, and delete scenarios and vehicles
- Simulate scenarios with moving vehicles
- Proper validation for adding vehicles

## Project Setup

### Prerequisites

- Node.js and npm installed on your machine
- Git installed on your machine

### Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/Prashanth1249/Scenario-Simulation-Application.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Scenario-Simulation-Application
    ```

3. Install the project dependencies:

    ```bash
    npm install
    ```

### Running the Application

#### JSON Server

1. Install the JSON Server dependency:

    ```bash
    npm install json-server
    ```

2. Start the JSON Server to host the database:

    ```bash
    npx json-server --watch db.json --port 3001
    ```

   This command will start the JSON Server and host the database on `http://localhost:3001`.

#### React Application

1. Start the React application:

    ```bash
    npm start
    ```

   This command will start the React development server and open the application in your default web browser.

2. Access the application in your web browser at `http://localhost:3000`.

### Usage

1. Upon starting the application, you will land on the Home page.
2. Create, display, update, and delete scenarios and vehicles as needed.
3. Select a scenario and start the simulation to see vehicles move based on specified parameters.

### Deployment

This application can be deployed to any platform of your choice, such as Vercel, Netlify, etc. Follow the platform's instructions to deploy a React application.

## Technologies Used

- React.js
- JSON Server
- HTML/CSS

## Contributors

- [Prashanth](https://github.com/Prashanth1249)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This README now correctly uses `#` and `##` for the headings.
