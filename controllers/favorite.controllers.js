const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Add technology to favorites
async function addToFavorites(req, res) {
  try {
    const { id_tech } = req.params;
    const userId = req.user.id_user;

    // Check if technology exists
    const technology = await prisma.technology.findUnique({
      where: { id_tech }
    });

    if (!technology) {
      throw new Error("Teknologi tidak ditemukan");
    }

    // Check if user already has a favorite list
    let favorite = await prisma.favorite.findFirst({
      where: {
        id_user: userId,
        deleted_at: null
      }
    });

    // If no favorite list exists, create one
    if (!favorite) {
      favorite = await prisma.favorite.create({
        data: {
          id_user: userId
        }
      });
    }

    // Check if technology is already in favorites
    const existingTechFavorite = await prisma.tech_favorite.findUnique({
      where: {
        id_favorite_id_tech: {
          id_favorite: favorite.id_favorite,
          id_tech
        }
      }
    });

    if (existingTechFavorite) {
      throw new Error("Teknologi sudah ada di daftar favorit");
    }

    // Add technology to favorites
    await prisma.tech_favorite.create({
      data: {
        id_favorite: favorite.id_favorite,
        id_tech
      }
    });

    // Get updated favorite list with more technology details
    const updatedFavorite = await prisma.favorite.findUnique({
      where: { id_favorite: favorite.id_favorite },
      select: {
        id_favorite: true,
        created_at: true,
        techFavorites: {
          select: {
            technology: {
              select: {
                id_tech: true,
                tech_name: true,
                brand: true,
                rating: true,
                tech_image: true,
                review: true,
                description_tech: true,
                category: {
                  select: {
                    id_category: true,
                    category_name: true,
                    icon_category: true
                  }
                }
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Teknologi berhasil ditambahkan ke favorit",
      data: updatedFavorite
    });
  } catch (error) {
    console.error("addToFavorites error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal menambahkan ke favorit"
    });
  }
}

// Get user's favorites
async function getFavorites(req, res) {
  try {
    const userId = req.user.id_user;

    const favorite = await prisma.favorite.findFirst({
      where: { 
        id_user: userId,
        deleted_at: null
      },
      select: {
        id_favorite: true,
        techFavorites: {
          select: {
            technology: {
              select: {
                id_tech: true,
                tech_name: true,
                brand: true,
                rating: true,
                tech_image: true,
                review: true,
                description_tech: true,
                category: {
                  select: {
                    id_category: true,
                    category_name: true,
                    icon_category: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!favorite) {
      return res.status(200).json({
        success: true,
        message: "Daftar favorit kosong",
        data: { techFavorites: [] }
      });
    }

    res.status(200).json({
      success: true,
      message: "Daftar favorit berhasil diambil",
      data: favorite
    });
  } catch (error) {
    console.error("getFavorites error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil daftar favorit"
    });
  }
}

// Remove technology from favorites
async function removeFromFavorites(req, res) {
  try {
    const { id_tech } = req.params;
    const userId = req.user.id_user;

    // Find user's favorite list
    const favorite = await prisma.favorite.findFirst({
      where: {
        id_user: userId,
        deleted_at: null
      }
    });

    if (!favorite) {
      throw new Error("Daftar favorit tidak ditemukan");
    }

    // Find the tech_favorite entry
    const techFavorite = await prisma.tech_favorite.findUnique({
      where: {
        id_favorite_id_tech: {
          id_favorite: favorite.id_favorite,
          id_tech
        }
      }
    });

    if (!techFavorite) {
      throw new Error("Teknologi tidak ditemukan di daftar favorit");
    }

    // Remove the tech_favorite entry
    await prisma.tech_favorite.delete({
      where: {
        id_favorite_id_tech: {
          id_favorite: favorite.id_favorite,
          id_tech
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Teknologi berhasil dihapus dari favorit"
    });
  } catch (error) {
    console.error("removeFromFavorites error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal menghapus dari favorit"
    });
  }
}

module.exports = {
  addToFavorites,
  getFavorites,
  removeFromFavorites
};