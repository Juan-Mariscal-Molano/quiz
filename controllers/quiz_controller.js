var models = require('../models/models.js');

// Reemplaza en text todas las apariciones de charSearch por charReplace
function replaceAll(text, charSearch, charReplace){
	while (text.toString().indexOf(charSearch) != -1){
		text = text.toString().replace(charSearch, charReplace);
	}
	return text;
}

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find({
			where: {id: Number(quizId)},
			include: [{ model: models.Comment }]
	}).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId = ' + quizId));
			}
		}
	).catch(function(error) { next(error);});
}

// Get /quizes
exports.index = function(req, res){
	var search = req.query.search;
	var query = null;

	if(search !== null && search !== undefined){
		query = {where: ["lower(pregunta) like lower(?)", '%' + replaceAll(search, ' ', '%') + '%'], order: 'pregunta ASC'};
		
	} else {
		query = {order: 'pregunta ASC'};
		search = 'Busque aquí';
	}

	models.Quiz.findAll(query).then(
		function(quizes){
			res.render('quizes/index.ejs', { quizes: quizes, search: search, errors: []});
		}
	).catch(function(error) {next(error);});
}

// GET /quizes/:id
exports.show = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', { quiz: req.quiz, errors: []});
	});
	
};

// GET /quizes/answer
exports.answer = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		var resultado = 'Incorrecto'
		if(req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()){
			resultado = 'Correcto';
		}

		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
		
	});
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build( // crea objeto quiz
			{	
				pregunta:"", 
				respuesta:"" ,
				tema:""
			}
		);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz );

	quiz
	.validate()
	.then(
		function(err){
		if(err){
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			// Guarda en DB los datos pregunta y respuesta de quiz
			quiz.save({field: ["pregunta", "respuesta", "tema"] }).then(function(){
					res.redirect('/quizes'); // Redirección HTTP (URL relativo) lista de preguntas
			});
		}
	});
};

// GET quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz; // autoload de la instancia quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
}

// PUT quizes/:id
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz
	.validate()
	.then(
		function(err){
		if(err){
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
			// Guarda en DB los datos pregunta y respuesta de quiz
			req.quiz.save({field: ["pregunta", "respuesta", "tema"] }).then(function(){
					res.redirect('/quizes'); // Redirección HTTP (URL relativo) lista de preguntas
			});
		}
	});
}

// DELETE quizes/:id
exports.destroy = function(req, res){
	req.quiz
	.destroy()
	.then(
		function(){
			res.redirect('/quizes'); // Redirección HTTP (URL relativo) lista de preguntas
	}).catch(function(error){
		next(error);
	});
}