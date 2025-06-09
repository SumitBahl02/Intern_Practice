import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // allows using PrismaService everywhere without re-importing
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
