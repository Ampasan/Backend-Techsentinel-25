const { PrismaClient } = require("@prisma/client");
const uploadToCloudinary = require("../utils/upload-to-cloudinary.js");

const prisma = new PrismaClient();

// Get user profile
async function getUserProfile(req, res) {
  try {
    const userId = req.user.id_user;

    const user = await prisma.user.findUnique({
      where: { id_user: userId },
      select: {
        id_user: true,
        user_name: true,
        user_email: true,
        profile_picture: true,
        level: {
          select: { name: true }
        }
      }
    });

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    res.status(200).json({
      success: true,
      message: "Profile berhasil diambil",
      data: user
    });
  } catch (error) {
    console.error("getUserProfile error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil profile"
    });
  }
}

// Update user profile
async function updateUserProfile(req, res) {
  try {
    const userId = req.user.id_user;
    const { user_name, user_email } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id_user: userId }
    });

    if (!existingUser) {
      throw new Error("User tidak ditemukan");
    }

    let updateData = {};
    
    // Only include fields that are provided in the request
    if (user_name !== undefined) updateData.user_name = user_name;
    if (user_email !== undefined) updateData.user_email = user_email;

    let profile_picture = existingUser.profile_picture;
    // Handle profile picture upload if exists
    if (req.file && req.file.buffer) {
      profile_picture = await uploadToCloudinary(
        req.file.buffer,
        "profile_picture",
        req.file.originalname
      );
      updateData.profile_picture = profile_picture;
    }

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      throw new Error("Tidak ada data yang diupdate");
    }

    updateData.updated_at = new Date();

    const updatedUser = await prisma.user.update({
      where: { id_user: userId },
      data: updateData,
      select: {
        id_user: true,
        user_name: true,
        user_email: true,
        profile_picture: true,
        updated_at: true,
        level: {
          select: { name: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Profile berhasil diupdate",
      data: updatedUser
    });
  } catch (error) {
    console.error("updateUserProfile error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengupdate profile"
    });
  }
}

// Get all users (admin only)
async function getAllUsers(req, res) {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const users = await prisma.user.findMany({
      where: { deleted_at: null },
      select: {
        id_user: true,
        user_name: true,
        user_email: true,
        profile_picture: true,
        level: {
          select: { name: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Daftar user berhasil diambil",
      data: users
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil daftar user"
    });
  }
}

// Get user by ID (admin only)
async function getUserById(req, res) {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id_user: id },
      select: {
        id_user: true,
        user_name: true,
        user_email: true,
        profile_picture: true,
        level: {
          select: { name: true }
        }
      }
    });

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    res.status(200).json({
      success: true,
      message: "User berhasil diambil",
      data: user
    });
  } catch (error) {
    console.error("getUserById error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil data user"
    });
  }
}

// Update user by ID (admin only)
async function updateUserById(req, res) {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;
    const { user_name, user_email, id_level } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id_user: id }
    });

    if (!existingUser) {
      throw new Error("User tidak ditemukan");
    }

    let updateData = {};
    
    // Only include fields that are provided in the request
    if (user_name !== undefined) updateData.user_name = user_name;
    if (user_email !== undefined) updateData.user_email = user_email;
    if (id_level !== undefined) updateData.id_level = id_level;

    let profile_picture = existingUser.profile_picture;
    // Handle profile picture upload if exists
    if (req.file && req.file.buffer) {
      profile_picture = await uploadToCloudinary(
        req.file.buffer,
        "profile_picture",
        req.file.originalname
      );
      updateData.profile_picture = profile_picture;
    }

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      throw new Error("Tidak ada data yang diupdate");
    }

    updateData.updated_at = new Date();

    const updatedUser = await prisma.user.update({
      where: { id_user: id },
      data: updateData,
      select: {
        id_user: true,
        user_name: true,
        user_email: true,
        profile_picture: true,
        updated_at: true,
        level: {
          select: { name: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "User berhasil diupdate",
      data: updatedUser
    });
  } catch (error) {
    console.error("updateUserById error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengupdate user"
    });
  }
}

// Delete user by ID (admin only) - soft delete
async function deleteUserById(req, res) {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;

    const deletedUser = await prisma.user.update({
      where: { id_user: id },
      data: { deleted_at: new Date() },
      select: {
        id_user: true,
        user_name: true,
        user_email: true,
        profile_picture: true,
        deleted_at: true,
        level: {
          select: { name: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
      data: deletedUser
    });
  } catch (error) {
    console.error("deleteUserById error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal menghapus user"
    });
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
};