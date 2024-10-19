import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebaseConfig";

export async function fetchFile(filePath: string): Promise<string> {
  try {
    const fileRef = ref(storage, filePath);
    console.log(fileRef)
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}
