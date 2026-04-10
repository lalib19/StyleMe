import { storeUserImage, getUserDataFromDB } from '@/src/lib/db';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/src/lib/auth';

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(buffer: Buffer) {
    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: "style-me/model-images",
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(buffer);
    });
    return uploadResult;
}

export async function deleteImageFromCloudinary(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return new Response(JSON.stringify({
                message: "Authentication required"
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        if (!file) {
            return new Response(JSON.stringify({ message: "No file provided" }), { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadResult = await uploadImageToCloudinary(buffer) as CloudinaryUploadResult;
        await storeUserImage(session.user.email, uploadResult.secure_url, uploadResult.public_id);

        return new Response(JSON.stringify({
            message: "File uploaded successfully",
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
        }), { status: 200 });
    } catch (error) {
        console.error("Error processing file upload:", error);
        return new Response(JSON.stringify({
            message: "File upload failed",
            error: error,
        }), { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return new Response(JSON.stringify({
                message: "Authentication required"
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        const userData = await getUserDataFromDB(session.user.email);
        const currentImage = userData.userImage;
        if (currentImage?.publicId) {
            try {
                const cloudinaryResult = await deleteImageFromCloudinary(currentImage.publicId);
                console.log('Cloudinary image deleted:', cloudinaryResult);
            } catch (cloudinaryError) {
                console.error('Failed to delete image from Cloudinary:', cloudinaryError);
            }
        }
        await storeUserImage(session.user.email, null);

        return new Response(JSON.stringify({
            message: "User image deleted successfully",
        }), { status: 200 });

    } catch (error) {
        console.error("Error in DELETE endpoint:", error);
        return new Response(JSON.stringify({
            message: "Failed to delete user image",
            error: error,
        }), { status: 500 });
    }
}