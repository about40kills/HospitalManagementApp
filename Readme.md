# Hospital Management System

This project is a full-stack Hospital Management application. It includes both the backend system and the frontend interface for managing patients, doctors, appointments, and other hospital-related data.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features
- Patient management
- Doctor management
- Appointment scheduling
- Medical records management
- Authentication and authorization

## Technologies
### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Docker (optional)

### Frontend
- React.js
- Redux
- Material-UI
- EJS

## Installation

### Backend

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/HospitalManagement-Backend.git
    cd HospitalManagement-Backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:
    ```bash
    npm start
    ```

### Frontend

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the frontend server:
    ```bash
    npm start
    ```

## Usage
- The backend server will start on `http://localhost:3000`.
- The frontend server will start on `http://localhost:3001`.
- Use a tool like Postman to test the API endpoints or navigate to the frontend URL to use the application.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Add a new patient
- `GET /api/patients/:id` - Get a patient by ID
- `PUT /api/patients/:id` - Update a patient by ID
- `DELETE /api/patients/:id` - Delete a patient by ID

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Add a new doctor
- `GET /api/doctors/:id` - Get a doctor by ID
- `PUT /api/doctors/:id` - Update a doctor by ID
- `DELETE /api/doctors/:id` - Delete a doctor by ID

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Schedule a new appointment
- `GET /api/appointments/:id` - Get an appointment by ID
- `PUT /api/appointments/:id` - Update an appointment by ID
- `DELETE /api/appointments/:id` - Cancel an appointment by ID

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.