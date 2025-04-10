const { execSync } = require('child_process')

// Obtener argumentos desde la línea de comandos
const args = process.argv
const action =
  args.find((arg) => arg.startsWith('--'))?.replace('--', '') || 'help' // Acción por defecto

const migrationName = `Migration_${Date.now()}` // Nombre aleatorio

const commands = {
  create: `npx typeorm-ts-node-commonjs migration:create src/config/database/migrations/${migrationName}`,
  generate: `npx typeorm-ts-node-commonjs migration:generate -d src/config/database/ormconfig.ts src/config/database/migrations/${migrationName}`,
  run: `npx typeorm-ts-node-commonjs migration:run -d src/config/database/ormconfig.ts`,
  revert: `npx typeorm-ts-node-commonjs migration:revert -d src/config/database/ormconfig.ts`,
  help: `echo "Uso: npm run migration -- --create | --generate | --run | --revert"`,
}

if (!commands[action]) {
  console.error(`❌ Acción no reconocida: --${action}`)
  process.exit(1)
}

console.info(`🚀 Ejecutando: ${commands[action]}`)
execSync(commands[action] as never, { stdio: 'inherit' })
