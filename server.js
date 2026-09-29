const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 56611;

app.use(express.static('public'));
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'capa') {
            cb(null, 'public/imagens');
        } else if (file.fieldname === 'musica') {
            cb(null, 'public/musicas');
        }
    },
    filename: (req, file, cb) => {
        const nomeUnico = Date.now() + path.extname(file.originalname);
        cb(null, nomeUnico);
    }
});

const upload = multer({ storage: storage });

app.get('/musicas', (req, res) => {
    fs.readFile('musicas.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler o arquivo json.');
        }
        res.json(JSON.parse(data));
    });
});

app.post('/musicas', upload.fields([{ name: 'capa' }, { name: 'musica' }]), (req, res) => {
    const { nome, artista } = req.body;
    const capaFile = req.files['capa'] ? req.files['capa'][0] : null;
    const musicaFile = req.files['musica'] ? req.files['musica'][0] : null;

    if (!nome || !artista || !capaFile || !musicaFile) {
        return res.status(400).send('Preencha todos os campos e envie os arquivos.');
    }

    const novaMusica = {
        nome: nome,
        artista: artista,
        capa: `imagens/${capaFile.filename}`,
        musica: `musicas/${musicaFile.filename}`
    };

    fs.readFile('musicas.json', 'utf8', (err, data) => {
        let musicas = [];
        if (!err && data) {
            musicas = JSON.parse(data);
        }
        musicas.push(novaMusica);
        fs.writeFile('musicas.json', JSON.stringify(musicas, null, 4), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar no arquivo.');
            }
            res.status(201).json(novaMusica);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});