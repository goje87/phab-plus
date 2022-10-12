import { Schema, model, models } from 'mongoose';

interface IToken {
  tags: string[];
}

const tokenSchema = new Schema<IToken>({
  tags: [{ type: String }],
});

const Token =
  models['x-access-token'] || model<IToken>('x-access-token', tokenSchema);

export default Token;
