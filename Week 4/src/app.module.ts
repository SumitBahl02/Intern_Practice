import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      // Add default values for required environment variables
      validate: (config) => {
        // Ensure required environment variables are set
        const requiredVars = ['JWT_SECRET'];
        for (const var_ of requiredVars) {
          if (!config[var_]) {
            throw new Error(`Environment variable ${var_} is required`);
          }
        }
        return config;
      },
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    TasksModule,
    ProjectsModule,
  ],
})
export class AppModule {}