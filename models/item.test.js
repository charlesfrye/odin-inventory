const mongoose = require("mongoose");
const Item = require("./item");

describe("Item Model Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should have a createdAt and updatedAt field", async () => {
    const item = new Item({
      name: "Sample Item",
      description: "Sample Description",
      category: new mongoose.Types.ObjectId(),
      price: 100,
      stock: 10
    });
    const savedItem = await item.save();

    expect(savedItem.createdAt).toBeDefined();
    expect(savedItem.updatedAt).toBeDefined();
  });

  it("should accept a valid item", async () => {
    const validItem = new Item({
      name: "Test Item",
      description: "This is a test description",
      category: new mongoose.Types.ObjectId(),
      price: 1000,
      stock: 50
    });
    const savedItem = await validItem.save();

    expect(savedItem._id).toBeDefined();
    expect(savedItem.name).toBe(validItem.name);
    expect(savedItem.description).toBe(validItem.description);
    expect(savedItem.category).toEqual(validItem.category);
    expect(savedItem.price).toBe(validItem.price);
    expect(savedItem.stock).toBe(validItem.stock);
  });

  it("should fail to insert an item with missing required fields", async () => {
    const invalidItem = new Item({});
    await expect(invalidItem.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  it("should fail to insert an item with short name", async () => {
    const invalidItem = new Item({
      name: "ab",
      description: "Valid Description",
      category: new mongoose.Types.ObjectId(),
      price: 1000,
      stock: 50
    });
    await expect(invalidItem.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  it("should fail to insert an item with long name", async () => {
    const invalidItem = new Item({
      name: "a".repeat(101),
      description: "Valid Description",
      category: new mongoose.Types.ObjectId(),
      price: 1000,
      stock: 50
    });
    await expect(invalidItem.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  it("should fail to insert an item with short description", async () => {
    const invalidItem = new Item({
      name: "Valid Name",
      description: "ab",
      category: new mongoose.Types.ObjectId(),
      price: 1000,
      stock: 50
    });
    await expect(invalidItem.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  it("should fail to insert an item with negative price", async () => {
    const invalidItem = new Item({
      name: "Valid Name",
      description: "Valid Description",
      category: new mongoose.Types.ObjectId(),
      price: -10,
      stock: 50
    });
    await expect(invalidItem.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  it("should fail to insert an item with non-integer stock", async () => {
    const invalidItem = new Item({
      name: "Valid Name",
      description: "Valid Description",
      category: new mongoose.Types.ObjectId(),
      price: 1000,
      stock: 3.5
    });
    await expect(invalidItem.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  it("should have a URL virtual field that returns the correct URL", () => {
    const item = new Item({
      name: "Virtual URL Item",
      description: "Testing the virtual URL",
      category: new mongoose.Types.ObjectId(),
      price: 1000,
      stock: 50
    });

    expect(item.url).toBe(`/items/${item._id}`);
  });
});
