const { PrismaClient } = require("@prisma/client");

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
        brand: true,
        specs: true,
        tech_image: true,
        rating: true,
        category: {
          select: {
            id_category: true,
            category_name: true
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

    // Get all unique keys from both technologies' specs
    const allKeys = new Set([
      ...Object.keys(tech1Data.specs),
      ...Object.keys(tech2Data.specs)
    ]);

    // Create comparison entries for each spec
    for (const key of allKeys) {
      comparison.push({
        key_spec: key,
        tech1_value: tech1Data.specs[key] || "-",
        tech2_value: tech2Data.specs[key] || "-"
      });
    }

    res.status(200).json({
      success: true,
      message: "Sukses membandingkan teknologi",
      data: {
        tech1: {
          id_tech: tech1Data.id_tech,
          tech_name: tech1Data.tech_name,
          brand: tech1Data.brand,
          tech_image: tech1Data.tech_image,
          rating: tech1Data.rating,
          category: tech1Data.category
        },
        tech2: {
          id_tech: tech2Data.id_tech,
          tech_name: tech2Data.tech_name,
          brand: tech2Data.brand,
          tech_image: tech2Data.tech_image,
          rating: tech2Data.rating,
          category: tech2Data.category
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

// Get all comparisons (public)
async function getAllComparisons(req, res) {
  try {
    const comparisons = await prisma.comparison.findMany({
      where: { deleted_at: null },
      select: {
        id_detail: true,
        id_tech: true,
        compared_with: true,
        created_at: true,
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
        },
      }
    });

    // Fetch compared technology details for each comparison
    const comparisonsWithBothTech = await Promise.all(comparisons.map(async (comp) => {
      const comparedTechnology = await prisma.technology.findUnique({
        where: { id_tech: comp.compared_with, deleted_at: null },
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
      });
      return { ...comp, compared_technology: comparedTechnology };
    }));

    res.status(200).json({
      success: true,
      message: "Daftar perbandingan berhasil diambil",
      data: comparisonsWithBothTech
    });
  } catch (error) {
    console.error("getAllComparisons error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil daftar perbandingan"
    });
  }
}

// Get comparison by ID (public)
async function getComparisonById(req, res) {
  try {
    const { id } = req.params;

    const comparison = await prisma.comparison.findUnique({
      where: { id_detail: id, deleted_at: null },
      select: {
        id_detail: true,
        id_tech: true,
        compared_with: true,
        created_at: true,
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
        },
      }
    });

    if (!comparison) {
      throw new Error("Perbandingan tidak ditemukan");
    }

    // Fetch compared technology details
    const comparedTechnology = await prisma.technology.findUnique({
      where: { id_tech: comparison.compared_with, deleted_at: null },
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
    });

    res.status(200).json({
      success: true,
      message: "Perbandingan berhasil diambil",
      data: { ...comparison, compared_technology: comparedTechnology }
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

    const { id_tech, compared_with } = req.body;

    if (!id_tech || !compared_with) {
      throw new Error("ID kedua teknologi harus diisi");
    }

    // Check if both technologies exist
    const technologies = await prisma.technology.findMany({
      where: {
        id_tech: {
          in: [id_tech, compared_with]
        },
        deleted_at: null
      }
    });

    if (technologies.length !== 2) {
      throw new Error("Satu atau kedua teknologi tidak ditemukan");
    }

    const newComparison = await prisma.comparison.create({
      data: {
        id_tech,
        compared_with
      },
      select: {
        id_detail: true,
        id_tech: true,
        compared_with: true,
        created_at: true,
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

    // Fetch compared technology details for the newly created comparison
    const comparedTechnology = await prisma.technology.findUnique({
      where: { id_tech: newComparison.compared_with, deleted_at: null },
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
    });

    res.status(201).json({
      success: true,
      message: "Perbandingan berhasil dibuat",
      data: { ...newComparison, compared_technology: comparedTechnology }
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
    const { id_tech, compared_with } = req.body;

    // Check if comparison exists
    const existingComparison = await prisma.comparison.findUnique({
      where: { id_detail: id }
    });

    if (!existingComparison) {
      throw new Error("Perbandingan tidak ditemukan");
    }

    // Check if both technologies exist
    if (id_tech || compared_with) {
      const techIds = [id_tech || existingComparison.id_tech, compared_with || existingComparison.compared_with];
      const technologies = await prisma.technology.findMany({
        where: {
          id_tech: {
            in: techIds
          },
          deleted_at: null
        }
      });

      if (technologies.length !== 2) {
        throw new Error("Satu atau kedua teknologi tidak ditemukan");
      }
    }

    let updateData = {};
    
    // Only include fields that are provided in the request
    if (id_tech !== undefined) updateData.id_tech = id_tech;
    if (compared_with !== undefined) updateData.compared_with = compared_with;

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
        id_tech: true,
        compared_with: true,
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

    // Fetch compared technology details for the updated comparison
    const comparedTechnology = await prisma.technology.findUnique({
      where: { id_tech: updatedComparison.compared_with, deleted_at: null },
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
    });

    res.status(200).json({
      success: true,
      message: "Perbandingan berhasil diupdate",
      data: { ...updatedComparison, compared_technology: comparedTechnology }
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
        id_tech: true,
        compared_with: true,
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

    // Fetch compared technology details for the deleted comparison
    const comparedTechnology = await prisma.technology.findUnique({
      where: { id_tech: deletedComparison.compared_with, deleted_at: null },
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
    });

    res.status(200).json({
      success: true,
      message: "Perbandingan berhasil dihapus",
      data: { ...deletedComparison, compared_technology: comparedTechnology }
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