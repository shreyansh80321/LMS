const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    company: String,
    city: String,
    state: String,
    source: {
      type: String,
      enum: [
        "website",
        "facebook_ads",
        "google_ads",
        "referral",
        "events",
        "other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost", "won"],
      default: "new",
    },
    score: { type: Number, min: 0, max: 100 },
    lead_value: Number,
    last_activity_at: Date,
    is_qualified: { type: Boolean, default: false },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Lead", leadSchema);
