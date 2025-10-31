const TrackerEntry = require("../models/trackerEntry.model");

// Helper to sanitize output
const sanitizeEntry = (entry) => {
  const { __v, ...data } = entry.toObject();
  return data;
};

// CREATE tracker entry
const createEntry = async (req, res) => {
  try {
    const { type, title, notes, date, meta } = req.body;

    // Create entry for logged-in user (req.user.id comes from JWT middleware)
    const entry = await TrackerEntry.create({
      user: req.user.id,
      type,
      title,
      notes,
      date,
      meta,
    });

    res.status(201).json({ success: true, message: "Entry created", data: sanitizeEntry(entry) });
  } catch (error) {
    console.error("Create Entry Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET all entries of logged-in user
const getEntries = async (req, res) => {
  try {
    const entries = await TrackerEntry.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: entries.map(sanitizeEntry) });
  } catch (error) {
    console.error("Get Entries Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET single entry by ID
const getEntryById = async (req, res) => {
  try {
    const entry = await TrackerEntry.findOne({ _id: req.params.id, user: req.user.id });
    if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });

    res.status(200).json({ success: true, data: sanitizeEntry(entry) });
  } catch (error) {
    console.error("Get Entry Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE entry
const updateEntry = async (req, res) => {
  try {
    const updates = { ...req.body };
    const entry = await TrackerEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });

    res.status(200).json({ success: true, message: "Entry updated", data: sanitizeEntry(entry) });
  } catch (error) {
    console.error("Update Entry Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE entry
const deleteEntry = async (req, res) => {
  try {
    const entry = await TrackerEntry.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });

    res.status(200).json({ success: true, message: "Entry deleted" });
  } catch (error) {
    console.error("Delete Entry Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createEntry, getEntries, getEntryById, updateEntry, deleteEntry };
