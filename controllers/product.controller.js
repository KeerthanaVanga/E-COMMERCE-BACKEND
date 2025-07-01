import Product from "../models/product.model.js";

const listProducts = async (req, res) => {
  try {
    const { type, category, subCategory } = req.query;

    const query = {};

    if (type) {
      const typeArray = Array.isArray(type) ? type : [type];
      query.productType = { $in: typeArray };
    }

    // Filter by category inside attributes
    if (category) {
      const categoryArray = Array.isArray(category) ? category : [category];
      query["attributes.category"] = { $in: categoryArray };
    }

    // Filter by subCategory only if provided
    if (subCategory) {
      const subCategoryArray = Array.isArray(subCategory)
        ? subCategory
        : [subCategory];
      query["attributes.subCategory"] = { $in: subCategoryArray };
    }

    const products = await Product.find(query);
    res.json({ success: true, products });
  } catch (err) {
    console.error("Filter API Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const totalReviews = product.reviews.length;
    const averageRating =
      totalReviews > 0
        ? (
            product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            totalReviews
          ).toFixed(1)
        : 0;

    res.json({
      success: true,
      product: {
        ...product.toObject(),
        totalReviews,
        averageRating,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchProduct = async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res
      .status(400)
      .json({ success: false, message: "Search term required" });
  }

  try {
    const products = await Product.find({
      name: { $regex: search, $options: "i" },
    }).select("name _id");

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const relatedProducts = async (req, res) => {
  try {
    const { category, productType, subCategory } = req.params;

    const query = {
      "attributes.category": category,
      productType: productType,
    };

    if (subCategory) {
      query["attributes.subCategory"] = subCategory;
    }

    const products = await Product.find(query);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};

const bestSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ bestSeller: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const latestCollectionProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 }) // Newest first
      .limit(10);

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const productReviews = async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res
      .status(400)
      .json({ success: false, message: "Rating and comment are required" });
  }

  const product = await Product.findById(req.params.id);
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
  });

  await product.save();
  res.json({ success: true, message: "Review added successfully" });
};

export {
  listProducts,
  singleProduct,
  relatedProducts,
  bestSellerProducts,
  latestCollectionProducts,
  searchProduct,
  productReviews,
};
