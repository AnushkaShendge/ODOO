import EmergencyContact from '../model/emergency-contact.js';

export const createContact = async (req, res) => {
  try {
    const { name, phone, type, country, city, isGlobal } = req.body;
    const user = req.user ? req.user.id : null;
    const contact = await EmergencyContact.create({ user, name, phone, type, country, city, isGlobal });
    res.status(201).json({ success: true, contact });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getContacts = async (req, res) => {
  try {
    const user = req.user ? req.user.id : null;
    const { country, city } = req.query;
    // Fetch user contacts and global contacts for location
    const query = [
      { user },
      { isGlobal: true, ...(country && { country }), ...(city && { city }) }
    ];
    const contacts = await EmergencyContact.find({ $or: query });
    res.json({ success: true, contacts });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const contact = await EmergencyContact.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, contact });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await EmergencyContact.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
}; 