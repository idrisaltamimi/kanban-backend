import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    username: { type: 'string', required: true },
    password: { type: 'string', required: true },
});
export default mongoose.model('User', userSchema);
//# sourceMappingURL=user.js.map