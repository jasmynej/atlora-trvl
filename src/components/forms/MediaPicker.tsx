'use client'
import axios from "axios";
import {useState, useEffect} from "react";

type MediaPickerProps = {
    value?: string | FileList;
    onChangeAction: (value: string | FileList) => void;
    agency: string
};

type S3Image = {
    key: string,
    size: number,
    url: string
}

export default function MediaPicker({value, onChangeAction, agency}: MediaPickerProps){
    const [images, setImages] = useState<S3Image[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    useEffect(() => {
        axios.get(`/api/uploads?agency=${agency}`).then((d)=> setImages(d.data));
    }, [agency]);

    const tabs = ["Upload","Choose Existing"];
    const baseTabClass = "";
    const activeTab = "underline";
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
            let folder = ''
            if (agency === 'global'){
                 folder = encodeURIComponent(`${agency}`);
            }
            else{
                 folder = encodeURIComponent(`agencies/${agency}`);
            }

            const fd = new FormData();
            fd.append("file", file, file.name); // must match route expectation

            const { data } = await axios.put(`/api/uploads?folder=${folder}`, fd);
            // data.url should be your public URL returned from route

            onChangeAction(data.url); // send URL back to parent form
            setFile(null);
            setPreview(null);

            // optional: refresh existing gallery
            const res = await axios.get(`/api/uploads?agency=${agency}`);
            setImages(res.data);
        } catch (e: any) {
            setError(e?.response?.data?.error || "Upload failed");
        } finally {
            setUploading(false);
        }
    }

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] || null;
        setFile(f ?? null);
        if (f) {
            const reader = new FileReader();
            reader.onload = () => setPreview(String(reader.result));
            reader.readAsDataURL(f);
        } else {
            setPreview(null);
        }
    }

    useEffect(() => {
        if (typeof value === 'string' && value) {
            setSelectedImg(value);
        }
    }, [value]);

    return (
        <div>
            <div id="tabs" className="flex gap-2">
                {tabs.map((tab_name, i)=> {
                    const isActiveTab = i === tab;
                    return (
                        <div
                            key={i}
                            onClick={()=> (setTab(i))}
                            className={`${baseTabClass} ${isActiveTab ? activeTab : hover}`}>
                            <p>{tab_name}</p>
                        </div>
                    );
                })}
            </div>

            <div>
                {tab === 0 && (
                    <div className="flex flex-col gap-3 mt-3">
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
                                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {error && <p className="text-red-600 text-sm">{error}</p>}

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

                {tab === 1 && (
                    <div className="flex flex-col mt-3">
                        <div className="flex flex-wrap gap-2">
                            {images.map(img => (
                                <button
                                    key={img.key}
                                    type="button"
                                    onClick={() => selectImage(img.url)}
                                    className={`w-32 p-2 border rounded hover:border-brand-primary ${
                                        selectedImg === img.url ? "border-brand-primary" : "border-transparent"
                                    }`}
                                    title={img.key}
                                >
                                    <img src={img.url} alt="" className="w-full h-24 object-cover rounded" />
                                </button>
                            ))}
                        </div>

                        <div className="mt-3">
                            {selectedImg && (
                                <div className="w-64 border rounded overflow-hidden">
                                    <img src={selectedImg} alt="Selected" className="w-full h-40 object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}