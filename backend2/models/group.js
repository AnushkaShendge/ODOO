import mongoose from 'mongoose';
const { Schema } = mongoose;

const GroupMemberSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'member', 'viewer'], default: 'member' }
}, { _id: false });

const GroupSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePhoto: { type: String },
  members: [GroupMemberSchema],
  approvalWorkflow: {
    enabled: { type: Boolean, default: false },
    minApprovals: { type: Number, default: 1 }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Group', GroupSchema);
