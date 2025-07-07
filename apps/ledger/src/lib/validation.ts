import { z } from "zod";

// UUID validation schema
const uuidSchema = z.string().uuid();

/**
 * Validates if a string is a valid UUID
 * @param id - The string to validate
 * @returns object with isValid boolean and error message if invalid
 */
export const validateUUID = (id: string): { isValid: boolean; error?: string } => {
  const result = uuidSchema.safeParse(id);
  
  if (!result.success) {
    return {
      isValid: false,
      error: "Invalid UUID format"
    };
  }
  
  return { isValid: true };
};

/**
 * Validates multiple UUIDs
 * @param ids - Array of strings to validate
 * @returns object with isValid boolean and errors array if any are invalid
 */
export const validateUUIDs = (ids: string[]): { isValid: boolean; errors?: string[] } => {
  const errors: string[] = [];
  
  ids.forEach((id, index) => {
    const validation = validateUUID(id);
    if (!validation.isValid) {
      errors.push(`Invalid UUID at position ${index}: ${id}`);
    }
  });
  
  if (errors.length > 0) {
    return {
      isValid: false,
      errors
    };
  }
  
  return { isValid: true };
};