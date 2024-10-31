import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('File Sharing App API')
    .setDescription('File Sharing API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
        secure: false,
      },
    }),
  );

  const PORT = process.env.PORT;

  await app.listen(PORT);

  console.log(
    '--------------------------------------------------------------------------------------',
  );
  console.log(
    `Server running on port ${PORT} and you can access the API at http://localhost:${PORT}`,
  );
  console.log(
    '--------------------------------------------------------------------------------------',
  );
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api`,
  );
  console.log(
    '--------------------------------------------------------------------------------------',
  );
  console.log(`MongoDB connection string: ${process.env.MONGODB_URI}`);
  console.log(
    '--------------------------------------------------------------------------------------',
  );
}
bootstrap();
