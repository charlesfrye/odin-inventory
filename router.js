const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const router = express.Router();

router.use(expressLayouts);

const categoryController = require("./controllers/categoryController");

router.get("/categories", categoryController.category_list);

router.get("/categories/create/", categoryController.category_add_get);
router.post("/categories/create/", categoryController.category_add_post);

router.get("/categories/:id/update", categoryController.category_update_get);
router.post("/categories/:id/update", categoryController.category_update_post);

router.post("/categories/:id/delete", categoryController.category_delete_post);

router.get("/categories/:id", categoryController.category_get);

const itemController = require("./controllers/itemController");

router.get("/items", itemController.item_list);
router.get("/items/:id", itemController.item_get);

router.get("/items/create", itemController.item_add_get);
router.post("/items/create", itemController.item_add_post);

router.get("/items/:id/update", itemController.item_update_get);
router.post("/items/:id/update", itemController.item_update_post);

router.get("/items/:id/delete", itemController.item_delete_get);
router.post("/items/:id/delete", itemController.item_delete_post);

module.exports = router;
