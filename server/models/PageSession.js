import mongoose from 'mongoose';

const pageSessionSchema = new mongoose.Schema(
    {
        page_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BirthdayPage', required: true },
        session_key: { type: String, required: true },
        opened_wish_ids: { type: [mongoose.Schema.Types.ObjectId], default: [] },
        all_opened: { type: Boolean, default: false },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

// Unique session per page + session_key combo
pageSessionSchema.index({ page_id: 1, session_key: 1 }, { unique: true });

export default mongoose.model('PageSession', pageSessionSchema);
