function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export default function FieldError({
  errors,
  field,
}: {
  errors: Record<string, string[]> | null;
  field: string;
}) {
  if (!errors || !errors[field]) return null;
  return (
    <p className="text-red-500 text-sm mt-1">
      <span className="font-medium">{formatFieldName(field)}:</span> {errors[field][0]}
    </p>
  );
}