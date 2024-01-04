const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Category = require("../models/category");
const Item = require("../models/item");

exports.item_list = asyncHandler(async (req, res) => {
  const items = await Item.find()
    .populate("category")
    .sort([["category.name", "ascending"]]);
  res.render("items", { title: "Items", items });
});

exports.item_get = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate("category");
  res.render("item", { title: item.name, item });
});

exports.item_add_get = asyncHandler(async (req, res) => {
  const allCategories = await Category.find();
  res.render("item_form", {
    title: "Add Item",
    errors: [],
    item: { category: {} },
    categories: allCategories
  });
});

exports.item_add_post = [
  body("name", "Name must be between 3 and 100 characters")
    .trim()
    .isLength({ min: 3, max: 100 }),
  body("description", "Description must be between 3 and 3000 characters")
    .trim()
    .isLength({ min: 3, max: 3000 }),
  body("category", "Category must be specified")
    .trim()
    .isLength({ min: 1 })
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new Error("Invalid category");
      }
      return true;
    }),
  body("price", "Price must be a number ≥ 0")
    .trim()
    .isFloat({ min: 0 })
    .toFloat(),
  body("stock", "Stock must be a round number ≥ 0")
    .trim()
    .isInt({ min: 0 })
    .toInt(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const priceInCents = Math.round(req.body.price * 100);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: priceInCents,
      stock: req.body.stock
    });
    if (!errors.isEmpty()) {
      res.render("item_form", {
        title: "Add Item",
        item,
        errors: errors.array(),
        categories: await Category.find()
      });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  })
];

exports.item_update_get = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate("category");
  const allCategories = await Category.find();
  res.render("item_form", {
    title: "Update Item",
    item,
    errors: [],
    categories: allCategories
  });
});

exports.item_update_post = [
  body("name", "Name must be between 3 and 100 characters")
    .trim()
    .isLength({ min: 3, max: 100 }),
  body("description", "Description must be between 3 and 3000 characters")
    .trim()
    .isLength({ min: 3, max: 3000 }),
  body("category", "Category must be specified")
    .trim()
    .isLength({ min: 1 })
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new Error("Invalid category");
      }
      return true;
    }),
  body("price", "Price must be a number ≥ 0")
    .trim()
    .isFloat({ min: 0 })
    .toFloat(),
  body("stock", "Stock must be a round number ≥ 0")
    .trim()
    .isInt({ min: 0 })
    .toInt(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const item = await Item.findById(req.params.id);
    const priceInCents = Math.round(req.body.price * 100);

    item.name = req.body.name;
    item.description = req.body.description;
    item.category = req.body.category;
    item.price = priceInCents;
    item.stock = req.body.stock;

    if (!errors.isEmpty()) {
      res.render("item_form", {
        title: "Add Item",
        item,
        errors: errors.array(),
        categories: await Category.find()
      });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  })
];

exports.item_delete_post = asyncHandler(async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect("/inventory/items");
});
