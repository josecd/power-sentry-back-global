import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, contraseña } = loginDto;

    // Validar las credenciales del usuario
    const usuario = await this.authService.validateUser(email, contraseña);

    // Generar tokens de acceso y refresh
    const tokens = await this.authService.login(usuario);

    return tokens;
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt')) // Proteger la ruta con JWT
  async logout(@Req() req: Request, @Body() refreshTokenDto: RefreshTokenDto) {
    const userId = req['user']['id'];; // Obtener el ID del usuario desde el token JWT
    const { refreshToken } = refreshTokenDto;
    // Revocar el refresh token
    await this.authService.logout(userId, refreshToken);
    return { message: 'Sesión cerrada correctamente' };
  }

  
  @Post('logout-all')
  @UseGuards(AuthGuard('jwt')) // Proteger la ruta con JWT
  async logoutAll(@Req() req: Request) {
    const userId = req['user']['id']; // Obtener el ID del usuario desde el token JWT
    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }  
    // Revocar todos los tokens del usuario
    await this.authService.logoutAll(userId);
    return { message: 'Todas las sesiones cerradas correctamente' };
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refreshToken, userId } = refreshTokenDto;

    // Validar el refresh token y generar un nuevo access token
    const accessToken = await this.authService.refreshAccessToken(userId, refreshToken);

    return accessToken;
  }


  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // Aquí puedes agregar la lógica para registrar un nuevo usuario
    // utilizando el servicio de usuarios.
  }

}
