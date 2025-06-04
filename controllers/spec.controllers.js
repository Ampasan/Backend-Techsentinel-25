const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all specs
async function getAllSpecs(req, res) {
  try {
    const specs = await prisma.spec.findMany({
      where: { deleted_at: null },
      include: {
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
      message: "Daftar spesifikasi berhasil diambil",
      data: specs
    });
  } catch (error) {
    console.error("getAllSpecs error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil daftar spesifikasi"
    });
  }
}

// Get spec by ID
async function getSpecById(req, res) {
  try {
    const { id } = req.params;

    const spec = await prisma.spec.findUnique({
      where: { id_spec: id },
      include: {
        technology: {
          select: {
            tech_name: true,
            brand: true
          }
        }
      }
    });

    if (!spec) {
      throw new Error("Spesifikasi tidak ditemukan");
    }

    res.status(200).json({
      success: true,
      message: "Spesifikasi berhasil diambil",
      data: spec
    });
  } catch (error) {
    console.error("getSpecById error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengambil data spesifikasi"
    });
  }
}

// Create new spec
async function createSpec(req, res) {
  try {
    const {
      id_tech,
      ram,
      storage,
      baterai,
      camera,
      prosesor,
      sistem_operasi,
      ukuran_layar,
      resolusi_layar,
      refresh_rate,
      price
    } = req.body;

    // Validate required fields
    if (!id_tech || !ram || !storage || !baterai || !camera || !prosesor || 
        !sistem_operasi || !ukuran_layar || !resolusi_layar || !refresh_rate || !price) {
      throw new Error("Semua field harus diisi");
    }

    const spec = await prisma.spec.create({
      data: {
        id_tech,
        ram,
        storage,
        baterai,
        camera,
        prosesor,
        sistem_operasi,
        ukuran_layar,
        resolusi_layar,
        refresh_rate,
        price: parseInt(price)
      },
      include: {
        technology: {
          select: {
            tech_name: true,
            brand: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Spesifikasi berhasil dibuat",
      data: spec
    });
  } catch (error) {
    console.error("createSpec error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal membuat spesifikasi"
    });
  }
}

// Update spec
async function updateSpec(req, res) {
  try {
    const { id } = req.params;
    const {
      ram,
      storage,
      baterai,
      camera,
      prosesor,
      sistem_operasi,
      ukuran_layar,
      resolusi_layar,
      refresh_rate,
      price
    } = req.body;

    const updateData = {};
    if (ram) updateData.ram = ram;
    if (storage) updateData.storage = storage;
    if (baterai) updateData.baterai = baterai;
    if (camera) updateData.camera = camera;
    if (prosesor) updateData.prosesor = prosesor;
    if (sistem_operasi) updateData.sistem_operasi = sistem_operasi;
    if (ukuran_layar) updateData.ukuran_layar = ukuran_layar;
    if (resolusi_layar) updateData.resolusi_layar = resolusi_layar;
    if (refresh_rate) updateData.refresh_rate = refresh_rate;
    if (price) updateData.price = parseInt(price);

    const updatedSpec = await prisma.spec.update({
      where: { id_spec: id },
      data: updateData,
      include: {
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
      message: "Spesifikasi berhasil diupdate",
      data: updatedSpec
    });
  } catch (error) {
    console.error("updateSpec error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal mengupdate spesifikasi"
    });
  }
}

// Delete spec (soft delete)
async function deleteSpec(req, res) {
  try {
    const { id } = req.params;

    await prisma.spec.update({
      where: { id_spec: id },
      data: { deleted_at: new Date() }
    });

    res.status(200).json({
      success: true,
      message: "Spesifikasi berhasil dihapus"
    });
  } catch (error) {
    console.error("deleteSpec error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Gagal menghapus spesifikasi"
    });
  }
}

module.exports = {
  getAllSpecs,
  getSpecById,
  createSpec,
  updateSpec,
  deleteSpec
};
