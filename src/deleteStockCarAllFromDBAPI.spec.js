import test from 'ava';
import {
  EXHIBITION_ID,
  EXHIBITION_ID_ERROR,
  queryResultMock,
  dbapiErrorResult,
  deleteAllResult,
} from '../test/mock/';
import {deleteStockCarImage, deleteStockCarEquip, deleteStockCarCrack, deleteStockCar, deleteStockCarAllFromDBAPI} from './deleteStockCarAllFromDBAPI';

test('stock_car_imageテーブルから該当データを削除するクエリが正常に実行される', async (t) => {
  const result = await deleteStockCarImage(EXHIBITION_ID);
  t.is(result.affectedRows, queryResultMock.affectedRows);
});

test('stock_car_equipテーブルから該当データを削除するクエリが正常に実行される', async (t) => {
  const result = await deleteStockCarEquip(EXHIBITION_ID);
  t.is(result.affectedRows, queryResultMock.affectedRows);
});

test('stock_car_crackテーブルから該当データを削除するクエリが正常に実行される', async (t) => {
  const result = await deleteStockCarCrack(EXHIBITION_ID);
  t.is(result.affectedRows, queryResultMock.affectedRows);
});

test('stock_carテーブルから該当データを削除するクエリが正常に実行される', async (t) => {
  const result = await deleteStockCar(EXHIBITION_ID);
  t.is(result.affectedRows, queryResultMock.affectedRows);
});

test('複数テーブルからの削除を連携する処理が正常に実行される', async (t) => {
  const deleteList = [EXHIBITION_ID, EXHIBITION_ID, EXHIBITION_ID];
  const result = await deleteStockCarAllFromDBAPI(deleteList);
  t.deepEqual(result, deleteAllResult);
});

test('複数テーブルからの削除を連携にて、エラー発生時にresultsが返却される', async (t) => {
  const deleteList = [EXHIBITION_ID_ERROR, EXHIBITION_ID_ERROR, EXHIBITION_ID_ERROR];
  const result = await deleteStockCarAllFromDBAPI(deleteList);
  t.deepEqual(result, dbapiErrorResult);
});
