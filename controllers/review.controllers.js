const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all reviews
async function getAllReviews(req, res) {
  try {
    const reviews = await prisma.review.findMany({
      where: { deleted_at: null },
      include: {
        user: {
          select: {
            user_name: true,
            profile_picture: true
          }
        },
        technology: {
          select: {
            tech_name: true,
            brand: true
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

// Get review by ID
async function getReviewById(req, res) {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id_review: id },
      include: {
        user: {
          select: {
            user_name: true,
            profile_picture: true
          }
        },
        technology: {
          select: {
            tech_name: true,
            brand: true
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

// Create new review
async function createReview(req, res) {
  try {
    const { id_tech, rating, comment } = req.body;
    const id_user = req.user.id_user; // Get id_user from authenticated user

    // Validate required fields
    if (!id_tech || !rating || !comment) {
      throw new Error("Semua field harus diisi");
    }

    // Validate rating range (1-5)
    if (rating < 1 || rating > 5) {
      throw new Error("Rating harus antara 1-5");
    }

    const review = await prisma.review.create({
      data: {
        id_user,
        id_tech,
        rating: parseFloat(rating),
        comment
      },
      include: {
        user: {
          select: {
            user_name: true,
            profile_picture: true
          }
        },
        technology: {
          select: {
            tech_name: true,
            brand: true
          }
        }
      }
    });

    // Update technology average rating
    const techReviews = await prisma.review.findMany({
      where: { id_tech, deleted_at: null }
    });

    const avgRating = techReviews.reduce((acc, curr) => acc + parseFloat(curr.rating), 0) / techReviews.length;

    await prisma.technology.update({
      where: { id_tech },
      data: { rating: avgRating }
    });

    res.status(201).json({
      success: true,
      message: "Review berhasil dibuat",
      data: review
    });
  } catch (error) {
    console.error("createReview error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal membuat review"
    });
  }
}

// Update review
async function updateReview(req, res) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const updateData = {};
    if (rating) {
      if (rating < 1 || rating > 5) {
        throw new Error("Rating harus antara 1-5");
      }
      updateData.rating = parseFloat(rating);
    }
    if (comment) updateData.comment = comment;

    const updatedReview = await prisma.review.update({
      where: { id_review: id },
      data: updateData,
      include: {
        user: {
          select: {
            user_name: true,
            profile_picture: true
          }
        },
        technology: {
          select: {
            tech_name: true,
            brand: true
          }
        }
      }
    });

    // Update technology average rating
    const techReviews = await prisma.review.findMany({
      where: { id_tech: updatedReview.id_tech, deleted_at: null }
    });

    const avgRating = techReviews.reduce((acc, curr) => acc + parseFloat(curr.rating), 0) / techReviews.length;

    await prisma.technology.update({
      where: { id_tech: updatedReview.id_tech },
      data: { rating: avgRating }
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

// Delete review (soft delete)
async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id_review: id }
    });

    await prisma.review.update({
      where: { id_review: id },
      data: { deleted_at: new Date() }
    });

    // Update technology average rating
    const techReviews = await prisma.review.findMany({
      where: { id_tech: review.id_tech, deleted_at: null }
    });

    if (techReviews.length > 0) {
      const avgRating = techReviews.reduce((acc, curr) => acc + parseFloat(curr.rating), 0) / techReviews.length;

      await prisma.technology.update({
        where: { id_tech: review.id_tech },
        data: { rating: avgRating }
      });
    } else {
      await prisma.technology.update({
        where: { id_tech: review.id_tech },
        data: { rating: 0 }
      });
    }

    res.status(200).json({
      success: true,
      message: "Review berhasil dihapus"
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
