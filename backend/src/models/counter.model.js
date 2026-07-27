import mongoose, { Schema } from 'mongoose';

const counterSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    sequence: {
        type: Number,
        default: 0
    }
});

const Counter = mongoose.model("Counter", counterSchema);
export {
    Counter
}