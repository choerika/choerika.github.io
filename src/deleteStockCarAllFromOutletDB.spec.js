import test from 'ava';
import {
  EXHIBITION_ID,
  EXHIBITION_ID_ERROR,
  queryResultMock,
  outletDBErrorResult,
  outletDBResult,
} from '../test/mock/';
import {deleteBargainStockCars, deleteStockCarAddExtractions, deleteStockCarAdds, deleteStockCarHiddens, deleteStockCarSolds, deleteStockCarAllFromOutletDB} from './deleteStockCarAllFromOutletDB';

test('bargain_stock_carsテーブルから該当データを削除するクエリが正常に実行される', async (t) => {
  const result = await deleteBargainStockCars(EXHIBITION_ID);
  t.is(result.affectedRows, queryResultMock.affectedRows);
});

test('stock_car_add_extractionsテーブルから該当データを削除するクエリが正常に実行される', async (t) => {
  const result = await deleteStockCarAddExtractions(EXHIBITION_ID);
  t.is(result.affectedRows, queryResultMock.affectedRows);
});

test('stock_car_addsテーブルから該当データを削除するクエリが正常に実行される', async (t) => {
  const result = await deleteStockCarAdds(EXHIBITION_ID);
  t.is(result.affectedRows, queryResultMock.affectedRows);
});

test('stock_car_hiddensテーブルから該当データを削除するクエリが正常に実行される', async (t) => {
  const result = await deleteStockCarHiddens(EXHIBITION_ID);
  t.is(result.affectedRows, queryResultMock.affectedRows);
});

test('stock_car_soldsテーブルから該当データを削除するクエリが正常に実行される', async (t) => {
  const result = await deleteStockCarSolds(EXHIBITION_ID);
  t.is(result.affectedRows, queryResultMock.affectedRows);
});

test('複数テーブルからの削除を連携する処理が正常に実行される', async (t) => {
  const deleteList = [EXHIBITION_ID, EXHIBITION_ID, EXHIBITION_ID];
  const result = await deleteStockCarAllFromOutletDB(deleteList);
  t.deepEqual(result, outletDBResult);
});

test('複数テーブルからの削除を連携にて、エラー発生時にresultsが返却される', async (t) => {
  const deleteList = [EXHIBITION_ID_ERROR, EXHIBITION_ID_ERROR, EXHIBITION_ID_ERROR];
  const result = await deleteStockCarAllFromOutletDB(deleteList);
  t.deepEqual(result, outletDBErrorResult);
});
