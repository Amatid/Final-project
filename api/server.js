const express = require('express'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
	  fs = require('file-system'),
	  dbFilePathAdvice = 'advices.json',
	  dbFilePathCalories = 'calories.json'
	  dbFilePathProducts = './products.json'
      app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/', (req, res) => res.send(getAdvicesFromDB(dbFilePathAdvice)));

app.get('/menu', (req, res) => res.send(getAdvicesFromDB(dbFilePathCalories)));

app.get('/products', (req, res) => res.send(getAdvicesFromDB(dbFilePathProducts)));

app.get('/api/task/:id', (req, res) => {
	const tasksData = getTasksFromDB(),
		task = tasksData.find(task => task.id === req.params.id);

    task ? res.send(task) : res.send({});
});

app.post('/addProduct', (req, res) => {
	// const currentProduct = getAdvicesFromDB(dbFilePathProducts),
	// 	task = tasksData.find(task => task.id === req.params.id),
	// 	updatedTask = req.body;

	// task.title = updatedTask.title;
	// task.description = updatedTask.description || 'No Description';
	recordNewArray(req.body);

	// res.sendStatus(204);
});

function getAdvicesFromDB(dbFilePath) {
    return JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
}

function recordNewArray(productsData) {
	console.log(dbFilePathProducts);
    fs.writeFileSync(dbFilePathProducts, JSON.stringify(productsData));
}

app.listen(3000, () => console.log('Server has been started...'));
