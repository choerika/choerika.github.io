import mysql from 'mysql';
import Promise from 'bluebird';
import {deleteStockCarAllFromDB, finishDeleting} from './services/';
import {dbConnectionConfigToOutletDB} from './services/config';

let dbConnectionToOutletDB = mysql.createConnection(dbConnectionConfigToOutletDB());

export const deleteBargainStockCars = (exhibitionId) => {
  return new Promise((resolve, reject) => {
    const deleteBargainStockCarsQuery = `DELETE FROM bargain_stock_cars WHERE stock_car_add = '${exhibitionId}';`;
    dbConnectionToOutletDB.query(deleteBargainStockCarsQuery, (error, results) => {
      if (error) {
        reject(`OUTLET_DB bargain_stock_cars -> ${error.message}`);
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
    dbConnectionToOutletDB.destroy();
    dbConnectionToOutletDB = mysql.createConnection(dbConnectionConfigToOutletDB());
    throw e;
  })
  ;
};

export const deleteStockCarAddExtractions = (exhibitionId) => {
  return new Promise((resolve, reject) => {
    const deleteStockCarAddExtractionsQuery = `DELETE FROM stock_car_add_extractions WHERE exhibition_id = '${exhibitionId}';`;
    dbConnectionToOutletDB.query(deleteStockCarAddExtractionsQuery, (error, results) => {
      if (error) {
        reject(`OUTLET_DB stock_car_add_extractions -> ${error.message}`);
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
    dbConnectionToOutletDB.destroy();
    dbConnectionToOutletDB = mysql.createConnection(dbConnectionConfigToOutletDB());
    throw e;
  })
  ;
};

export const deleteStockCarAdds = (exhibitionId) => {
  return new Promise((resolve, reject) => {
    const deleteStockCarAddsQuery = `DELETE FROM stock_car_adds WHERE exhibition_id = '${exhibitionId}';`;
    dbConnectionToOutletDB.query(deleteStockCarAddsQuery, (error, results) => {
      if (error) {
        reject(`OUTLET_DB stock_car_adds -> ${error.message}`);
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
    dbConnectionToOutletDB.destroy();
    dbConnectionToOutletDB = mysql.createConnection(dbConnectionConfigToOutletDB());
    throw e;
  })
  ;
};

export const deleteStockCarHiddens = (exhibitionId) => {
  return new Promise((resolve, reject) => {
    const deleteStockCarHiddensQuery = `DELETE FROM stock_car_hiddens WHERE stock_car_add = '${exhibitionId}';`;
    dbConnectionToOutletDB.query(deleteStockCarHiddensQuery, (error, results) => {
      if (error) {
        reject(`OUTLET_DB stock_car_hiddens -> ${error.message}`);
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
    dbConnectionToOutletDB.destroy();
    dbConnectionToOutletDB = mysql.createConnection(dbConnectionConfigToOutletDB());
    throw e;
  })
  ;
};

export const deleteStockCarSolds = (exhibitionId) => {
  return new Promise((resolve, reject) => {
    const deleteStockCarSoldsQuery = `DELETE FROM stock_car_solds WHERE stock_car_add = '${exhibitionId}';`;
    dbConnectionToOutletDB.query(deleteStockCarSoldsQuery, (error, results) => {
      if (error) {
        reject(`OUTLET_DB stock_car_solds -> ${error.message}`);
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
    dbConnectionToOutletDB.destroy();
    dbConnectionToOutletDB = mysql.createConnection(dbConnectionConfigToOutletDB());
    throw e;
  })
  ;
};

export const deleteStockCarAllFromOutletDB = (deleteList, s3Object) => {
  dbConnectionToOutletDB = mysql.createConnection(dbConnectionConfigToOutletDB());
  const deleteStockCarDependenciesList = [
    deleteBargainStockCars,
    deleteStockCarAddExtractions,
    deleteStockCarAdds,
    deleteStockCarHiddens,
    deleteStockCarSolds,
  ];
  const promise = deleteStockCarAllFromDB(
    s3Object,
    deleteList,
    deleteStockCarDependenciesList,
  );
  return finishDeleting(
    promise,
    dbConnectionToOutletDB,
  );
};
