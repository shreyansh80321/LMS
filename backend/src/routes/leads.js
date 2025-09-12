const express = require("express");
const Lead = require("../models/Lead");
const auth = require("../middleware/auth");
const router = express.Router();


router.post("/", auth, async (req, res) => {
  try {
     console.log("Incoming lead data:", req.body);
     console.log("Logged-in user:", req.user);
    const leadData = {
      ...req.body,
      ownerId: req.user._id,
    };

    const lead = await Lead.create(leadData);
    return res.status(201).json(lead);
  } catch (err) {
    console.error("Lead creation error:", err);

    if (err.code === 11000)
      return res.status(400).json({ message: "Email must be unique" });

    if (err.name === "ValidationError")
      return res.status(400).json({ message: err.message });

    return res.status(500).json({ message: "Server error" });
  }
});
function buildFilters(query) {
  const filters = {};
  
  if (query.email_eq) filters.email = query.email_eq;
  if (query.company_contains)
    filters.company = { $regex: query.company_contains, $options: "i" };
  if (query.city_contains)
    filters.city = { $regex: query.city_contains, $options: "i" };
  
  if (query.status) filters.status = { $in: query.status.split(",") };
  if (query.source) filters.source = { $in: query.source.split(",") };
  
  if (query.score_gt || query.score_lt) {
    filters.score = {};
    if (query.score_gt) filters.score.$gt = Number(query.score_gt);
    if (query.score_lt) filters.score.$lt = Number(query.score_lt);
  }
  if (query.lead_value_gt || query.lead_value_lt) {
    filters.lead_value = {};
    if (query.lead_value_gt)
      filters.lead_value.$gt = Number(query.lead_value_gt);
    if (query.lead_value_lt)
      filters.lead_value.$lt = Number(query.lead_value_lt);
  }
  
  if (query.created_after || query.created_before) {
    filters.created_at = {};
    if (query.created_after)
      filters.created_at.$gte = new Date(query.created_after);
    if (query.created_before)
      filters.created_at.$lte = new Date(query.created_before);
  }
  
  if (query.is_qualified === "true" || query.is_qualified === "false") {
    filters.is_qualified = query.is_qualified === "true";
  }
  return filters;
}

router.get("/", auth, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const filters = buildFilters(req.query);
    const [total, data] = await Promise.all([
      Lead.countDocuments(filters),
      Lead.find(filters).sort({ created_at: -1 }).skip(skip).limit(limit),
    ]);
    return res
      .status(200)
      .json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id", auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(lead);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id", auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(lead);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});
router.delete("/:id", auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
