const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const { Readable } = require("stream");
const { pipeline } = require("stream/promises");

const Product = require("../models/Product");

const router = express.Router();

// GET products from MongoDB
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products: products.map((product) => ({
        ...product.toObject(),
        imageUrl: `/api/products/${product._id}/image`,
      })),
    });
  } catch (error) {
    console.error("products fetching error: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Fetch external products and save images in GridFS
router.post("/sync", async (req, res) => {
  try {
    const response = await axios.get("https://dummyjson.com/products?limit=5", {
      timeout: 15000,
    });

    const products = response.data.products;

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "productImages",
    });

    let savedCount = 0;

    for (const item of products) {
      // Avoid duplicate products
      const existing = await Product.findOne({
        externalId: item.id,
      });

      if (existing) continue;

      // Download actual image bytes
      const imageResponse = await axios.get(item.thumbnail, {
        responseType: "arraybuffer",
        timeout: 15000,
      });

      const imageBuffer = Buffer.from(imageResponse.data);

      const contentType = imageResponse.headers["content-type"] || "image/jpeg";

      // Store image in MongoDB GridFS
      const uploadStream = bucket.openUploadStream(`product-${item.id}`, {
        metadata: {
          externalId: item.id,
          contentType,
        },
      });

      await pipeline(Readable.from(imageBuffer), uploadStream);

      // Save product details in MongoDB
      await Product.create({
        externalId: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        imageFileId: uploadStream.id,
        imageContentType: contentType,
      });

      savedCount++;
    }

    res.status(200).json({
      success: true,
      message: "Products synchronized successfully",
      fetched: products.length,
      saved: savedCount,
    });
  } catch (error) {
    console.error("Product sync error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Fetch image from MongoDB GridFS
router.get("/:id/image", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "productImages",
    });

    res.set("Content-Type", product.imageContentType);
    res.set("Cache-Control", "public, max-age=3600");

    const downloadStream = bucket.openDownloadStream(product.imageFileId);

    downloadStream.on("error", () => {
      if (!res.headersSent) {
        res.status(404).json({
          message: "Image not found",
        });
      } else {
        res.destroy();
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
