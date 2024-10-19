import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebaseConfig";
import { fetchFile } from "@/utils/firebase/fetchStorage"; // Adjust the import path as needed

// Mock Firebase Storage functions
jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  getDownloadURL: jest.fn(),
}));

// Mock the storage object
jest.mock("@/firebaseConfig", () => ({
  storage: {},
}));

describe("fetchFile", () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch file URL successfully", async () => {
    const mockFilePath = "path/to/file.jpg";
    const mockDownloadURL = "https://example.com/file.jpg";

    // Mock the ref function
    (ref as jest.Mock).mockReturnValue({ /* mock file reference */ });

    // Mock the getDownloadURL function
    (getDownloadURL as jest.Mock).mockResolvedValue(mockDownloadURL);

    const result = await fetchFile(mockFilePath);

    expect(ref).toHaveBeenCalledWith(storage, mockFilePath);
    expect(getDownloadURL).toHaveBeenCalled();
    expect(result).toBe(mockDownloadURL);
  });

  it("should throw an error when fetching fails", async () => {
    const mockFilePath = "path/to/nonexistent-file.jpg";
    const mockError = new Error("File not found");

    // Mock the ref function
    (ref as jest.Mock).mockReturnValue({ /* mock file reference */ });

    // Mock the getDownloadURL function to throw an error
    (getDownloadURL as jest.Mock).mockRejectedValue(mockError);

    await expect(fetchFile(mockFilePath)).rejects.toThrow("File not found");

    expect(ref).toHaveBeenCalledWith(storage, mockFilePath);
    expect(getDownloadURL).toHaveBeenCalled();
  });

  it("should log error to console when fetching fails", async () => {
    const mockFilePath = "path/to/nonexistent-file.jpg";
    const mockError = new Error("File not found");

    // Mock console.error
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    // Mock the ref function
    (ref as jest.Mock).mockReturnValue({ /* mock file reference */ });

    // Mock the getDownloadURL function to throw an error
    (getDownloadURL as jest.Mock).mockRejectedValue(mockError);

    await expect(fetchFile(mockFilePath)).rejects.toThrow("File not found");

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching file:", mockError);

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
