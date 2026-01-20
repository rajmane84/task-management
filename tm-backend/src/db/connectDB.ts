import mongoose from 'mongoose';

export const connectDB = async (uri: string): Promise<void> => {
    try {
        const conn = await mongoose.connect(uri);
        console.log('MongoDB connected successfully:', conn.connection.host);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};