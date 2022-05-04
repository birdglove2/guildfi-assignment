# Auth Service

## Endpoint `/api/v1/auth`

- Get Message `/message`
- Log in `/login`

## Detail

1. Get Message `/message`

- For frontend to get message and let user sign to prove identity of the wallet address
- After getting signature, proceed to 2nd API

2. Log in `/login`

- Frontend request the route with two things in body which are `signature` and `walletAddress`.
- Backend verify the signature with the message from `1`, generate token and send back to user for using in `3`

3. Attach token to header

- Frontend attach the token received from `2` to `Authorization Header`
  as

  to grant authorization of any other API that requires.

#

`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXRBZGRyZXNzIjoiMHg1Zjk1ODk3MTA3MmJmNTNjNGM1NzdiNDRkN2E4YTA0YWRjZTkwNGJhIiwiaWF0IjoxNjUxNjY0NzU5LCJleHAiOjE2NTQyNTY3NTl9.N1KmV6CvO9lNX5fiRFBQf5I_tFG7BM_rfwruqq3sYrM`
