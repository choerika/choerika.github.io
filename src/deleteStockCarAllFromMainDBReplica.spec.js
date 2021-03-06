import test from 'ava';
import {EXHIBITION_ID,
  EXHIBITION_ID_ERROR,
  queryResultMock,
  mainDBReplicaErrorResult,
  deleteAllResult,
} from '../test/mock/';
import {deleteStockCarAdds, deleteStockCars, deleteStockCarAllFromMainDBReplica} from './deleteStockCarAllFromMainDBReplica';

test('stock_car_addsテーブルから該当データを削除するクエリが正常に実行される', async (t) => {
  const result = await deleteStockCarAdds(EXHIBITION_ID);
  t.is(result.affectedRows, queryResultMock.affectedRows);
});

test('stock_carsテーブルから該当データを削除するクエリが正常に実行される', async (t) => {
  const result = await deleteStockCars(EXHIBITION_ID);
  t.is(result.affectedRows, queryResultMock.affectedRows);
});

test('複数テーブルからの削除を連携する処理が正常に実行される', async (t) => {
  const deleteList = [EXHIBITION_ID, EXHIBITION_ID, EXHIBITION_ID];
  const result = await deleteStockCarAllFromMainDBReplica(deleteList);
  t.deepEqual(result, deleteAllResult);
});

test('複数テーブルからの削除を連携にて、エラー発生時にresultsが返却される', async (t) => {
  const deleteList = [EXHIBITION_ID_ERROR, EXHIBITION_ID_ERROR, EXHIBITION_ID_ERROR];
  const result = await deleteStockCarAllFromMainDBReplica(deleteList);
  t.deepEqual(result, mainDBReplicaErrorResult);
});
