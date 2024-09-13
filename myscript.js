//JAVASCRIPT

//Creando página
window.onload=function(){
	listar();
	document.getElementById('frmRegistro').addEventListener('submit', adicionarOuAlterar);
	document.getElementById('frmRegistro').addEventListener('submit', listar);
}

//variavel global
var idAlterar = null;

//Evento do botao cadastrar/salvar (verificação)
function adicionarOuAlterar(e){
	var nom = document.getElementById('txtNombre').value;
	var p = {
		nombre : !nom ? "sem nombre": nom, //mesmo que if(nom = ""){ nom = "sem nome";}
		nascimiento : new Date(document.getElementById('dtpFechaNacimiento').value.replace("-","/")),
		sexo : document.getElementById('rdoMasculino').checked ? 'M' : 'F',
		data : new Date()
	}

	if(idAlterar == null)	
		adicionar(p);
	else if(idAlterar > 0)
		alterar(p);
	else
		alert("Accion Desconocida");	
	
	//bloqueia a ação de atualização do browser
	e.preventDefault();
}

function adicionar(p){	
	var pessoas = [];	
	var idValido = 1;	
	//se já possuir o localStorage, adiciono no array	
	if(localStorage.getItem('value') !== null ){
		pessoas = JSON.parse(localStorage.getItem('value')); //captura o array de objetos(JSON);
				
		if(pessoas.length > 0)
			idValido = 	(function obterIdValido() {	//Função Auto-executável
							 //percorre verificando se tiver "buraco" entre os numeros
							for(var i = 0; i < pessoas.length; i++)
								if(pessoas[i].Id != i+1)
									return i + 1;							
							//se nao achar, retorna o id posterior da ultima pessoa
							return pessoas[pessoas.length - 1].Id + 1;
						})();
	}	
	
	var pessoa = {
		Id: idValido,
		Nombre: p.nombre,
		FechaNacimiento: p.nascimiento.toLocaleString("pt-BR").substring(0, 10),
		Sexo: p.sexo,
		DatoRegistro : p.dato.toLocaleString("pt-BR")
	};
	
	//Adiciona o objeto ao ultimo indice do array
	pessoas.push(pessoa);	
	//Ordeno o array pelo ID do objeto
	pessoas.sort(function(a,b) {
		return a.Id - b.Id;
	});			
	//armazena no Localstorage
	localStorage.setItem('value', JSON.stringify(pessoas));	
	//reseta os campos do formulario
	document.getElementById('frmRegistro').reset();	
}

function alterar(p){
	var btn = document.getElementById('btnGuardarRegistro');	

	pessoas = JSON.parse(localStorage.getItem('value'));
	//substituir as informaçoes
	for(var i = 0; i < pessoas.length; i++){
		if(pessoas[i].Id == idAlterar){
			pessoas[i].Nombre = p.nombre;
			pessoas[i].FechaNacimiento = p.nascimiento.toLocaleString("pt-BR").substring(0, 10);
			pessoas[i].Sexo = p.sexo;
			pessoas[i].DatoRegistro = p.dato.toLocaleString("pt-BR");
			
			btn.value = "Registrar";
			idAlterar = null;

			localStorage.setItem('value', JSON.stringify(pessoas));	
			document.getElementById('frmRegistro').reset();			
			break;
		}
	}
}

//função do botao Alterar
function prepararAlterar(idRow){	
	document.getElementById('btnGuardarRegistro').value = "Guardar";
	
	var txtNombre = document.getElementById('txtNombre'),
	    dtpFechaNacimiento = document.getElementById('dtpFechaNacimiento'),
	    rdoMasculino = document.getElementById('rdoMasculino'),
	    rdoFemenino = document.getElementById('rdoFemenino');

	var pessoas = JSON.parse(localStorage.getItem('value'));
	for(var i = 0; i < pessoas.length; i++){
		if(pessoas[i].Id == idRow){			
			//popular os campos
			txtNombre.value = pessoas[i].Nombre;
			dtpFechaNacimiento.value = pessoas[i].FechaNacimiento.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3-$2-$1'); //caso fosse tipo date toISOString().substring(0, 10);
			rdoMasculino.checked = !(rdoFemenino.checked = (pessoas[i].Sexo == 'F'));
			
			//recarrega a lista para limpar o th com background alterado
			listar();
			//coloco ID null (caso clicar em varios botao alterar)
			idAlterar = null;
			if(idAlterar === null){
				//mudar o background da nova linha
				var th = document.getElementById("rowTable"+i);				
				th.className = "estadoAlterado";				
			}

			//atribuir o Id a variavel global
			idAlterar = pessoas[i].Id;
			break;
		}
	}
}

function excluir(cod){
	var pessoas = JSON.parse(localStorage.getItem('value'));

	for(var i = 0; i < pessoas.length; i++)
		if(pessoas[i].Id == cod)
			pessoas.splice(i, 1);
				
	
	localStorage.setItem('value', JSON.stringify(pessoas));
	listar();
	
	//se nao possuir mais nenhum registro, limpar o storage
	if(pessoas.length == 0)
		window.localStorage.removeItem("value");
}

function listar(){
	//se nao possuir nenhum local storage, nao fazer nada
	if(localStorage.getItem('value') === null)
		return;
	
	//captura os objetos de volta
	var pessoas = JSON.parse(localStorage.getItem('value'));
	var tbody = document.getElementById("tbodyResultados");

	//limpar o body toda vez que atualizar
	tbody.innerHTML = '';
	
	for(var i = 0; i < pessoas.length; i++){
		var	id = pessoas[i].Id,
		    nombre = pessoas[i].Nombre,
		    nascimiento = pessoas[i].FechaNacimiento,
		    sexo = pessoas[i].Sexo,
			dato = pessoas[i].DatoRegistro
			       
		tbody.innerHTML += '<tr id="rowTable'+i+'">'+
								'<td>'+id+'</td>'+
								'<td>'+nombre+'</td>'+
								'<td>'+nascimiento+'</td>'+
								'<td>'+sexo+'</td>'+
								'<td>'+dato+'</td>'+
								'<td><button onclick="excluir(\'' + id + '\')">Excluir</button></td>'+
								'<td><button onclick="prepararAlterar(\'' + id + '\')">Alterar</button></td>'+
						   '</tr>';		
	}
}
							//'<td class="celTable'+i+'">'+id+'</td>'+
