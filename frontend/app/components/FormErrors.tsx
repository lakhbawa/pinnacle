function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// Optional: Define custom labels for fields
const fieldLabels: Record<string, string> = {
  userId: 'User ID',
  title: 'Title',
  whyItMatters: 'Why It Matters',
  successMetricValue: 'Success Metric Value',
  successMetricUnit: 'Success Metric Unit',
  deadline: 'Deadline',
};

function getLabel(field: string): string {
  return fieldLabels[field] || formatFieldName(field);
}

export default function FormErrors({
  errors
}: {
  errors: Record<string, string[]> | null
}) {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <p className="text-red-800 font-medium mb-2">Please fix the following errors:</p>
      <ul className="list-disc list-inside space-y-1">
        {Object.entries(errors).map(([field, messages]) => (
          messages.map((message, index) => (
            <li key={`${field}-${index}`} className="text-red-600 text-sm">
              <span className="font-medium">{getLabel(field)}:</span> {message}
            </li>
          ))
        ))}
      </ul>
    </div>
  );
}