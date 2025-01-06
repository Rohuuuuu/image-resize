require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const EmployeeModel = require("./models/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(cookieParser());

// Get MongoDB URI and JWT secret from the .env file
const atlasURI = process.env.MONGODB_URI;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Connect to MongoDB Atlas
mongoose
  .connect(atlasURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

// Configure multer for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Unlock PDF using qpdf
const unlockPdf = (inputBuffer, password) => {
  return new Promise((resolve, reject) => {
    const uniqueId = Date.now();
    const tempInputPath = path.join(__dirname, `tempInput_${uniqueId}.pdf`);
    const tempOutputPath = path.join(__dirname, `tempOutput_${uniqueId}.pdf`);

    fs.writeFileSync(tempInputPath, inputBuffer);

    const qpdfPath = '"C:\\Program Files\\qpdf 11.9.1\\bin\\qpdf.exe"';
    const command = `qpdf --decrypt --password=${password} "${tempInputPath}" "${tempOutputPath}"`;

    exec(command, (error) => {
      if (error) {
        if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
        if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
        console.log(error.message);
        reject(error.message);
        return;
      }

      const unlockedBuffer = fs.readFileSync(tempOutputPath);
      fs.unlinkSync(tempInputPath);
      fs.unlinkSync(tempOutputPath);
      resolve(unlockedBuffer);
    });
  });
};

// Serve static files from the React app's build folder
app.use('/assets', express.static(path.join(__dirname, 'client', 'public', 'assets')));

// app.use(express.static(path.join(__dirname, "client/dist")));

// Handle React routing, return all requests to the React app
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/dist", "index.html"));
// });

// Endpoint to login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await EmployeeModel.findOne({ email: email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ email: user.email }, jwtSecretKey, {
          expiresIn: "1d",
        });
        res.cookie("token", token);
        res.json("success");
      } else {
        res.json("The password is incorrect");
      }
    } else {
      res.json("No record found");
    }
  } catch (err) {
    res.status(500).json("Error logging in");
  }
});

// Endpoint to register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = await EmployeeModel.create({
      name,
      email,
      password: hashedPassword,
    });
    res.json(newEmployee);
  } catch (err) {
    res.status(500).json("Error registering user");
  }
});

// Endpoint to unlock the PDF
app.post("/unlock-pdf", upload.single("file"), async (req, res) => {
  const file = req.file;
  const password = req.body.password;

  if (!file || !password) {
    return res.status(400).send("File and password are required.");
  }

  try {
    const unlockedBuffer = await unlockPdf(file.buffer, password);
    res.setHeader("Content-Disposition", 'attachment; filename="unlocked.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    res.send(unlockedBuffer);
  } catch (error) {
    res
      .status(500)
      .send("Failed to unlock the PDF. Make sure the password is correct.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
