type IncludeTree = Record<string, true | { include: IncludeTree }>;

export function buildInclude(paths: string[]): IncludeTree {
  const include: IncludeTree = {};

  for (const path of paths) {
    const parts = path.split('.');
    let current: IncludeTree = include;

    parts.forEach((part, index) => {
      const isLeaf = index === parts.length - 1;

      if (!current[part]) {
        current[part] = isLeaf ? true : { include: {} };
      } else if (current[part] === true && !isLeaf) {
        // If it was previously set to true but we need to go deeper, convert it
        current[part] = { include: {} };
      }

      if (!isLeaf) {
        current = (current[part] as { include: IncludeTree }).include;
      }
    });
  }

  return include;
}

export function normalizeQueryArray(query: any, field: string) {
  return ([] as string[]).concat(query[field] ?? query[field + '[]'] ?? []);
}
