const { PrismaClient } = require("@prisma/client");
const uploadToCloudinary = require("../utils/upload-to-cloudinary.js");

const prisma = new PrismaClient();

// Search articles
async function searchArticles(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      throw new Error("Query pencarian harus diisi");
    }

    const articles = await prisma.article.findMany({
      where: {
        deleted_at: null,
        title_article: { contains: query, mode: "insensitive" }
      },
      select: {
        id_article: true,
        title_article: true,
        article_image: true,
        excerpt: true,
        created_at: true,
        user: {
          select: {
            user_name: true
          }
        },
        technology: {
          select: {
            category: {
              select: {
                category_name: true
              }
            }
          }
        }
      }
    });

    // Format response to match the example
    const result = articles.map(article => ({
      id: article.id_article,
      title: article.title_article,
      thumbnail: article.article_image,
      author: article.user.user_name,
      category: article.technology.category.category_name,
      date: article.created_at.toISOString().split('T')[0],
      excerpt: article.excerpt
    }));

    res.status(200).json({
      success: true,
      message: "Hasil pencarian artikel berhasil diambil",
      data: result
    });
  } catch (error) {
    console.error("searchArticles error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mencari artikel"
    });
  }
}

// Get all articles
async function getAllArticles(req, res) {
  try {
    const articles = await prisma.article.findMany({
      where: { deleted_at: null },
      select: {
        id_article: true,
        title_article: true,
        article_image: true,
        excerpt: true,
        created_at: true,
        user: {
          select: {
            user_name: true
          }
        },
        technology: {
          select: {
            category: {
              select: {
                category_name: true
              }
            }
          }
        }
      }
    });

    // Format response to match the example
    const result = articles.map(article => ({
      id: article.id_article,
      title: article.title_article,
      thumbnail: article.article_image,
      author: article.user.user_name,
      category: article.technology.category.category_name,
      date: article.created_at.toISOString().split('T')[0],
      excerpt: article.excerpt
    }));

    res.status(200).json({
      success: true,
      message: "Daftar artikel berhasil diambil",
      data: result
    });
  } catch (error) {
    console.error("getAllArticles error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil daftar artikel"
    });
  }
}

// Get article by ID
async function getArticleById(req, res) {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id_article: id },
      select: {
        id_article: true,
        title_article: true,
        article_image: true,
        intro: true,
        subTitle: true,
        subImage: true,
        subContent: true,
        subTitle2: true,
        subContent2: true,
        section2Title: true,
        section2Image: true,
        section2Content: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            user_name: true
          }
        },
        technology: {
          select: {
            tech_name: true,
            category: {
              select: {
                category_name: true
              }
            }
          }
        }
      }
    });

    if (!article) {
      throw new Error("Artikel tidak ditemukan");
    }

    // Format response to match the example
    const result = {
      id: article.id_article,
      title: article.title_article,
      image: article.article_image,
      intro: article.intro,
      subTitle: article.subTitle,
      subImage: article.subImage,
      subContent: article.subContent,
      subTitle2: article.subTitle2,
      subContent2: article.subContent2,
      section2Title: article.section2Title,
      section2Image: article.section2Image,
      section2Content: article.section2Content
    };

    res.status(200).json({
      success: true,
      message: "Artikel berhasil diambil",
      data: result
    });
  } catch (error) {
    console.error("getArticleById error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil data artikel"
    });
  }
}

