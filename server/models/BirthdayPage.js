import mongoose from 'mongoose';

const birthdayPageSchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, unique: true, trim: true },
        receiver_name: { type: String, required: true },
        sender_name: { type: String, required: true },
        is_active: { type: Boolean, default: true },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

export default mongoose.model('BirthdayPage', birthdayPageSchema);
