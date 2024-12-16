# Backend Developer Test

---

### Scenario

**Context:**

A doctor needs a simple online system to manage appointment slots. Patients can book available slots, with each slot having a defined start and end time. Slots can be configured to repeat according to specific rules.

**Key Points:**

- The doctor can create multiple slots by specifying:
    - A start and end time range for a given day.
    - A slot duration (15 or 30 minutes).
    - Recurrence options for these slots:
        - Repeat daily (e.g., every day at these times)
        - Repeat weekly (e.g., every Monday, Wednesday, and Friday)
        - A one-time occurrence on a specific date (e.g., 25th Dec 2014)
- Once a patient books a slot, it becomes unavailable for others.

**What to Implement:**

1. **Create a Doctor**
    - **API (Example):** `POST /doctors`
    - **Request Body Example:**
        
        ```json
        {
          "username": "drsmith",
          "first_name": "John",
          "last_name": "Smith",
          "email": "john.smith@clinic.com"
        }
        ```
        
    - **Expected Result:**
    Creates a new doctor record. Returns the created doctor's details along with an ID.
2. **Set/Create Slots**
    - **API (Example):** `POST /doctors/{doctorId}/slots`
    - **Request Body Example (30-min slots between 10:00 and 11:30, daily):**
        
        ```json
        {
          "start_time": "2014-12-25T10:00:00Z",
          "end_time": "2014-12-25T11:30:00Z",
          ...........
          .......... // complete the remaining where applicable
        }
        ```
        
    - **What This Means:**
        - From 10:00 to 11:30, 30-minute slots yield 3 slots:
            - Slot 1: 10:00–10:30
            - Slot 2: 10:30–11:00
            - Slot 3: 11:00–11:30
        - These slots repeat daily until December 31, 2014.
    - **Expected Result:**
    The API creates slot entries in the database (or stores the recurrence rule and generates them as needed). Returns a summary of created slots (or the recurrence rule ID).
3. **Create an Appointment (Book a Slot)**
    - **API (Example):** `POST /slots/{slotId}/book`
    - **Expected Result:**
    Marks the chosen slot as booked and returns the booking confirmation.
4. **Show All Booked Appointments**
    - **API (Example):** `GET /doctors/{doctorId}/bookings?start_date=2014-12-01&end_date=2014-12-31`
    - **Expected Result:**
    Returns a list of all booked appointments for the given doctor within the specified date range, including slot details and patient information.
5. **Show All Available Slots**
    - **API (Example):** `GET /doctors/{doctorId}/available_slots?date=2014-12-25`
    - **Expected Result:**
    Returns a list of all available (not booked) slots for the given doctor on the specified date.

---

### Additional Notes & Examples

- **Database Choice:**You can choose any database (SQL or NoSQL). For SQL (e.g., Postgres), consider tables like `doctors`, `slots`, `bookings` etc. For NoSQL (e.g., MongoDB), consider collections to store doctors, slot documents, and booking documents.
- **Data Modelling Example (SQL-like):**
    - **doctors** table:
        - `id` (primary key)
        - `username`
        - `first_name`
        - `last_name`
        - `email`
    - **slots** table:
        - `id` (primary key)
        - `doctor_id` (foreign key to doctors)
        - `start_time`
        - `end_time`
        - `status` (e.g., "available" or "booked")
    - **bookings** table:
        - `id` (primary key)
        - `slot_id` (foreign key to slots)
        - `patient_id`
        - `reason`
        - `booking_time` (timestamp of when booking was made)
- **Recurring Slots Handling:**
    - One approach is to store the recurrence details in a separate table/collection (e.g., `recurrence_rules`) and pre-generate the individual slots up to a certain end date.
    - Another approach is to generate the slots when needed (e.g., on the fly when someone requests availability).
- **Basic Logic for Slot Creation (Example):**
    - Suppose you receive a request to create slots from `10:00` to `11:30` with 30-minute slots.
    - Calculate how many slots fit: `1.5 hours / 0.5 hours = 3 slots`.
    - Insert three records into the `slots` table (or one record per day if recurring).
