export class JsonPathParser {
  static parse(obj: any, path: string, context?: any): any {
    // Remove whitespace and split into parts
    const parts = path.trim().split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      
      // Handle special tokens
      if (part === '*') {
        // Use context key if available
        if (context && context.key) {
          current = current[context.key];
        }
      } else if (part === '$key') {
        return context?.key;
      } else if (part === '$index') {
        return context?.index;
      } else if (part === '$value') {
        return current;
      } else {
        // Remove any quotes
        const cleanPart = part.replace(/['"]/g, '');
        current = current[cleanPart];
      }
      
      if (current === undefined) return null;
    }
    
    return current;
  }

  static validate(path: string): boolean {
    // Add path validation logic
    const validTokens = ['*', '$key', '$index', '$value'];
    const parts = path.trim().split('.');
    
    return parts.every(part => {
      const cleanPart = part.trim();
      return validTokens.includes(cleanPart) || 
             /^[\w\s-]+$/.test(cleanPart) ||
             /^["'][\w\s-]+["']$/.test(cleanPart);
    });
  }
} 