import mongoose from 'mongoose';

const wishSchema = new mongoose.Schema(
    {
        page_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BirthdayPage', required: true },
        from_name: { type: String, required: true },
        message: { type: String, required: true },
        tag: {
            type: String,
            required: true,
            enum: ['heartfelt', 'funny', 'inspirational', 'sweet'],
        },
        color: { type: String, default: '#D4A853' },
        emoji: { type: String, default: '💌' },
        is_sender: { type: Boolean, default: false },
        is_mystery: { type: Boolean, default: false },
        display_order: { type: Number, default: 1 },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

// Sort by display_order by default
wishSchema.index({ page_id: 1, display_order: 1 });

export default mongoose.model('Wish', wishSchema);
