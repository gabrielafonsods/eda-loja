// Rode assim, no terminal, dentro da pasta eda-backend:
//   node gerar-senha.js SUA_SENHA_AQUI
//
// Ele imprime o hash que vai no ADMIN_PASSWORD_HASH do .env.
// Depois de gerar, pode apagar este arquivo (ele não é usado pelo app).

const bcrypt = require('bcryptjs');

const senha = process.argv[2];

if (!senha) {
  console.log('Uso: node gerar-senha.js SUA_SENHA_AQUI');
  process.exit(1);
}

const hash = bcrypt.hashSync(senha, 10);
console.log('\nAdicione esta linha no seu .env:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
