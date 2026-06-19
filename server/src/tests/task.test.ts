import request from "supertest";

import app from "../app";

export const registerAndLogin =
  async (
    email: string
  ) => {

    const password =
      "Password123";

    await request(app)
      .post("/api/auth/register")
      .send({
        email,
        password,
      });

    const loginResponse =
      await request(app)
        .post("/api/auth/login")
        .send({
          email,
          password,
        });

    return loginResponse
      .body
      .data
      .accessToken;
  };

  it(
  "creates task",
  async () => {

    const token =
      await registerAndLogin(
        "task@test.com"
      );

    const response =
      await request(app)
        .post("/api/tasks")
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          title: "First Task",
          priority: "HIGH",
        });

    expect(
      response.status
    ).toBe(201);

    expect(
      response.body.success
    ).toBe(true);

    expect(
      response.body.data.title
    ).toBe("First Task");
  }
);

it(
  "rejects unauthenticated user",
  async () => {

    const response =
      await request(app)
        .post("/api/tasks")
        .send({
          title: "Task",
        });

    expect(
      response.status
    ).toBe(401);
  }
);

it(
  "rejects missing title",
  async () => {

    const token =
      await registerAndLogin(
        "invalid@test.com"
      );

    const response =
      await request(app)
        .post("/api/tasks")
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({});

    expect(
      response.status
    ).toBe(400);
  }
);

it(
  "reads task by id",
  async () => {

    const token =
      await registerAndLogin(
        "read@test.com"
      );

    const createResponse =
      await request(app)
        .post("/api/tasks")
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          title: "Read Task",
        });

    const taskId =
      createResponse
        .body
        .data
        ._id;

    const response =
      await request(app)
        .get(
          `/api/tasks/${taskId}`
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(
      response.status
    ).toBe(200);
  }
);

it(
  "prevents access to another user's task",
  async () => {

    const token1 =
      await registerAndLogin(
        "user1@test.com"
      );

    const token2 =
      await registerAndLogin(
        "user2@test.com"
      );

    const created =
      await request(app)
        .post("/api/tasks")
        .set(
          "Authorization",
          `Bearer ${token1}`
        )
        .send({
          title: "Secret Task",
        });

    const taskId =
      created.body.data._id;

    const response =
      await request(app)
        .get(
          `/api/tasks/${taskId}`
        )
        .set(
          "Authorization",
          `Bearer ${token2}`
        );

    expect(
      response.status
    ).toBe(404);
  }
);

it(
  "updates task",
  async () => {

    const token =
      await registerAndLogin(
        "update@test.com"
      );

    const created =
      await request(app)
        .post("/api/tasks")
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          title: "Old Title",
        });

    const taskId =
      created.body.data._id;

    const response =
      await request(app)
        .patch(
          `/api/tasks/${taskId}`
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          title: "New Title",
        });

    expect(
      response.status
    ).toBe(200);

    expect(
      response.body.data.title
    ).toBe("New Title");
  }
);

it(
  "deletes task",
  async () => {

    const token =
      await registerAndLogin(
        "delete@test.com"
      );

    const created =
      await request(app)
        .post("/api/tasks")
        .set(
          "Authorization",
          `Bearer ${token}`
        )
        .send({
          title: "Delete Me",
        });

    const taskId =
      created.body.data._id;

    const response =
      await request(app)
        .delete(
          `/api/tasks/${taskId}`
        )
        .set(
          "Authorization",
          `Bearer ${token}`
        );

    expect(
      response.status
    ).toBe(204);
  }
);