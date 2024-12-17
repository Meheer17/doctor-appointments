# Doctor Appointment API - README

This README will guide you through setting up and running the **Doctor Appointment API** on your local system as well as in a Docker container. This API is built with **Next.js**.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) (version 14 or higher)
- [Docker](https://www.docker.com/get-started) (for running with Docker)

## Setup Instructions

### 1. Clone the repository

Clone the repository to your local machine:

```bash
git clone https://github.com/Meheer17/doctor-appointment-api.git
cd doctor-appointment-api
```

### 2. Install Dependencies

Install the required dependencies for the application:

```bash
npm install
```

### 3. Run the Application Locally

To run the application on your local system, follow these steps:

#### Start the application

```bash
npm run dev
```

This will start the Next.js server on [http://localhost:3000](http://localhost:3000).

#### Environment Variables

Make sure you have set up the necessary environment variables in a `.env.local` file in the root of your project. Below is a sample configuration:

```env
MONGO_URI=YourMongoDB_URI
```

- `MONGO_URI`: Connection string for MongoDB (update it to match your MongoDB setup).

### 4. Running with Docker

If you want to run the application in a Docker container, follow these steps.

#### Step 1: Build the Docker image

First, build the Docker image using the following command:

```bash
cd docker/
docker build -t doctor-appointment-api .
```

#### Step 2: Run the Docker container

Once the image is built, you can run the container using:

```bash
docker run -p 3000:3000 doctor-appointment-api
```

This will expose the application on port `3000` inside the Docker container and map it to port `3000` on your local machine.

#### Step 3: Environment Variables in Docker

When running the app in Docker, you will need to pass the environment variables for the database connection. You can do this by creating a `.env.local` file or passing them directly in the `docker run` command.

Example:

```bash
docker run -p 3000:3000 \
  -e MONGO_URI=...MONGOURI \
  doctor-appointment-api
```

---

## Available Scripts

In the project directory, you can run the following commands:

### `npm run dev`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `.next` folder.

### `npm start`

Starts the application in production mode after you have built it with `npm run build`.

### `npm run lint`

Runs the linter to check for potential issues in the code.

---

## API Endpoints

Refer to the [API Documentation](#api.documentation.md) section for detailed descriptions of all the available API endpoints, their request and response formats.


## Troubleshooting

### Common Errors

- **Error: Cannot connect to MongoDB**: Ensure that your MongoDB instance is running and the `MONGO_URI` in the `.env.local` file is correctly configured.
- **Port already in use**: If you receive an error about the port being in use, make sure nothing else is running on port `3000` or change the port in the `.env.local` file.

---

## Conclusion

You now have all the necessary steps to set up and run the Doctor Appointment API on your local machine or in a Docker container. If you encounter any issues, feel free to open an issue in the repository or consult the documentation.