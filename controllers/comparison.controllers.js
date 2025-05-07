const { PrismaClient } = require("@prisma/client");
const uploadToCloudinary = require("../utils/upload-to-cloudinary.js");

const prisma = new PrismaClient();

// Compare two technologies (for regular users and admin)
async function compareTechnologies(req, res) {
  try {
    const { tech1, tech2 } = req.query;

    if (!tech1 || !tech2) {
      throw new Error("ID kedua teknologi harus diisi");
    }

    const technologies = await prisma.technology.findMany({
      where: {
        id_tech: {
          in: [tech1, tech2]
        },
        deleted_at: null
      },
      select: {
        id_tech: true,
        tech_name: true,
        category: {
          select: {
            id_category: true,
            category_name: true
          }
        },
        comparisons: {
          where: { deleted_at: null },
          select: {
            key_spec: true,
            value_spec: true,
            image_comparison: true
          }
        }
      }
    });

    if (technologies.length !== 2) {
      throw new Error("Satu atau kedua teknologi tidak ditemukan");
    }

    // Create comparison array
    const comparison = [];
    const tech1Data = technologies.find(t => t.id_tech === tech1);
    const tech2Data = technologies.find(t => t.id_tech === tech2);

    // Get image comparison URLs (take the first non-null image for each tech)
    const tech1Image = tech1Data.comparisons.find(c => c.image_comparison)?.image_comparison || null;
    const tech2Image = tech2Data.comparisons.find(c => c.image_comparison)?.image_comparison || null;

    // Get all unique key_specs from both technologies
    const allKeySpecs = new Set([
      ...tech1Data.comparisons.map(c => c.key_spec),
      ...tech2Data.comparisons.map(c => c.key_spec)
    ]);

    // Create comparison entries for each key_spec
    for (const keySpec of allKeySpecs) {
      const tech1Comparison = tech1Data.comparisons.find(c => c.key_spec === keySpec);
      const tech2Comparison = tech2Data.comparisons.find(c => c.key_spec === keySpec);

      comparison.push({
        key_spec: keySpec,
        tech1_value: tech1Comparison?.value_spec || "-",
        tech2_value: tech2Comparison?.value_spec || "-"
      });
    }

    // Remove comparisons from the response as they're now in the comparison array
    delete tech1Data.comparisons;
    delete tech2Data.comparisons;

    res.status(200).json({
      message: "Sukses membandingkan teknologi",
      data: {
        tech1: {
          ...tech1Data,
          image_comparison: tech1Image
        },
        tech2: {
          ...tech2Data,
          image_comparison: tech2Image
        },
        comparison
      }
    });
  } catch (error) {
    console.error("compareTechnologies error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal membandingkan teknologi"
    });
  }
}