// Create new article (admin only)
async function createArticle(req, res) {
  try {
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { 
      title_article,
      id_tech,
      excerpt,
      intro,
      subTitle,
      subContent,
      subTitle2,
      subContent2,
      section2Title,
      section2Content
    } = req.body;

    if (!title_article || !id_tech || !excerpt || !intro) {
      throw new Error("Field wajib harus diisi");
    }

    let article_image = null;
    let subImage = null;
    let section2Image = null;

    if (req.files) {
      if (req.files['article_image']) {
        article_image = await uploadToCloudinary(
          req.files['article_image'][0].buffer,
          "article_image",
          req.files['article_image'][0].originalname
        );
      }
      if (req.files['subImage']) {
        subImage = await uploadToCloudinary(
          req.files['subImage'][0].buffer,
          "sub_image",
          req.files['subImage'][0].originalname
        );
      }
      if (req.files['section2Image']) {
        section2Image = await uploadToCloudinary(
          req.files['section2Image'][0].buffer,
          "section2_image",
          req.files['section2Image'][0].originalname
        );
      }
    }

    const newArticle = await prisma.article.create({
      data: {
        title_article,
        id_tech,
        id_user: req.user.id_user,
        article_image,
        excerpt,
        intro,
        subTitle,
        subImage,
        subContent,
        subTitle2,
        subContent2,
        section2Title,
        section2Image,
        section2Content
      },
      select: {
        id_article: true,
        title_article: true,
        article_image: true,
        excerpt: true,
        intro: true,
        created_at: true,
        user: {
          select: {
            user_name: true
          }
        },
        technology: {
          select: {
            tech_name: true,
            category: {
              select: {
                category_name: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Artikel berhasil dibuat",
      data: newArticle
    });
  } catch (error) {
    console.error("createArticle error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal membuat artikel baru"
    });
  }
}

// Update article (admin only)
async function updateArticle(req, res) {
  try {
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;
    const { 
      title_article,
      id_tech,
      excerpt,
      intro,
      subTitle,
      subContent,
      subTitle2,
      subContent2,
      section2Title,
      section2Content
    } = req.body;

    const existingArticle = await prisma.article.findUnique({
      where: { id_article: id }
    });

    if (!existingArticle) {
      throw new Error("Artikel tidak ditemukan");
    }

    let updateData = {};
    
    if (title_article !== undefined) updateData.title_article = title_article;
    if (id_tech !== undefined) updateData.id_tech = id_tech;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (intro !== undefined) updateData.intro = intro;
    if (subTitle !== undefined) updateData.subTitle = subTitle;
    if (subContent !== undefined) updateData.subContent = subContent;
    if (subTitle2 !== undefined) updateData.subTitle2 = subTitle2;
    if (subContent2 !== undefined) updateData.subContent2 = subContent2;
    if (section2Title !== undefined) updateData.section2Title = section2Title;
    if (section2Content !== undefined) updateData.section2Content = section2Content;

    if (req.files) {
      if (req.files['article_image']) {
        updateData.article_image = await uploadToCloudinary(
          req.files['article_image'][0].buffer,
          "article_image",
          req.files['article_image'][0].originalname
        );
      }
      if (req.files['subImage']) {
        updateData.subImage = await uploadToCloudinary(
          req.files['subImage'][0].buffer,
          "sub_image",
          req.files['subImage'][0].originalname
        );
      }
      if (req.files['section2Image']) {
        updateData.section2Image = await uploadToCloudinary(
          req.files['section2Image'][0].buffer,
          "section2_image",
          req.files['section2Image'][0].originalname
        );
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("Tidak ada data yang diupdate");
    }

    updateData.updated_at = new Date();

    const updatedArticle = await prisma.article.update({
      where: { id_article: id },
      data: updateData,
      select: {
        id_article: true,
        title_article: true,
        article_image: true,
        excerpt: true,
        intro: true,
        updated_at: true,
        user: {
          select: {
            user_name: true
          }
        },
        technology: {
          select: {
            tech_name: true,
            category: {
              select: {
                category_name: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Artikel berhasil diupdate",
      data: updatedArticle
    });
  } catch (error) {
    console.error("updateArticle error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengupdate artikel"
    });
  }
}

// Delete article (admin only) - soft delete
async function deleteArticle(req, res) {
  try {
    if (req.user.level.name !== "admin") {
      throw new Error("Unauthorized: Hanya admin yang dapat mengakses");
    }

    const { id } = req.params;

    const deletedArticle = await prisma.article.update({
      where: { id_article: id },
      data: { deleted_at: new Date() },
      select: {
        id_article: true,
        title_article: true,
        deleted_at: true,
        user: {
          select: {
            user_name: true
          }
        },
        technology: {
          select: {
            tech_name: true,
            category: {
              select: {
                category_name: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Artikel berhasil dihapus",
      data: deletedArticle
    });
  } catch (error) {
    console.error("deleteArticle error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal menghapus artikel"
    });
  }
}

module.exports = {
  searchArticles,
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};