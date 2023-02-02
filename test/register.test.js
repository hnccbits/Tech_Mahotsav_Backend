const request = require("supertest");
const { app } = require("../src/app");
const User = require("../src/model/user");
const { userOneId, userOne, dbSetup } = require("./fixture/db");
beforeEach(dbSetup);

test("register", async () => {
  const response = await request(app)
    .post("/api/register")
    .send({
      name: "Aditya",
      email: "akm@akm.com",
      password: "#$.jgvFH9898",
      dob: "2000/01/08",
    })
    .expect(201);
  const user = await User.findOne({ email: "akm@akm.com" });

  expect(user).not.toBeNull();
});

test("register with invalid dob", async () => {
  const response = await request(app)
    .post("/api/register")
    .send({
      name: "Aman",
      email: "aman@akm.com",
      password: "#$.jgvFH9898",
      dob: "2000/31/08", //yyyy-mm-dd
    })
    .expect(400);
  const user = await User.findOne({ email: "akm@akm.com" });
  expect(user).toBeNull();
});

test("register with missing details", async () => {
  const response = await request(app)
    .post("/api/register")
    .send({
      email: "aman@akm.com",
      password: "#$.jgvFH9898",
      dob: "2000/09/08", //yyyy-mm-dd
    })
    .expect(400);
  const user = await User.findOne({ email: "akm@akm.com" });
  expect(user).toBeNull();
});

test("register with small pass", async () => {
  const response = await request(app)
    .post("/api/register")
    .send({
      name: "Leontine Light",
      email: "llight0@moonfruit.com",
      gender: "M",
      dob: "2017/05/05",
      country: "China",
      language: "Polish",
      password: "ATHREE.1257#$^sdc6",
    })
    .expect(201);
  const user = await User.findOne({ email: "akm@akm.com" });
  expect(user).toBeNull();
});
  