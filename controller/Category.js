const Category = require("../models/category");
const Course = require("../models/course");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to create a category",
      });
    }

    // Prevent duplicate categories
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const categoryDetails = await Category.create({ name, description });

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: categoryDetails,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating category",
    });
  }
};

// Get All Categories
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({}, { name: true, description: true });

    return res.status(200).json({
      success: true,
      message: "All categories returned successfully",
      data: allCategories,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Cannot get all categories",
    });
  }
};

// Get Category Page Details
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    // Get courses for the selected category
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Get other categories (excluding selected one)
    const differentCategories = await Category.find({ _id: { $ne: categoryId } })
      .populate("courses")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Category page details fetched successfully",
      data: {
        selectedCategory,
        differentCategories,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching category details",
    });
  }
};
