import request from "supertest";
import express, { NextFunction } from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import jwt from "jsonwebtoken";
import { IUser, IUserDocument, User } from "../../models/User";
import { getUser, loginUser, registerUser, updatePassword } from "./users";
import { UserRoute } from "../../config/constants";
// import passportJwtStrategy from "../../config/passport";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("passport");
jest.mock("../../models/User");

const app = express();
app.use(express.json());
// app.use(passport.initialize());
// passportJwtStrategy(passport);

app.post(UserRoute.REGISTER, registerUser);
app.post(UserRoute.LOGIN, loginUser);
app.get(UserRoute.GET_USER, getUser);
app.put(UserRoute.UPDATE_PASSWORD, updatePassword);

const userMockedData = {
  id: "userId",
  email: "test@test.test",
  login: "testuser",
  password: "testTest",
  anotherEmail: "another@email.test",
  anotherPassword: "hashedPassword",
};

interface IUserTest {
  user: {
    id?: string;
    password?: string;
    email?: string;
  };
}

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("User registration", () => {
    describe("Required fields", () => {
      it("should return status 400 if email field is missing", async () => {
        const res = await request(app).post(UserRoute.LOGIN).send({ password: userMockedData.password, login: userMockedData.login });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Fill correct fields");
      });
      it("should return status 400 if login field is missing", async () => {
        const res = await request(app).post(UserRoute.LOGIN).send({ email: userMockedData.email, password: userMockedData.password });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Fill correct fields");
      });
      it("should return status 400 if password field is missing", async () => {
        const res = await request(app).post(UserRoute.LOGIN).send({ email: userMockedData.email, login: userMockedData.login });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Fill correct fields");
      });
    });

    it("should return status 400 if email already exist", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: userMockedData.email });

      const res = await request(app).post(UserRoute.REGISTER).send({ email: userMockedData.email, login: userMockedData.login, password: userMockedData.password });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(`Email ${userMockedData.email} already exist`);
    });

    it("should return status 400 if login already exist", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ login: userMockedData.login });

      const res = await request(app).post(UserRoute.REGISTER).send({ email: userMockedData.email, login: userMockedData.login, password: userMockedData.password });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(`Login ${userMockedData.login} already exist`);
    });

    // it("should register user succsessfuly", async () => {
    //   (User.findOne as jest.Mock).mockResolvedValue(null);
    //   (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
    //   (bcrypt.hash as jest.Mock).mockResolvedValue(userMockedData.password);

    //   const saveMock = jest.fn().mockResolvedValue({ email: userMockedData.email });

    //   (User as unknown as jest.Mock).mockImplementation(() => ({
    //     save: saveMock,
    //   }));

    //   const res = await request(app).post(UserRoute.REGISTER).send({ email: userMockedData.email, login: userMockedData.login, password: userMockedData.password });

    //   expect(res.status).toBe(200);
    //     expect(res.body.message).toBe(`User ${userMockedData.email} was succsessfuly registrated!`);
    // });
  });

  describe("Login user", () => {
    describe("Required fields", () => {
      it("should return status 400 if loginOrEmail field is missing", async () => {
        const res = await request(app).post(UserRoute.LOGIN).send({ password: userMockedData.password });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Fill correct fields");
      });
      it("should return status 400 if password field is missing", async () => {
        const res = await request(app).post(UserRoute.LOGIN).send({ loginOrEmail: userMockedData.email });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Fill correct fields");
      });
    });

    it("should return status 400 if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post(UserRoute.LOGIN).send({ loginOrEmail: userMockedData.anotherEmail, password: userMockedData.password });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User not found");
    });

    it("should return status 400 if password is incorrect ", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ password: userMockedData.anotherPassword });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const res = await request(app).post(UserRoute.LOGIN).send({ loginOrEmail: userMockedData.email, password: userMockedData.password });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Password incorrect");
    });

    it("should return status 200 and token if login is successful", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ _id: userMockedData.id, login: userMockedData.login, password: userMockedData.password });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockImplementation((payload, secret, options, callback) => callback(null, "token"));

      const res = await request(app).post(UserRoute.LOGIN).send({ loginOrEmail: userMockedData.login, password: userMockedData.password });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBe("Bearer token");
    });
  });

  describe("Get user", () => {
    it("should return status 401 if jwt token expired or invalid", async () => {
      const user = { id: userMockedData.id, password: userMockedData.password };
      (passport.authenticate as jest.Mock) = jest.fn((strategy, options, callback) => (req: IUserTest) => {
        req.user = user;
        callback(null, user);
      });

      const res = await request(app).get(UserRoute.GET_USER);

      expect(res.status).toBe(200);
      expect(res).toEqual(user);
    });
  });

  describe("User password", () => {
    describe("Required fields", () => {
      it("should return status 400 if newPassword field is missing", async () => {
        const res = await request(app).put(UserRoute.UPDATE_PASSWORD).send({ password: userMockedData.password });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Fill required fields");
      });
      it("should return status 400 if password field is missing", async () => {
        const res = await request(app).put(UserRoute.UPDATE_PASSWORD).send({ newPassword: userMockedData.password });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Fill required fields");
      });
    });

    // it("should return status 400 if old password is incorrect", async () => {
    //   (User.findById as jest.Mock).mockResolvedValue({ comparePassword: jest.fn().mockResolvedValue(false) });
    //   const res = await request(app).put(UserRoute.UPDATE_PASSWORD).send({ password: userMockedData.password, newPassword: userMockedData.anotherPassword });

    //   expect(res.status).toBe(400);
    //   expect(res.body.message).toBe("Password dosen't match");
    // });

    // it("should update password successfully", async () => {
    //   (User.findById as jest.Mock).mockResolvedValue({ comparePassword: jest.fn().mockResolvedValue(true) });
    //   (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");
    //   (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({ email: "test@test.com" });

    //   const res = await request(app).put("/updatePassword").send({ password: "password", newPassword: "newPassword" });

    //   expect(res.status).toBe(200);
    //   expect(res.body.message).toBe("Password succsessfuly changed");
    // });
  });

  // describe("getUser", () => {
  //   it("should return the user object", async () => {
  //     const user = { id: userMockedData.id, email: userMockedData.email };
  //     (passport.authenticate as jest.Mock) = jest.fn((strategy, options, callback) => (req: IUserTest) => {
  //       req.user = user;
  //       callback(null, user);
  //     });

  //     const res = await request(app).get(UserRoute.GET_USER);

  //     expect(res.status).toBe(200);
  //     expect(res.body).toEqual(user);
  //   });
  // });
});
