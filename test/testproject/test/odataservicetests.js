var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var MovieProxy = MovieService.MovieContainer;
var serviceuri = "http://localhost:2200/moviedb";
console.log("Starting Tests");
QUnit.test("Default test", function (assert) {
    assert.ok(1 === 1, "Passed!");
});
QUnit.test("Test Get", function (assert) { return __awaiter(_this, void 0, void 0, function () {
    var comm, done, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                comm = new MovieProxy(serviceuri, "Testproxy");
                done = assert.async();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, comm.Addresses.Get()];
            case 2:
                _a.sent();
                assert.ok(true, "Passed get all");
                return [4 /*yield*/, comm.Addresses.Select("Id").Get("1")];
            case 3:
                _a.sent();
                assert.ok(true, "Passed get one with select");
                done();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                assert.ok(false, JSON.stringify(error_1));
                done();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
QUnit.test("Test Post", function (assert) {
    var comm = new MovieProxy(serviceuri, "Testproxy");
    var done = assert.async();
    comm.Addresses.Post({
        Id: 0, Street: "123 Fakestreet", Zip: "123456"
    }).then(function (value) {
        assert.ok(true);
        done();
    })["catch"](function (err) {
        assert.ok(false, JSON.stringify(err));
        done();
    });
});
QUnit.test("Test Rate Action", function (assert) {
    var comm = new MovieProxy(serviceuri, "Testproxy");
    var done = assert.async();
    comm.Movies.Rate(0, 2.5, "This is not a good movie.").then(function (value) {
        assert.ok(value === "Rated  successfully");
        done();
    })["catch"](function (err) {
        assert.ok(false, JSON.stringify(err));
        done();
    });
});
QUnit.test("Test Unbound Action", function (assert) {
    var comm = new MovieProxy(serviceuri, "Testproxy");
    var done = assert.async();
    comm.SetSomething(25).then(function (value) {
        assert.ok(value === 25);
        done();
    })["catch"](function (err) {
        assert.ok(false, JSON.stringify(err));
        done();
    });
});
QUnit.test("Test Unbound Function", function (assert) {
    var comm = new MovieProxy(serviceuri, "Testproxy");
    var done = assert.async();
    comm.CurrentTime().then(function (value) {
        var curtime = new Date(value);
        assert.ok(curtime != undefined);
        done();
    })["catch"](function (err) {
        assert.ok(false, JSON.stringify(err));
        done();
    });
});
