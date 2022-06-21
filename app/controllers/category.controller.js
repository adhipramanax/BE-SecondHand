const { Category } = require('../models')
const responseFormatter = require('../helpers/responseFormatter');

class categoryController{
  static getAllCategory = async (req, res) => {
    try {
      const category = await Category.findAll();

      res.status(200).json(responseFormatter.success(category, "Berhasil mengambil semua kategori", res.statusCode));
    } catch (error) {
      res.status(500).json(responseFormatter.error(null, error.message, res.statusCode))
    }
  }
}

module.exports = categoryController;