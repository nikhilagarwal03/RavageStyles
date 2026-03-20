import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  _id: string; name: string; slug: string; description: string; shortDescription?: string;
  price: number; compareAtPrice?: number;
  category: 'T-Shirts'|'Hoodies'|'Jackets'|'Accessories';
  images: string[];
  sizes: { size: string; stock: number }[];
  totalStock: number; isFeatured: boolean; isActive: boolean; tags: string[];
  material?: string; careInstructions?: string;
  averageRating: number; totalReviews: number;
  viewCount: number; purchaseCount: number; trendingScore: number;
  createdAt: Date; updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true, maxlength: 2000 },
  shortDescription: { type: String, maxlength: 200 },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  category: { type: String, required: true, enum: ['T-Shirts','Hoodies','Jackets','Accessories'] },
  images: { type: [String], required: true },
  sizes: [{ size: { type: String, enum: ['XS','S','M','L','XL','XXL'] }, stock: { type: Number, default: 0, min: 0 } }],
  totalStock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [String],
  material: String,
  careInstructions: String,
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  purchaseCount: { type: Number, default: 0 },
  trendingScore: { type: Number, default: 0 },
}, { timestamps: true });

ProductSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug)
    this.slug = this.name.toLowerCase().replace(/[^\w\s-]/g,'').replace(/[\s_]+/g,'-').replace(/^-+|-+$/g,'');
  this.totalStock = this.sizes.reduce((s, sz) => s + sz.stock, 0);
  this.trendingScore = this.purchaseCount * 3 + this.viewCount * 1 + this.averageRating * 10 + this.totalReviews * 2;
  next();
});

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ trendingScore: -1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
