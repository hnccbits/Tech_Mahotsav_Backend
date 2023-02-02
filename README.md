
# techmahotsav

## Run Locally

Go to the project directory

```bash
  cd techmahotsav
```

Install dependencies

```bash
  npm install
```

Rename `.env.example` to `.env` and add these fields

```bash
  PORT=
  MONGO_URI=
  JWT_SECRET=
```

Testing

```bash
  npm test
```

Start the server

```bash
  npm run start
```

On successfull setup-

`🚀 Server ready at http://localhost:{PORT}`

## Environment Variables

To run this project locally, you will need to add the following environment variables to your .env file

`JWT_SECRET`

`MONGO_URI`

`PORT`

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

# API Reference

### 💡 Register a user

```http
  POST /api/register
```

#### Description

`This endpoint is used to register a user.`

|    Body   | Type     | Required Keys                |
| :-------- | :------- | :------------------------- |
| `data` | `string` |  `name`,`email`,`password`,`dob` |

##### Request Body

```JSON
{
    "name":     "Aditya Kumar Mandal",
    "email":    "akm123@gmail.com",
    "country":  "India",
    "gender":   "M",
    "dob":      "2001/01/01",
    "game":     "cricket",
    "about":    "Just another coder",
    "password": "Three.1415",
    "language": "Hindi"
}
```

##### Response Body

```JSON
{
    "data": {
        "user": {
            "name": "Aditya Kumar Mandal",
            "email": "akm123@gmail.com",
            "dob": "2000-12-31T18:30:00.000Z",
            "gender": "M",
            "about": "Just another coder",
            "game": "cricket",
            "country": "India",
            "language": "Hindi",
            "_id": "62aec4b4487d50816fadd1d5",
            "createdAt": "2022-06-19T06:39:48.676Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmFlYzRiNDQ4N2Q1MDgxNmZhZGQxZDUiLCJpYXQiOjE2NTU2MjA3ODh9.sy1E1xN2KOWtJWmQePD4eQyCgpABdHi39DtOaVuX_tA"
    }
}
```

##### Status Codes

```http
201 - created
400 - Bad Request
```

### 💡 Login a user

```http
  POST /api/login
```

#### Description

`This endpoint is used to login.`


|    Body   | Type     | Required Keys                |
| :-------- | :------- | :------------------------- |
| `data` | `string` |  `email`,`password` |

##### Request Body

```JSON
{
    "email":    "akm123@gmail.com",
    "password": "Three.1415"
}
```

##### Response Body

```JSON
{
    "data": {
        "user": {
            "_id": "62aec4b4487d50816fadd1d5",
            "name": "Aditya Kumar Mandal",
            "email": "akm123@gmail.com",
            "dob": "2000-12-31T18:30:00.000Z",
            "gender": "M",
            "about": "Just another coder",
            "game": "cricket",
            "country": "India",
            "language": "Hindi",
            "createdAt": "2022-06-19T06:39:48.676Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmFlYzRiNDQ4N2Q1MDgxNmZhZGQxZDUiLCJpYXQiOjE2NTU2MjEwMzh9.Yym0WbTpB2FhFc05q66nb7Xm_oh-vRcDm4xfYSM1WOs"
    }
}
```

##### Status Codes

```http
201 - created
400 - Bad Request
```


### 💡 Logout a user

```http
  GET /api/logout
```

#### Description

`This endpoint is used to logout.`


|    Header   | Type     | Required                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `Bearer` |      `true`           |


##### Response Body

```JSON
{
    "data": "Logout success"
}
```

##### Status Codes

```http
200 - ok
401 - Unautharized
500 - Internal server error
```



### 💡 Get all user

```http
  GET /api/user
```

#### Description

`This endpoint is used to get all the registered users.`

|    Header   | Type     | Required                |
| :-------- | :------- | :-------------------------|
| `Authorization` | `Bearer` |      `true`         |


##### Response Body

