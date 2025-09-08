# Auth Service

The **Auth Service** is a Spring Boot microservice responsible for handling user authentication and registration in the **Social Media Platform**. It provides REST endpoints for logging in, signing up new users, and deleting accounts.

---

## 📌 Features

* **User Login** – Authenticate users with username and password, and return a JWT token.
* **User Registration** – Sign up new users with required details.
* **User Deletion** – Delete a user by username.
* **Centralized Exception Handling** – Consistent JSON error responses.
* **JWT Token Generation** – Provides stateless authentication with expiration handling.

---

## 🚀 Tech Stack

* **Spring Web**
* **Spring Security**
* **Lombok**
* **JWT (JSON Web Token)**


---

## 📂 Project Structure

```
auth-service/
 ├── controller/
 │    ├── AuthController.java
 │    └── ExceptionController.java
 ├── Dto/
 │    ├── LoginRequestDto.java
 │    ├── LoginResponseDto.java
 │    ├── RegisterUserDto.java
 │    ├── ExceptionResponse.java
 │    └── ExceptionType.java
 ├── config/
 │    ├── ApplicationConfig.java
 │    ├── JwtAuthenticationFilter.java
 │    └── SecurityConfig.java
 ├── entity/
 │    └── User.java
 ├── exception/
 │    └── InvalidCredentialException.java
 ├── repository/
 │    └── UserRepository.java
 ├── client/
 │    └── UserClient.java
 ├── service/
 │    ├── AuthService.java
 │    └── JwtService.java
 ├── AuthServiceApplication.java
 └── ...
 
```

---

## 🔑 Endpoints

### 1. **Login**

Authenticate a user and return a JWT token.

**POST** `/api/v1/auth/login`

#### Request Body:

```json
{
  "username": "john_doe",
  "password": "password123"
}
```

#### Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "expiresIn": 1736492382000
}
```

---

### 2. **Signup**

Register a new user.

**POST** `/api/v1/auth/signup`

#### Request Body:

```json
{
  "username": "john_doe",
  "password": "password123",
  "email": "john@example.com"
}
```

#### Response:

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

---

### 3. **Delete User**

Delete a user by their username.

**DELETE** `/api/v1/auth/{username}`

#### Example:

```
DELETE /api/v1/auth/john_doe
```

#### Response:

```
204 No Content
```

---

## ⚠️ Error Handling

The `ExceptionController` provides centralized exception handling. All errors are returned in a **JSON format** with a type and message.

### Example Response:

#### 1. Invalid Credentials

```json
{
  "error": "Bad credentials",
  "type": "BAD_CREDENTIAL"
}
```

**Status Code:** `401 Unauthorized`

---

#### 2. Method Not Allowed

```json
{
  "error": "Request method 'PUT' not supported",
  "type": "METHOD_NOT_ALLOWED"
}
```

**Status Code:** `405 Method Not Allowed`

---

#### 3. Internal Server Error

```json
{
  "error": "internal server error",
  "type": "UNKNOWN"
}
```

**Status Code:** `500 Internal Server Error`

---

## ⚙️ Configuration

JWT expiration time and secret should be configured in `application.properties` or `application.yml`:

```yaml
jwt:
  secret: your-secret-key
  expiration: 3600000   # 1 hour in ms
```

---

## ▶️ Running the Service

### 1. Build with Maven:

```bash
mvn clean install
```

### 2. Run the application:

```bash
mvn spring-boot:run
```

The service will be available at:
👉 `http://localhost:8080/api/v1/auth`

---

## ✅ Next Steps

* Add **refresh tokens** for long-lived sessions.
* Add **role-based access control (RBAC)**.


