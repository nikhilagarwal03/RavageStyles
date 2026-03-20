import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string; name: string; email: string; password: string;
  isAdmin: boolean; phone?: string; avatar?: string;
  wishlist: string[]; addresses: any[]; createdAt: Date; updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  isAdmin: { type: Boolean, default: false },
  phone: { type: String },
  avatar: { type: String },
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  addresses: [new Schema({
    name: String, phone: String, line1: String, line2: String,
    city: String, state: String, pincode: String, country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false },
  })],
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.set('toJSON', { transform: (_doc: any, ret: any) => { delete ret.password; return ret; } });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
