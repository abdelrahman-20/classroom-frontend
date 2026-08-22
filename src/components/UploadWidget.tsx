import { UploadWidgetProps, UploadWidgetValue } from "@/types";
import { UploadCloud } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { CLOUDINARY_CLOUD_NAME, requireEnv } from "@/constants";

const UploadWidget = ({
  value = null,
  onChange,
  disabled = false,
}: UploadWidgetProps) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);

  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const openWidget = () => {
    if (!disabled) widgetRef.current?.open();
  };

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    // Initialize Cloudinary upload widget once
    if (typeof window === "undefined" || widgetRef.current) return;
    if (!window.cloudinary?.createUploadWidget) return;

    const uploadPreset =
      (import.meta.env as any).VITE_CLOUDINARY_UPLOAD_PRESET ??
      requireEnv("VITE_CLOUDINARY_UPLOAD_PRESET", "");

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset,
        multiple: false,
        cropping: false,
        resourceType: "image",
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
        maxFileSize: 5 * 1024 * 1024, // 5MB
        folder: "classroom-uploads",
      },
      (error, result) => {
        if (error) return;
        if (!result) return;
        if (result.event === "success") {
          const info = result.info;
          const newVal: UploadWidgetValue = {
            url: info.secure_url,
            publicId: info.public_id,
          };
          setPreview(newVal);
          setDeleteToken(info.delete_token ?? null);
          onChangeRef.current?.(newVal);
        }
      },
    );
  }, []);

  const removeFromCloudinary = async () => {
    if (!deleteToken) {
      setPreview(null);
      onChangeRef.current?.(null);
      return;
    }
    setIsRemoving(true);
    try {
      const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`;
      const body = new URLSearchParams();
      body.append("token", deleteToken);

      const res = await fetch(endpoint, {
        method: "POST",
        body,
      });

      if (!res.ok) {
        throw new Error("Failed to remove image from Cloudinary");
      }

      setPreview(null);
      setDeleteToken(null);
      onChangeRef.current?.(null);
    } catch (err) {
      // swallow — could show notification instead
      console.error(err);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="upload-preview">
          <img
            src={preview.url}
            alt={preview.publicId}
            className="max-w-full h-auto rounded-md"
          />
          <div className="mt-2">
            <button
              type="button"
              onClick={removeFromCloudinary}
              disabled={isRemoving}
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white"
            >
              {isRemoving ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>
      ) : (
        <div
          className="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={openWidget}
          onKeyDown={(e) => {
            if (e.key === "enter") {
              e.preventDefault();
              openWidget();
            }
          }}
        >
          <div className="upload-prompt">
            <UploadCloud />
            <div>
              <p>Click To Upload Photo</p>
              <p>PNG, JPG, PNG, WEB Up To 5MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
