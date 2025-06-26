import mongoose from 'mongoose';
const { Schema } = mongoose;

const splitAmountSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  share: { type: Number, required: true }
}, { _id: false });

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ApprovalHistorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['approved', 'rejected'], required: true },
  date: { type: Date, default: Date.now }
}, { _id: false });

const FinanceTransactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  category: { type: Schema.Types.ObjectId, ref: 'FinanceCategory', required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  tags: { type: [String], default: [] },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  sharedWithRoles: { type: [String], default: [] },
  splitType: { type: String, enum: ['equal', 'custom'], default: 'equal' },
  splitAmounts: [splitAmountSchema],
  attachment: { type: String }, // file path or URL
  currency: { type: String, default: 'INR' },
  recurring: { type: Boolean, default: false },
  recurrenceRule: { type: String }, // e.g. 'monthly', 'weekly', 'custom'
  createdAt: { type: Date, default: Date.now },
  group: { type: Schema.Types.ObjectId, ref: 'Group' }, // For group/shared transactions
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvals: [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, approved: Boolean }],
  approvalHistory: [ApprovalHistorySchema],
  comments: [CommentSchema]
});

export default mongoose.model('FinanceTransaction', FinanceTransactionSchema); 