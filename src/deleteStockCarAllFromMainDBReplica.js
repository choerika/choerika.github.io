import mysql from 'mysql';
import Promise from 'bluebird';
import {deleteStockCarAllFromDB, finishDeleting} from './services/';
import {dbConnectionConfigToMainDBReplica} from './services/config';

let dbConnectionToMainDBReplica =
  mysql.createConnection(dbConnectionConfigToMainDBReplica());

export const deleteStockCarAdds = (exhibitionId) => {
  return new Promise((resolve, reject) => {
    const deleteStockCarAddsQuery = `DELETE FROM stock_car_adds WHERE exhibition_id = '${exhibitionId}';`;
    dbConnectionToMainDBReplica.query(deleteStockCarAddsQuery, (error, results) => {
      if (error) {
        reject(`MAIN_DB_REPLICA stock_car_adds -> ${error.message}`);
        return;
      }
      console.log(results);
      resolve(results);
    });
  })
  .then((results) => {
    return results;
  })
  .catch((e) => {
    console.log('Promiseのcatch');
    console.log(e);
    dbConnectionToMainDBReplica.destroy();
    dbConnectionToMainDBReplica = mysql.createConnection(dbConnectionConfigToMainDBReplica());
    throw e;
  })
  ;
};

export const deleteStockCars = (exhibitionId) => {
  return new Promise((resolve, reject) => {
    const deleteStockCarsQuery = `DELETE FROM stock_cars WHERE exhibition_id = '${exhibitionId}';`;
    dbConnectionToMainDBReplica.query(deleteStockCarsQuery, (error, results) => {
      if (error) {
        reject(`MAIN_DB_REPLICA stock_cars -> ${error.message}`);
        return;
      }
      console.log(results);
      resolve(results);
    });
  })
  .then((results) => {
    return results;
  })
  .catch((e) => {
    console.log('Promiseのcatch');
    console.log(e);
    dbConnectionToMainDBReplica.destroy();
    dbConnectionToMainDBReplica = mysql.createConnection(dbConnectionConfigToMainDBReplica());
    throw e;
  })
  ;
};

export const deleteStockCarAllFromMainDBReplica = (deleteList, s3Object) => {
  dbConnectionToMainDBReplica = mysql.createConnection(dbConnectionConfigToMainDBReplica());
  const deleteStockCarDependenciesList = [
    deleteStockCarAdds,
  ];
  const promise = deleteStockCarAllFromDB(
    s3Object,
    deleteList,
    deleteStockCarDependenciesList,
    deleteStockCars,
  );
  return finishDeleting(
    promise,
    dbConnectionToMainDBReplica,
  );
};
