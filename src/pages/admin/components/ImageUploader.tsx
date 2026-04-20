import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const MAX_WIDTH = 1280;
const MAX_HEIGHT = 1280;
const QUALITY = 0.82;

const compressImage = (file: File): Promise<Blob> =>
  new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => resolve(blob ?? file),
        'image/jpeg',
        QUALITY,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });

export default function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const compressed = await compressImage(file);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(fileName, compressed, { cacheControl: '3600', upsert: false, contentType: 'image/jpeg' });
    if (error) { console.error(error); return null; }
    const { data: urlData } = supabase.storage.from('project-images').getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = maxImages - images.length;
    if (remaining <= 0) return;
    setUploading(true);
    setUploadProgress(0);
    const toUpload = Array.from(files).slice(0, remaining).filter((f) => f.type.startsWith('image/'));
    let done = 0;
    const results = await Promise.all(
      toUpload.map(async (file) => {
        const url = await uploadFile(file);
        done += 1;
        setUploadProgress(Math.round((done / toUpload.length) * 100));
        return url;
      }),
    );
    const urls = results.filter(Boolean) as string[];
    onChange([...images, ...urls]);
    setUploading(false);
    setUploadProgress(0);
  };

  const removeImage = async (idx: number) => {
    const url = images[idx];
    // Extract path from URL
    const path = url.split('/project-images/')[1];
    if (path) await supabase.storage.from('project-images').remove([path]);
    onChange(images.filter((_, i) => i !== idx));
  };

  const moveImage = (from: number, to: number) => {
    const arr = [...images];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    onChange(arr);
  };

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            dragOver ? 'border-amber-400 bg-amber-400/5' : 'border-slate-600 hover:border-amber-400/60 hover:bg-amber-400/5'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-400 text-sm">Mengupload foto... {uploadProgress}%</span>
              <div className="w-full max-w-xs bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <i className="ri-upload-cloud-2-line text-3xl text-slate-500" />
              <span className="text-slate-400 text-sm">Klik atau drag foto ke sini</span>
              <span className="text-slate-600 text-xs">PNG, JPG, WEBP · Maks {maxImages} foto</span>
            </div>
          )}
        </div>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((url, idx) => (
            <div key={url} className="relative group rounded-lg overflow-hidden bg-slate-800" style={{ height: '90px' }}>
              <img src={url} alt={`foto-${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-amber-400 text-black text-xs font-bold px-1.5 py-0.5 rounded">Cover</span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(idx, idx - 1)}
                    className="w-7 h-7 bg-white/20 hover:bg-white/40 rounded text-white text-xs flex items-center justify-center cursor-pointer"
                    title="Geser kiri"
                  >
                    <i className="ri-arrow-left-s-line" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded text-white text-xs flex items-center justify-center cursor-pointer"
                  title="Hapus"
                >
                  <i className="ri-delete-bin-line" />
                </button>
                {idx < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(idx, idx + 1)}
                    className="w-7 h-7 bg-white/20 hover:bg-white/40 rounded text-white text-xs flex items-center justify-center cursor-pointer"
                    title="Geser kanan"
                  >
                    <i className="ri-arrow-right-s-line" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
