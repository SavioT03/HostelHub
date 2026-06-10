const Property = require("../database/models/Property");
const User = require("../database/models/User");

const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "Property submitted successfully",
        property,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOwnerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.params.ownerId });
    res.status(200).json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getApprovedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    const owner = await User.findById(property.ownerId).select(
      "firstName lastName phone",
    );
    res.status(200).json({
      success: true,
      property: {
        ...property.toObject(),
        ownerName: owner ? `${owner.firstName} ${owner.lastName}` : null,
        ownerPhone: owner?.phone || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Property updated successfully",
        property: updatedProperty,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved", featured: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProperty,
  getOwnerProperties,
  getApprovedProperties,
  getPropertyById,
  deleteProperty,
  updateProperty,
  getFeaturedProperties,
};
