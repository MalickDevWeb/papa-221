import { Router, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "qudmvipg",
  api_key: "423861318775332",
  api_secret: "LwQXYD_L2befowdg2wNItSF-s0A"
});

export const uploadRouter = Router();

uploadRouter.post("/upload", async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileStr } = req.body;
    if (!fileStr) {
      res.status(400).json({ error: "Aucun fichier fourni sous forme de chaîne de caractères Base64 (fileStr)" });
      return;
    }

    // Calcul de la taille approximative du fichier en octets
    const approxSizeBytes = Math.round((fileStr.length * 3) / 4);
    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo

    if (approxSizeBytes > MAX_SIZE_BYTES) {
      res.status(400).json({ error: "Le fichier dépasse la limite de taille autorisée de 10 Mo" });
      return;
    }

    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      resource_type: "auto",
      folder: "ecole221"
    });

    res.json({
      success: true,
      url: uploadResponse.secure_url,
      originalName: uploadResponse.original_filename
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: error.message || "Erreur de téléversement Cloudinary" });
  }
});
