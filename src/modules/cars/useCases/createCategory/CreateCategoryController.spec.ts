import request from "supertest";
import { app } from "@shared/infra/http/app";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcrypt";

import createConnection from "@shared/infra/typeorm";
import { Connection } from "typeorm";

let connection: Connection;

describe("Create Category Controller", () => {
  beforeAll( async () => {
    connection = await createConnection("localhost");
    await connection.runMigrations();

    const id = uuidV4();
    const hashPassword = await hash("admin", 8);
    
    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
        values('${id}', 'admin', 'admin@rentx.com.br', '${hashPassword}', true, 'now()', 'xxxxxxxxx')`
    );
  });

  afterAll( async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to create a new category", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin"
    });

    const { refresh_token } = responseToken.body;

    const response = await request(app).post("/categories").send({
        name: "Category supertest",
        description: "Category supertest"
    }).set({
      Authorization: `Bearer ${refresh_token}`
    });

    expect(response.status).toBe(201);
  });
  
  it("should not be able to create a new category with name exists", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin"
    });

    const { refresh_token } = responseToken.body;

    const response = await request(app).post("/categories").send({
        name: "Category supertest",
        description: "Category supertest"
    }).set({
      Authorization: `Bearer ${refresh_token}`
    });

    expect(response.status).toBe(400);
  });
});
