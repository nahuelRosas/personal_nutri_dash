import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Injectable,
  Scope,
} from '@nestjs/common';

import { ENVIRONMENT } from '@/common/base/enum/common.enum';

import {
  IResponseService,
  TCreateResponse,
} from '../interface/response.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class ResponseService extends ConsoleLogger implements IResponseService {
  mark = 'Handled by ResponseService.errorHandler';
  status =
    process.env.RESPONSE_MODULE !== ENVIRONMENT.PRODUCTION ? true : false;

  createResponse: TCreateResponse = ({ type = 'OK', message, payload }) => {
    if (message && this.status) {
      this.verbose(`Message: ${message}`);
    }

    return {
      success: HttpStatus[type]
        ? HttpStatus[type] >= 0 && HttpStatus[type] < 400
        : true,
      statusCode: HttpStatus[type] ? HttpStatus[type] : 200,
      message: message || 'Success',
      payload,
      type,
    };
  };

  errorHandler = ({
    type = 'INTERNAL_SERVER_ERROR',
    error,
  }: {
    type?: keyof typeof HttpStatus;
    error?: Error | Error[];
  }): void => {
    if (error instanceof HttpException) {
      if (JSON.stringify(error).includes(this.mark)) {
        throw error;
      }

      this.handleError({
        error,
      });

      const code = error.getStatus();
      throw this.createHttpException({
        code,
        error,
      });
    }

    this.handleError({
      error,
    });

    throw this.createHttpException({
      code: HttpStatus[type],
      error,
    });
  };

  private handleError({
    error,
    description,
  }: {
    error: Error | Error[];
    description?: string;
  }): void {
    if (description) this.error(`Message: ${description}`);
    if (Array.isArray(error)) {
      error.forEach((err) => {
        if (err && err.toString().length > 0) this.error(err.toString());
      });
    } else if (error && error.toString().length > 0) {
      this.error(error.toString());
    }
  }

  private createHttpException({
    error,
    code,
  }: {
    code: number;
    error: Error | Error[];
  }): HttpException {
    let message: string | string[] | undefined = undefined;
    const newError = Array.isArray(error)
      ? new Error(error.map((e) => e?.message).join(', '))
      : error;

    if (Array.isArray(error)) {
      message = error.map((e) => e?.message);
    } else {
      message = error?.message || '';
    }

    return new HttpException(message, code, {
      cause: newError,
      description: this.mark,
    });
  }
}
