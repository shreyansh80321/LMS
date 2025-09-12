const Lead = require("../models/Lead");
const { buildWhere } = require("../utils/filter.js");

exports.createLead = async (req, res) => {
  try {
    console.log("Incoming lead data:", req.body);
    console.log("User:", req.user);
    const lead = await Lead.create({ ...req.body, ownerId: req.user.id });
    res.status(201).json(lead);
  } catch (err) {
    console.error("Error creating lead:", err);
    if (err.code === 11000)
      return res.status(409).json({ message: "email already exists" });

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.log();
    
    res.status(500).json({ message: "Server error" });
  }
};

exports.listLeads = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const filters = buildWhere(req.query);
  filters.ownerId = req.user.id;

  const total = await Lead.countDocuments(filters);
  const data = await Lead.find(filters)
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
};

exports.getLead = async (req, res) => {
  const lead = await Lead.findOne({ _id: req.params.id, ownerId: req.user.id });
  if (!lead) return res.status(404).json({ message: "Not found" });
  res.status(200).json(lead);
};

exports.updateLead = async (req, res) => {
  const lead = await Lead.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user.id },
    req.body,
    { new: true }
  );
  if (!lead) return res.status(404).json({ message: "Not found" });
  res.status(200).json(lead);
};

exports.deleteLead = async (req, res) => {
  const result = await Lead.deleteOne({
    _id: req.params.id,
    ownerId: req.user.id,
  });
  if (result.deletedCount === 0)
    return res.status(404).json({ message: "Not found" });
  res.status(200).json({ message: "deleted" });
};
