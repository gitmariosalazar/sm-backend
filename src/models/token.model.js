import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    token_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    token_github: {
        type: String,
        required: false,
        unique: false
    },
    description: {
        type: String,
        required: false,
        unique: false
    },
    expire_days: {
        type: Number,
        require: true,
    },
    expire_date: {
        type: Date,
        require: true
    },
    status: {
        type: String,
        require: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Token', tokenSchema)