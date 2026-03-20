import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalytics extends Document {
  product: any; date: Date; views: number; purchases: number; revenue: number;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  date: { type: Date, default: () => { const d = new Date(); d.setHours(0,0,0,0); return d; } },
  views: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
}, { timestamps: true });

AnalyticsSchema.index({ product: 1, date: 1 }, { unique: true });

export async function trackProductView(productId: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  await Analytics.findOneAndUpdate({ product: productId, date: today }, { $inc: { views: 1 } }, { upsert: true });
  await mongoose.model('Product').findByIdAndUpdate(productId, { $inc: { viewCount: 1 } });
}

export async function trackProductPurchase(productId: string, qty: number, revenue: number) {
  const today = new Date(); today.setHours(0,0,0,0);
  await Analytics.findOneAndUpdate({ product: productId, date: today }, { $inc: { purchases: qty, revenue } }, { upsert: true });
  await mongoose.model('Product').findByIdAndUpdate(productId, { $inc: { purchaseCount: qty } });
}

const Analytics: Model<IAnalytics> = mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
export default Analytics;
