// controllers/imageController.js
import { bucket } from "../../config/gcpStorage.js";
import sharp from "sharp";

export const uploadImage = async (req, res) => {
  try {
    // Verificar que el archivo esté presente
    if (!req.file) {
      console.error("No se ha proporcionado ningún archivo");
      return res
        .status(400)
        .json({ message: "No se ha proporcionado ningún archivo" });
    }

    // Tamaño original del archivo
    const originalSize = req.file.size;
    console.log(`Tamaño original del archivo: ${originalSize} bytes`);

    // Nombre original del archivo sin extensión
    const originalName = req.file.originalname
      .split(".")
      .slice(0, -1)
      .join(".");
    const optimizedFileName = `${originalName}.webp`;
    const file = bucket.file(optimizedFileName);

    const optimizedImageBuffer = await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    const optimizedSize = optimizedImageBuffer.length;
    console.log(`Tamaño después de la compresión: ${optimizedSize} bytes`);

    const reductionPercentage =
      ((originalSize - optimizedSize) / originalSize) * 100;
    console.log(`Reducción de tamaño: ${reductionPercentage.toFixed(2)}%`);

    // Crear flujo de subida
    const stream = file.createWriteStream({
      metadata: { contentType: "image/webp" },
      predefinedAcl: "publicRead", // Configurar para hacer que el archivo sea público
    });

    stream.on("error", (error) => {
      console.error("Error al subir la imagen:", error.message);
      res
        .status(500)
        .json({ message: "Error subiendo la imagen", error: error.message });
    });

    stream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${optimizedFileName}`;
      console.log(`Imagen subida exitosamente: ${publicUrl}`);
      res
        .status(200)
        .json({ message: "Imagen subida exitosamente", imageUrl: publicUrl });
    });

    stream.end(optimizedImageBuffer);
  } catch (error) {
    console.error("Error en el proceso de subida de la imagen:", error.message);
    res
      .status(500)
      .json({ message: "Error subiendo la imagen", error: error.message });
  }
};

// Obtener una lista de imágenes con URLs públicas y tamaños
export const listImages = async (req, res) => {
  try {
    // Obtener los parámetros de paginación del cliente, con valores predeterminados
    const { page = 1, limit = 12 } = req.query;

    // Convertir los valores a números
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Obtener todos los archivos en el bucket
    const [files] = await bucket.getFiles();

    // Calcular el rango para la paginación
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;

    // Filtrar los archivos para obtener solo los de la página solicitada
    const paginatedFiles = files.slice(startIndex, endIndex);

    // Mapear los archivos para incluir metadata y la URL pública
    const images = await Promise.all(
      paginatedFiles.map(async (file) => {
        const [metadata] = await file.getMetadata();
        return {
          name: file.name,
          url: `https://storage.googleapis.com/${bucket.name}/${file.name}`, // URL pública
          size: metadata.size, // Tamaño en bytes
        };
      })
    );

    // Devolver la respuesta con los datos paginados y la información de paginación
    res.status(200).json({
      data: images,
      currentPage: pageNumber,
      totalPages: Math.ceil(files.length / limitNumber),
      totalImages: files.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al listar las imágenes", error: error.message });
  }
};

export const listAllImages = async (req, res) => {
  try {
    // Obtener todos los archivos en el bucket
    const [files] = await bucket.getFiles();

    // Mapear los archivos para incluir metadata y la URL pública
    const images = await Promise.all(
      files.map(async (file) => {
        const [metadata] = await file.getMetadata();
        return {
          name: file.name,
          url: `https://storage.googleapis.com/${bucket.name}/${file.name}`, // URL pública
          size: metadata.size, // Tamaño en bytes
        };
      })
    );

    res.status(200).json({ data: images, totalImages: files.length });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al listar las imágenes", error: error.message });
  }
}

// Obtener una imagen por su nombre con URL pública y tamaño en bytes
export const getImage = async (req, res) => {
  try {
    const { imageName } = req.params;
    const file = bucket.file(imageName);

    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    const [metadata] = await file.getMetadata();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${imageName}`;

    res.status(200).json({
      name: imageName,
      url: publicUrl,
      size: metadata.size, // Tamaño en bytes
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error obteniendo la imagen", error: error.message });
  }
};

// Función para eliminar una imagen por su nombre
export const deleteImage = async (req, res) => {
  try {
    const { imageName } = req.params;
    const file = bucket.file(imageName);

    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    await file.delete();
    res.status(200).json({ message: "Imagen eliminada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error eliminando la imagen", error: error.message });
  }
};
