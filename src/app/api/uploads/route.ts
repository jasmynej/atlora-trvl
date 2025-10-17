import {generateUploadPresignedUrl, getAgencyUploads, publicUrl, getGlobalUploads} from '@/lib/media'
import {NextRequest, NextResponse} from "next/server";

const MAX_BYTES = 10 * 1024 * 1024;

function sanitize(p: string) {
    return p.replace(/[^a-zA-Z0-9/_\-.]/g, "").replace(/^\/+|\/+$/g, "");
}

export async function PUT(req: NextRequest) {
    try {
        const folderParam = req.nextUrl.searchParams.get("folder");
        if (!folderParam) {
            return NextResponse.json({ error: "Missing ?folder=" }, { status: 400 });
        }
        const folder = sanitize(folderParam);

        // Require multipart/form-data with a "file" field
        const form = await req.formData().catch(() => null);
        if (!form) {
            return NextResponse.json(
                { error: "Expected multipart/form-data" },
                { status: 400 }
            );
        }

        const file = form.get("file");
        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "Missing 'file' field in multipart form-data" },
                { status: 400 }
            );
        }

        if (file.size > MAX_BYTES) {
            return NextResponse.json(
                { error: `File too large (max ${Math.round(MAX_BYTES / 1024 / 1024)}MB)` },
                { status: 413 }
            );
        }

        const contentType = file.type || "application/octet-stream";
        const originalName = file.name || "upload.bin";
        // const ext = (originalName.match(/\.([a-zA-Z0-9]+)$/)?.[1] ?? "").toLowerCase();
        const key = `${folder}/${crypto.randomUUID()}-${originalName}`;

        // 1) Get presigned PUT URL for this key + content type
        const url = await generateUploadPresignedUrl(key, 60, contentType);

        // 2) Upload bytes to S3 via the presigned URL
        const bytes = await file.arrayBuffer();
        const put = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": contentType },
            body: bytes,
        });

        if (!put.ok) {
            const text = await put.text().catch(() => "");
            return NextResponse.json(
                { error: "Upload to S3 failed", status: put.status, s3: text || undefined },
                { status: 502 }
            );
        }

        // 3) Return the key and a public URL (CloudFront preferred)
        return NextResponse.json({
            ok: true,
            key,
            contentType,
            url: publicUrl(key),
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: "Unexpected error", detail: err?.message ?? String(err) },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest){
    try {
        const agencyParam = req.nextUrl.searchParams.get("agency");
        if(!agencyParam){
            return NextResponse.json({ error: "Missing ?agency=" }, { status: 400 });
        }
        let items = []
        if(agencyParam === 'global'){
            items = await getGlobalUploads();
        }
        else {
            items = await getAgencyUploads(agencyParam);
        }

        return NextResponse.json(items);

    } catch (err: any){
        return NextResponse.json(
            { error: "Unexpected error", detail: err?.message ?? String(err) },
            { status: 500 }
        );
    }
}