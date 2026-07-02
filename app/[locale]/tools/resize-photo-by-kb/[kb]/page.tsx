import { Metadata } from "next";
import ResizeClient from "../ResizeClient";

interface Props {
  params: {
    kb: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const kb = params.kb;
  
  return {
    title: `Compress Image to ${kb}KB Online - Free Resizer`,
    description: `Easily compress and resize your photo or signature to exactly ${kb}KB for government forms, exams, or applications without losing quality.`,
  };
}

export default function DynamicResizePage({ params }: Props) {
  const targetKb = parseInt(params.kb, 10);
  const isValidKb = !isNaN(targetKb) && targetKb > 0;

  // Fallback to 50 if the URL parameter is invalid
  const finalKb = isValidKb ? targetKb : 50;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Compress Image to {finalKb}KB</h1>
        <p className="text-gray-600">Compress your photo, signature, or document to an exact size of {finalKb} KB.</p>
      </div>

      <ResizeClient initialKb={finalKb} />
    </div>
  );
}
