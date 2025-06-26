const DB_NAME = 'TestMgmtDB', DB_VERSION = 1;
const STORES = ['suites','requirements','testCases','executions'];

function openDB() {
  return new Promise((res, rej) => {
    const rq = indexedDB.open(DB_NAME, DB_VERSION);
    rq.onupgradeneeded = () => {
      const db = rq.result;
      STORES.forEach(name => {
        if (!db.objectStoreNames.contains(name)) {
          const st = db.createObjectStore(name, {keyPath:'id',autoIncrement:true});
          if (name==='testCases') st.createIndex('suiteId','suiteId',{unique:false});
          if (name==='executions') st.createIndex('testCaseId','testCaseId',{unique:false});
        }
      });
    };
    rq.onsuccess = () => res(rq.result);
    rq.onerror = () => rej(rq.error);
  });
}
function dbOperation(store, mode, cb) {
  return openDB().then(db => new Promise((res, rej)=>{
    const tx = db.transaction(store, mode);
    const st = tx.objectStore(store);
    const rq = cb(st);
    rq.onsuccess = () => res(rq.result);
    rq.onerror = () => rej(rq.error);
  }));
}
function dbAdd(store, obj){ obj.createdAt=obj.updatedAt=Date.now(); return dbOperation(store,'readwrite', st=>st.add(obj)); }
function dbGetAll(store, idx, val){ return dbOperation(store,'readonly', st => idx ? st.index(idx).getAll(val) : st.getAll()); }
function dbGet(store, id){ return dbOperation(store,'readonly', st => st.get(id)); }
function dbUpdate(store, obj){ obj.updatedAt = Date.now(); return dbOperation(store,'readwrite', st=>st.put(obj)); }
function dbDelete(store, id){ return dbOperation(store,'readwrite', st=>st.delete(id)); }
