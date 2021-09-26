const express = require("express");
const auth = require("../middleware/auth");
const { File } = require("../model/file");
const route = express.Router();

route.post("/api/createfile", auth, async (req, res) => {
  try {
    if (req.files === null) {
      return res.status(422).json({ msg: "file not uploaded" });
    }
    let { file } = req.files;
    const fileName = Date.now();
    file.mv(
      `${__dirname}/../../client/public/${req.user.username}/${fileName}`,
      async function (err) {
        if (err) {
          return res.status(422).json({ msg: "file not uploaded" });
        } else {
          req.user.password = undefined;
          const { email, phone, type } = req.body;
          if (!email || !phone || !type) {
            return res.status(422).json({ msg: "please fill the all field" });
          }
          let insobj = {
            file: fileName,
            user: req.user,
            size: file.size,
            email,
            phone,
            type,
            intersted: true,
          };
          const createdFile = await File.insertMany(insobj);
          return res
            .status(200)
            .json({ data: createdFile, msg: "File upload sucessfully" });
        }
      }
    );
  } catch (error) {
    return res.status(422).json({ msg: "Invalid Details" });
  }
});

route.get("/api/myfile", auth, async (req, res) => {
  try {
    const file = await File.find({ user: req.user._id }).populate(
      "user",
      "_id name email username"
    );
    res.status(200).send(file);
  } catch (error) {
    req.status(401).send(error);
  }
});

route.delete("/api/:id", async (req, res) => {
  try {
    const deleteFile = await File.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).json({ msg: "something weng Wrong" });
    }
    return res.json({ data: deleteFile, msg: "File deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "something went wrong" });
  }
});

route.get("/:id", async (req, res) => {
  try {
    const popupFile = await File.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send("something weng Wrong");
    }
    const newFiles = await File.insertMany(popupFile);
    res.send(newFiles);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.get("/getfile/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate(
      "user",
      "_id name email username"
    );
    if (file) {
      return res.status(200).send(file);
    } else {
      return res.status(422).send({ error: "File not found" + error });
    }
  } catch (error) {
    return res.status(422).send({ error: "Something went wrong" + error });
  }
});

route.patch("/file/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    req.user.password = undefined;
    const { email, phone, type, intersted } = req.body;
    if (req.files) {
      const fileName = Date.now();
      let { file } = req.files;
      file.mv(
        `${__dirname}/../../client/public/${req.user.username}/${fileName}`,
        async function (err) {
          if (err) {
            return res.status(422).json({ msg: "file not uploaded" });
          }
        }
      );
      let insObj = {
        file: fileName,
        user: req.user,
        size: file.size,
        email,
        phone,
        type,
        intersted,
      };
      const updatedFile = await File.findByIdAndUpdate(_id, insObj, {
        new: true,
      });
      return res.json({ data: updatedFile, msg: "File updated" });
    } else {
      let insObj = {
        user: req.user,
        email,
        phone,
        type,
        intersted,
      };
      const updatedFile = await File.findByIdAndUpdate(_id, insObj, {
        new: true,
      });
      return res.json({ data: updatedFile, msg: "File updated" });
    }
  } catch (error) {
    return res.status(422).json({ msg: "Invalid Details"});
  }
});

route.patch("/intersted/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updatedFile = await File.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    return res
      .status(200)
      .json({ data: updatedFile, msg: "Not intersted success" });
  } catch (error) {
    return res.status(422).json({ msg: "Invalid Details" });
  }
});

module.exports = route;
