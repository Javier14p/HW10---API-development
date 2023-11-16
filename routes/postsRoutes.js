const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Aquí irán las rutas CRUD, PATCH, HEADER, OPTION, TRACE
// la ruta GET:
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// ... imports previos ...

// POST - Crear una nueva publicación
const upload = require('../middlewares/upload');

router.post('/', upload.single('imagen'), async (req, res) => {
    console.log(req.file);
    try {
        const { titulo, cuerpo, tipo, fecha } = req.body;
        const imagen = req.file ? req.file.path : null; // Aquí obtienes la ruta de la imagen
        const newPost = await Post.create({ titulo, cuerpo, tipo, fecha, imagen });
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error); 
        res.status(500).send('Error al crear publicación');
    }
});

// PUT - Actualizar una publicación
router.put('/:id', upload.single('imagen'), async (req, res) => {
    console.log(req.file);  // Imprimir la información del archivo
    console.log(req.body); // Ver qué datos están llegando
    console.log(req.params.id); // Ver el ID que se está pasando
    
    let imagenPath = req.file ? `uploads/${req.file.filename}` : undefined; 
    
    if (imagenPath) {
        imagenPath = imagenPath.replace(/\\/g, '/');
    }

    try {
        const { titulo, cuerpo, tipo, fecha } = req.body;
        await Post.update({ titulo, cuerpo, tipo, fecha, imagen: imagenPath }, { where: { id: req.params.id } });
        res.json({ message: 'Publicación actualizada correctamente' });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Error al actualizar publicación' });
    }
});


// DELETE - Eliminar una publicación
router.delete('/:id', async (req, res) => {
    try {
        await Post.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Publicación eliminada correctamente' });  // Cambio aquí
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar publicación' });  // Y aquí también
    }
});


// PATCH - Actualizar solo el título de una publicación
router.patch('/:id', async (req, res) => {
    try {
        console.log("PATCH request received for post:", req.params.id);
        console.log("Data received:", req.body);
        const { titulo } = req.body;
        await Post.update({ titulo }, { where: { id: req.params.id } });
        res.json({ message: 'Título actualizado correctamente' });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Error al actualizar título' });
    }
});

router.options('/', (req, res) => {
    res.header('Allow', 'GET, POST, PUT, DELETE, PATCH, HEAD, TRACE');
    res.status(204).send();  // 204 No Content indica que la petición ha sido procesada correctamente pero que no necesita enviar ninguna información de vuelta
});

// router.head('/:id', async (req, res) => {
//     try {
//         const post = await Post.findByPk(req.params.id);
//         if (!post) {
//             res.status(404).end(); // No se encontró el recurso
//             return;
//         }
//         res.status(200).end(); // Todo salió bien, sin cuerpo pero con respuesta
//     } catch (error) {
//         console.error(error);
//         res.status(500).end(); // Error del servidor
//     }
// });
router.head('/:id', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            res.status(404).end(); // No se encontró el recurso
            return;
        }

        // Establecer los headers personalizados
        res.set('Content-Type', 'application/json');
        res.set('Custom-Header', 'PHP, HTML, JavaScript');
        res.set('X-API-Version', '1.0');

        // Termina la respuesta sin enviar ningún cuerpo
        res.status(200).end(); // Todo salió bien, sin cuerpo pero con respuesta
    } catch (error) {
        console.error(error);
        res.status(500).end(); // Error del servidor
    }
});


router.trace('/', (req, res) => {
    console.log("TRACE request received");
    res.send(req.headers);
});

module.exports = router;
