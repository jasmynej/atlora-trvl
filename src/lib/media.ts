import {PutObjectCommand, S3Client, ListObjectsV2Command} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET
const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
    }
})

function publicUrl(key: string) {
    return `https://${BUCKET}.s3.amazonaws.com/${key}`;
}


async function generateUploadPresignedUrl(objectKey: string, expiresInSeconds = 60, contentType: string){
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: objectKey,
        ContentType: contentType
    })

    return await getSignedUrl(s3, command, { expiresIn: expiresInSeconds })
}

async function getAgencyUploads(slug: string){
    const command = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: `agencies/${slug}`
    })

    const response = await s3.send(command)
    if (!response.Contents) return []
    return response.Contents.filter((obj) => obj.Key && !obj.Key.endsWith("/")).map((obj) => ({
        key: obj.Key!,
        size: obj.Size,
        lastModified: obj.LastModified,
        url: publicUrl(obj.Key!),
    }));
}

async function getGlobalUploads(){
    const command = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: `global`
    })

    const response = await s3.send(command)
    if (!response.Contents) return []
    return response.Contents.filter((obj) => obj.Key && !obj.Key.endsWith("/")).map((obj) => ({
        key: obj.Key!,
        size: obj.Size,
        lastModified: obj.LastModified,
        url: publicUrl(obj.Key!),
    }));
}

export {generateUploadPresignedUrl, getAgencyUploads, publicUrl, getGlobalUploads}
