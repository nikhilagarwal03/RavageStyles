import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  user: any; product: any; rating: number; title: string; comment: string;
  isVerifiedPurchase: boolean; helpfulVotes: number; createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, maxlength: 100 },
  comment: { type: String, required: true, maxlength: 1000 },
  isVerifiedPurchase: { type: Boolean, default: false },
  helpfulVotes: { type: Number, default: 0 },
}, { timestamps: true });

ReviewSchema.index({ user: 1, product: 1 }, { unique: true });
ReviewSchema.index({ product: 1, createdAt: -1 });

ReviewSchema.post('save', async function() {
  const stats = await mongoose.model('Review').aggregate([
    { $match: { product: this.product } },
    { $group: { _id: '$product', averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(this.product, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    });
  }
});

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
