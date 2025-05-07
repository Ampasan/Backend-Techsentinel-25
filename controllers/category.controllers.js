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
        description: true
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
        description: true
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

// Get all categories with technologies (admin only)
async function getAllCategoriesWithTechnologies(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const categories = await prisma.category.findMany({
      select: {
        id_category: true,
        category_name: true,
        icon_category: true,
        description: true,
        technologies: {
          where: { deleted_at: null },
          select: {
            id_tech: true,
            tech_name: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Daftar kategori berhasil diambil",
      data: categories
    });
  } catch (error) {
    console.error("getAllCategoriesWithTechnologies error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil daftar kategori"
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

    const { category_name, description } = req.body;

    if (!category_name || !description) {
      throw new Error("Semua field harus diisi");
    }

    let icon_category = null;
    if (req.file && req.file.buffer) {
      icon_category = await uploadToCloudinary(
        req.file.buffer,
        "icon_category",
        req.file.originalname
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        category_name,
        icon_category,
        description
      },
      select: {
        id_category: true,
        category_name: true,
        icon_category: true,
        description: true,
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
    const { category_name, description } = req.body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id_category: id }
    });

    if (!existingCategory) {
      throw new Error("Kategori tidak ditemukan");
    }

    let updateData = {};
    
    // Only include fields that are provided in the request
    if (category_name !== undefined) updateData.category_name = category_name;
    if (description !== undefined) updateData.description = description;

    let icon_category = existingCategory.icon_category;
    if (req.file && req.file.buffer) {
      icon_category = await uploadToCloudinary(
        req.file.buffer,
        "icon_category",
        req.file.originalname
      );
      updateData.icon_category = icon_category;
    }

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      throw new Error("Tidak ada data yang diupdate");
    }

    updateData.updated_at = new Date();

    const updatedCategory = await prisma.category.update({
      where: { id_category: id },
      data: updateData,
      select: {
        id_category: true,
        category_name: true,
        icon_category: true,
        description: true,
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
        description: true,
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
  getAllCategoriesWithTechnologies,
  createCategory,
  updateCategory,
  deleteCategory
};