const request = require("supertest");
const { app } = require("../src/app");
const User = require("../src/model/user");
const { userOneId, userOne, dbSetup } = require("./fixture/db");

beforeEach(dbSetup);

test("GET all users", async () => {
  await request(app)
    .get("/api/user")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("GET all users without authentication", async () => {
  const response = await request(app).get("/api/user").send().expect(401);
});

test("Update user data without authentication", async () => {
  await request(app)
    .put(`/api/user/${userOneId}`)
    .send({
      name: "Mr Aditya Kumar Mandal",
      email: "akm@gmail.com",
    })
    .expect(401);
});

test("Update user data", async () => {
  await request(app)
    .put(`/api/user/${userOneId}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Mr Aditya Kumar Mandal",
      email: "akm@gmail.com",
    })
    .expect(200);
});

test("Update user data with valid + invalid fields", async () => {
  await request(app)
    .put(`/api/user/${userOneId}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      _id: userOneId,
      name: "Mr Aditya Kumar Mandal",
      email: "akm@gmail.com",
      gender: "Male",
    })
    .expect(400);
});

test("Update user data with no body", async () => {
  await request(app)
    .put(`/api/user/${userOneId}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({})
    .expect(400);
});

test("update user data with invalid body", async () => {
  await request(app)
    .put(`/api/user/${userOneId}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ Gender: "male" })
    .expect(400);
});

test("Delete a user without authentication", async () => {
  await request(app).delete(`/api/user/${userOneId}`).send().expect(401);
  const user = await User.findById({ _id: userOneId });
  expect(user).not.toBeNull();
});

test("Delete a user", async () => {
  const response = await request(app)
    .delete(`/api/user/${userOneId}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById({ _id: userOneId });
  expect(user).toBeNull();
});
