const { PrismaClient } = require("@prisma/client");
const uploadToCloudinary = require("../utils/upload-to-cloudinary.js");

const prisma = new PrismaClient();

// Get all categories (for regular users)
async function getAllCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        deleted_at: null
      },
      select: {
        id_category: true,
        category_name: true,
        icon_category: true,
        created_at: true,
        updated_at: true
      }
    });

    res.status(200).json({
      success: true,
      message: "Daftar kategori berhasil diambil",
      data: categories
    });
  } catch (error) {
    console.error("getAllCategories error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil daftar kategori"
    });
  }
}

// Get category by ID (for regular users)
async function getCategoryById(req, res) {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: { 
        id_category: id,
        deleted_at: null
      },
      select: {
        id_category: true,
        category_name: true,
        icon_category: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!category) {
      throw new Error("Kategori tidak ditemukan");
    }

    res.status(200).json({
      success: true,
      message: "Kategori berhasil diambil",
      data: category
    });
  } catch (error) {
    console.error("getCategoryById error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil data kategori"
    });
  }
}

// Create new category (admin only)
async function createCategory(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { category_name } = req.body;

    if (!category_name) {
      throw new Error("Nama kategori harus diisi");
    }

    if (!req.file || !req.file.buffer) {
      throw new Error("Icon kategori harus diupload");
    }

    // Upload icon to Cloudinary
    const icon_category = await uploadToCloudinary(
      req.file.buffer,
      "icon_category",
      req.file.originalname
    );

    const newCategory = await prisma.category.create({
      data: {
        category_name,
        icon_category
      },
      select: {
        id_category: true,
        category_name: true,
        icon_category: true,
        created_at: true
      }
    });

    res.status(201).json({
      success: true,
      message: "Kategori berhasil dibuat",
      data: newCategory
    });
  } catch (error) {
    console.error("createCategory error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal membuat kategori baru"
    });
  }
}

// Update category (admin only)
async function updateCategory(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;
    const { category_name } = req.body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id_category: id }
    });

    if (!existingCategory) {
      throw new Error("Kategori tidak ditemukan");
    }

    if (!category_name) {
      throw new Error("Nama kategori harus diisi");
    }

    const updateData = {
      category_name,
      updated_at: new Date()
    };

    // Handle icon upload if new file is provided
    if (req.file && req.file.buffer) {
      const icon_category = await uploadToCloudinary(
        req.file.buffer,
        "category_icon",
        req.file.originalname
      );
      updateData.icon_category = icon_category;
    }

    const updatedCategory = await prisma.category.update({
      where: { id_category: id },
      data: updateData,
      select: {
        id_category: true,
        category_name: true,
        icon_category: true,
        updated_at: true
      }
    });

    res.status(200).json({
      success: true,
      message: "Kategori berhasil diupdate",
      data: updatedCategory
    });
  } catch (error) {
    console.error("updateCategory error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengupdate kategori"
    });
  }
}

// Delete category (admin only) - soft delete
async function deleteCategory(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id_category: id }
    });

    if (!existingCategory) {
      throw new Error("Kategori tidak ditemukan");
    }

    // Soft delete the category
    const deletedCategory = await prisma.category.update({
      where: { id_category: id },
      data: {
        deleted_at: new Date()
      },
      select: {
        id_category: true,
        category_name: true,
        icon_category: true,
        deleted_at: true
      }
    });

    res.status(200).json({
      success: true,
      message: "Kategori berhasil dihapus",
      data: deletedCategory
    });
  } catch (error) {
    console.error("deleteCategory error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal menghapus kategori"
    });
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};