- **Booking a Slot (Example):**
    - When a request to book slot `slot_id=101` comes in:
        - Check if `slots.status == 'available'`.
        - If available, create a booking record and update slot status to "booked".
        - If already booked, return an error.

---

### Tech Stack Guidelines

- **Backend Language & Framework:** Node.js with Express.js (or a similar framework).
- **Database:** Any choice (e.g., MongoDB, PostgreSQL, MySQL).
- **Testing & Documentation:** You can provide Postman collections or simple curl commands to test endpoints.

---

### What to Submit

To successfully complete this exercise, submit the following:

1. **GitHub Repository:**
    - **Codebase:**
        - Complete source code for the backend application.
        - Clear, concise commit history showing your development process.
    - [**README.md](http://readme.md/):**
        - **Project Description:** Brief overview of the project and its features.
        - **Setup Instructions:** Clear guide to set up and run the application.
        - **API Documentation:** Detailed documentation of all endpoints with examples.
        - **Technologies Used:** List of technologies and tools used.
        - **Bonus (if implemented):** Frontend interface access instructions.
2. **Docker Compose Setup:**
    - **docker-compose.yml File:**
        - Defines backend and database services.
        - Enables one-command setup using `docker-compose up`.
    - **Dockerfile(s):**
        - Backend application configuration with all dependencies.
        - Database configuration (if needed beyond standard Docker Hub images).
    - **Example `docker-compose.yml`:**
        
        ```yaml
        version: '3.8'
        
        services:
          app:
            build: .
            ports:
              - "3000:3000"
            environment:
              - DB_HOST=db
              - DB_PORT=5432
              - DB_USER=your_db_user
              - DB_PASSWORD=your_db_password
              - DB_NAME=your_db_name
            depends_on:
              - db
        
          db:
            image: postgres:13
            restart: always
            environment:
              POSTGRES_USER: your_db_user
              POSTGRES_PASSWORD: your_db_password
              POSTGRES_DB: your_db_name
            ports:
              - "5432:5432"
            volumes:
              - db-data:/var/lib/postgresql/data
        
        volumes:
          db-data:
        ```
        
    - **Instructions:**
        - Set up the `Dockerfile` correctly for the backend build.
        - Configure necessary environment variables for database connections.
        - Ensure proper communication between services in the Docker network.
        
3. **Running the Application:**
    - Start with Docker using:
        
        ```bash
        docker-compose up --build
        ```
        
    - This command will:
        - Build the backend application image.
        - Set up the database container.
        - Launch all services (backend available at `http://localhost:3000`).
4. **Bonus (Optional): Simple Frontend Implementation**
    - **Frontend Application:**
        - Basic interface for API interaction.
        - Features to:
            - View available slots.
            - Book appointments.
            - View bookings.
    - **Technology Stack:** Any modern framework (React, Vue.js, Angular) or vanilla JavaScript.
    - **Integration:**
        - Deploy either as a separate service or static frontend served by the backend.
    - **Submission:**
        - Include frontend code in the repository.
        - Add frontend setup instructions to `README.md`.

### **Submission Checklist**

Ensure your submission includes:

- [ ]  A public GitHub repository with all source code.
- [ ]  A `README.md` with clear setup and usage instructions.
- [ ]  A `docker-compose.yml` file for easy application setup.
- [ ]  (Bonus) Frontend code and setup instructions.

### **Evaluation Criteria**

Your submission will be evaluated on:

1. **Functionality:**
    - Working API endpoints as specified.
    - Proper slot creation, booking, and listing.
2. **Code Quality:**
    - Clean, readable, and documented code.
    - Clear version control with meaningful commits.
3. **Database Design:**
    - Efficient schema design (SQL) or collection structure (NoSQL).
    - Optimised query performance through proper indexing.
4. **Dockerization:**
    - Proper Docker configuration setup.
    - Easy environment replication.
5. **Bonus (If Implemented):**
    - Frontend usability and functionality.
    - Smooth frontend-backend integration.