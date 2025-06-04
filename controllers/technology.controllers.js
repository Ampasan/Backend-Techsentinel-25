const { PrismaClient } = require("@prisma/client");
const uploadToCloudinary = require("../utils/upload-to-cloudinary.js");

const prisma = new PrismaClient();

// Search technologies (for regular users)
async function searchTechnologies(req, res) {
  try {
    const { query } = req.query;

    // Query pencarian nama tetap wajib
    if (!query) {
      throw new Error("Query pencarian harus diisi");
    }

    const technologies = await prisma.technology.findMany({
      where: {
        deleted_at: null,
        tech_name: { contains: query, mode: "insensitive" }
      },
      select: {
        id_tech: true,
        tech_name: true,
        brand: true,
        rating: true,
        tech_image: true,
        category: {
          select: {
            category_name: true
          }
        },
        specs: {
          select: {
            price: true
          }
        }
      }
    });

    // Mapping hasil pencarian
    const result = technologies.map(tech => ({
      id_tech: tech.id_tech,
      tech_name: tech.tech_name,
      brand: tech.brand,
      rating: tech.rating,
      tech_image: tech.tech_image,
      category: tech.category.category_name,
      price: tech.specs[0]?.price || null
    }));

    res.status(200).json({
      success: true,
      message: "Hasil pencarian teknologi berhasil diambil",
      data: result
    });
  } catch (error) {
    console.error("searchTechnologies error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mencari teknologi"
    });
  }
}

// Get all technologies (admin only)
async function getAllTechnologies(req, res) {
  try {
    const technologies = await prisma.technology.findMany({
      where: { deleted_at: null },
      select: {
        id_tech: true,
        tech_name: true,
        brand: true,
        rating: true,
        tech_image: true,
        review: true,
        description_tech: true,
        created_at: true,
        updated_at: true,
        category: {
          select: {
            id_category: true,
            category_name: true
          }
        },
        specs: {
          select: {
            ram: true,
            storage: true,
            baterai: true,
            camera: true,
            prosesor: true,
            sistem_operasi: true,
            ukuran_layar: true,
            resolusi_layar: true,
            refresh_rate: true,
            price: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Daftar teknologi berhasil diambil",
      data: technologies
    });
  } catch (error) {
    console.error("getAllTechnologies error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil daftar teknologi"
    });
  }
}

// Get technology by ID (admin only)
async function getTechnologyById(req, res) {
  try {
    const { id } = req.params;

    const technology = await prisma.technology.findUnique({
      where: { id_tech: id },
      select: {
        id_tech: true,
        tech_name: true,
        brand: true,
        rating: true,
        tech_image: true,
        review: true,
        description_tech: true,
        created_at: true,
        updated_at: true,
        category: {
          select: {
            id_category: true,
            category_name: true
          }
        },
        specs: {
          select: {
            ram: true,
            storage: true,
            baterai: true,
            camera: true,
            prosesor: true,
            sistem_operasi: true,
            ukuran_layar: true,
            resolusi_layar: true,
            refresh_rate: true,
            price: true
          }
        },
        reviews: {
          where: {
            deleted_at: null
          },
          select: {
            id_review: true,
            rating: true,
            comment: true,
            created_at: true,
            user: {
              select: {
                id_user: true,
                user_name: true,
                profile_picture: true
              }
            }
          }
        }
      }
    });

    if (!technology) {
      throw new Error("Teknologi tidak ditemukan");
    }

    res.status(200).json({
      success: true,
      message: "Teknologi berhasil diambil",
      data: technology
    });
  } catch (error) {
    console.error("getTechnologyById error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil data teknologi"
    });
  }
}

// Create new technology (admin only)
async function createTechnology(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { 
      tech_name, 
      id_category, 
      brand,
      review,
      description_tech,
      rating
    } = req.body;

    if (!tech_name || !id_category || !brand || !review || !description_tech || !rating) {
      throw new Error("Semua field wajib harus diisi");
    }

    let tech_image = null;
    if (req.file && req.file.buffer) {
      tech_image = await uploadToCloudinary(
        req.file.buffer,
        "tech_image",
        req.file.originalname
      );
    }

    const newTechnology = await prisma.technology.create({
      data: {
        tech_name,
        id_category,
        brand,
        review,
        description_tech,
        tech_image,
        rating: parseFloat(rating),
        id_user: req.user.id_user
      },
      select: {
        id_tech: true,
        tech_name: true,
        brand: true,
        rating: true,
        tech_image: true,
        review: true,
        description_tech: true,
        created_at: true,
        category: {
          select: {
            id_category: true,
            category_name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Teknologi berhasil dibuat",
      data: newTechnology
    });
  } catch (error) {
    console.error("createTechnology error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal membuat teknologi baru"
    });
  }
}

// Update technology (admin only)
async function updateTechnology(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;
    const { 
      tech_name, 
      id_category, 
      brand,
      review,
      description_tech,
      rating
    } = req.body;

    // Check if technology exists
    const existingTechnology = await prisma.technology.findUnique({
      where: { id_tech: id }
    });

    if (!existingTechnology) {
      throw new Error("Teknologi tidak ditemukan");
    }

    let updateData = {};
    
    // Only include fields that are provided in the request
    if (tech_name !== undefined) updateData.tech_name = tech_name;
    if (id_category !== undefined) updateData.id_category = id_category;
    if (brand !== undefined) updateData.brand = brand;
    if (review !== undefined) updateData.review = review;
    if (description_tech !== undefined) updateData.description_tech = description_tech;
    if (rating !== undefined) updateData.rating = parseFloat(rating);

    // Handle image upload
    if (req.file && req.file.buffer) {
      const tech_image = await uploadToCloudinary(
        req.file.buffer,
        "tech_image",
        req.file.originalname
      );
      updateData.tech_image = tech_image;
    }

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      throw new Error("Tidak ada data yang diupdate");
    }

    updateData.updated_at = new Date();

    const updatedTechnology = await prisma.technology.update({
      where: { id_tech: id },
      data: updateData,
      select: {
        id_tech: true,
        tech_name: true,
        brand: true,
        rating: true,
        tech_image: true,
        review: true,
        description_tech: true,
        updated_at: true,
        category: {
          select: {
            id_category: true,
            category_name: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Teknologi berhasil diupdate",
      data: updatedTechnology
    });
  } catch (error) {
    console.error("updateTechnology error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengupdate teknologi"
    });
  }
}

// Delete technology (admin only) - soft delete
async function deleteTechnology(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;

    const deletedTechnology = await prisma.technology.update({
      where: { id_tech: id },
      data: { deleted_at: new Date() },
      select: {
        id_tech: true,
        tech_name: true,
        deleted_at: true,
        category: {
          select: {
            id_category: true,
            category_name: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Teknologi berhasil dihapus",
      data: deletedTechnology
    });
  } catch (error) {
    console.error("deleteTechnology error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal menghapus teknologi"
    });
  }
}

module.exports = {
  searchTechnologies,
  getAllTechnologies,
  getTechnologyById,
  createTechnology,
  updateTechnology,
  deleteTechnology
};