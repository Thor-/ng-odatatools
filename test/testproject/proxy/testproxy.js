/**************************************************************************
Created by odatatools: https://marketplace.visualstudio.com/items?itemName=apazureck.odatatools
Use Command 'odata: xyUpdate to refresh data while this file is active in the editor.
Creation Time: Mon Jan 15 2018 20:59:16 GMT+0100 (Mitteleuropäische Zeit)
DO NOT DELETE THIS IN ORDER TO UPDATE YOUR SERVICE
#ODATATOOLSOPTIONS
{
    "modularity": "Ambient",
    "requestOptions": {},
    "source": "http://services.odata.org/TripPinRESTierService/(S(tq0v4cxv3cph5pkpi1qziqzc))/$metadata",
    "useTemplate": "proxy.ot"
}
#ODATATOOLSOPTIONSEND
**************************************************************************/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Base classes ##########################################################
// Leave this in order to use the base classes
var odatatools;
(function (odatatools) {
    var Method;
    (function (Method) {
        Method[Method["GET"] = 0] = "GET";
        Method[Method["POST"] = 1] = "POST";
        Method[Method["PUT"] = 2] = "PUT";
        Method[Method["PATCH"] = 3] = "PATCH";
        Method[Method["DELETE"] = 4] = "DELETE";
    })(Method || (Method = {}));
    var ProxyBase = /** @class */ (function () {
        function ProxyBase(Address, Name, additonalHeaders) {
            this.Address = Address;
            this.Name = Name;
            this.Name = this.Name || "ProxyService";
            this.Headers = {
                "Content-Type": "application/json",
                Accept: "application/json"
            };
            for (var attrname in additonalHeaders) {
                this.Headers[attrname] = additonalHeaders[attrname];
            }
        }
        return ProxyBase;
    }());
    odatatools.ProxyBase = ProxyBase;
    var ODataQueryOptionBase = /** @class */ (function () {
        function ODataQueryOptionBase() {
            this.query = [];
        }
        ODataQueryOptionBase.prototype.resolveODataOptions = function () {
            if (this.query.length > 0)
                return "?" + this.query.join("&");
            else
                return "";
        };
        ODataQueryOptionBase.prototype.addToQuery = function (element) {
            this.query.push(element);
        };
        ODataQueryOptionBase.prototype.emptyQuery = function () {
            this.query = [];
        };
        return ODataQueryOptionBase;
    }());
    odatatools.ODataQueryOptionBase = ODataQueryOptionBase;
    var ODataQueryOptionsGetSingle = /** @class */ (function (_super) {
        __extends(ODataQueryOptionsGetSingle, _super);
        function ODataQueryOptionsGetSingle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ODataQueryOptionsGetSingle;
    }(ODataQueryOptionBase));
    odatatools.ODataQueryOptionsGetSingle = ODataQueryOptionsGetSingle;
    var ODataQueryFilterOptions = /** @class */ (function (_super) {
        __extends(ODataQueryFilterOptions, _super);
        function ODataQueryFilterOptions() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Selects properties on the elements. Works on Get() and Get(id).
         *
         * @param {keyof T | (keyof T)[]} properties Use comma separated names without spaces
         * @returns {ODataQueryOptions<T>}
         *
         * @memberof ODataQueryOptions
         */
        ODataQueryFilterOptions.prototype.Select = function (properties) {
            if (typeof properties === "string")
                this.addToQuery("$select=" + properties);
            else
                this.addToQuery("$select=" + properties.join(","));
            return this;
        };
        /**
         * Orders elements by the given property. Works only on Get()
         *
         * @param {string} property Property on dataset to order by
         * @param {Order} [order=asc] Order "asc" for ascending and "desc" for descending.
         * @returns {ODataQueryFilterOptions<T>}
         *
         * @memberof ODataQueryFilterOptions
         */
        ODataQueryFilterOptions.prototype.OrderBy = function (property, order) {
            this.addToQuery("$orderby=" + property + order ? " " + order : "");
            return this;
        };
        /**
         * Top selects the given number of element. Works only on Get()
         *
         * @param {number} select number of elements to select
         * @returns {ODataQueryFilterOptions<T>}
         *
         * @memberof ODataQueryFilterOptions
         */
        ODataQueryFilterOptions.prototype.Top = function (select) {
            this.addToQuery("$top=" + select);
            return this;
        };
        /**
         * Skips the given number of elements and starts with element n + 1
         *
         * @param {number} select Number of elements to skip
         * @returns {ODataQueryFilterOptions<T>}
         *
         * @memberof ODataQueryFilterOptions
         */
        ODataQueryFilterOptions.prototype.Skip = function (select) {
            this.addToQuery("$skip=" + select);
            return this;
        };
        /**
         * Filters by given criteria. See odata $filter convention for information on syntax.
         *
         * @param {string} filter Filter syntax specified by odata V4 standard.
         * @returns {ODataQueryFilterOptions<T>}
         *
         * @memberof ODataQueryFilterOptions
         */
        ODataQueryFilterOptions.prototype.Filter = function (filter) {
            this.addToQuery("$filter=" + filter);
            return this;
        };
        /**
         * Expands given property or array of properties.
         *
         * @param {(keyof T | (keyof T)[])} properties Properties to expand on.
         * @returns {ODataQueryFilterOptions<T>}
         *
         * @memberof ODataQueryFilterOptions
         */
        ODataQueryFilterOptions.prototype.Expand = function (properties) {
            if (typeof properties === "string")
                this.addToQuery("$expand=" + properties);
            else
                this.addToQuery("$expand=" + properties.join(","));
            return this;
        };
        /**
         * Searches for a value in the entity set as specified in OData protocol
         *
         * @param {string} searchExpression Search specified in OData protocol
         * @returns {ODataQueryFilterOptions<T>}
         *
         * @memberof ODataQueryFilterOptions
         */
        ODataQueryFilterOptions.prototype.Search = function (searchExpression) {
            this.addToQuery("$search=" + searchExpression);
            return this;
        };
        ODataQueryFilterOptions.prototype.Custom = function (customData) {
            this.addToQuery(customData);
            return this;
        };
        return ODataQueryFilterOptions;
    }(ODataQueryOptionsGetSingle));
    odatatools.ODataQueryFilterOptions = ODataQueryFilterOptions;
    /**
     *
     * A generic entity set which represents the content of the entity container.
     *
     * @export
     * @class EntitySet
     * @template T
     */
    var EntitySet = /** @class */ (function (_super) {
        __extends(EntitySet, _super);
        /**
         * Creates an instance of EntitySet.
         *
         * @param {string} name of the EntitySet (Will determine the address of the entityset, too -> address + "/" + name)
         * @param {string} address of the service
         * @param {string} key of the EntitySet
         * @param {odatajs.Header} [headers] additional headers: Per default there are "Content-Type" and "Accept".
         *
         * @memberOf EntitySet
         */
        function EntitySet(name, address, key, additionalHeaders) {
            var _this = _super.call(this) || this;
            _this.Name = name;
            _this.Address = address.replace(/\/$/, "") + "/" + name;
            _this.Key = key;
            _this.Headers = {
                "Content-Type": "application/json",
                Accept: "application/json"
            };
            for (var attrname in additionalHeaders) {
                _this.Headers[attrname] = additionalHeaders[attrname];
            }
            return _this;
        }
        EntitySet.prototype.Get = function (id) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var requri;
                if (id) {
                    requri = _this.Address + "(" + id + ")";
                }
                else {
                    requri = _this.Address;
                }
                requri += _this.resolveODataOptions();
                _this.emptyQuery();
                var request = {
                    headers: _this.Headers,
                    method: Method[Method.GET],
                    requestUri: requri
                };
                odatajs.oData.request(request, function (data, response) {
                    if (id) {
                        resolve(data);
                    }
                    else {
                        resolve(data.value);
                    }
                }, function (error) {
                    console.error(error.name +
                        " " +
                        error.message +
                        " | " +
                        (error.response | error.response.statusText) +
                        ":\n" +
                        (error.response | error.response.body));
                    reject(error);
                });
            });
        };
        /**
         * Replaces an existing value in the entity collection.
         *
         * @param {T} value to replace
         * @returns {Promise<T>} for async Operation. Use `await` keyword to get value or `.then` callback.
         *
         * @memberOf EntitySet
         */
        EntitySet.prototype.Put = function (value) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var request = {
                    headers: _this.Headers,
                    method: Method[Method.PUT],
                    requestUri: _this.Address + "(" + value[_this.Key] + ")",
                    data: value
                };
                odatajs.oData.request(request, function (data, response) {
                    resolve();
                }, function (error) {
                    console.error(error.name +
                        " " +
                        error.message +
                        " | " +
                        (error.response | error.response.statusText) +
                        ":\n" +
                        (error.response | error.response.body));
                    reject(error);
                });
            });
        };
        /**
         * Adds a new entry to an EntitySet
         *
         * @param {T} value to ad to the EntitySet
         * @returns {Promise<T>} for async Operation. Use `await` keyword to get value or `.then` callback.
         *
         * @memberOf EntitySet
         */
        EntitySet.prototype.Post = function (value) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var request = {
                    headers: _this.Headers,
                    method: Method[Method.POST],
                    requestUri: _this.Address,
                    data: value
                };
                odatajs.oData.request(request, function (data, response) {
                    resolve(data);
                }, function (error) {
                    console.error(error.name +
                        " " +
                        error.message +
                        " | " +
                        (error.response | error.response.statusText) +
                        ":\n" +
                        (error.response | error.response.body));
                    reject(error);
                });
            });
        };
        EntitySet.prototype.Patch = function (oldvalordelta, newval) {
            var _this = this;
            if (newval)
                oldvalordelta = this.getDelta(oldvalordelta, newval);
            return new Promise(function (resolve, reject) {
                var request = {
                    headers: _this.Headers,
                    method: Method[Method.PATCH],
                    requestUri: _this.Address,
                    data: oldvalordelta
                };
                odatajs.oData.request(request, function (data, response) {
                    resolve();
                }, function (error) {
                    console.error(error.name +
                        " " +
                        error.message +
                        " | " +
                        (error.response | error.response.statusText) +
                        ":\n" +
                        (error.response | error.response.body));
                    reject(error);
                });
            });
        };
        EntitySet.prototype.getDelta = function (oldval, newVal) {
            var ret = {};
            for (var prop in newVal)
                if (oldval[prop] != newVal[prop])
                    ret[prop] = newVal[prop];
            return ret;
        };
        /**
         * Deletes a value from the entity set.
         *
         * @param {T} value to delete
         * @returns {Promise<T>} for async Operation. Use `await` keyword to get value or `.then` callback.
         *
         * @memberOf EntitySet
         */
        EntitySet.prototype.Delete = function (value) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var request = {
                    headers: _this.Headers,
                    method: Method[Method.DELETE],
                    requestUri: _this.Address + "(" + value[_this.Key] + ")"
                };
                odatajs.oData.request(request, function (data, response) {
                    resolve();
                }, function (error) {
                    console.error(error.name +
                        " " +
                        error.message +
                        " | " +
                        (error.response | error.response.statusText) +
                        ":\n" +
                        (error.response | error.response.body));
                    reject(error);
                });
            });
        };
        EntitySet.prototype.Count = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var requri = _this.Address + "/$count/" + _this.resolveODataOptions();
                var request = {
                    headers: _this.Headers,
                    method: Method[Method.GET],
                    requestUri: requri
                };
                odatajs.oData.request(request, function (data, response) {
                    resolve(data);
                }, function (error) {
                    console.error(error.name +
                        " " +
                        error.message +
                        " | " +
                        (error.response | error.response.statusText) +
                        ":\n" +
                        (error.response | error.response.body));
                    reject(error);
                });
            });
        };
        return EntitySet;
    }(ODataQueryFilterOptions));
    odatatools.EntitySet = EntitySet;
    var EntityContainer = /** @class */ (function () {
        function EntityContainer(name, uri) {
            this.Name = name;
            this.Uri = uri;
        }
        return EntityContainer;
    }());
})(odatatools || (odatatools = {}));
console.log("Loaded odataproxybase");
// ###################################### Implementation ################
var Microsoft;
(function (Microsoft) {
    var OData;
    (function (OData) {
        var Service;
        (function (Service) {
            var Sample;
            (function (Sample) {
                var TrippinInMemory;
                (function (TrippinInMemory) {
                    var Models;
                    (function (Models) {
                        var Container = /** @class */ (function (_super) {
                            __extends(Container, _super);
                            function Container(address, name, additionalHeaders) {
                                var _this = _super.call(this, address, name, additionalHeaders) || this;
                                _this.People = new PeopleEntitySet("People", address, "UserName", additionalHeaders);
                                _this.Airlines = new AirlinesEntitySet("Airlines", address, "AirlineCode", additionalHeaders);
                                _this.Airports = new AirportsEntitySet("Airports", address, "Name", additionalHeaders);
                                _this.NewComePeople = new NewComePeopleEntitySet("NewComePeople", address, "UserName", additionalHeaders);
                                return _this;
                            }
                            // Unbound Functions
                            Container.prototype.GetPersonWithMostFriends = function () {
                                var _this = this;
                                return new Promise(function (resolve, reject) {
                                    var request = {
                                        headers: _this.Headers,
                                        method: "GET",
                                        requestUri: _this.Address + "/GetPersonWithMostFriends()"
                                    };
                                    odatajs.oData.request(request, function (data, response) {
                                        resolve(data.value || data);
                                    }, function (error) {
                                        console.error(error.name +
                                            " " +
                                            error.message +
                                            " | " +
                                            (error.response | error.response.statusText) +
                                            ":" +
                                            (error.response | error.response.body));
                                        reject(error);
                                    });
                                });
                            };
                            Container.prototype.GetNearestAirport = function (lat, lon) {
                                var _this = this;
                                return new Promise(function (resolve, reject) {
                                    var request = {
                                        headers: _this.Headers,
                                        method: "GET",
                                        requestUri: _this.Address + "/GetNearestAirport(lat=" + lat + ",lon=" + lon + ")"
                                    };
                                    odatajs.oData.request(request, function (data, response) {
                                        resolve(data.value || data);
                                    }, function (error) {
                                        console.error(error.name +
                                            " " +
                                            error.message +
                                            " | " +
                                            (error.response | error.response.statusText) +
                                            ":" +
                                            (error.response | error.response.body));
                                        reject(error);
                                    });
                                });
                            };
                            //Unbound Actions
                            Container.prototype.ResetDataSource = function () {
                                var _this = this;
                                return new Promise(function (resolve, reject) {
                                    var request = {
                                        headers: _this.Headers,
                                        method: "POST",
                                        requestUri: _this.Address + "/ResetDataSource()",
                                        data: {}
                                    };
                                    odatajs.oData.request(request, function (data, response) {
                                        resolve(data.value || data);
                                    }, function (error) {
                                        console.error(error.name +
                                            " " +
                                            error.message +
                                            " | " +
                                            (error.response | error.response.statusText) +
                                            ":" +
                                            (error.response | error.response.body));
                                        reject(error);
                                    });
                                });
                            };
                            return Container;
                        }(odatatools.ProxyBase));
                        Models.Container = Container;
                        //EntitySets
                        var PeopleEntitySet = /** @class */ (function (_super) {
                            __extends(PeopleEntitySet, _super);
                            function PeopleEntitySet(name, address, key, additionalHeaders) {
                                return _super.call(this, name, address, key, additionalHeaders) || this;
                            }
                            // Bound to entity Actions
                            PeopleEntitySet.prototype.ShareTrip = function (key, userName, tripId) {
                                var _this = this;
                                return new Promise(function (resolve, reject) {
                                    var request = {
                                        headers: _this.Headers,
                                        method: "POST",
                                        requestUri: _this.Address +
                                            "(" +
                                            key +
                                            ")/Microsoft.OData.Service.Sample.TrippinInMemory.Models.ShareTrip()",
                                        data: {
                                            userName: userName,
                                            tripId: tripId
                                        }
                                    };
                                    odatajs.oData.request(request, function (data, response) {
                                        resolve(data.value || data);
                                    }, function (error) {
                                        console.error(error.name +
                                            " " +
                                            error.message +
                                            " | " +
                                            (error.response | error.response.statusText) +
                                            ":" +
                                            (error.response | error.response.body));
                                        reject(error);
                                    });
                                });
                            };
                            // Bound to entity Functions
                            PeopleEntitySet.prototype.GetFavoriteAirline = function (person) {
                                var _this = this;
                                return new Promise(function (resolve, reject) {
                                    var request = {
                                        headers: _this.Headers,
                                        method: "GET",
                                        requestUri: _this.Address +
                                            "(" +
                                            person +
                                            ")/Microsoft.OData.Service.Sample.TrippinInMemory.Models.GetFavoriteAirline()"
                                    };
                                    odatajs.oData.request(request, function (data, response) {
                                        resolve(data.value || data);
                                    }, function (error) {
                                        console.error(error.name +
                                            " " +
                                            error.message +
                                            " | " +
                                            (error.response | error.response.statusText) +
                                            ":" +
                                            (error.response | error.response.body));
                                        reject(error);
                                    });
                                });
                            };
                            PeopleEntitySet.prototype.GetFriendsTrips = function (person, userName) {
                                var _this = this;
                                return new Promise(function (resolve, reject) {
                                    var request = {
                                        headers: _this.Headers,
                                        method: "GET",
                                        requestUri: _this.Address +
                                            "(" +
                                            person +
                                            ")/Microsoft.OData.Service.Sample.TrippinInMemory.Models.GetFriendsTrips(userName=" +
                                            userName +
                                            ")"
                                    };
                                    odatajs.oData.request(request, function (data, response) {
                                        resolve(data.value || data);
                                    }, function (error) {
                                        console.error(error.name +
                                            " " +
                                            error.message +
                                            " | " +
                                            (error.response | error.response.statusText) +
                                            ":" +
                                            (error.response | error.response.body));
                                        reject(error);
                                    });
                                });
                            };
                            PeopleEntitySet.prototype.UpdatePersonLastName = function (person, lastName) {
                                var _this = this;
                                return new Promise(function (resolve, reject) {
                                    var request = {
                                        headers: _this.Headers,
                                        method: "GET",
                                        requestUri: _this.Address +
                                            "(" +
                                            person +
                                            ")/Microsoft.OData.Service.Sample.TrippinInMemory.Models.UpdatePersonLastName(lastName=" +
                                            lastName +
                                            ")"
                                    };
                                    odatajs.oData.request(request, function (data, response) {
                                        resolve(data.value || data);
                                    }, function (error) {
                                        console.error(error.name +
                                            " " +
                                            error.message +
                                            " | " +
                                            (error.response | error.response.statusText) +
                                            ":" +
                                            (error.response | error.response.body));
                                        reject(error);
                                    });
                                });
                            };
                            return PeopleEntitySet;
                        }(odatatools.EntitySet));
                        Models.PeopleEntitySet = PeopleEntitySet;
                        var AirlinesEntitySet = /** @class */ (function (_super) {
                            __extends(AirlinesEntitySet, _super);
                            function AirlinesEntitySet(name, address, key, additionalHeaders) {
                                return _super.call(this, name, address, key, additionalHeaders) || this;
                            }
                            return AirlinesEntitySet;
                        }(odatatools.EntitySet));
                        Models.AirlinesEntitySet = AirlinesEntitySet;
                        var AirportsEntitySet = /** @class */ (function (_super) {
                            __extends(AirportsEntitySet, _super);
                            function AirportsEntitySet(name, address, key, additionalHeaders) {
                                return _super.call(this, name, address, key, additionalHeaders) || this;
                            }
                            return AirportsEntitySet;
                        }(odatatools.EntitySet));
                        Models.AirportsEntitySet = AirportsEntitySet;
                        var NewComePeopleEntitySet = /** @class */ (function (_super) {
                            __extends(NewComePeopleEntitySet, _super);
                            function NewComePeopleEntitySet(name, address, key, additionalHeaders) {
                                return _super.call(this, name, address, key, additionalHeaders) || this;
                            }
                            // Bound to entity Actions
                            NewComePeopleEntitySet.prototype.ShareTrip = function (key, userName, tripId) {
                                var _this = this;
                                return new Promise(function (resolve, reject) {
                                    var request = {
                                        headers: _this.Headers,
                                        method: "POST",
                                        requestUri: _this.Address +
                                            "(" +
                                            key +
                                            ")/Microsoft.OData.Service.Sample.TrippinInMemory.Models.ShareTrip()",
                                        data: {
                                            userName: userName,
                                            tripId: tripId
                                        }
                                    };
                                    odatajs.oData.request(request, function (data, response) {
                                        resolve(data.value || data);
                                    }, function (error) {
                                        console.error(error.name +
                                            " " +
                                            error.message +
                                            " | " +
                                            (error.response | error.response.statusText) +
                                            ":" +
                                            (error.response | error.response.body));
                                        reject(error);
                                    });
                                });
                            };
                            // Bound to entity Functions
                            NewComePeopleEntitySet.prototype.GetFavoriteAirline = function (person) {
                                var _this = this;
                                return new Promise(function (resolve, reject) {
                                    var request = {
                                        headers: _this.Headers,
                                        method: "GET",
                                        requestUri: _this.Address +
                                            "(" +
                                            person +
                                            ")/Microsoft.OData.Service.Sample.TrippinInMemory.Models.GetFavoriteAirline()"
                                    };
                                    odatajs.oData.request(request, function (data, response) {
                                        resolve(data.value || data);
                                    }, function (error) {
                                        console.error(error.name +
                                            " " +
                                            error.message +
                                            " | " +
                                            (error.response | error.response.statusText) +
                                            ":" +
                                            (error.response | error.response.body));
                                        reject(error);
                                    });
                                });
                            };
                            NewComePeopleEntitySet.prototype.GetFriendsTrips = function (person, userName) {
                                var _this = this;
                                return new Promise(function (resolve, reject) {
                                    var request = {
                                        headers: _this.Headers,
                                        method: "GET",
                                        requestUri: _this.Address +
                                            "(" +
                                            person +
                                            ")/Microsoft.OData.Service.Sample.TrippinInMemory.Models.GetFriendsTrips(userName=" +
                                            userName +
                                            ")"
                                    };
                                    odatajs.oData.request(request, function (data, response) {
                                        resolve(data.value || data);
                                    }, function (error) {
                                        console.error(error.name +
                                            " " +
                                            error.message +
                                            " | " +
                                            (error.response | error.response.statusText) +
                                            ":" +
                                            (error.response | error.response.body));
                                        reject(error);
                                    });
                                });
                            };
                            NewComePeopleEntitySet.prototype.UpdatePersonLastName = function (person, lastName) {
                                var _this = this;
                                return new Promise(function (resolve, reject) {
                                    var request = {
                                        headers: _this.Headers,
                                        method: "GET",
                                        requestUri: _this.Address +
                                            "(" +
                                            person +
                                            ")/Microsoft.OData.Service.Sample.TrippinInMemory.Models.UpdatePersonLastName(lastName=" +
                                            lastName +
                                            ")"
                                    };
                                    odatajs.oData.request(request, function (data, response) {
                                        resolve(data.value || data);
                                    }, function (error) {
                                        console.error(error.name +
                                            " " +
                                            error.message +
                                            " | " +
                                            (error.response | error.response.statusText) +
                                            ":" +
                                            (error.response | error.response.body));
                                        reject(error);
                                    });
                                });
                            };
                            return NewComePeopleEntitySet;
                        }(odatatools.EntitySet));
                        Models.NewComePeopleEntitySet = NewComePeopleEntitySet;
                    })(Models = TrippinInMemory.Models || (TrippinInMemory.Models = {}));
                })(TrippinInMemory = Sample.TrippinInMemory || (Sample.TrippinInMemory = {}));
            })(Sample = Service.Sample || (Service.Sample = {}));
        })(Service = OData.Service || (OData.Service = {}));
    })(OData = Microsoft.OData || (Microsoft.OData = {}));
})(Microsoft || (Microsoft = {}));
