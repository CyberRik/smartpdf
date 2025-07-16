'use client';

type Props = {
  summary: string;
};

export default function SummaryBox({ summary }: Props) {
  if (!summary) return null;

  return (
    <div className="bg-white border rounded-md p-4 max-h-64 overflow-y-auto">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">PDF Summary</h2>
      <p className="text-sm text-gray-600 whitespace-pre-wrap">{summary}</p>
    </div>
  );
}
// This component displays the summary of the uploaded PDF file.