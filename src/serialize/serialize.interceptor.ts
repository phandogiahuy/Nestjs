import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor } from '@nestjs/common';
import {
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface classContructor {
  new (...args: any[]): Record<string, any>;
}

export function Serialize(dto: classContructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
