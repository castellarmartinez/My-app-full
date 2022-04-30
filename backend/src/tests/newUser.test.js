const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index.js");
const User = require("../models/user.js");

chai.should();
chai.use(chaiHttp);

describe("Test for the creation of new users.", () => {
  it("It should create a new user.", (done) => {
    const newUser = {
      name: "Test Test",
      username: "test",
      email: "test@test.com",
      password: "testPassword",
      phone: 5555555,
    };

    chai
      .request(app)
      .post("/users/register")
      .send(newUser)
      .end((err, response) => {
        response.should.have.status(201);
        response.should.be.an("object");
        done();
      });
  });

  it("It should fail to create a new user due to invalid name (numbers on it).", (done) => {
    const newUser = {
      name: "Test Test 85",
      username: "test",
      email: "test@test.com",
      password: "testPassword",
      phone: 5555555,
    };

    chai
      .request(app)
      .post("/users/register")
      .send(newUser)
      .end((err, response) => {
        response.should.have.status(400);
        response.should.be.an("object");
        done();
      });
  });

  it("It should fail to create a new user due to invalid username (less than 3 characters).", (done) => {
    const newUser = {
      name: "Test Test",
      username: "te",
      email: "test@test.com",
      password: "testPassword",
      phone: 5555555,
    };

    chai
      .request(app)
      .post("/users/register")
      .send(newUser)
      .end((err, response) => {
        response.should.have.status(400);
        response.should.be.an("object");
        done();
      });
  });

  it("It should fail to create a new user due to duplicate email.", (done) => {
    const newUser = {
      name: "Test Test",
      username: "test",
      email: "test@test.com",
      password: "testPassword",
      phone: 5555555,
    };

    chai
      .request(app)
      .post("/users/register")
      .send(newUser)
      .end((err, response) => {
        response.should.have.status(400);
        response.should.be.an("object");
        done();
      });
  });

  it("It should fail to create a new user due to invalid password (less than 6 characters).", (done) => {
    const newUser = {
      name: "Test Test",
      username: "test",
      email: "test@test.com",
      password: "Pass",
      phone: 5555555,
    };

    chai
      .request(app)
      .post("/users/register")
      .send(newUser)
      .end((err, response) => {
        response.should.have.status(400);
        response.should.be.an("object");
        done();
      });
  });

  it("It should fail to create a new user due to invalid phone (characters on it).", (done) => {
    const newUser = {
      name: "Test Test",
      username: "test",
      email: "test@test.com",
      password: "testPassword",
      phone: "+5555555",
    };

    chai
      .request(app)
      .post("/users/register")
      .send(newUser)
      .end((err, response) => {
        response.should.have.status(400);
        response.should.be.an("object");
        done();
      });
  });

  it("It should return the user previously created and stored in the database.", async () => {
    const user = await User.findOne({ email: "test@test.com" });
    const userSaved = user !== null;

    userSaved.should.be.true;
  });

  after(async () => {
    await User.deleteOne({ email: "test@test.com" });
  });
});
