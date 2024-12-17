# Doctor Appointment API Documentation

The **Doctor Appointment API** provides a set of HTTP REST-like endpoints for managing doctor appointments, slot creation, and bookings. This API enables users to manage doctor schedules, available slots, and appointments seamlessly.

## API Endpoints

### 1. **GET `/api/doctors`**
   - **Description**: Retrieves the list of doctors along with their details and schedule information.
   - **Response**:
     ```json
     {
         "data": [
             {
                 "_id": "6760b0e99c68a0b6136925c0",
                 "username": "MJ",
                 "first_name": "Meheer",
                 "last_name": "J",
                 "email": "meherr17.j@gmail.com",
                 "slot_details": []
             }
         ]
     }
     ```

---

### 2. **POST `/api/doctors`**
   - **Description**: Creates a new doctor entry with the provided details.
   - **Request Body**:
     ```json
     {
         "username": "MJ",
         "first_name": "Mahi",
         "last_name": "J",
         "email": "meherr17.j@gmail.com"
     }
     ```
   - **Response**:
     ```json
     {
         "success": true,
         "data": {
             "acknowledged": true,
             "insertedId": "6760f4afbbd62fb9028b719f"
         }
     }
     ```

---

### 3. **POST `/api/doctors/[id]/slots`**
   - **Description**: Creates multiple appointment slots for the specified doctor between the given start and end dates.
   - **Request Body**:
     ```json
     {
         "slot_duration": 15,
         "slot_start_date": "2024-05-05",
         "slot_end_date": "2024-05-07",
         "slot_type": "daily",
         "days": [], 
         "start_time": "2024-05-05T10:00:00", 
         "end_time": "2024-05-05T11:30:00"
     }
     ```
   - **Response**:
     ```json
     {
         "success": true,
         "message": "Slots created successfully!",
         "id": [
             "6760f771bbd62fb9028b71a0",
             "6760f771bbd62fb9028b71a1",
             "6760f771bbd62fb9028b71a2",
             ...
             "6760f771bbd62fb9028b71af"
         ]
     }
     ```

---

### 4. **GET `/api/doctors/[id]/available_slots?date=2024-05-05`**
   - **Description**: Retrieves the available unbooked appointment slots for the given doctor on the specified date.
   - **Query Parameters**:
     - `date` (optional): The date for which to fetch available slots.
   - **Response**:
     ```json
     {
         "message": [
             {
                 "_id": "6760f774bbd62fb9028b71b2",
                 "slot_id": "6760f771bbd62fb9028b71a0",
                 "start_time": "2024-05-05T04:30:00.000Z",
                 "end_time": "2024-05-05T04:45:00.000Z",
                 "patient_name": "",
                 "patient_phone": "",
                 "patient_email": "",
                 "patient_visit_reason": "",
                 "doctor_id": "6760f4afbbd62fb9028b719f",
                 "appoitment_date": "2024-05-05T00:00:00.000Z",
                 "booked": false
             },
             ...
         ]
     }
     ```

---

### 5. **POST `/api/slots/[slotid]/book`**
   - **Description**: Books an available appointment slot for a patient.
   - **Request Body**:
     ```json
     {
         "patient_name": "XYZ",
         "patient_phone": "123123123",
         "patient_email": "sample@gmail.com",
         "patient_visit_reason": "General Check Up"
     }
     ```
   - **Response**:
     ```json
     {
         "success": true,
         "message": "Booked successfully!"
     }
     ```

---

### 6. **GET `/api/doctors/[id]/bookings`**
   - **Description**: Retrieves a list of all appointments for a specific doctor.
   - **Response**:
     ```json
     {
         "message": [
             {
                 "_id": "6760f774bbd62fb9028b71b2",
                 "slot_id": "6760f771bbd62fb9028b71a0",
                 "start_time": "2024-05-05T04:30:00.000Z",
                 "end_time": "2024-05-05T04:45:00.000Z",
                 "patient_name": "XYZ",
                 "patient_phone": "123123123",
                 "patient_email": "sample@gmail.com",
                 "patient_visit_reason": "General Check Up",
                 "doctor_id": "6760f4afbbd62fb9028b719f",
                 "appoitment_date": "2024-05-05T00:00:00.000Z",
                 "booked": true
             }
         ]
     }
     ```

---

## Response Codes

- **200 OK**: The request was successfully processed.
- **201 Created**: A resource was successfully created (e.g., doctor, slots).
- **400 Bad Request**: The request was invalid, possibly due to missing parameters or incorrect data.
- **404 Not Found**: The requested resource (e.g., doctor, slot) was not found.
- **500 Internal Server Error**: An error occurred on the server side.

---

## Summary of Endpoints

| Method | Endpoint                             | Description                                           |
|--------|--------------------------------------|-------------------------------------------------------|
| GET    | `/api/doctors`                       | Retrieve a list of doctors and their schedules        |
| POST   | `/api/doctors`                       | Create a new doctor                                  |
| POST   | `/api/doctors/[id]/slots`            | Create slots for a doctor                             |
| GET    | `/api/doctors/[id]/available_slots`  | Get available slots for a doctor                      |
| POST   | `/api/slots/[slotid]/book`           | Book an appointment for a slot                        |
| GET    | `/api/doctors/[id]/bookings`         | Retrieve a list of bookings for a specific doctor     |

---

### Notes

- Replace `[id]` and `[slotid]` with the appropriate doctor's and slot's unique identifiers when making requests to these endpoints.
- The `slot_type` can be `daily`, `weekly`, or `specific` to define the slot recurrence.
