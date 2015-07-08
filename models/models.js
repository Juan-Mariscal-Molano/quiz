var path = require('path');

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
						{dialect: "sqlite", storage: "quiz.sqlite"}
					);

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
// Exportar la definición de la tabla Quiz
exports.Quiz = Quiz;

sequelize.sync().success(function(){
	console.log('sequelize.sync().success')
	// succes(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function(count){
		console.log('count: ' + count);
		if(count === 0){
			// se inicializa la tabla sólo si está vacía
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma'}
			).success(function(){
				console.log('Base de datos inicializada');
			});
		}
	});
});