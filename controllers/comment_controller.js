var models = require('../models/models.js');

// GET quizes/:quizId/comments/new
exports.new = function(req, res){
	res.render('comments/new', {quizId: req.params.quizId, errors: []});
};

// POST quizes/:quizId/comments/create
exports.create = function(req, res){

console.log("###### " + req.body.comment.texto);
console.log("###### " + req.params.quizId);

	var comment = models.Comment.build({
		texto: req.body.comment.texto,
		QuizId: req.params.quizId
	});

	comment
	.validate()
	.then(
		function(err){
		if(err){
			res.render('comments/new', {comment: comment, quizId: req.params.quizId, errors: err.errors});
		} else {
			// Guarda en DB el campo texto de comment
			comment.save().then(function(){
					res.redirect('/quizes/'+req.params.quizId); // Redirección HTTP (URL relativo) a la pregunta
			});
		}
	}
	).catch(function(error){
		next(error);
	});
};