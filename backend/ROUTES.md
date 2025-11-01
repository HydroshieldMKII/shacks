# ROUTES POUR TRUST

URL DEV: https://api-dev.trust.hydroshield.dev

URL PROD: https://api-prod.trust.hydroshield

Format for routes:

METHOD "/entity/path"

HTTP CODE POSSIBLE: REASON → BODY CONTENT

---

## USERS

```cpp
GET "/users/me"
401: not connected or session cookie invalid -> {}
200: authenticated -> {
  id: 1,
  username: "john_doe"
}

POST "/users/login"
Body: { username: "john_doe", password: "password123" }
401: bad username / password -> {error: "Invalid credentials"}
200: success -> {
  session_token: "COOKIE_HERE_FOR_AUTH",
  user: {
    id: 1,
    username: "john_doe"
  }
}

POST "/users/signup"
Body: { username: "john_doe", password: "password123" }
400: signup failed -> {error: "Password requirement not met / Username already exists / ..."}
201: success -> {
  session_token: "COOKIE_HERE_FOR_AUTH",
  user: {
    id: 1,
    username: "john_doe"
  }
}

POST "/users/logout"
401: not connected or session cookie invalid -> {}
200: success -> {message: "Logged out successfully"}
```

---

## PASSWORDS

```cpp
POST "/passwords"
Body: {
  userId: 1,
  folderId: 1,
  name: "My Gmail",
  username: "john@gmail.com",
  password: "encrypted_password",
  url?: "https://gmail.com",
  notes?: "Personal email account"
}
401: not connected or session cookie invalid -> {}
400: validation failed -> {error: "Invalid input"}
201: success -> {
  id: 123,
  userId: 1,
  folderId: 1,
  name: "My Gmail",
  username: "john@gmail.com",
  password: "encrypted_password",
  url: "https://gmail.com",
  notes: "Personal email account"
}

GET "/passwords/:passwordId"
401: not connected or session cookie invalid -> {}
404: not your password or doesn't exist -> {error: "Password not found"}
200: success -> {
  id: 123,
  userId: 1,
  folderId: 1,
  name: "My Gmail",
  username: "john@gmail.com",
  password: "encrypted_password",
  url: "https://gmail.com",
  notes: "Personal email account"
}

PATCH "/passwords/:passwordId"
Body: {
  name?: "Updated Gmail",
  username?: "newemail@gmail.com",
  password?: "new_encrypted_password",
  url?: "https://mail.google.com",
  notes?: "Updated notes"
}
401: not connected or session cookie invalid -> {}
404: not your password or doesn't exist -> {error: "Password not found"}
200: success -> {
  id: 123,
  userId: 1,
  folderId: 1,
  name: "Updated Gmail",
  username: "newemail@gmail.com",
  password: "new_encrypted_password",
  url: "https://mail.google.com",
  notes: "Updated notes"
}

DELETE "/passwords/:passwordId"
401: not connected or session cookie invalid -> {}
404: not your password or doesn't exist -> {error: "Failed to delete password"}
200: success -> {
  id: 123,
  userId: 1,
  folderId: 1,
  name: "My Gmail",
  username: "john@gmail.com",
  password: "encrypted_password",
  url: "https://gmail.com",
  notes: "Personal email account"
}
```

---

## FOLDERS

```cpp
GET "/folders"
401: not connected or session cookie invalid -> {}
200: return all current user folders -> [
  {id: 1, name: "Work"},
  {id: 2, name: "Personal"},
  {id: 3, name: "Finance"}
]

POST "/folders"
Body: { name: "Social Media" }
401: not connected or session cookie invalid -> {}
400: validation failed -> {error: "Invalid input"}
201: success -> {
  id: 4,
  name: "Social Media"
}

GET "/folders/:folderId"
401: not connected or session cookie invalid -> {}
404: not your folder or folder doesn't exist -> {error: "Folder not found"}
200: return all passwords in folder -> {
  id: 1,
  name: "Work",
  passwords: [
    {
      id: 123,
      userId: 1,
      folderId: 1,
      name: "Company Email",
      username: "john@company.com",
      password: "encrypted_password",
      url: "https://mail.company.com",
      notes: "Work email"
    },
    {
      id: 124,
      userId: 1,
      folderId: 1,
      name: "Slack",
      username: "john@company.com",
      password: "encrypted_password",
      url: "https://slack.com",
      notes: null
    }
  ]
}

PATCH "/folders/:folderId"
Body: { name: "Updated Folder Name" }
401: not connected or session cookie invalid -> {}
404: not your folder or folder doesn't exist -> {error: "Folder not found"}
200: success -> {
  id: 1,
  name: "Updated Folder Name"
}

DELETE "/folders/:folderId"
401: not connected or session cookie invalid -> {}
404: not your folder or folder doesn't exist -> {error: "Folder not found"}
200: success -> {
  id: 1,
  name: "Work"
}

POST "/folders/:folderId/passwords/:passwordId"
401: not connected or session cookie invalid -> {}
404: not your password, folder doesn't exist or password doesn't exist -> {error: "Failed to add password to folder"}
200: success -> {
  id: 123,
  userId: 1,
  folderId: 1,
  name: "My Gmail",
  username: "john@gmail.com",
  password: "encrypted_password",
  url: "https://gmail.com",
  notes: "Personal email account"
}
```

---

## GUARDIANS

```cpp
GET "/guardians"
401: not connected or session cookie invalid -> {}
200: return all guardians for current user -> {
  protecting: [
    {
      id: 1,
      userId: 1,
      guardedEmail: "alice@example.com",
      guardianKeyValue: "a1b2c3d4e5f67890abcdef1234567890"
    }
  ],
  protected: [
    {
      id: 2,
      userId: 3,
      guardedEmail: "john@example.com"
    }
  ]
}

POST "/guardians"
Body: {
  guardedEmail: "alice@example.com"
}
401: not connected or session cookie invalid -> {}
400: validation failed -> {error: "Invalid input"}
404: guarded user not found -> {error: "Guarded user not found"}
201: success -> {
  id: 1,
  userId: 1,
  guardedEmail: "alice@example.com",
  guardianKeyValue: "a1b2c3d4e5f67890abcdef1234567890"
}

DELETE "/guardians/:guardianId"
401: not connected or session cookie invalid -> {}
403: not your guardian relationship -> {error: "Access denied"}
404: guardian doesn't exist -> {error: "Guardian relationship not found"}
200: success -> {
  id: 1,
  userId: 1,
  guardedEmail: "alice@example.com",
  guardianKeyValue: "a1b2c3d4e5f67890abcdef1234567890"
}

POST "/guardians/recover" (PUBLIC - No authentication required)
Body: {
  email: "alice@example.com",
  guardianKey1: "a1b2c3d4e5f67890abcdef1234567890",
  guardianKey2: "fedcba0987654321fedcba0987654321",
  newPassword: "NewSecurePassword123!"
}
400: not enough guardians or same keys -> {error: "Account recovery requires at least 2 guardians" | "Both guardian keys must be different"}
401: invalid guardian keys -> {error: "Invalid guardian keys provided"}
404: user not found -> {error: "User not found"}
200: success -> {
  message: "Account recovered successfully",
  email: "alice@example.com",
  username: "alice"
}
```
