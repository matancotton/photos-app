const express = require("express");
const crypto = require("crypto");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const app = express();
const port = process.env.PORT || 3000;

const storge = multer.diskStorage({
    destination: "./images/",
    filename(req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err);
            cb(null, raw.toString("hex") + path.extname(file.originalname));
        });
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("File must be an image"));
        }
        cb(undefined, true);
    },
});

const upload = multer({ storage: storge });

app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));
app.use("/images", express.static(path.join(__dirname, "../images")));

app.post(
    "/upload",
    upload.single("upload"),
    (req, res) => {
        console.log(req.file.filename);
        res.send({ imageName: req.file.filename });
    },
    (error, req, res, next) => {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
);

// app.get("/images", (req, res) => {
//     res.sendFile(path.join(__dirname, "../images"));
// });

app.listen(port, () => console.log("server is running on port", port));
