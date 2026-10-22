
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import { getDatabase, ref, set, onValue, push} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";



const firebaseConfig = {
    apiKey: "AIzaSyDi6ZeyhrfVql6E3f8o54XQ4yU_5ekMyzw",
    authDomain: "stockmusica.firebaseapp.com",
    projectId: "stockmusica",
    storageBucket: "stockmusica.firebasestorage.app",
    messagingSenderId: "298596348310",
    appId: "1:298596348310:web:20e7df1d9d91411894edb7"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


let nombreINGRESADO = document.querySelector("#nombreINGRESADO");
let artistaINGRESADO = document.querySelector("#artistaINGRESADO");
let generoINGRESADO = document.querySelector("#generoINGRESADO");
let unidadesINGRESADO = document.querySelector("#unidadesINGRESADO");
let precioINGRESADO = document.querySelector("#precioINGRESADO");

let btnpublicar = document.querySelector(".btn-publicar");
let productosRef = ref(db, 'Productos');


let btnVerFormulario = document.getElementById("btnVerFormulario");
let btnVerBuscador = document.getElementById("btnVerBuscador");
let seccionRegistrar = document.getElementById("seccionRegistrar");
let seccionBuscador = document.getElementById("seccionBuscador");


let contenedorRecienCargado = document.getElementById("contenedorRecienCargado");
let tablaUltimoProducto = document.getElementById("tablaUltimoProducto");

let inputBusqueda = document.getElementById("inputBusqueda");
let tablaProductos = document.querySelector(".tabla-productos");
let vistaVacia = document.getElementById("vista-vacia");
let vistaTabla = document.getElementById("vista-tabla");


let todosLosProductos = {};


btnVerFormulario.onclick = function () {
    seccionRegistrar.style.display = "block";
    seccionBuscador.style.display = "none";
};

btnVerBuscador.onclick = function () {
    seccionRegistrar.style.display = "none";
    seccionBuscador.style.display = "block";
};


btnpublicar.onclick = function () {
    if (nombreINGRESADO.value.trim() == "") {
        alert("Por favor ingresa al menos el nombre del producto.");
        return;
    }
    push(productosRef, {
        nombre: nombreINGRESADO.value,
        artista: artistaINGRESADO.value,
        genero: generoINGRESADO.value,
        unidades: unidadesINGRESADO.value,
        precio: precioINGRESADO.value
    })
    .then((respuesta) => {
        alert("Producto agregado correctamente");
        tablaUltimoProducto.innerHTML = `
            <tr>
                <td>${respuesta.key.slice(-6)}</td>
                <td>${nombreINGRESADO.value}</td>
                <td>${artistaINGRESADO.value}</td>
                <td>${generoINGRESADO.value}</td>
                <td>${unidadesINGRESADO.value}</td>
                <td>$${precioINGRESADO.value}</td>
            </tr>
        `;
        contenedorRecienCargado.style.display = "block";
        nombreINGRESADO.value = "";
        artistaINGRESADO.value = "";
        generoINGRESADO.value = "";
        unidadesINGRESADO.value = "";
        precioINGRESADO.value = "";
    })
    .catch((error) => {
        alert("Error al agregar producto: " + error.message);
    });
};



onValue(productosRef, (snapshot) => {
    todosLosProductos = snapshot.val() || {};
    filtrarTablaGeneral();
});

function filtrarTablaGeneral() {
    tablaProductos.innerHTML = "";

    if (!todosLosProductos || Object.keys(todosLosProductos).length === 0) {
        vistaVacia.style.display = "block";
        vistaTabla.style.display = "none";
        return;
    }

    let termino = inputBusqueda.value.toLowerCase().trim();
    let contadorCoincidencias = 0;

    for (let id in todosLosProductos) {
        let prod = todosLosProductos[id];
        let nombre;
        if (prod.nombre) {
        nombre = prod.nombre.toLowerCase(); 
        } else {
        nombre = ""; 
        }
        let artista;
        if (prod.artista) {
        artista = prod.artista.toLowerCase(); 
        } else {
        artista = "";
        }

        if (termino === "" || artista.includes(termino) || nombre.includes(termino)) {
            contadorCoincidencias = contadorCoincidencias + 1
            tablaProductos.innerHTML += `
                <tr>
                    <td>${id.slice(-6)}</td>
                    <td>${prod.nombre}</td>
                    <td>${prod.artista}</td>
                    <td>${prod.genero}</td>
                    <td>${prod.unidades}</td>
                    <td>$${prod.precio}</td>
                </tr>
            `;
        }
    }

    if (contadorCoincidencias === 0) {
        vistaVacia.style.display = "block";
        vistaTabla.style.display = "none";
    } else {
        vistaVacia.style.display = "none";
        vistaTabla.style.display = "block";
    }
}

inputBusqueda.oninput = function () {
    filtrarTablaGeneral();
};