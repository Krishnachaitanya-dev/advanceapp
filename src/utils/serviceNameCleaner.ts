
// Helper function for development logging
const devLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[serviceNameCleaner] ${message}`, ...args);
  }
};

export const getCleanServiceName = (serviceName: string): string => {
  if (!serviceName) return 'Service';
  
  devLog('Original service name:', serviceName);
  
  // Remove common separators and split
  const separatorRegex = /\s*[-–—|,]\s*/g;
  const parts = serviceName.split(separatorRegex);
  
  devLog('Split parts:', parts);
  
  // Clean each part and remove empty strings
  const cleanedParts = parts
    .map(part => part.trim())
    .filter(part => part.length > 0);
  
  devLog('Cleaned parts:', cleanedParts);
  
  // More aggressive duplicate removal - normalize and compare
  const normalizedParts = cleanedParts.map(part => part.toLowerCase().replace(/\s+/g, ' ').trim());
  
  // Find the first unique part by checking if it's already included in previous parts
  const uniqueParts = [];
  const seen = new Set<string>();
  
  for (let i = 0; i < normalizedParts.length; i++) {
    const normalized = normalizedParts[i];
    const original = cleanedParts[i];
    
    // Check if this normalized part is similar to any we've already seen
    let isDuplicate = false;
    
    for (const seenPart of seen) {
      // Check for exact match or if one contains the other
      if (normalized === seenPart || 
          normalized.includes(seenPart) || 
          seenPart.includes(normalized)) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      seen.add(normalized);
      uniqueParts.push(original);
    }
  }
  
  devLog('Unique parts after aggressive filtering:', uniqueParts);
  
  // If we still have multiple parts, try to find the most meaningful one
  if (uniqueParts.length > 1) {
    // Prefer parts that are not just service types like "Wash & Fold"
    const meaningfulParts = uniqueParts.filter(part => 
      !part.toLowerCase().includes('wash') &&
      !part.toLowerCase().includes('fold') &&
      !part.toLowerCase().includes('iron') &&
      !part.toLowerCase().includes('steam')
    );
    
    if (meaningfulParts.length > 0) {
      devLog('Using meaningful part:', meaningfulParts[0]);
      return meaningfulParts[0];
    }
  }
  
  // Return the first unique part or fallback
  const result = uniqueParts[0] || 'Service';
  devLog('Final result:', result);
  return result;
};

// New function to check if two names are essentially the same
export const areNamesEquivalent = (name1: string, name2: string): boolean => {
  if (!name1 || !name2) return false;
  
  const normalized1 = name1.toLowerCase().trim();
  const normalized2 = name2.toLowerCase().trim();
  
  // Exact match
  if (normalized1 === normalized2) return true;
  
  // One contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;
  
  return false;
};

// New function to get the best display name from service name and item name
export const getBestDisplayName = (serviceName: string, itemName: string | null): string => {
  const cleanServiceName = getCleanServiceName(serviceName);
  
  if (!itemName) return cleanServiceName;
  
  // If they're equivalent, return the longer/more descriptive one
  if (areNamesEquivalent(cleanServiceName, itemName)) {
    return cleanServiceName.length >= itemName.length ? cleanServiceName : itemName;
  }
  
  // If service name already contains item name, just return service name
  if (cleanServiceName.toLowerCase().includes(itemName.toLowerCase())) {
    return cleanServiceName;
  }
  
  // If item name contains service name, return item name
  if (itemName.toLowerCase().includes(cleanServiceName.toLowerCase())) {
    return itemName;
  }
  
  // If they're genuinely different, combine them
  return `${itemName} - ${cleanServiceName}`;
};
