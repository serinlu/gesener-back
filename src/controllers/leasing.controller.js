import Leasing from '../models/leasing.model.js'
import Brand from '../models/brand.model.js'

export const createLeasing = async (req, res) => {
    try {
        const { name, model, brand, description, manual, sheet, image } = req.body

        if (!brand) {
            return res.status(400).json({ message: 'Debe seleccionar una marca' })
        }

        const existingBrand = await Brand.findById(brand)

        if (!existingBrand) {
            return res.status(400).json({ message: 'La marca no existe' })
        }

        const newLeasing = new Leasing({
            name,
            model,
            description,
            manual,
            sheet,
            image,
            brand: existingBrand._id
        })

        const savedLeasing = await newLeasing.save()
        res.status(201).json(savedLeasing)
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el leasing', error })
    }
}

export const getLeasings = async (req, res) => {
    try {
        const leasings = await Leasing.find().populate('brand', 'name')
        res.status(200).json(leasings)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los leasings', error })
    }
}

export const getLeasingById = async (req, res) => {
    try {
        const leasing = await Leasing.findById(req.params.id).populate('brand', 'name')

        if (!leasing) {
            return res.status(404).json({ message: 'El leasing no existe' })
        }

        res.status(200).json(leasing)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el leasing', error })
    }
}

export const updateLeasing = async (req, res) => {
    try {
        const { name, model, brand, description, manual, sheet, image } = req.body

        let updateFields = { name, model, brand, description, manual, sheet, image }

        if (brand) {
            const existingBrand = await Brand.findById(brand)

            if (!existingBrand) {
                return res.status(400).json({ message: 'La marca no existe' });
            }

            // Asignar el ID de la marca existente
            updateFields.brand = existingBrand._id;
        }

        const updatedLeasing = await Leasing.findByIdAndUpdate(req.params.id, updateFields, { new: true })

        if (!updatedLeasing) {
            return res.status(404).json({ message: 'El arrendamiento no existe' })
        }

        res.status(200).json(updatedLeasing)
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el arrendamiento', error: error.message })
    }
}

export const deleteLeasing = async (req, res) => {
    try {
        const deletedLeasing = await Leasing.findByIdAndDelete(req.params.id)

        if (!deletedLeasing) {
            return res.status(404).json({ message: 'El arrendamiento no existe' })
        }

        res.status(200).json({ message: 'Arrendamiento eliminado' })
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el arrendamiento', error: error.message })
    }
}

//endpoints para almacenar fichas tecnicas y manuales
import { manualBucket } from '../../config/gcpManualStorage.js'

export const uploadManual = async (req, res) => {
    try {
        // Verificar que el archivo esté presente
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha proporcionado ningún archivo' });
        }

        // Nombre original del archivo como destino
        const { originalname } = req.file;
        const file = manualBucket.file(originalname);

        // Crear flujo de subida
        const stream = file.createWriteStream({
            metadata: { contentType: req.file.mimetype },
            predefinedAcl: 'publicRead', // Configurar para hacer que el archivo sea público
        });

        stream.on('error', (error) => {
            res.status(500).json({ message: 'Error subiendo la imagen', error: error.message });
        });

        stream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${manualBucket.name}/${originalname}`;
            res.status(200).json({ message: 'Imagen subida exitosamente', imageUrl: publicUrl });
        });

        stream.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ message: 'Error subiendo la imagen', error: error.message });
    }
};

export const listManuals = async (req, res) => {
    try {
        // Obtener los parámetros de paginación del cliente, con valores predeterminados
        const { page = 1, limit = 12 } = req.query;

        // Convertir los valores a números
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Obtener todos los archivos en el bucket
        const [files] = await manualBucket.getFiles();

        // Calcular el rango para la paginación
        const startIndex = (pageNumber - 1) * limitNumber;
        const endIndex = startIndex + limitNumber;

        // Filtrar los archivos para obtener solo los de la página solicitada
        const paginatedFiles = files.slice(startIndex, endIndex);

        // Mapear los archivos para incluir metadata y la URL pública
        const manuals = await Promise.all(
            paginatedFiles.map(async (file) => {
                const [metadata] = await file.getMetadata();
                return {
                    name: file.name,
                    url: `https://storage.googleapis.com/${manualBucket.name}/${file.name}`, // URL pública
                    size: metadata.size, // Tamaño en bytes
                };
            })
        );

        // Devolver la respuesta con los datos paginados y la información de paginación
        res.status(200).json({
            data: manuals,
            currentPage: pageNumber,
            totalPages: Math.ceil(files.length / limitNumber),
            totalImages: files.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al listar las imágenes', error: error.message });
    }
};

export const deleteManual = async (req, res) => {
    try {
        const { manualName } = req.params;
        const file = manualBucket.file(manualName);

        const [exists] = await file.exists();
        if (!exists) {
            return res.status(404).json({ message: 'manual no encontrado' });
        }

        await file.delete();
        res.status(200).json({ message: 'manual eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando el manual', error: error.message });
    }
};


import { sheetBucket } from '../../config/gcpSheetStorage.js';

export const uploadSheet = async (req, res) => {
    try {
        // Verificar que el archivo esté presente
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha proporcionado ningún archivo' });
        }

        // Nombre original del archivo como destino
        const { originalname } = req.file;
        const file = sheetBucket.file(originalname);

        // Crear flujo de subida
        const stream = file.createWriteStream({
            metadata: { contentType: req.file.mimetype },
            predefinedAcl: 'publicRead', // Configurar para hacer que el archivo sea público
        });

        stream.on('error', (error) => {
            res.status(500).json({ message: 'Error subiendo la ficha', error: error.message });
        });

        stream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${sheetBucket.name}/${originalname}`;
            res.status(200).json({ message: 'Ficha subida exitosamente', imageUrl: publicUrl });
        });

        stream.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ message: 'Error subiendo la ficha', error: error.message });
    }
};

export const listSheets = async (req, res) => {
    try {
        // Obtener los parámetros de paginación del cliente, con valores predeterminados
        const { page = 1, limit = 12 } = req.query;

        // Convertir los valores a números
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Obtener todos los archivos en el bucket
        const [files] = await sheetBucket.getFiles();

        // Calcular el rango para la paginación
        const startIndex = (pageNumber - 1) * limitNumber;
        const endIndex = startIndex + limitNumber;

        // Filtrar los archivos para obtener solo los de la página solicitada
        const paginatedFiles = files.slice(startIndex, endIndex);

        // Mapear los archivos para incluir metadata y la URL pública
        const sheets = await Promise.all(
            paginatedFiles.map(async (file) => {
                const [metadata] = await file.getMetadata();
                return {
                    name: file.name,
                    url: `https://storage.googleapis.com/${sheetBucket.name}/${file.name}`, // URL pública
                    size: metadata.size, // Tamaño en bytes
                };
            })
        );

        // Devolver la respuesta con los datos paginados y la información de paginación
        res.status(200).json({
            data: sheets,
            currentPage: pageNumber,
            totalPages: Math.ceil(files.length / limitNumber),
            totalImages: files.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al listar las fichas', error: error.message });
    }
};

export const deleteSheet = async (req, res) => {
    try {
        const { sheetName } = req.params;
        const file = sheetBucket.file(sheetName);

        const [exists] = await file.exists();
        if (!exists) {
            return res.status(404).json({ message: 'ficha no encontrada' });
        }

        await file.delete();
        res.status(200).json({ message: 'ficha eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando la ficha', error: error.message });
    }
};