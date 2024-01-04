#! /usr/bin/env node
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */

console.log(
  'This script populates superhero-themed categories and items to your database. Specified database as argument - e.g.: populatedb "mongodb+srv://youruser:yourpassword@yourcluster.mongodb.net/heromart"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require("mongoose");
const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: Connecting to database");
  await mongoose.connect(mongoDB);
  console.log("Debug: Database connected");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
  const categoryDetail = { name, description };
  const category = new Category(categoryDetail);
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, description, price, stock, category) {
  const itemDetail = {
    name,
    description,
    price,
    stock,
    category
  };

  const item = new Item(itemDetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "Costumes and Armor",
      "For heroes who rely on their iconic suits, whether for stealth, protection, or sheer style. This category includes everything from spandex suits to high-tech armor, catering to heroes from the nimble vigilante to the armored warrior. Whether it's for blending into the shadows or withstanding heavy attacks, these outfits are designed for functionality and flair."
    ),
    categoryCreate(
      1,
      "Gadgets and Tools",
      "Essential for the tech-savvy hero or the detective type. This category features a range of gadgets, from grappling hooks to advanced communication devices. Perfect for heroes who rely on their wits and technological prowess to outmaneuver villains."
    ),
    categoryCreate(
      2,
      "Mystical Artifacts",
      "For those who draw their power from the mystical and the arcane. This category includes enchanted items like magic wands, ancient tomes, and mystical amulets. It caters to sorcerers, witches, and any hero whose power source is the mystic arts."
    ),
    categoryCreate(
      3,
      "Superhuman Enhancements",
      "Designed for heroes whose abilities come from advanced science or alien technology. This category offers a variety of serums, power suits, and bio-enhancements. It's for heroes who seek to augment their physical or mental capabilities beyond human limits."
    ),
    categoryCreate(
      4,
      "Utility Wear",
      "Practical gear for the everyday hero. This category includes items like utility belts, multi-functional boots, and all-weather capes. It's for heroes who need to be prepared for anything, with gear that's as versatile as they are."
    )
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      0,
      "Stealth Suit",
      "A sleek, black suit designed for silent movement and invisibility in low light. Ideal for nocturnal vigilantes.",
      150000,
      5,
      categories[0]._id
    ),
    itemCreate(
      1,
      "Nano-Tech Armor",
      "A suit made of nanotechnology that can adapt to different environmental conditions and attacks, providing optimal defense.",
      250000,
      3,
      categories[0]._id
    ),
    itemCreate(
      2,
      "Regenerative Outfit",
      "A costume with self-repairing fibers, perfect for heroes who face heavy combat and need quick recovery.",
      120000,
      4,
      categories[0]._id
    ),
    itemCreate(
      3,
      "Gravitational Grappling Gun",
      "A high-tech grappling tool that uses gravity manipulation to provide swift vertical or horizontal movement.",
      80000,
      10,
      categories[1]._id
    ),
    itemCreate(
      4,
      "Holographic Multi-Tool",
      "A device capable of projecting various tools and objects holographically, each with functional physical properties.",
      70000,
      8,
      categories[1]._id
    ),
    itemCreate(
      5,
      "Quantum Communicator",
      "A communication device that uses quantum entanglement, allowing secure and instant communication across vast distances.",
      120000,
      6,
      categories[1]._id
    ),
    itemCreate(
      6,
      "Chrono Pendant",
      "An ancient necklace that grants the wearer limited time manipulation abilities, such as brief time pauses or rewinds.",
      95000,
      2,
      categories[2]._id
    ),
    itemCreate(
      7,
      "Elixir of Clairvoyance",
      "A rare potion providing temporary psychic abilities like telepathy or precognition.",
      50000,
      15,
      categories[2]._id
    ),
    itemCreate(
      8,
      "Wand of Elemental Control",
      "A magical wand that allows the user to summon and control elemental forces like fire, water, air, and earth.",
      110000,
      3,
      categories[2]._id
    ),
    itemCreate(
      9,
      "Hyper-Strength Serum",
      "A scientifically formulated serum that temporarily boosts physical strength to superhuman levels.",
      60000,
      20,
      categories[3]._id
    ),
    itemCreate(
      10,
      "Neural Enhancer Helmet",
      "A helmet that enhances brain function, increasing intelligence, memory, and processing speed.",
      130000,
      5,
      categories[3]._id
    ),
    itemCreate(
      11,
      "Adaptive Exoskeleton",
      "A wearable exoskeleton that enhances the user's speed, agility, and strength, adapting to their movement style.",
      180000,
      2,
      categories[3]._id
    ),
    itemCreate(
      12,
      "Multi-Pocket Utility Belt",
      "A belt with various compartments holding essential tools, from lock picks to miniaturized medical kits.",
      45000,
      12,
      categories[4]._id
    ),
    itemCreate(
      13,
      "All-Terrain Tactical Boots",
      "Boots designed for extreme durability and adaptability, providing excellent traction and support in various environments.",
      75000,
      7,
      categories[4]._id
    ),
    itemCreate(
      14,
      "Weather-Resistant Cape",
      "A cape made from advanced materials, offering protection from extreme weather and temperatures while maintaining flexibility and style.",
      50000,
      9,
      categories[4]._id
    )
  ]);
}
