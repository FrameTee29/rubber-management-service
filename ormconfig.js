module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  timezone: process.env.NEST_TYPEORM_TIMEZONE,
  seeds: ['dist/seeds/*.seed{.ts,.js}'],
  migrations: ['dist/migration/*{.ts,.js}'],
  entities: ['dist/**/*.entity{.ts,.js}'],
  factories: ['dist/factories/*.factory{.ts,.js}'],
  synchronize: process.env.NEST_TYPEORM_SYNCHRONIZE,
  logging: process.env.NEST_TYPEORM_LOGGING,
  cli: {
    migrationsDir: 'src/migration',
  },
};
