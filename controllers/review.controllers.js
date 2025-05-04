const { PrismaClient } = require("@prisma/client");
const uploadToCloudinary = require("../utils/upload-to-cloudinary.js");

const prisma = new PrismaClient();

// Get all reviews (for regular users and admin)
async function getAllReviews(req, res) {
  try {
    const reviews = await prisma.review.findMany({
      where: { deleted_at: null },
      select: {
        id_review: true,
        title_review: true,
        content: true,
        rating: true,
        thumbnail: true,
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
        user: {
          select: {
            id_user: true,
            user_name: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Daftar review berhasil diambil",
      data: reviews
    });
  } catch (error) {
    console.error("getAllReviews error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil daftar review"
    });
  }
}

// Get review by ID (for regular users and admin)
async function getReviewById(req, res) {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id_review: id },
      select: {
        id_review: true,
        title_review: true,
        content: true,
        rating: true,
        thumbnail: true,
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
        user: {
          select: {
            id_user: true,
            user_name: true
          }
        }
      }
    });

    if (!review) {
      throw new Error("Review tidak ditemukan");
    }

    res.status(200).json({
      success: true,
      message: "Review berhasil diambil",
      data: review
    });
  } catch (error) {
    console.error("getReviewById error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil data review"
    });
  }
}

// Create new review (admin only)
async function createReview(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { title_review, content, id_tech, id_user, rating } = req.body;

    if (!title_review || !content || !id_tech || !id_user || !rating) {
      throw new Error("Semua field harus diisi");
    }

    // Validate rating is between 0 and 5
    if (rating < 0 || rating > 5) {
      throw new Error("Rating harus antara 0 sampai 5");
    }

    let thumbnail = null;
    if (req.file && req.file.buffer) {
      thumbnail = await uploadToCloudinary(
        req.file.buffer,
        "thumbnail",
        req.file.originalname
      );
    }

    const newReview = await prisma.review.create({
      data: {
        title_review,
        content,
        id_tech,
        id_user,
        rating,
        thumbnail
      },
      select: {
        id_review: true,
        title_review: true,
        content: true,
        rating: true,
        thumbnail: true,
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
        user: {
          select: {
            id_user: true,
            user_name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Review berhasil dibuat",
      data: newReview
    });
  } catch (error) {
    console.error("createReview error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal membuat review baru"
    });
  }
}

// Update review (admin only)
async function updateReview(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;
    const { title_review, content, id_tech, id_user, rating } = req.body;

    if (!title_review || !content || !id_tech || !id_user || !rating) {
      throw new Error("Semua field harus diisi");
    }

    // Validate rating is between 0 and 5
    if (rating < 0 || rating > 5) {
      throw new Error("Rating harus antara 0 sampai 5");
    }

    let updateData = {
      title_review,
      content,
      id_tech,
      id_user,
      rating
    };

    if (req.file && req.file.buffer) {
      const thumbnail = await uploadToCloudinary(
        req.file.buffer,
        "thumbnail",
        req.file.originalname
      );
      updateData.thumbnail = thumbnail;
    }

    const updatedReview = await prisma.review.update({
      where: { id_review: id },
      data: updateData,
      select: {
        id_review: true,
        title_review: true,
        content: true,
        rating: true,
        thumbnail: true,
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
        user: {
          select: {
            id_user: true,
            user_name: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Review berhasil diupdate",
      data: updatedReview
    });
  } catch (error) {
    console.error("updateReview error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengupdate review"
    });
  }
}

// Delete review (admin only) - soft delete
async function deleteReview(req, res) {
  try {
    // Check if user is admin
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;

    const deletedReview = await prisma.review.update({
      where: { id_review: id },
      data: { deleted_at: new Date() },
      select: {
        id_review: true,
        title_review: true,
        content: true,
        thumbnail: true,
        created_at: true,
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
        },
        user: {
          select: {
            id_user: true,
            user_name: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Review berhasil dihapus",
      data: deletedReview
    });
  } catch (error) {
    console.error("deleteReview error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal menghapus review"
    });
  }
}

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};