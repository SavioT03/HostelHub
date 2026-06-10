const express = require('express')
const userController = require('../controllers/userController')
const propertyController = require("../controllers/propertyController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");
const multer = require("multer");
const path = require("path");

const router = new express.Router()

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Auth
router.post("/auth/register", userController.registerController);
router.post("/auth/login", userController.loginController);

// Profile
router.get("/profile/:id", verifyToken, userController.getProfile);
router.put("/profile/:id", verifyToken, userController.updateProfile);

// Image upload
router.post("/upload", verifyToken, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ success: true, imageUrl });
});

// ─── STATIC property routes MUST come before dynamic /:ownerId / /:id ───────

// Public: approved properties list
router.get("/properties/approved", propertyController.getApprovedProperties);

// Public: featured properties
router.get("/properties/featured", propertyController.getFeaturedProperties);

// Public: single property detail
router.get("/properties/detail/:id", propertyController.getPropertyById);

// Owner: add property
router.post("/properties/add", verifyToken, requireRole("owner"), propertyController.createProperty);

// ─── dynamic routes those with ':'

// Owner: list own properties  (/:ownerId must come AFTER /approved and /add)
router.get("/properties/:ownerId", verifyToken, propertyController.getOwnerProperties);

// Owner: delete / update property
router.delete("/properties/:id", verifyToken, requireRole("owner"), propertyController.deleteProperty);
router.put("/properties/:id", verifyToken, requireRole("owner"), propertyController.updateProperty);

// ─── Saved properties (user only)
router.get("/users/:userId/saved", verifyToken, requireRole("user"), userController.getSavedProperties);
router.post("/users/:userId/saved/:propertyId", verifyToken, requireRole("user"), userController.saveProperty);
router.delete("/users/:userId/saved/:propertyId", verifyToken, requireRole("user"), userController.unsaveProperty);

// ─── Admin routes 

//user management
router.get("/admin/users", verifyToken, requireRole("admin"), adminController.getAllUsers);
router.delete("/admin/users/:id", verifyToken, requireRole("admin"), adminController.deleteUser);

//property management
router.get("/admin/properties", verifyToken, requireRole("admin"), adminController.getAllProperties);
router.delete("/admin/properties/:id", verifyToken, requireRole("admin"), adminController.deleteProperty);

//featured
router.put("/admin/properties/:id/featured", verifyToken, requireRole("admin"), adminController.toggleFeatured);
router.put("/admin/properties/:id/status", verifyToken, requireRole("admin"), adminController.updatePropertyStatus);



module.exports = router
