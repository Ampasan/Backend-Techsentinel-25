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
        created_at: true,
        category: {
          select: {
            id_category: true,
            category_name: true,
            description: true
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
        tech2_value: tech2Comparison?.value_spec || "-",
        tech1_image: tech1Comparison?.image_comparison || null,
        tech2_image: tech2Comparison?.image_comparison || null
      });
    }

    // Remove comparisons from the response as they"re now in the comparison array
    delete tech1Data.comparisons;
    delete tech2Data.comparisons;

    res.status(200).json({
      message: "Sukses membandingkan teknologi",
      data: {
        tech1: tech1Data,
        tech2: tech2Data,
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

    const { id_tech, key_spec, value_spec } = req.body;

    if (!id_tech || !key_spec || !value_spec) {
      throw new Error("Semua field harus diisi");
    }

    let image_comparison = null;
    if (req.file && req.file.buffer) {
      image_comparison = await uploadToCloudinary(
        req.file.buffer,
        "image_comparison",
        req.file.originalname
      );
    }

    const newComparison = await prisma.comparison.create({
      data: {
        id_tech,
        key_spec,
        value_spec,
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

    res.status(201).json({
      success: true,
      message: "Perbandingan berhasil dibuat",
      data: newComparison
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
    const { id_tech, key_spec, value_spec } = req.body;

    if (!id_tech || !key_spec || !value_spec) {
      throw new Error("Semua field harus diisi");
    }

    let updateData = {
      id_tech,
      key_spec,
      value_spec
    };

    if (req.file && req.file.buffer) {
      const image_comparison = await uploadToCloudinary(
        req.file.buffer,
        "image_comparison",
        req.file.originalname
      );
      updateData.image_comparison = image_comparison;
    }

    const updatedComparison = await prisma.comparison.update({
      where: { id_detail: id },
      data: updateData,
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
        created_at: true,
        deleted_at: true,
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