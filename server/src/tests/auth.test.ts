import request from "supertest";

import app from "../app";

describe(
  "Auth",
  () => {

    it(
      "registers user",
      async () => {

        const response = await request(app).post("/api/auth/register").send({email:"test@gmail.com",password:"password123"});
    
        expect(
          response.status
        ).toBe(201);

        expect(
          response.body.success
        ).toBe(true);
      }

    );

    it(
      "rejects duplicate email",
      async () => {

        await request(app).post("/api/auth/register").send({email:"duplicate@gmail.com",password:"password12345"});
            
        const response =
          await request(app).post("/api/auth/register").send({email:"duplicate@gmail.com",password:"password123"});
        expect(
          response.status
        ).toBe(409);
      }
    );

    it(
      "logs in user",
      async () => {

        await request(app).post("/api/auth/register").send({email:"login@gmail.com",password:"password123"});
        const response =
          await request(app).post("/api/auth/login").send({email:"login@gmail.com",password:"password123"});

        expect(
          response.status
        ).toBe(200);

        expect(
          response.body.data
            .accessToken
        ).toBeDefined();
      }
    );
  }
);