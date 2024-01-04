const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Category = require("../models/category");
const Item = require("../models/item");

exports.category_list = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort([["name", "ascending"]]);
  res.render("categories", {
    title: "Categories",
    categories
  });
});

exports.category_get = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  const allItemsInCategory = await Item.find({ category: req.params.id });
  res.render("category", {
    title: category.name,
    items: allItemsInCategory,
    category
  });
});

exports.category_add_get = asyncHandler(async (req, res) => {
  res.render("category_form", {
    title: "Add Category",
    errors: [],
    category: {}
  });
});

exports.category_add_post = [
  body("name", "Category name must be between 3 and 100 characters")
    .trim()
    .isLength({ min: 3, max: 100 }),
  body(
    "description",
    "Category description must be between 3 and 3000 characters"
  )
    .trim()
    .isLength({ min: 3, max: 3000 }),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Add Category",
        category,
        errors: errors.array()
      });
    } else {
      await category.save();
      res.redirect(category.url);
    }
  })
];

exports.category_update_get = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render("category_form", {
    title: "Update Category",
    category,
    errors: []
  });
});

exports.category_update_post = [
  body("name", "Category name must be between 3 and 100 characters")
    .trim()
    .isLength({ min: 3, max: 100 }),
  body(
    "description",
    "Category description must be between 3 and 3000 characters"
  )
    .trim()
    .isLength({ min: 3, max: 3000 }),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const category = await Category.findById(req.params.id);

    category.name = req.body.name;
    category.description = req.body.description;

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Add Category",
        category,
        errors: errors.array()
      });
    } else {
      await category.save();
      res.redirect(category.url);
    }
  })
];

exports.category_delete_post = asyncHandler(async (req, res) => {
  await Promise.all([
    Item.deleteMany({ category: req.params.id }),
    Category.findByIdAndDelete(req.params.id)
  ]);
  res.redirect("/inventory/categories");
});
