const { UserService } = require('../src/userService');

describe('UserService - Suíte de testes limpa', () => {
	let userService;

	beforeEach(() => {
		userService = new UserService();
		userService._clearDB();
	});

	test('deve criar um usuário ativo com os dados informados', () => {
		const dadosUsuario = {
			nome: 'Fulano de Tal',
			email: 'fulano@teste.com',
			idade: 25,
		};

		const usuarioCriado = userService.createUser(
			dadosUsuario.nome,
			dadosUsuario.email,
			dadosUsuario.idade
		);

		expect(usuarioCriado).toMatchObject({
			nome: dadosUsuario.nome,
			email: dadosUsuario.email,
			idade: dadosUsuario.idade,
			status: 'ativo',
			id: expect.any(String),
		});
	});

	test('deve buscar um usuário existente pelo identificador', () => {
		const usuarioCriado = userService.createUser(
			'Fulano de Tal',
			'fulano@teste.com',
			25
		);

		const usuarioEncontrado = userService.getUserById(usuarioCriado.id);

		expect(usuarioEncontrado).toEqual(usuarioCriado);
	});

	test('deve desativar um usuário comum', () => {
		const usuario = userService.createUser(
			'Comum',
			'comum@teste.com',
			30
		);

		const foiDesativado = userService.deactivateUser(usuario.id);

		expect({
			foiDesativado,
			status: userService.getUserById(usuario.id).status,
		}).toEqual({
			foiDesativado: true,
			status: 'inativo',
		});
	});

	test('não deve desativar um usuário administrador', () => {
		const administrador = userService.createUser(
			'Admin',
			'admin@teste.com',
			40,
			true
		);

		const foiDesativado = userService.deactivateUser(administrador.id);

		expect({
			foiDesativado,
			status: userService.getUserById(administrador.id).status,
		}).toEqual({
			foiDesativado: false,
			status: 'ativo',
		});
	});

	test('deve incluir os usuários ativos no relatório', () => {
		userService.createUser('Alice', 'alice@email.com', 28);

		const relatorio = userService.generateUserReport();

		expect(relatorio).toContain('Alice');
		expect(relatorio).toContain('ativo');
	});

	test('deve informar quando não há usuários cadastrados', () => {
		const relatorio = userService.generateUserReport();

		expect(relatorio).toContain('Nenhum usuário cadastrado.');
	});

	test('deve rejeitar a criação de usuário menor de idade', () => {
		const criarUsuarioMenor = () =>
			userService.createUser('Menor', 'menor@email.com', 17);

		expect(criarUsuarioMenor).toThrow('O usuário deve ser maior de idade.');
	});
});
