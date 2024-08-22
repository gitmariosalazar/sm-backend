import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        require: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
    },
    name: {
        type: String,
        require: true
    },
    photo: {
        type: String,
    },
    provider: {
        type: String
    }
}, {
    timestamps: true
}
)

export default mongoose.model('User', userSchema)