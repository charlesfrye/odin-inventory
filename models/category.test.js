const mongoose = require("mongoose");
const Category = require("./category");

describe("Category Model Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create and save a category successfully", async () => {
    const validCategory = new Category({
      name: "Test Category",
      description: "This is a test description"
    });
    const savedCategory = await validCategory.save();

    expect(savedCategory._id).toBeDefined();
    expect(savedCategory.name).toBe(validCategory.name);
    expect(savedCategory.description).toBe(validCategory.description);
  });

  it("should fail to insert a category with missing required fields", async () => {
    const invalidCategory = new Category({});
    await expect(invalidCategory.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  it("should fail to insert a category with short name", async () => {
    const invalidCategory = new Category({
      name: "ab",
      description: "Valid Description"
    });
    await expect(invalidCategory.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  it("should fail to insert a category with long name", async () => {
    const invalidCategory = new Category({
      name: "a".repeat(101),
      description: "Valid Description"
    });
    await expect(invalidCategory.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  it("should fail to insert a category with short description", async () => {
    const invalidCategory = new Category({
      name: "Valid Name",
      description: "ab"
    });
    await expect(invalidCategory.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  it("should have a URL virtual field that returns the correct URL", () => {
    const category = new Category({
      name: "Virtual URL Category",
      description: "Testing the virtual URL"
    });

    expect(category.url).toBe(`/categories/${category._id}`);
  });
});
