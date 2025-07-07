import { validateUUID, validateUUIDs } from "./validation";

describe("UUID Validation", () => {
  describe("validateUUID", () => {
    it("should return valid for a correct UUID", () => {
      const validUUID = "123e4567-e89b-12d3-a456-426614174000";
      const result = validateUUID(validUUID);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should return invalid for an incorrect UUID format", () => {
      const invalidUUID = "invalid-uuid";
      const result = validateUUID(invalidUUID);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid UUID format");
    });

    it("should return invalid for empty string", () => {
      const emptyString = "";
      const result = validateUUID(emptyString);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid UUID format");
    });

    it("should return invalid for UUID with wrong length", () => {
      const wrongLength = "123e4567-e89b-12d3-a456";
      const result = validateUUID(wrongLength);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid UUID format");
    });

    it("should return invalid for UUID with invalid characters", () => {
      const invalidChars = "123e4567-e89b-12d3-a456-42661417400g";
      const result = validateUUID(invalidChars);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid UUID format");
    });
  });

  describe("validateUUIDs", () => {
    it("should return valid for array of correct UUIDs", () => {
      const validUUIDs = [
        "123e4567-e89b-12d3-a456-426614174000",
        "987fcdeb-51a2-43d1-9876-543210987654"
      ];
      const result = validateUUIDs(validUUIDs);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it("should return invalid for array with some invalid UUIDs", () => {
      const mixedUUIDs = [
        "123e4567-e89b-12d3-a456-426614174000", // valid
        "invalid-uuid", // invalid
        "987fcdeb-51a2-43d1-9876-543210987654" // valid
      ];
      const result = validateUUIDs(mixedUUIDs);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0]).toContain("Invalid UUID at position 1");
    });

    it("should return valid for empty array", () => {
      const emptyArray: string[] = [];
      const result = validateUUIDs(emptyArray);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
    });
  });
});