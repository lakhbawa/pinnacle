import { ZodError } from 'zod';

export function formatZodErrors(error: ZodError): Record<string, string[]> {
  return error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const field = issue.path.join('.') || 'root';

    if (!acc[field]) {
      acc[field] = [];
    }

    acc[field].push(issue.message);
    return acc;
  }, {});
}