// Get all comparisons (admin only)
async function getAllComparisons(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const comparisons = await prisma.comparison.findMany({
      where: { deleted_at: null },
      select: {
        id_detail: true,
        key_spec: true,
        value_spec: true,
        image_comparison: true,
        technology: {
          select: {
            id_tech: true,
            tech_name: true,
            category: {
              select: {
                id_category: true,
                category_name: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Daftar perbandingan berhasil diambil",
      data: comparisons
    });
  } catch (error) {
    console.error("getAllComparisons error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil daftar perbandingan"
    });
  }
}

// Get comparison by ID (admin only)
async function getComparisonById(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;

    const comparison = await prisma.comparison.findUnique({
      where: { id_detail: id },
      select: {
        id_detail: true,
        key_spec: true,
        value_spec: true,
        image_comparison: true,
        technology: {
          select: {
            id_tech: true,
            tech_name: true,
            category: {
              select: {
                id_category: true,
                category_name: true
              }
            }
          }
        }
      }
    });

    if (!comparison) {
      throw new Error("Perbandingan tidak ditemukan");
    }

    res.status(200).json({
      success: true,
      message: "Perbandingan berhasil diambil",
      data: comparison
    });
  } catch (error) {
    console.error("getComparisonById error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil data perbandingan"
    });
  }
}

// Create new comparison (admin only)
async function createComparison(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    let { id_tech, key_spec, value_spec } = req.body;

    // Pastikan semua field ada
    if (!id_tech || !key_spec || !value_spec) {
      throw new Error("Semua field harus diisi");
    }

    // Jika hanya satu, jadikan array
    if (!Array.isArray(key_spec)) key_spec = [key_spec];
    if (!Array.isArray(value_spec)) value_spec = [value_spec];

    if (key_spec.length !== value_spec.length) {
      throw new Error("Jumlah key_spec dan value_spec harus sama");
    }

    // Untuk upload gambar, jika ingin support multiple images, perlu modifikasi upload middleware juga.
    // Untuk sekarang, kita asumsikan satu gambar untuk semua comparison, atau bisa dikembangkan lebih lanjut.

    let image_comparison = null;
    if (req.file && req.file.buffer) {
      image_comparison = await uploadToCloudinary(
        req.file.buffer,
        "image_comparison",
        req.file.originalname
      );
    }

    // Loop dan create comparison untuk setiap pasangan key-value
    const createdComparisons = [];
    for (let i = 0; i < key_spec.length; i++) {
      const newComparison = await prisma.comparison.create({
        data: {
          id_tech,
          key_spec: key_spec[i],
          value_spec: value_spec[i],
          image_comparison
        },
        select: {
          id_detail: true,
          key_spec: true,
          value_spec: true,
          image_comparison: true,
          created_at: true,
          technology: {
            select: {
              id_tech: true,
              tech_name: true,
              category: {
                select: {
                  id_category: true,
                  category_name: true,
                  description: true
                }
              }
            }
          }
        }
      });
      createdComparisons.push(newComparison);
    }

    res.status(201).json({
      success: true,
      message: "Perbandingan berhasil dibuat",
      data: createdComparisons
    });
  } catch (error) {
    console.error("createComparison error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal membuat perbandingan baru"
    });
  }
}

// Update comparison (admin only)
async function updateComparison(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;
    let { id_tech, key_spec, value_spec } = req.body;

    // Jika field berupa array (karena form-data), ambil elemen pertamanya
    if (Array.isArray(id_tech)) id_tech = id_tech[0];
    if (Array.isArray(key_spec)) key_spec = key_spec[0];
    if (Array.isArray(value_spec)) value_spec = value_spec[0];

    // Check if comparison exists
    const existingComparison = await prisma.comparison.findUnique({
      where: { id_detail: id }
    });

    if (!existingComparison) {
      throw new Error("Perbandingan tidak ditemukan");
    }

    let updateData = {};

    // Only include fields that are provided in the request
    if (id_tech !== undefined) updateData.id_tech = id_tech;
    if (key_spec !== undefined) updateData.key_spec = key_spec;
    if (value_spec !== undefined) updateData.value_spec = value_spec;

    let image_comparison = existingComparison.image_comparison;
    if (req.file && req.file.buffer) {
      image_comparison = await uploadToCloudinary(
        req.file.buffer,
        "image_comparison",
        req.file.originalname
      );
      updateData.image_comparison = image_comparison;
    }

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      throw new Error("Tidak ada data yang diupdate");
    }

    updateData.updated_at = new Date();

    const updatedComparison = await prisma.comparison.update({
      where: { id_detail: id },
      data: updateData,
      select: {
        id_detail: true,
        key_spec: true,
        value_spec: true,
        image_comparison: true,
        updated_at: true,
        technology: {
          select: {
            id_tech: true,
            tech_name: true,
            category: {
              select: {
                id_category: true,
                category_name: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Perbandingan berhasil diupdate",
      data: updatedComparison
    });
  } catch (error) {
    console.error("updateComparison error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengupdate perbandingan"
    });
  }
}

// Delete comparison (admin only) - soft delete
async function deleteComparison(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;

    const deletedComparison = await prisma.comparison.update({
      where: { id_detail: id },
      data: { deleted_at: new Date() },
      select: {
        id_detail: true,
        key_spec: true,
        value_spec: true,
        image_comparison: true,
        deleted_at: true,
        technology: {
          select: {
            id_tech: true,
            tech_name: true,
            category: {
              select: {
                id_category: true,
                category_name: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Perbandingan berhasil dihapus",
      data: deletedComparison
    });
  } catch (error) {
    console.error("deleteComparison error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal menghapus perbandingan"
    });
  }
}

module.exports = {
  compareTechnologies,
  getAllComparisons,
  getComparisonById,
  createComparison,
  updateComparison,
  deleteComparison
}; 