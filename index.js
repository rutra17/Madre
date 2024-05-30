const { error } = require("console");
const express = require("express");
const sqlite = require("sqlite3").verbose();

const app = express();
const port = 3000;
const db = new sqlite.Database("database.db");

db.serialize(() => {
	db.run("CREATE TABLE IF NOT EXISTS Perfil (Id_Perfil INTEGER IDENTITY PRIMARY KEY, Nome_Perfil VARCHAR(30) NOT NULL, Descricao_Perfil VARCHAR(30) NOT NULL)");
	
	db.run("CREATE TABLE IF NOT EXISTS Usuario (CPF_Usuario CHAR(11) PRIMARY KEY NOT NULL, Id_Perfil INTEGER REFERENCES Perfil(Id_Perfil), Nome_Usuario VARCHAR(60) NOT NULL, RG_Usuario VARCHAR(20) NOT NULL, Orgao_Emissor VARCHAR (6) NOT NULL, Nascimento DATE NOT NULL, Telefone VARCHAR(20) NOT NULL, Email VARCHAR(50) NOT NULL UNIQUE, Sexo CHAR(1) NOT NULL)");
});

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Estou na minha API");
});

app.get("/Perfil", (req, res) => {
	db.all("SELECT * FROM Perfil", (error, rows) => {
		if (error) {
			res.send(error);
		}
		res.send(rows);
	});
});

app.get("/Usuario", (req, res) => {
	db.all("SELECT * FROM Usuario", (error, rows) => {
		if (error) {
			res.send(error);
		}
		res.send(rows);
	});
});

app.get("/Perfil/:Id_Perfil", (req, res) => {
	const Id = req.params.Id_Perfil;
	db.all("SELECT * FROM Perfil WHERE Id_Perfil = ?", Id, (error, rows) => {
		if (error) {
			res.send(error);
		}
		res.send(rows);
	});
});

app.get("/Usuario/:CPF", (req, res) => {
	const CPF = req.params.CPF;
	db.all("SELECT * FROM Usuario WHERE CPF_Usuario = ?", CPF, (error, rows) => {
		if (error) {
			res.send(error);
		}
		res.send(rows);
	});
});

app.post("/Perfil", (req, res) => {
	const { Id_Perfil, Nome_Perfil, Descricao_Perfil } = req.body;
	console.log(req.body);

	if ( !Id_Perfil || !Nome_Perfil || !Descricao_Perfil) {
		res.send("Dados incompletos");
		return;
	} else {
		db.run(
			"INSERT INTO Perfil (Id_Perfil, Nome_Perfil, Descricao_Perfil) VALUES (?, ?, ?)",
			[Id_Perfil, Nome_Perfil, Descricao_Perfil],
			(error) => {
				if (error) {
					res.send(error);
					return;
				}
				res.send(`Perfil ${Nome_Perfil} cadastrado com sucesso`);
			},
		);
	}
});

app.post("/Usuario", (req, res) => {
	const { CPF_Usuario, Id_Perfil, Nome_Usuario, RG_Usuario, Orgao_Emissor,Nascimento, Telefone, Email, Sexo } = req.body;

	if (!CPF_Usuario || !Id_Perfil || !Nome_Usuario || !RG_Usuario || !Orgao_Emissor || !Nascimento || !Telefone || !Email || !Sexo) {
		res.send("Dados incompletos");
		return;
	} else {
		db.run("INSERT INTO Usuario (CPF_Usuario, Id_Perfil, Nome_Usuario, RG_Usuario, Orgao_Emissor,Nascimento, Telefone, Email, Sexo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
[CPF_Usuario, Id_Perfil, Nome_Usuario, RG_Usuario, Orgao_Emissor,Nascimento, Telefone, Email, Sexo], (error) => {
				if (error) {
					res.send(error);
					return;
				}
				console.log(req.body)
				res.send(`Usuário ${Nome_Usuario} cadastrado com sucesso`);
			},
		);
	}
});
	
