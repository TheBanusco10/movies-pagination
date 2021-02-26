let arrayPeliculas = [];

let alerta;

if (window.localStorage.alerta) alerta = JSON.parse(window.localStorage.alerta);

$(function () {

	if (alerta) {
		mostrarAlerta();
	}else {
		$('#alerta').hide();
	}

	$.post("php/pagination.php?page=1", function (data) {
		let peliculas = '';

		peliculas = data.peliculas.map(({id, titulo, sinopsis, image}) => {
			return `<article id="${id}">
					<div class="imagenContenedor">
						<img class="imagen" src="${image}" />
					</div>
					<h3 class="titulo">${titulo}</h3>
					<p class="sinopsis">${sinopsis}</p>
					
				</article>`;
		}).join('');

		jQuery("#peliculas").html(peliculas);

		$('article').each(function () {
			guardarPelicula($(this));
		});
		
		if (data.rec.length > 0) {

			peliculas = data.rec.map(({id, titulo, sinopsis, image}) => {
				return `<article id="${id}" class="col-12 col-md-3">
						<div class="imagenContenedor">
							<img class="imagen" src="${image}" />
						</div>
						<h3 class="titulo">${titulo}</h3>
						<p class="sinopsis">${sinopsis}</p>
						<div class="acciones">
					
						<button id="editarBoton" data-toggle="modal" data-target="#editarPeliculaModal" class="btn btn-small btn-success" data-id="${id}">Editar</button>
						<button id="eliminarBoton" data-toggle="modal" data-target="#eliminarPeliculaModal" class="btn btn-small btn-danger" data-id="${id}">Eliminar</button>

						</div>
					</article>`;
			}).join('');

			jQuery("#peliculas").html(peliculas);
			jQuery("#append-pagination").html(data.pagination);

		}

	});

	$("#append-pagination").on("click", ".pagination a", function (e) {
		e.preventDefault();
		jQuery("#target-content").html('loading...');
		jQuery("#pagination li").removeClass('active');
		jQuery(this).addClass('active');

		var pageNum = $(this).attr("data-page");

		$.post("php/pagination.php?page=" + pageNum, function (data) {
			let peliculas = '';

			if (data.rec.length > 0) {
				
				peliculas = data.rec.map(({id, titulo, sinopsis, image}) => {
					return `<article id="${id}" class="col-12 col-md-3">
							<div class="imagenContenedor">
								<img class="imagen" src="${image}" />
							</div>
							<h3>${titulo}</h3>
							<p>${sinopsis}</p>
							<div class="acciones">
					
							<button id="editarBoton" data-toggle="modal" data-target="#editarPeliculaModal" class="btn btn-small btn-success" data-id="${id}">Editar</button>
							<button id="eliminarBoton" data-toggle="modal" data-target="#eliminarPeliculaModal" class="btn btn-small btn-danger" data-id="${id}">Eliminar</button>
							
							</div>
						</article>`;
				}).join('');

			}
			jQuery("#peliculas").html(peliculas);
			jQuery("#append-pagination").html(data.pagination);

			$('article').each(function () {
				guardarPelicula($(this));
			});
		});


	});

	$('#busqueda').keyup(function () {

		if ($('#busqueda').val().length > 0) {

			let resultados = arrayPeliculas.filter(({titulo}) => titulo.toLowerCase().includes($('#busqueda').val().toLowerCase()));
	
			let html = resultados.map(({id, imagen, titulo, sinopsis}) => {
				return `<article id="${id}" class="col-12 col-md-3">
							<div class="imagenContenedor">
								<img class="imagen" src="${imagen}" />
							</div>
							<h3>${titulo}</h3>
							<p>${sinopsis}</p>
							<div class="acciones">
					
							<button id="editarBoton" data-toggle="modal" data-target="#editarPeliculaModal" class="btn btn-small btn-success" data-id="${id}">Editar</button>
							<button id="eliminarBoton" data-toggle="modal" data-target="#eliminarPeliculaModal" class="btn btn-small btn-danger" data-id="${id}">Eliminar</button>
							
							</div>
						</article>`;
			})
	
			$('#resultadoBusqueda').html(html);
			$('#peliculas').hide();

		}else {

			$('#resultadoBusqueda').html('');
			$('#peliculas').show();

		}

	});

	$(document).on('click', '#editarBoton', function() {

		getPelicula($(this).data('id'), function({id, titulo, sinopsis, image}) {
				$('#id').val(id);
				$('#tituloInput').val(titulo);
				$('#headerTituloPelicula').text(titulo);
				$('#sinopsisInput').val(sinopsis);
				$('#imagenInput').val(image);
		});

	});

	$(document).on('click', '#eliminarBoton', function() {

		getPelicula($(this).data('id'), function({id, titulo}) {
			$('#textoEliminarPelicula').html(`¿Estás seguro de que desea eliminar la película <strong data-id="${id}">${titulo}</strong>?`)
		})

	});
	
	$('#confirmarEditar').click(function (e) {
		e.preventDefault();
		editarPelicula();
	})

	$('#confirmarEliminar').click(function () {

		eliminarPelicula($('#textoEliminarPelicula > strong').data('id'));

	});
	
});

function guardarPelicula(thisObj) {

	let pelicula = {
        id: thisObj.attr('id'),
        titulo: thisObj.find('.titulo').text(),
		imagen: thisObj.find('.imagen').attr('src'),
        sinopsis: thisObj.find('.sinopsis').text(),

    }

	arrayPeliculas.push(pelicula);

}

function getPelicula(id, callback) {

	$.get('php/obtenerPelicula.php', {id: id}, callback);
}

function editarPelicula() {

	$.post('php/editarPelicula.php', $('#editarPeliculaForm').serialize(), function(data) {

		guardarAlerta(data.msg);
		window.location.reload();

	});

}

function eliminarPelicula(id) {

	
	$.get('php/eliminarPelicula.php', {id: id}, function(data) {
		guardarAlerta(data.msg);
		
		$('.btn').prop('disabled', true);
		$('article#'+id).addClass('eliminar-animacion');
		setTimeout(() => {
			window.location.reload();

		}, 1100)
	});

}

function guardarAlerta(mensaje) {

	window.localStorage.setItem('alerta', JSON.stringify({
		mensaje: mensaje
	}));

}

function mostrarAlerta() {

	$('#alerta').show();
	$('#alertaTexto').text(alerta.mensaje);

	window.localStorage.removeItem('alerta');

}