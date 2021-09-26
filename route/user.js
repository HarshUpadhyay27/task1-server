const express = require("express");
const route = express.Router();
const { User } = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const fs = require("fs");

route.get("/", auth, (req, res) => {
  res.send(req.user);
});

route.post("/user/signup", async (req, res) => {
  try {
    const { name, email, password, username, mode, color } = req.body;
    if (!name || !email || !password || !username) {
      return res.status(422).json({ msg: "please fill the all field" });
    }
    const userExist = await User.findOne({ email });
    const userName = await User.findOne({ username });
    if (userExist) {
      return res.status(422).json({ msg: "user already exist" });
    }
    if (userName) {
      return res.status(422).json({ msg: "user name is already taken" });
    }
    const user = new User({
      mode,
      color,
      name,
      username,
      email,
      password: bcrypt.hashSync(password, 10),
    });
    const createUser = await user.save();
    res.status(200).json({
      data: {
        mode: createUser.mode,
        color: createUser.color,
        _id: createUser._id,
        username: createUser.username,
        name: createUser.name,
        email: createUser.email,
        token: jwt.sign({ _id: createUser._id }, "harshupadhyaya"),
      },
      msg: "Register success!",
    });
    fs.mkdir(`${__dirname}/../../client/public/${createUser.username}`, () => {
      console.log("folder created");
    });
  } catch (error) {
    return res.status(422).json({ msg: "something went wrong" });
  }
});

route.post("/user/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(422).json({ msg: "please fill the all field" });
    }
    const user = await User.findOne({ email });
    if (user) {
      if (bcrypt.compare(password, user.password)) {
        return res.status(200).send({
          data: {
            mode: user.mode,
            color: user.color,
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            token: jwt.sign({ _id: user._id }, "harshupadhyaya"),
          },
          msg: "Login success",
        });
      }else{
        return res.status(422).json({ msg: "Invalid details" });
      }
    } else {
      return res.status(422).json({ msg: "User does not exist" });
    }
  } catch (error) {
    return res.status(422).json({ msg: "something went wrong" });
  }
});

route.patch("/mode/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const changeMode = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.send({
      mode: changeMode.mode,
      color: changeMode.color,
      _id: changeMode._id,
      username: changeMode.username,
      name: changeMode.name,
      email: changeMode.email,
      token: jwt.sign({ _id: changeMode._id }, "harshupadhyaya"),
    });
  } catch (error) {
    return res.status(422).send({ error: "something went wrong" });
  }
});

module.exports = route;
