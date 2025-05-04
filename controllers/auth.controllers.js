const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uploadToCloudinary = require("../utils/upload-to-cloudinary.js");

const prisma = new PrismaClient();


async function registerUser(req, res) {
  try {
    const { user_name, user_email, user_password } = req.body;

    if (!user_name || !user_email || !user_password) {
      throw new Error("Username, email, dan password harus diisi");
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { user_email },
    });

    if (existingUser) {
      throw new Error(
        "Email sudah terdaftar. Silakan login atau gunakan email lain"
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user_password, saltRounds);

    // Set default user level to A101 (user)
    const defaultUserLevel = "A101";

    // Upload gambar ke Cloudinary (opsional)
    let imageUrl = null;
    if (req.file && req.file.buffer) {
      imageUrl = await uploadToCloudinary(
        req.file.buffer,
        "profile_picture",
        req.file.originalname
      );
    }

    const newUser = await prisma.user.create({
      data: {
        user_name,
        user_email,
        user_password: hashedPassword,
        profile_picture: imageUrl || null,
        id_level: defaultUserLevel,
      },
      select: {
        id_user: true,
        user_name: true,
        user_email: true,
        profile_picture: true,
        created_at: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "User berhasil didaftarkan",
      data: newUser,
    });
  } catch (error) {
    console.error("registerUser error:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Gagal membuat user baru.",
    });
  }
}

async function login(req, res) {
  try {
    const { user_email, user_password } = req.body;

    const user = await prisma.user.findUnique({
      where: { user_email },
      select: {
        id_user: true,
        user_name: true,
        user_email: true,
        user_password: true,
        level: {
          select: { name: true },
        },
        profile_picture: true,
      },
    });

    if (!user) {
      throw new Error("Email tidak ditemukan");
    }

    const passwordValid = await bcrypt.compare(
      user_password,
      user.user_password
    );
    if (!passwordValid) {
      throw new Error("Password salah");
    }

    const token = jwt.sign(
      { id_user: user.id_user, role: user.level.name },
      process.env.JWT_SECRET,
      { expiresIn: "60s" }
    );

    // Hapus password sebelum kirim response
    delete user.user_password;
    user.level = user.level.name;

    res
      .cookie("token", token, {
        signed: true,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || false,
      })
      .status(200)
      .json({
        success: true,
        message: "Berhasil login",
        data: user,
        token,
      });
  } catch (error) {
    console.error("login error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message || "Gagal login.",
    });
  }
}

async function logout(req, res, next) {
  try {
    // Hapus cookie token
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Berhasil logout",
    });
  } catch (error) {
    console.error("logout error:", error);
    next(error);
  }
}

module.exports = { registerUser, login, logout };