app.put("/Perfil/:Id_Perfil", (req, res) => {
	const Id = req.params.Id_Perfil;
	const { Id_Perfil, Nome_Perfil, Descricao_Perfil } = req.body;
	if (!Id_Perfil || !Nome_Perfil || !Descricao_Perfil){
		res.send("Dados incompletos");
		return;
	}else{
		db.run(
			"UPDATE Perfil SET Nome_Perfil = ?, Descricao_Perfil = ? WHERE Id_Perfil = ?",
			[Nome_Perfil, Descricao_Perfil, Id],
			(error) => {
				if (error) {
					res.send(error);
					return;
				}
				console.log(req.body)
				res.send(`Usuário com a Id: ${Id_Perfil} atualizado com sucesso`);
			},
		);
	}
})

app.put("/Usuario/:CPF", (req, res) => {
	const CPF = req.params.CPF;
	const { Nome_Usuario, RG_Usuario, Orgao_Emissor,Nascimento, Telefone, Email, Sexo } = req.body;
	if (!Nome_Usuario || !RG_Usuario || !Orgao_Emissor || !Nascimento || !Telefone || !Email || !Sexo){
		res.send("Dados incompletos");
		return;
	}else{
		db.run("UPDATE Usuario SET Nome_Usuario = ?, RG_Usuario = ?, Orgao_Emissor = ?, Nascimento = ?, Telefone = ?, Email = ?, Sexo = ? WHERE CPF = ?",
			[Nome_Usuario, RG_Usuario, Orgao_Emissor,Nascimento, Telefone, Email, Sexo, CPF],
			(error) => {
				if (error) {
					res.send(error);
					return;
				}
				res.send(`Usuário com o CPF: ${CPF} atualizado com sucesso`);
			},
		);
	}
})
	
app.patch("/Perfil/:Id_Perfil", (req, res) =>{
	const Id = req.params.Id;
	const { Id_Perfil, Nome_Perfil, Descricao_Perfil } = req.body;
	if (!Id_Perfil || !Nome_Perfil || !Descricao_Perfil){
		res.send("Dados incompletos");
		return;
	}else{
		db.run(
			"UPDATE Perfil SET Id_Perfil = ?, Nome_Perfil = ?, Descricao_Perfil = ? WHERE Id_Perfil = ?",
			[Nome_Perfil, Descricao_Perfil, Id],
			(error) => {
				if (error) {
					res.send(error);
					return;
				}
				res.send(`Usuário com o Id: ${Id_Perfil} atualizado com sucesso`);
			},
		);
	}
})

app.patch("/Usuario/:CPF", (req, res) =>{
	const CPF = req.params.CPF;
	const { Nome_Usuario, RG_Usuario, Orgao_Emissor,Nascimento, Telefone, Email, Sexo } = req.body;
	if (!Nome_Usuario || !RG_Usuario || !Orgao_Emissor || !Nascimento || !Telefone || !Email || !Sexo){
		res.send("Dados incompletos");
		return;
	}else{
		db.run("UPDATE Usuario SET Nome_Usuario = ?, RG_Usuario = ?, Orgao_Emissor = ?, Nascimento = ?, Telefone = ?, Email = ?, Sexo = ? WHERE CPF = ?",
			[Nome_Usuario, RG_Usuario, Orgao_Emissor,Nascimento, Telefone, Email, Sexo, CPF],
			(error) => {
				if (error) {
					res.send(error);
					return;
				}
				res.send(`Usuário com o CPF: ${CPF} atualizado com sucesso`);
			},
		);
	}
})
	
app.delete("/Perfil/:Id_Perfil", (req, res) =>{
	const id = req.params.id;
	db.run("DELETE FROM Perfil WHERE Id_Perfil = ?", id, (error) => {
		if (error) {
			res.send(error);
			return;
		}
		res.send(`Usuário ${id} deletado com sucesso`);
	});
})

app.delete("/Usuario/:CPF", (req, res) =>{
	const CPF = req.params.CPF;
	db.run("DELETE FROM Usuario WHERE CPF = ?", id, (error) => {
		if (error) {
			res.send(error);
			return;
		}
		res.send(`Usuário ${CPF} deletado com sucesso`);
	});
})
	
app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
