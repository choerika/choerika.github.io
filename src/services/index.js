// @flow
export * from './config';
export * from './errorHandler';
export * from './deleteStockCarAllFromDB';
export * from './finishDeleting';

export const statusCode = {
  Ok: 200,
  InvalidParameters: 400,
  Forbidden: 403,
  NotFound: 404,
  InternalError: 500,
};
