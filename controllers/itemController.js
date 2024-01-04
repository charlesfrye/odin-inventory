const asyncHandler = require("express-async-handler");
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
  res.send("NOT IMPLEMENTED: Item add GET");
});

exports.item_add_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED: Item add POST");
});

exports.item_update_get = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED: Item update GET");
});

exports.item_update_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED: Item update POST");
});

exports.item_delete_get = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
});

exports.item_delete_post = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
});
