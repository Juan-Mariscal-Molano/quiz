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
	models.Quiz.find(quizId).then(
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
	if(search !== null && search !== undefined){
		search = replaceAll(search, ' ', '%');
		models.Quiz.findAll({where: ["pregunta like ?", '%' + search + '%'], order: 'pregunta ASC'}).then(
			function(quizes){
				res.render('quizes/index.ejs', { quizes: quizes, search: req.query.search});
			}
		).catch(function(error) {next(error);});
	} else {
		models.Quiz.findAll({order: 'pregunta ASC'}).then(
			function(quizes){
				res.render('quizes/index.ejs', { quizes: quizes, search: 'Busque aquí'});
			}
		).catch(function(error) {next(error);});
	}
}

// GET /quizes/:id
exports.show = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', { quiz: req.quiz});
	});
	
};

// GET /quizes/answer
exports.answer = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		var resultado = 'Incorrecto'
		if(req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()){
			resultado = 'Correcto';
		}

		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
		
	});
};
