import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './modulos/usuarios/usuarios.module';
import { RolesModule } from './modulos/roles/roles.module';
import { PermisosModule } from './modulos/permisos/permisos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configurationEnv } from './configuration';
import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './modulos/locations/locations.module';
import { ShellyModule } from './modulos/shelly/shelly.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurationEnv]
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.HOST_BD,
      port: 3306,
      username: process.env.USERNAME_BD,
      password: process.env.PASSWORD_BD,
      database: process.env.DATABASE,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true
    }),
    UsuariosModule,
    RolesModule, 
    PermisosModule, 
    AuthModule,
    LocationsModule,
    ShellyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
