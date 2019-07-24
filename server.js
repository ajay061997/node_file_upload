const express = require("express");

const app = express();

const multer = require("multer");

const bodyParser = require("body-parser");

const path = require("path");

const mime = require("mime");

const fs = require("fs");

let userEnterFolder;

// Use body-parser
app.use(bodyParser.json());

app.use(express.static("public"));

// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/mp3files");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
//   }
// });

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//   cb(null, 'public')
// },
// filename: function (req, file, cb) {
//   cb(null, Date.now() + '-' +file.originalname )
// }
// })

var fileFilter = (req, file, cb) => {
  if (file.mimetype === "audio/mp3") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }));

// SETUP and Handling Cross-origin resource sharing(CORS)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// var upload = multer({ storage: storage, fileFilter: fileFilter }).single(
//   "file"
// );

app.get("/download/:id", function(req, res) {
  let fileId = req.params.id;
  let file = `./public/mp3files/${fileId}`;
  res.download(file); // Set disposition and send it.
});

app.post("/upload", (req, res) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(500)
        .json({ msg: "Server Problem ", status: "fail", error: err });
    } else if (err) {
      return res
        .status(500)
        .json({ msg: "file upload fail", status: "fail", error: err });
    }
    return res
      .status(200)
      .json({ msg: "file upload success", status: "success" });
  });
});

app.post("/checkfolder2", (req, res) => {
  userEnterFolder = req.body.userFolder;
  var dest = "./public/mp3files/" + userEnterFolder;
  const filePath = "./public/mp3files/";
  let isFind = false;
  fs.readdir(filePath, (err, files) => {
    files.forEach(file => {
      if (file === userEnterFolder) {
        isFind = true;
        res.json({ msg: "Folder Already Exits", status: "fail" });
      }
    });
    if (!isFind) {
      console.log("create folder");
      fs.mkdir(dest, () => {
        return res.json({ msg: "folder created success", status: "success" });
      });
    }

    // return res.json({ msg: "Folder Created Success" });
  });
  //console.log(ufiles);
});

app.get("/allfiles", (req, res) => {
  const filePath = "./public/mp3files/";
  fs.readdir(filePath, (err, files) => {
    let eachFiles = [];
    files.forEach(file => {
      eachFiles.push(file);
    });
    res.json(eachFiles);
  });
});

app.get("/allfiles2/:filename", (req, res) => {
  const fileName = req.params.filename;
  // return console.log(fileName);

  const filePath = `./public/mp3files/${fileName}`;
  let eachFiles = [];
  // return console.log(filePath);
  fs.readdir(filePath, (err, files) => {
    files.forEach(fl => {
      eachFiles.push(fl);
    });
    res.json(eachFiles);

    // let eachFiles = [];
    // files.forEach(file => {
    //   //console.log(file);
    //   // fs.readdirSync(`${filePath + file}`, (err, files1) => {
    //   //   console.log(files1);
    //   // });
    //   file.forEach(fl => {
    //     console.log(fl);
    //   });
    // });
    // res.json(eachFiles);
  });
});

app.post("/checkfolder", (req, res) => {
  var user = userEnterFolder;

  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/mp3files/" + user);
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    }
  });

  var upload = multer({
    storage: storage
  }).single("file");

  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(500)
        .json({ msg: "Server Problem ", status: "fail", error: err });
    } else if (err) {
      return res
        .status(500)
        .json({ msg: "file upload fail", status: "fail", error: err });
    }
    return res
      .status(200)
      .json({ msg: "file upload success", status: "success" });
  });
});

app.get("/delete/:id", (req, res) => {
  let fileId = req.params.id;
  let file = `./public/mp3files/${fileId}`;
  var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index) {
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          deleteFolderRecursive(curPath);
        } else {
          // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdir(path, () => {
        res
          .status(200)
          .json({ msg: "Folder Deleted success", status: "success" });
      });
    }
  };

  deleteFolderRecursive(file);
  // fs.rmdir(file, () => {
  //   return res
  //     .status(200)
  //     .json({ msg: "Folder Deleted success", status: "success" });
  // });
  //return console.log(fs.lstatSync(file).isDirectory());
  // fs.unlink(file);
});

app.listen(5000, () => {
  console.log("app is running on port 5000");
});
