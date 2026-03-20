import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId; orderId: string; user: any;
  items: { product: any; name: string; image: string; price: number; size: string; quantity: number }[];
  shippingAddress: { name: string; phone: string; line1: string; line2?: string; city: string; state: string; pincode: string; country: string };
  subtotal: number; shippingFee: number; discount: number; total: number;
  paymentStatus: 'pending'|'paid'|'failed'|'refunded'; paymentMethod: string;
  razorpayOrderId?: string; razorpayPaymentId?: string; razorpaySignature?: string;
  orderStatus: 'pending'|'confirmed'|'processing'|'shipped'|'delivered'|'cancelled'|'refunded';
  trackingNumber?: string;
  statusHistory: { status: string; timestamp: Date; note?: string }[];
  createdAt: Date; updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, unique: true, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ product: { type: Schema.Types.ObjectId, ref: 'Product' }, name: String, image: String, price: Number, size: String, quantity: Number }],
  shippingAddress: { name: String, phone: String, line1: String, line2: String, city: String, state: String, pincode: String, country: { type: String, default: 'India' } },
  subtotal: Number, shippingFee: { type: Number, default: 0 }, discount: { type: Number, default: 0 }, total: Number,
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  paymentMethod: { type: String, default: 'razorpay' },
  razorpayOrderId: String, razorpayPaymentId: String, razorpaySignature: String,
  orderStatus: { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'], default: 'pending' },
  trackingNumber: String,
  statusHistory: [{ status: String, timestamp: { type: Date, default: Date.now }, note: String }],
}, { timestamps: true });

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ razorpayOrderId: 1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
