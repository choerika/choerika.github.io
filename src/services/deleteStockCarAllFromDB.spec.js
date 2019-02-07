import test from 'ava';
import Promise from 'bluebird';
import {EXHIBITION_ID, s3ObjectMock} from '../../test/mock/';
import {deleteStockCarDependencies, deletePromise} from './deleteStockCarAllFromDB';

const deleteStockCarDependenciesListSuccess = [
  () => new Promise(resolve => resolve('success 1')),
  () => new Promise(resolve => resolve('success 2')),
  () => new Promise(resolve => resolve('success 3')),
];

const deleteStockCarDependenciesListFailure = [
  () => new Promise(resolve => resolve('success 1')),
  () => new Promise(resolve => resolve('success 2')),
  () => new Promise((resolve, reject) => reject('error 1')),
];

const DELETE_STOCK_CAR_DEPENDENCIES_RESULT_SUCCESS = [
  'success 1',
  'success 2',
  'success 3',
];

const DELETE_STOCK_CAR_DEPENDENCIES_RESULT_FAILURE = [
  'success 1',
  'success 2',
  'error 1',
];

test('個車の依存データ削除を正常に実行することができる', async (t) => {
  const result = await deleteStockCarDependencies(
    EXHIBITION_ID,
    deleteStockCarDependenciesListSuccess,
  );
  t.deepEqual(result, DELETE_STOCK_CAR_DEPENDENCIES_RESULT_SUCCESS);
});

test('個車の依存データ削除でエラーになった場合のハンドリングができる', async (t) => {
  try {
    await deleteStockCarDependencies(EXHIBITION_ID, deleteStockCarDependenciesListFailure);
  } catch (error) {
    t.deepEqual(error, DELETE_STOCK_CAR_DEPENDENCIES_RESULT_FAILURE);
  }
});

test('個車と個車の依存データ削除を正常に実行することができる', async (t) => {
  const deleteStockCar = () => new Promise(resolve => resolve('success'));
  const result = await deletePromise(
    s3ObjectMock,
    EXHIBITION_ID,
    deleteStockCarDependenciesListSuccess,
    deleteStockCar,
  );
  t.deepEqual(result, {
    status: 200,
    message: '',
    data: 'success',
  });
});

test('個車削除の処理でエラーになった場合のハンドリングができる', async (t) => {
  const deleteStockCar = () => new Promise((resolve, reject) => reject('error'));
  const result = await deletePromise(
    s3ObjectMock,
    EXHIBITION_ID,
    deleteStockCarDependenciesListSuccess,
    deleteStockCar,
  );
  t.deepEqual(result, {
    status: 500,
    message: '',
    data: 'error',
  });
});

test('個車削除の処理がなければ、個車の依存データのみを削除する', async (t) => {
  const result = await deletePromise(
    s3ObjectMock,
    EXHIBITION_ID,
    deleteStockCarDependenciesListSuccess,
  );
  t.deepEqual(result, {
    status: 200,
    message: '',
    data: DELETE_STOCK_CAR_DEPENDENCIES_RESULT_SUCCESS,
  });
});
