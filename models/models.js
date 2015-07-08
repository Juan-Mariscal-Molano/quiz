var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Importar definicion de la tabla Quiz
var quizPath = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quizPath);

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