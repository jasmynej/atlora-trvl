'use client'
import axios from "axios";
import { useState, useEffect } from "react";

type MediaPickerProps = {
    value?: string | FileList;
    onChangeAction: (value: string | FileList | string) => void;
    agency?: string;
    userId?: string;
    type?: "agency" | "profile"; // 👈 New prop
};

type S3Image = {
    key: string;
    size: number;
    url: string;
    type?: "user" | "default";
};

export default function MediaPicker({
                                        value,
                                        onChangeAction,
                                        agency,
                                        userId,
                                        type = "agency"
                                    }: MediaPickerProps) {
    const [images, setImages] = useState<S3Image[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    // 🧭 Fetch images depending on picker type
    useEffect(() => {
        async function fetchImages() {
            try {
                let res;
                if (type === "profile" && userId) {
                    res = await axios.get(`/api/uploads?type=profile&user=${userId}`);
                } else if (agency) {
                    res = await axios.get(`/api/uploads?agency=${agency}`);
                } else {
                    return;
                }
                setImages(res.data);
            } catch (err: any) {
                setError("Failed to load images");
                console.error(err);
            }
        }
        fetchImages();
    }, [agency, userId, type]);

    // 🧱 UI States
    const tabs = ["Upload", "Choose Existing"];
    const baseTabClass = "cursor-pointer text-sm font-medium";
    const activeTab = "underline text-brand-primary";
    const hover = "hover:underline";

    const selectImage = (img: string) => {
        setSelectedImg(img);
        onChangeAction(img);
    };

    async function handleUpload() {
        if (!file) return;
        setUploading(true);
        setError(null);

        try {
            let folder = "";
            if (type === "profile" && userId) {
                folder = encodeURIComponent(`profiles/${userId}`);
            } else if (agency === "global") {
                folder = encodeURIComponent(`${agency}`);
            } else {
                folder = encodeURIComponent(`agencies/${agency}`);
            }

            const fd = new FormData();
            fd.append("file", file, file.name);

            const { data } = await axios.put(`/api/uploads?folder=${folder}`, fd);

            onChangeAction(data.url);
            setFile(null);
            setPreview(null);

            // refresh image list
            if (type === "profile" && userId) {
                const res = await axios.get(`/api/uploads?type=profile&user=${userId}`);
                setImages(res.data);
            } else if (agency) {
                const res = await axios.get(`/api/uploads?agency=${agency}`);
                setImages(res.data);
            }
        } catch (e: any) {
            setError(e?.response?.data?.error || "Upload failed");
        } finally {
            setUploading(false);
        }
    }

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] || null;
        setFile(f);
        if (f) {
            const reader = new FileReader();
            reader.onload = () => setPreview(String(reader.result));
            reader.readAsDataURL(f);
        } else {
            setPreview(null);
        }
    }

    useEffect(() => {
        if (typeof value === "string" && value) {
            setSelectedImg(value);
        }
    }, [value]);

    // 🖼️ Group by source (only applies to profile type)
    const userImages = images.filter((i) => i.type === "user");
    const defaultImages = images.filter((i) => i.type === "default");

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="flex gap-4 border-b pb-2 mb-3">
                {tabs.map((tab_name, i) => (
                    <div
                        key={i}
                        onClick={() => setTab(i)}
                        className={`${baseTabClass} ${
                            tab === i ? activeTab : hover
                        }`}
                    >
                        {tab_name}
                    </div>
                ))}
            </div>

            {/* Upload tab */}
            {tab === 0 && (
                <div className="flex flex-col gap-3">
                    <label className="block">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onFileChange}
                            className="block mt-1 font-semibold"
                        />
                    </label>

                    {preview && (
                        <div className="w-40 h-40 overflow-hidden rounded border">
                            <img
                                src={preview}
                                alt="preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {error && (
                        <p className="text-red-600 text-sm">{error}</p>
                    )}

                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="px-4 py-2 rounded bg-brand-primary hover:bg-brand-primary-hover text-brand-bg disabled:opacity-50"
                    >
                        {uploading ? "Uploading…" : "Upload"}
                    </button>
                </div>
            )}

            {/* Choose existing tab */}
            {tab === 1 && (
                <div className="flex flex-col mt-3 gap-4">
                    {type === "profile" && (
                        <>
                            {/* Atlora default images */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
                                    Atlora Avatars
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {defaultImages.map((img) => (
                                        <button
                                            key={img.key}
                                            type="button"
                                            onClick={() => selectImage(img.url)}
                                            className={`w-28 p-1 border rounded hover:border-brand-primary ${
                                                selectedImg === img.url
                                                    ? "border-brand-primary"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            <img
                                                src={img.url}
                                                alt=""
                                                className="w-full h-24 object-cover rounded"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* User images */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2 mt-4">
                                    Your Uploads
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {userImages.map((img) => (
                                        <button
                                            key={img.key}
                                            type="button"
                                            onClick={() => selectImage(img.url)}
                                            className={`w-28 p-1 border rounded hover:border-brand-primary ${
                                                selectedImg === img.url
                                                    ? "border-brand-primary"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            <img
                                                src={img.url}
                                                alt=""
                                                className="w-full h-24 object-cover rounded"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {type === "agency" && (
                        <div className="flex flex-wrap gap-2">
                            {images.map((img) => (
                                <button
                                    key={img.key}
                                    type="button"
                                    onClick={() => selectImage(img.url)}
                                    className={`w-32 p-2 border rounded hover:border-brand-primary ${
                                        selectedImg === img.url
                                            ? "border-brand-primary"
                                            : "border-transparent"
                                    }`}
                                    title={img.key}
                                >
                                    <img
                                        src={img.url}
                                        alt=""
                                        className="w-full h-24 object-cover rounded"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}