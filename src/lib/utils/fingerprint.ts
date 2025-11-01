import objectHash from 'object-hash';

export function itemFingerprint(item: any): string {
  if (!item) return '';
  // Usa prompt + subject como fingerprint principal
  const key = `${item.subject || ''}|${item.prompt?.slice(0, 100) || ''}|${item.location || ''}`;
  return objectHash(key);
}

export function itemDiffFields(left: any, right: any): string[] {
  const fields: string[] = [];
  if (!left || !right) {
    if (left) fields.push('added_in_v2');
    if (right) fields.push('removed_in_v2');
    return fields;
  }
  if (left.prompt !== right.prompt) fields.push('prompt');
  if (left.negative_prompt !== right.negative_prompt) fields.push('negative_prompt');
  if (left.subject !== right.subject) fields.push('subject');
  if (left.title !== right.title) fields.push('title');
  if (left.theme !== right.theme) fields.push('theme');
  if (left.location !== right.location) fields.push('location');
  if (left.cover_key !== right.cover_key) fields.push('cover_key');
  return fields;
}

