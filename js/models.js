// models.js

(function() {
  class TestSuite {
    static store = 'suites';
    static create(data) { return dbAdd(this.store, data); }
    static getAll() { return dbGetAll(this.store); }
    static update(obj) { return dbUpdate(this.store, obj); }
    static delete(id) { return dbDelete(this.store, id); }
  }

  class Requirement {
    static store = 'requirements';
    static create(data) { return dbAdd(this.store, data); }
    static getAll() { return dbGetAll(this.store); }
    static update(obj) { return dbUpdate(this.store, obj); }
    static delete(id) { return dbDelete(this.store, id); }
  }

  class TestCase {
    static store = 'testCases';
    static create(data) { return dbAdd(this.store, data); }
    static getAll(filters) {
      return filters?.suiteId
        ? dbGetAll(this.store, 'suiteId', filters.suiteId)
        : dbGetAll(this.store);
    }
    static update(obj) { return dbUpdate(this.store, obj); }
    static delete(id) { return dbDelete(this.store, id); }
  }

  class Execution {
    static store = 'executions';
    static record(testCaseId, status) {
      return dbAdd(this.store, {
        testCaseId,
        status,
        timestamp: Date.now()
      });
    }
    static getByTestCase(id) {
      return dbGetAll(this.store, 'testCaseId', id);
    }
  }

  // Expose globally
  window.TestSuite = TestSuite;
  window.Requirement = Requirement;
  window.TestCase = TestCase;
  window.Execution = Execution;

  console.log('Database initialized from models.js');
})();
