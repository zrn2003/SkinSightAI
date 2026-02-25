import { useEffect, useRef, useState, useCallback } from "react";
import { Upload, Camera, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isAnalyzing: boolean;
}

const ImageUploader = ({ onImageUpload, isAnalyzing }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const takePhotoFallbackInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onImageUpload(file);
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) track.stop();
        streamRef.current = null;
      }
    };
  }, []);

  const openCamera = useCallback(async () => {
    setCameraError(null);

    // Try true camera access (works in https contexts + supported browsers).
    const mediaDevices = navigator.mediaDevices;
    if (mediaDevices?.getUserMedia) {
      try {
        const stream = await mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        streamRef.current = stream;
        setIsCameraOpen(true);

        // Attach stream after modal renders.
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            void videoRef.current.play().catch(() => { });
          }
        }, 0);
        return;
      } catch (err) {
        setCameraError("Camera access was blocked or unavailable. You can still use file upload.");
      }
    }

    // Fallback: trigger file input with `capture` for mobile browsers.
    takePhotoFallbackInputRef.current?.click();
  }, []);

  const captureFromCamera = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92)
    );
    if (!blob) return;

    const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
    stopCamera();
    processFile(file);
  }, [stopCamera]);

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-2xl border-2 border-dashed transition-all duration-300",
          "bg-card/50 backdrop-blur-sm",
          isDragging
            ? "border-primary bg-accent/50 scale-[1.02]"
            : "border-border hover:border-primary/50",
          preview ? "p-4" : "p-12"
        )}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Uploaded skin image"
              className="w-full h-auto rounded-xl object-cover max-h-96"
            />
            {!isAnalyzing && (
              <button
                onClick={clearPreview}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <p className="text-sm font-medium text-foreground">Analyzing image...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center animate-float">
              <Upload className="w-8 h-8 text-primary" />
            </div>

            <div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                Upload Skin Image
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Drag and drop your image here, or click to browse.
                Supports JPG, PNG up to 10MB.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="lg" asChild>
                <label className="cursor-pointer">
                  <ImageIcon className="w-5 h-5" />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </Button>
            </div>

            {cameraError && (
              <p className="text-xs text-muted-foreground max-w-sm">{cameraError}</p>
            )}

            {/* Fallback input (mobile capture / file picker) */}
            <input
              ref={takePhotoFallbackInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        )}
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-border">
              <div className="font-heading font-semibold text-foreground">Take Photo</div>
              <Button variant="ghost" size="icon" onClick={stopCamera} type="button">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4">
              <div className="rounded-xl overflow-hidden bg-muted">
                <video ref={videoRef} playsInline className="w-full h-auto" />
              </div>

              <div className="mt-4 flex gap-3 justify-end">
                <Button variant="outline" onClick={stopCamera} type="button">
                  Cancel
                </Button>
                <Button variant="hero" onClick={captureFromCamera} type="button">
                  Capture
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
