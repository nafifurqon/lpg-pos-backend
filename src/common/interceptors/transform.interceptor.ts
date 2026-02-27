import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator'

export interface ListPayload<T> {
  data: T[]
  metadata: {
    total_items: number
    total_pages: number
  }
}

function isListPayload(value: unknown): value is ListPayload<unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    'data' in value &&
    Array.isArray((value as ListPayload<unknown>).data) &&
    'metadata' in value
  )
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, unknown> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    const message =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? 'Success'

    return next.handle().pipe(
      map((data) => {
        if (isListPayload(data)) {
          return {
            message,
            result: data.data,
            metadata: data.metadata,
          }
        }

        return {
          message,
          result: data ?? null,
        }
      }),
    )
  }
}
