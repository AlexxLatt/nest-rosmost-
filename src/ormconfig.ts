//файл подключается к нашей бд а после  в строке  entities: [__dirname + '/**/*.entity{.ts,.js}'] выполняет код в tag.entity.ts
import { ConnectionOptions } from 'typeorm';
const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'rosmost',
  password: '123',
  database: 'rosmost',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // true дает возможность при запуске создавать таблицы данных если их нет в бд
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'], // ооткуда будет запуск миграций
  cli: {
    migrationsDir: 'src/migrations',
  }, // куда миграции будут создаваться
};
export default config; //  export в AppModule
