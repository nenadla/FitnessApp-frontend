import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

export const DATE_TIME_FORMAT = 'dd.MM.yyyy. HH:mm';
export const LOCAL = 'sr-Latn';

export function copy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export function equalFile(obj1: File, obj2: File) {
  return obj1.name === obj2.name && obj1.size === obj2.size;
}

export const dateTimeValueFormatter = (params: { value: string }): string => {
  return internalDateValueFormatter({
    value: params.value,
    format: DATE_TIME_FORMAT,
  });
};

const internalDateValueFormatter = (params: { value: string; format: string }): string => {
  if (!params.value || params.value === '0001-01-01T00:00:00') {
    return '';
  }

  const datePipe = new DatePipe(LOCAL);
  let dateValue = params.value;

  if (!/^\d/.test(dateValue)) {
    return dateValue;
  }

  if (!dateValue.includes('T')) {
    dateValue = `${dateValue}T00:00:00Z`;
  } else if (!dateValue.endsWith('Z')) {
    dateValue = `${dateValue}Z`;
  }

  return datePipe.transform(dateValue, params.format) || '';
};

export function getErrorMessage(error: HttpErrorResponse): string {
  const backendMessage = error.error?.message;

  if (typeof backendMessage === 'string' && backendMessage.trim()) {
    return backendMessage;
  }

  if (error.error instanceof ErrorEvent) {
    return `Client Error: ${error.error.message}`;
  }

  switch (error.status) {
    case 400:
      return 'Bad Request: The server cannot process the request due to a client error.';
    case 401:
      return 'Unauthorized: You need to be authenticated to access this resource.';
    case 403:
      return 'Forbidden: You do not have permission to access this resource.';
    case 404:
      return 'Not Found: The requested resource could not be found.';
    case 405:
      return 'Method Not Allowed: The requested method is not supported for this resource.';
    case 408:
      return 'Request Timeout: The server timed out waiting for the request.';
    case 500:
      return 'Internal Server Error: The server encountered an unexpected condition.';
    case 502:
      return 'Bad Gateway: The server received an invalid response from the upstream server.';
    case 503:
      return 'Service Unavailable: The server is currently unable to handle the request.';
    case 504:
      return 'Gateway Timeout: The server did not receive a timely response from the upstream server.';
    default:
      return `An error occurred. Status: ${error.status}, Message: ${error.message}`;
  }
}

export function formatDateToStringWithDots(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}.${month}.${year}`;
}

export function getDayOfWeek(date: Date | string | number): string {
  const day = new Intl.DateTimeFormat('sr-Latn-RS', { weekday: 'long' }).format(new Date(date));
  return `${day.charAt(0).toUpperCase()}${day.slice(1)}`;
}

export function getFormFirstErrorMessage(errors: readonly { kind: string; message?: string }[]): string {
  if (errors.length === 0) return '';

  const err = errors[0];
  if (err.message) return err.message;

  switch (err.kind) {
    case 'required': return 'Required';
    case 'min': return 'Value too low';
    case 'max': return 'Value too high';
    case 'minLength': return 'Too short';
    case 'maxLength': return 'Too long';
    case 'pattern': return 'Invalid format';
    case 'email': return 'Invalid email';
    default: return '';
  }
}
