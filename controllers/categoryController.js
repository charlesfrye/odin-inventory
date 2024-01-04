const asyncHandler = require("express-async-handler");
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
  res.render("category_form", { title: "Add Category" });
});

exports.category_add_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED: Category add POST");
});

exports.category_update_get = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED: Category update GET");
});

exports.category_update_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED: Category update POST");
});

exports.category_delete_get = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete GET");
});

exports.category_delete_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete POST");
});
