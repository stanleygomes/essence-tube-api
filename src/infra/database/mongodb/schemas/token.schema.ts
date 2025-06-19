import mongoose, { Schema, Document, Model } from 'mongoose';

export interface TokenDocument extends Document {
  uuid: string;
  access_token: string;
  expires_in: number;
  scope?: string;
  token_type?: string;
  refresh_token: string;
  refresh_token_expires_in?: number;
  created_at: Date | string;
  [key: string]: any;
}

const TokenSchema: Schema<TokenDocument> = new Schema<TokenDocument>({
  uuid: { type: String, required: true, unique: true },
  access_token: { type: String, required: true },
  expires_in: { type: Number, required: true },
  scope: { type: String },
  token_type: { type: String },
  refresh_token: { type: String, required: true },
  refresh_token_expires_in: { type: Number },
  created_at: { type: Schema.Types.Mixed, required: true },
}, { strict: false });

export const TokenModel: Model<TokenDocument> = mongoose.model<TokenDocument>('Token', TokenSchema);
