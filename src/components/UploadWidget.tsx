import { UploadWidgetProps, UploadWidgetValue } from "@/types";
import { UploadCloud } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";

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
    if (disabled || !widgetRef.current) return;
    widgetRef.current.open();
  };

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  useEffect(() => {
    // Initialize Cloudinary upload widget once
    if (typeof window === "undefined" || widgetRef.current) return;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) return;

    const initializeWidget = () => {
      if (!window.cloudinary?.createUploadWidget) return;

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
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
    };

    // Load Cloudinary script if not already present
    if (!window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
      script.type = "text/javascript";
      script.onload = initializeWidget;
      script.onerror = () => console.error("Failed to load Cloudinary widget");
      document.body.appendChild(script);
    } else {
      initializeWidget();
    }
  }, []);

  const removeFromCloudinary = async () => {
    if (disabled || isRemoving) return;
    if (!deleteToken) {
      setPreview(null);
      setDeleteToken(null);
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

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    return (
      <div className="rounded-md border border-dashed border-muted-foreground/40 p-3 text-sm text-muted-foreground">
        Image upload is currently unavailable.
      </div>
    );
  }

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
              disabled={disabled || isRemoving}
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
            if (e.key === "Enter" || e.key === " ") {
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