```JSON
{
    "data": [
        {
            "_id": "62aec4b4487d50816fadd1d5",
            "name": "Aditya Kumar Mandal",
            "email": "akm123@gmail.com",
            "dob": "2000-12-31T18:30:00.000Z",
            "gender": "M",
            "about": "Just another coder",
            "game": "cricket",
            "country": "India",
            "language": "Hindi",
            "createdAt": "2022-06-19T06:39:48.676Z"
        },
        {
            "_id": "62aeab432fe1205ce43c7579",
            "name": "Ankit Kumar",
            "email": "ankitkr69@gmail.com",
            "dob": "2000-12-31T18:30:00.000Z",
            "gender": "M",
            "country": "India",
            "createdAt": "2022-06-19T04:51:15.662Z"
        },   
       {
            "_id": "62ae3269c0089654a8736d9c",
            "name": "Aditi",
            "email": "aditi@yahoo.com",
            "dob": "2000-12-31T18:30:00.000Z",
            "gender": "F",
            "country": "India",
            "createdAt": "2022-06-18T20:15:37.181Z"
        },
        {
            "_id": "62ae3214c0089654a8736d98",
            "name": "Sourav",
            "email": "souraav1112@gmail.com",
            "dob": "2000-12-31T18:30:00.000Z",
            "createdAt": "2022-06-18T20:14:12.891Z"
        },
     
    ]
}
```

##### Status Codes

```http
200 - ok
401 - Unautharized
500 - Internal server error
```

### 💡 Update a user data

```http
  PUT /api/user/:id
```

#### Description

`This endpoint is used to update any user's data.`

|    Header   | Type     | Required                |
| :-------- | :------- | :-------------------------|
| `Authorization` | `Bearer` |      `true`         |


|    Parameter   | Type     | Required                |
| :-------- | :------- | :-------------------------|
| `Object Id` | `String` |      `true`         |

|    Body   | Type     | Valid Keys                |
| :-------- | :------- | :------------------------- |
| `data` | `string` |  `name`,`email`,`password`,`dob`,`gender`,`about`,`country`,`language`,`game` |

##### Request Body

```JSON
{
    "gender":   "M",
    "game":     "cricket",
    "about":    "coder",
    "language": "Hindi",
    "email":    "rohi@gmail.com",
    "name":     "Rohit",
    "dob":      "2002/12/08"
}
```

##### Response Body

```JSON
{
    "data": {
        "_id": "62aeb1d30360217f00e72ef3",
        "name": "Rohit",
        "email": "rohi@gmail.com",
        "dob": "2002-12-07T18:30:00.000Z",
        "country": "India",
        "createdAt": "2022-06-19T05:19:15.245Z",
        "language": "Hindi",
        "about": "coder",
        "game": "cricket",
        "gender": "M"
    }
}
```

##### Status Codes

```http
201 - created
400 - Bad Request
401 - Unautharized
```

### 💡 Delete a user data

```http
  PATCH /api/user/:id
```

#### Description

`This endpoint is used to delete a user's data.`

|    Header   | Type     | Required                |
| :-------- | :------- | :-------------------------|
| `Authorization` | `Bearer` |      `true`         |


|    Parameter   | Type     | Required                |
| :-------- | :------- | :-------------------------|
| `Object Id` | `String` |      `true`         |

|    Body   | Type     | Valid Keys                |
| :-------- | :------- | :------------------------- |
| `data` | `string` | `gender`,`about`,`country`,`language`,`game` |

##### Request Body

```JSON
{
  "gender":   "",
  "game":     "",
  "about":    "",
  "language": ""
}
```

##### Response Body

```JSON
{
    "data": {
        "_id": "62aeb1d30360217f00e72ef3",
        "name": "Rohit",
        "email": "rohi@gmail.com",
        "dob": "2002-12-07T18:30:00.000Z",
        "country": "India",
        "createdAt": "2022-06-19T05:19:15.245Z"
    }
}
```

##### Status Codes

```http
201 - created
400 - Bad Request
401 - Unautharized
```

### 💡 Delete a user profile

```http
  DELETE /api/user
```

#### Description

`This endpoint is used to delete a user profile.`


|    Header   | Type     | Required                |
| :-------- | :------- | :-------------------------|
| `Authorization` | `Bearer` |      `true`         |

|    Parameter   | Type     | Required                |
| :-------- | :------- | :-------------------------|
| `Object Id` | `String` |      `true`         |

##### Response Body

```JSON
{
    "data": {
        "_id": "62aec4b4487d50816fadd1d5",
        "name": "Aditya Kumar Mandal",
        "email": "akm123@gmail.com",
        "dob": "2000-12-31T18:30:00.000Z",
        "gender": "M",
        "about": "Just another coder",
        "game": "cricket",
        "country": "India",
        "language": "Hindi",
        "createdAt": "2022-06-19T06:39:48.676Z"
    }
}
```

##### Status Codes

```http
200 - created
400 - Bad Request
401 - Unautharized
```

## Author

- [@Aditya Kumar Mandal](https://www.github.com/akm-akm)
