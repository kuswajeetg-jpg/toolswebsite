import { Metadata } from "next";
import ResizeClient from "./ResizeClient";

export const metadata: Metadata = {
  title: "Resize Photo by KB - Free Image Compressor",
  description: "Compress your image to an exact KB size for government forms, applications, and more.",
};

export default function ResizePhotoKbPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Resize Photo by KB</h1>
        <p className="text-gray-600">Compress your image to an exact KB size for government forms or applications.</p>
      </div>

      <ResizeClient initialKb={50} />
    </div>
  );
}
