import supertest from "supertest";
import { server } from "./index";

describe("server", () => {
  const request = supertest.agent(server);

  afterAll((done) => {
    server.close(done);
  });

  it("should get /", async () => {
    const res = await request.get("/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: "It works!",
    });
  });
});
