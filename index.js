const express = require("express");
const sqlite = require("sqlite3").verbose();

const app = express();
const port = 3000;
const db = new sqlite.Database("database.db");

db.serialize(() => {
	db.run(
		"CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)",
	);

	// db.run("INSERT INTO users (username, password) VALUES ('admin', 'admin')")
});

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Estou na minha API");
});

app.get("/users", (req, res) => {
	db.all("SELECT * FROM users", (error, rows) => {
		if (error) {
			res.send(error);
		}
		res.send(rows);
	});
});

// pegar por ID

app.get("/users/:id", (req, res) => {
	const id = req.params.id;
	db.all("SELECT * FROM users WHERE id = ?", id, (error, rows) => {
		if (error) {
			res.send(error);
		}
		res.send(rows);
	});
});


app.post("/users", (req, res) => {
	const { username, password } = req.body;
	console.log(req.body);

	if (
		username == "undefined" ||
		username == "" ||
		password == "undefined" ||
		password == ""
	) {
		res.send("Dados incompletos");
		return;
	} else {
		db.run(
			"INSERT INTO users (username, password) VALUES (?, ?)",
			[username, password],
			(error) => {
				if (error) {
					res.send(error);
					return;
				}
				res.send(`Usuário ${username} cadastrado com sucesso`);
			},
		);
	}
});

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
