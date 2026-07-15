function toPlainText(raw: unknown): string {
  if (raw == null) return '';
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'number' || typeof raw === 'boolean') return String(raw);

  if (Array.isArray(raw)) {
    return raw.map(toPlainText).filter(Boolean).join(' ');
  }

  if (typeof raw === 'object') {
    const fields = raw as Record<string, unknown>;
    if (typeof fields.value === 'string' || typeof fields.value === 'number' || typeof fields.value === 'boolean') {
      return String(fields.value);
    }
    if (fields.jsonValue) {
      return toPlainText((fields.jsonValue as Record<string, unknown>)?.value ?? fields.jsonValue);
    }
    for (const key of ['text', 'value', 'raw', 'caption', 'heading', 'title', 'name']) {
      if (fields[key]) {
        return toPlainText(fields[key]);
      }
    }
  }

  return '';
}

function stripHtml(text: string): string {
  return text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\b[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatText(raw: unknown): string | undefined {
  const text = toPlainText(raw).trim();
  if (!text) return undefined;
  return stripHtml(text);
}

function extractFieldText(fieldName: string, fieldValue: unknown, headingLevel: number): string[] {
  const lines: string[] = [];
  const text = formatText(fieldValue);
  if (!text) return lines;

  const headingNames = ['title', 'heading', 'headline', 'name', 'pageTitle'];
  const lowerName = fieldName.toLowerCase();
  const isHeading = headingNames.some((candidate) => lowerName.includes(candidate));

  if (isHeading) {
    const level = Math.min(Math.max(1, headingLevel), 3);
    lines.push(`${'#'.repeat(level)} ${text}`);
    return lines;
  }

  if (Array.isArray(fieldValue)) {
    const items = fieldValue
      .map((item) => formatText(item))
      .filter((item): item is string => typeof item === 'string');
    items.forEach((item) => lines.push(`- ${item}`));
    return lines;
  }

  lines.push(text);
  return lines;
}

function appendUnique(lines: string[], candidate: string): void {
  const normalized = candidate.trim();
  if (!normalized) return;
  if (lines.includes(normalized)) return;
  lines.push(normalized);
}

function parseRendering(rendering: unknown, headingLevel: number, lines: string[]): void {
  if (!rendering || typeof rendering !== 'object') return;

  const node = rendering as Record<string, unknown>;
  const componentName = (node.componentName as string) || (node.name as string) || '';
  const componentHeading = formatText(componentName);
  if (componentHeading && headingLevel <= 3) {
    appendUnique(lines, `${'#'.repeat(Math.min(3, headingLevel))} ${componentHeading}`);
  }

  const fields = (node.fields as Record<string, unknown>) ||
    (node.params as Record<string, unknown>) ||
    (node.properties as Record<string, unknown>) ||
    {};

  Object.entries(fields).forEach(([name, value]) => {
    const extracted = extractFieldText(name, value, headingLevel + 1);
    extracted.forEach((line) => appendUnique(lines, line));
  });

  const placeholders = node.placeholders as Record<string, unknown> | undefined;
  if (placeholders && typeof placeholders === 'object') {
    Object.values(placeholders).forEach((placeholder) => {
      if (Array.isArray(placeholder)) {
        placeholder.forEach((child) => parseRendering(child, headingLevel + 1, lines));
      }
    });
  }

  const renderings = node.renderings as unknown[] | undefined;
  if (renderings) {
    renderings.forEach((child) => parseRendering(child, headingLevel + 1, lines));
  }
}

function parsePlaceholders(placeholders: Record<string, unknown> | undefined, headingLevel: number, lines: string[]): void {
  if (!placeholders || typeof placeholders !== 'object') return;

  Object.values(placeholders).forEach((placeholder) => {
    if (Array.isArray(placeholder)) {
      placeholder.forEach((rendering) => parseRendering(rendering, headingLevel, lines));
    } else if (typeof placeholder === 'object') {
      parseRendering(placeholder, headingLevel, lines);
    }
  });
}

export function generateMarkdownFromRoute(route: unknown): string {
  const lines: string[] = [];
  const routeObj = (route && typeof route === 'object') ? (route as Record<string, unknown>) : {};
  const routeFields = (routeObj.fields && typeof routeObj.fields === 'object') ? (routeObj.fields as Record<string, unknown>) : undefined;

  const title = formatText(
    routeFields?.pageTitle ??
      ((routeFields?.title && typeof routeFields.title === 'object') ? ((routeFields.title as Record<string, unknown>)?.value) : undefined) ??
      routeFields?.title
  );
  if (title) {
    appendUnique(lines, `# ${title}`);
  }

  const description = formatText(
    routeFields?.metadataDescription ?? routeFields?.pageSummary ?? routeFields?.description
  );
  if (description) {
    appendUnique(lines, description);
  }

  parsePlaceholders((routeObj.placeholders && typeof routeObj.placeholders === 'object') ? (routeObj.placeholders as Record<string, unknown>) : undefined, 2, lines);

  const renderings = Array.isArray(routeObj.renderings) ? routeObj.renderings : undefined;
  if (renderings) {
    renderings.forEach((rendering) => parseRendering(rendering, 2, lines));
  }

  if (lines.length === 0) {
    return '# No content available for AI Markdown';
  }

  return lines.join('\n\n');
}
