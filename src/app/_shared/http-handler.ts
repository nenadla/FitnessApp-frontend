import { HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, catchError, finalize, from, Observable, of, retry, switchMap, tap, throwError } from "rxjs";

export interface IHandlerConfig {
  defaultRetryCount?: number;
  defaultRetryDelay?: number;
  defaultErrorHandler?: (error: HttpErrorResponse) => void;
} 

let defaultErrorHandler: ((error: HttpErrorResponse) => void) | undefined;
let defaultRetryCount = 0;
let defaultRetryDelay = 0;
export function configureHandler(config: IHandlerConfig) {
  defaultErrorHandler = config.defaultErrorHandler;
  defaultRetryCount = config.defaultRetryCount ?? 0;
  defaultRetryDelay = config.defaultRetryDelay ?? 0;
}


let requestCount = 0;
let requestsSubject = new BehaviorSubject<number>(0);
let requests$ = requestsSubject.asObservable();

export function pendingRequestsCount(): Observable<number> {
  return requests$;
}

export function parseBlobError<T>() {
  return catchError<T, Observable<T>>((error: HttpErrorResponse) => {
    if (!(error.error instanceof Blob)) {
      return throwError(() => error);
    }
    return from(error.error.text()).pipe(
      switchMap(text => {
        let parsed: any = text;
        try { parsed = JSON.parse(text); } catch { /* leave as text */ }
        return throwError(() => new HttpErrorResponse({
          error: parsed,
          headers: error.headers,
          status: error.status,
          statusText: error.statusText,
          url: error.url ?? undefined,
        }));
      })
    );
  });
}

export function handle<T>(
    dataSetter: (response: T) => void,
    loadingSetter?: (loading: boolean) => void,
    errorHandler?: (error: HttpErrorResponse) => void,
    fallbackValue?: any,
    retryCount: number = defaultRetryCount,
    retryDelay: number = defaultRetryDelay,
  ): (source$: Observable<T>) => Observable<T> {
    return (source$: Observable<T>) => {
      requestCount++;
      requestsSubject.next(requestCount);
      if(loadingSetter){
        loadingSetter(true);
      }
      return source$.pipe(

        retry({
          count: retryCount,
          delay: retryDelay,
          resetOnSuccess: true
        }),

        tap((data: T) => dataSetter(data)),

        catchError((error: HttpErrorResponse) => {
          if (errorHandler) {
            errorHandler(error);
          } else if (defaultErrorHandler) {
            defaultErrorHandler(error);
          }

          if(fallbackValue !== undefined){
            dataSetter(fallbackValue as T);
            return of(fallbackValue as T);
          }
          return of(null as T);
        }),

        finalize(() => {
          requestCount--;
          requestCount = requestCount < 0 ? 0 : requestCount;
          requestsSubject.next(requestCount);
          if(loadingSetter){
            loadingSetter(false);
          }
        })

      );
    }
}

