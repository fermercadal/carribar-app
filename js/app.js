// Ubicación del mapa
const villaMaria = {lat: -32.410461, lng: -63.243645};

// Clases
class Carrito {
  constructor(nombre, ubicacionLat, ubicacionLng, descripcion) {
    this.nombre = nombre;
    this.ubicacion = {
      lat: ubicacionLat,
      lng: ubicacionLng
    };
    this.descripcion = descripcion;
  }
}
//
class CarritosLista {
  constructor() {
    this.listOfCarritos = [];
  }

  add(carrito) {
    this.listOfCarritos.push(carrito);
  } 

  printMap() {
    // Crear mapa
    var carritosMap = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: villaMaria
    });
    // Crear marcadores para cada carrito
    this.listOfCarritos.forEach(function(carrito, index, arr){
      // Ubicación
      let thisCarri = carrito.ubicacion;
      // Tooltip
      let thisCarriData = '<div><h2>' + carrito.nombre + '</h2>' +
                          '<p><strong>' + carrito.descripcion + '</strong></p></div>';
      let carriData = new google.maps.InfoWindow({
        content: thisCarriData
      });
      // Marcador
      let carritoMarker = new google.maps.Marker({
        map: carritosMap,
        animation: google.maps.Animation.DROP,
        label: {
          text: carrito.nombre,
          color: "#840404",
          fontSize: "0.8rem",
          fontWeight: "600",
        },
        position: thisCarri,
        icon: {
            url: 'assets/carrito-marker.png',
            size: new google.maps.Size(31, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 40),
            labelOrigin: new google.maps.Point(14, 55)
        }
      });
      carritoMarker.addListener('click', function() {
        carriData.open(carritosMap, carritoMarker);
      });
    });
  }
}

// Crear lista de carritos
let carritos = new CarritosLista();

// Traer lista JSON + imprimir mapa
var getJSON = function(url, successHandler, errorHandler) {
	var xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.responseType = 'json';
	xhr.onload = function() {
		var status = xhr.status;
		if (status == 200) {
			successHandler && successHandler(xhr.response);
		} else {
			errorHandler && errorHandler(status);
		}
	};
	xhr.send();
};
getJSON('http://localhost/carri-bar/js/carritos.json', function(data) {
  var carritosJSON = data;
  carritosJSON.forEach(function(carrito){
    // Agregar carrutos a la lista
    let thisCarrito = new Carrito(carrito.nombre, carrito.ubicacion['lat'], carrito.ubicacion['lng'], carrito.descripcion);
    carritos.add(thisCarrito);
    // Imprimir el mapa
    carritos.printMap();
  })
}, function(status) {
	alert('Something went wrong.');
});