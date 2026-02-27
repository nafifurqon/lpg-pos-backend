import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    let messages: string[]
    let error: string

    if (typeof exceptionResponse === 'string') {
      messages = [exceptionResponse]
      error = exception.message
    } else {
      const body = exceptionResponse as Record<string, unknown>

      // Normalize message → always string[]
      if (Array.isArray(body['message'])) {
        messages = body['message'] as string[]
      } else if (typeof body['message'] === 'string') {
        messages = [body['message']]
      } else {
        messages = [exception.message]
      }

      error = typeof body['error'] === 'string' ? body['error'] : exception.message
    }

    response.status(status).json({ messages, error })
  }
}
