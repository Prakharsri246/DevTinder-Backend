# JSON WEB TOKEN

- when the user Logins the server generates the JWT Token
- The JWT Token is validated every time the user send any request.
- The JWT token is shared at the users end.
- When user is Validated the jwt token is wrapped inside the cookie and shared to user.
- The JWT TOKEN is divided into 3 things - header , payload (seceret data which we can hide), sign