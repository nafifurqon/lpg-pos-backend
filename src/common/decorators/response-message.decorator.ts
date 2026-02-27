import { SetMetadata } from '@nestjs/common'

export const RESPONSE_MESSAGE_KEY = 'response_message'

/**
 * Sets a custom success message on the response envelope.
 * Read by TransformInterceptor to populate the `message` field.
 *
 * @example
 * @ResponseMessage('Berhasil mendaftar')
 * @Post('register')
 * register(@Body() dto: RegisterEmailDto) { ... }
 */
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE_KEY, message)
