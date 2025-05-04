const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Get all categories (for regular users)
async function getAllCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id_category: true,
        category_name: true,
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

    const category = await prisma.category.findUnique({
      where: { id_category: id },
      select: {
        id_category: true,
        category_name: true,
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
        description: true,
        technologies: {
          where: { deleted_at: null },
          select: {
            id_tech: true,
            tech_name: true,
            created_at: true
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

// Get category by ID with technologies (admin only)
async function getCategoryByIdWithTechnologies(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id_category: id },
      select: {
        id_category: true,
        category_name: true,
        description: true,
        technologies: {
          where: { deleted_at: null },
          select: {
            id_tech: true,
            tech_name: true,
            created_at: true
          }
        }
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
    console.error("getCategoryByIdWithTechnologies error:", error);
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

    const { category_name, description } = req.body;

    if (!category_name || !description) {
      throw new Error("Semua field harus diisi");
    }

    const newCategory = await prisma.category.create({
      data: {
        category_name,
        description
      },
      select: {
        id_category: true,
        category_name: true,
        description: true
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

    if (!category_name || !description) {
      throw new Error("Semua field harus diisi");
    }

    const updatedCategory = await prisma.category.update({
      where: { id_category: id },
      data: {
        category_name,
        description
      },
      select: {
        id_category: true,
        category_name: true,
        description: true
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
      throw new Error("Unauthorized: Only admin can access this endpoint");
    }

    const { id } = req.params;

    // Since there"s no deleted_at field in the category model,
    // we"ll perform a hard delete
    const deletedCategory = await prisma.category.delete({
      where: { id_category: id },
      select: {
        id_category: true,
        category_name: true,
        description: true
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
  getCategoryByIdWithTechnologies,
  createCategory,
  updateCategory,
  deleteCategory
};