import request from "supertest";
import { app } from "@shared/infra/http/app";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcrypt";

import createConnection from "@shared/infra/typeorm";
import { Connection } from "typeorm";

let connection: Connection;

describe("List all categories", () => {
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
  });

  it("should be able to list all category", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin"
    });

    const { refresh_token } = responseToken.body;

    await request(app).post("/categories").send({
        name: "Category supertest",
        description: "Category supertest"
    }).set({
      Authorization: `Bearer ${refresh_token}`
    });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0].name).toEqual("Category supertest");
  });
})