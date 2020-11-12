const face_api = require('../face-api/faceapi');
////
const funciones = {};
const { personas } = require('../models/sequalizeModel');
const { entradas } = require('../models/sequalizeModel');

///Usuarios 
funciones.listarUsers = async (req, res) => {
    const lista = await personas.findAll();

    var transformado = [];
    for (let i = 0; i < lista.length; i=i+1) {
        transformado.push({
            id: lista[i].id,
            name: lista[i].name,
            address: lista[i].address,
            phone: lista[i].phone
        });
    }

    res.render('listaUsers', {
        data: transformado
    });
};

funciones.listarEnters = async (req, res) => {
    const result1 = await entradas.findAll();
    const lista = await personas.findAll();
    var transformado = [];
    for (let i = 0; i < lista.length; i=i+1) {
        transformado.push({
            id: lista[i].id,
            name: lista[i].name,
        });
    };

    res.render('listaEnters', {
        enters: result1,
        users: transformado
    });
};

funciones.newUser = async (req, res) => {
    res.render('nuevoUser');
};

funciones.addUser = async (req, res) => {
    const consultados = await personas.create(req.body);
    res.json(consultados);
};

funciones.newEnter = async (req, res) => {
    res.render('nuevoEnter');
};

funciones.deleteUser = async (req, res) => {
    await entradas.destroy({
        where: { persona_id : req.params.personaID }
    });
    await personas.destroy({
        where: { id : req.params.personaID }
    });
    const nuevos = await personas.findAll();
    res.redirect('/');
};

funciones.addEnter = async (req, res) => {  
    var i = 0;
    const lista = await personas.findAll();
    const muestrasDescriptors = face_api.saveMuestras;

    const respuesta = await face_api.start(req.body.image, muestrasDescriptors);  

    const distance = respuesta.distance;
    console.log(respuesta);


    if (respuesta.label == "unknown") {
        res.json({
            data: respuesta.label
        });
    }else{
        while (i<=lista.length){
            if (lista[i].id == respuesta.label){
                name = lista[i].name;
                id = lista[i].id;
                i = lista.length;
            };
            i++;
        };
        res.json({
            data: name,
            id : id,
            distance : distance
        });
    }
};

funciones.obtener = async (req, res) => {
    console.log(req.body);
    const respuesta = await entradas.create(req.body);
    res.json(respuesta);
};

module.exports = funciones;