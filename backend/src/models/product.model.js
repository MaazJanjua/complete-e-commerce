import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,

    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountPrice: {
        type: Number,
        min: 0,
        validate: {
            validator(value) {
                return value == null || value <= this.price;
            },
            message: "Discount price cannot be greater than price"
        }
    },
    productImages: {
        type: [
            {
                url: String,
                public_id: String
            }
        ],
        default: []
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})


productSchema.index({
    isActive: 1
});

productSchema.index({
    category: 1,
    isActive: 1
});

productSchema.index({
    price: 1
});

productSchema.index({
    createdAt: -1
});
// productSchema.index({
//     slug: 1
// });
productSchema.virtual("discountPercentage").get(function () {

    if (!this.discountPrice)
        return 0;

    return Math.round(
        ((this.price - this.discountPrice) / this.price) * 100
    );

});


productSchema.plugin(aggregatePaginate);

const Product = mongoose.model("Product", productSchema)
export {
    Product
}