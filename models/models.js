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

// Importar definicion de la tabla Quiz
var commentPath = path.join(__dirname,'comment');
var Comment = sequelize.import(commentPath);

//Establecer relación entre tablas
Comment.belongsTo(Quiz, { onDelete: 'cascade' });
Quiz.hasMany(Comment, { onDelete: 'cascade' });

// Exportar la definición de la tabla Quiz
exports.Quiz = Quiz;
exports.Comment = Comment;

sequelize.sync().then(function(){
	console.log('sequelize.sync().then')
	// succes(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function(count){
		console.log('count: ' + count);
		if(count === 0){
			// se inicializa la tabla sólo si está vacía
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma',
						  tema: 'Geografía'
						}
			);
			Quiz.create({ pregunta: 'Capital de Portugal',
						  respuesta: 'Lisboa',
						  tema: 'Geografía'
						}
			).then(function(){
				console.log('Base de datos inicializada');
			});
		}
	});
});