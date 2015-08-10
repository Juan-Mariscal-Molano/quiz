var models = require('../models/models.js');

// GET statistics/index
exports.index = function(req, res){
	var statistics = {};

	// Número total de preguntas
	models.Quiz.count().then(function(totalPreguntas){
		statistics.totalPreguntas = totalPreguntas;

		// Número total de comentarios publicados
		models.Comment.count({where: { publicado: true }}).then(function(totalComments){
			statistics.totalComments = totalComments;

			// Número de preguntas con comentarios
			models.Quiz.count(
				{
					include: 
					[{
						model: models.Comment,
						where: { publicado: true }
					}],
					distinct: true
				}
				).then(function(quizComments){
					statistics.quizComments = quizComments;
					res.render('quizes/statistics.ejs', { statistics: statistics, errors: []});
			});

		
		});


	});

};