import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
    private prisma: PrismaService,
  ) {
    super({
      clientID: config.get('42_UID'),
      clientSecret: config.get('42_SECRET'),
      callbackURL: config.get('42_CALLBACK_URI'),
      Scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.emails[0].value },
    });
    if (!user) {
      user = await this.authService.signup({
        email: profile.emails[0].value,
        username: profile.username,
        password: 'tmpPass',
        avatar: profile._json.image.link,
      });
    }
    return user || null;
  }
}
