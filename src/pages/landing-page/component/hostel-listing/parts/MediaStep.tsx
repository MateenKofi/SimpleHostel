import { Image as ImageIcon, ShieldCheck, Upload } from "lucide-react";
import { ImageUpload, SingleImageUpload, type ImageFile } from "@/components/form";

interface MediaStepProps {
    logo: ImageFile | null;
    setLogo: (logo: ImageFile | null) => void;
    images: ImageFile[];
    setImages: (images: ImageFile[]) => void;
}

export const MediaStep = ({ logo, setLogo, images, setImages }: MediaStepProps) => {
    return (
        <div className="space-y-6">
            {/* Step Header */}
            <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-green-500 to-forest-green-600 flex items-center justify-center text-white shadow-lg shadow-forest-green-200 flex-shrink-0">
                    <ImageIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg md:text-xl font-bold text-foreground">Visual Media</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Showcase your hostel</p>
                </div>
            </div>

            {/* Upload Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Logo Upload */}
                <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground">Hostel Logo</h3>
                        <span className="px-2 py-0.5 bg-forest-green-100 text-forest-green-700 text-xs font-semibold rounded-full">
                            Required
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Square or transparent PNG recommended (min 200x200px)</p>
                    <div className="bg-gradient-to-br from-muted to-muted/80 p-4 md:p-6 rounded-2xl border border-border shadow-sm">
                        <SingleImageUpload
                            value={logo}
                            onChange={setLogo}
                            emptyStateTitle="Upload Logo"
                            emptyStateDescription="Drag & drop or tap"
                        />
                    </div>
                </div>

                {/* Gallery Upload */}
                <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground">Hostel Gallery</h3>
                        <span className="px-2 py-0.5 bg-forest-green-100 text-forest-green-700 text-xs font-semibold rounded-full">
                            Required
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Upload 3-5 high-quality photos (max 5MB each)</p>
                    <div className="bg-gradient-to-br from-muted to-muted/80 rounded-2xl border border-border shadow-sm min-h-[180px] md:min-h-[200px] p-3 md:p-4">
                        <ImageUpload
                            value={images}
                            onChange={setImages}
                            maxImages={5}
                            maxSize={5}
                            emptyStateTitle="Upload Gallery"
                        />
                    </div>

                    {/* Image Count Indicator */}
                    {images.length > 0 && (
                        <div className="flex items-center justify-between px-2 py-2 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Upload className="w-4 h-4 text-slate-400" />
                                <span className="text-xs text-slate-600 font-medium">
                                    {images.length} / 5 uploaded
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setImages([])}
                                className="text-xs text-forest-green-600 hover:text-forest-green-700 font-medium"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Guidelines */}
            <div className="p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-blue-800">Upload Guidelines</p>
                        <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Use bright, well-lit photos</li>
                            <li>• Show rooms, common areas, and amenities</li>
                            <li>• Avoid blurry or dark images</li>
                            <li>• First image will be the cover photo</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
