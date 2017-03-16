# intacct-api

[![CircleCI](https://img.shields.io/circleci/project/github/GoodwayGroup/intacct-api.svg)](https://circleci.com/gh/GoodwayGroup/intacct-api)
[![Codecov](https://img.shields.io/codecov/c/github/GoodwayGroup/intacct-api.svg)](https://codecov.io/github/GoodwayGroup/intacct-api)

## IntacctApi(options)

### options

* auth
    * senderId
    * senderPassword
    * [sessionId] - required if missing userId
    * [userId] - cannot be used with sessionId
    * [companyId] - required if userId given
    * [password] - required if userId given
* [controlId] - defaults to v1 uuid
* [uniqueId] - boolean
* [dtdVersion] - defaults to '3.0'

### .request(...controlFunctions)

Make a request to Intacct's API to fulfill the given control functions. You can provide arrays of control functions via many arguments and/or single array. See the following examples:

```javascript
const api = new IntacctApi({ ... });

const cid1 = api.inspect({ object: 'PROJECT' });
const cid2 = api.inspect({ object: 'VENDOR' });

// With a single array
const singleArray = await api.request([cid1, cid2]);

// With arguments
const withArgs = await api.request(cid1, cid2);

// Mixed arguments
const mixedArgs = await api.request(cid1, [cid2]);
```

#### Request Result

There are a couple ways to retrieve the results from the control functions: 1) from the return of the `request` function call or 2) from the reference of the control function you passed into the `request` call.

##### Invocation Return

* functions - object hash of control functions keyed by control Function's control id
* payload - converted payload from xml
* rawPayload - raw payload string

## ControlFunction Class

It's exported from the module as `ControlFunction`.

### constructor(name, params = {}, controlId = null, parse = true)

Sets up a control function. It is recommended that you use one of the static factory methods.

### .get([path])

If path is given, hoek.reach is used to retrieve the desired property. If path isn't given, the entire `this.data` variable is returned.

### .isSuccessful()

Returns a boolean of the contextual control function's resulting success.

### .assignControlId(controlId = null)

Assigns or generates a control id. Caution to not duplicate control ids, duplicate id's will result in a thrown error.

## Static Functions

All static functions return an instance of the ControlFunction class with the name defined by the static function's name. All static functions have the same signature: `(params, controlId = null, parse = true)`

Refer to [Intacct's API Documentation](https://developer.intacct.com/wiki/function-reference) for how to understand the parameters needed to make these functions work.

* .consolidate(...)
* .create(...)
* .delete(...)
* .getAPISession(...)
* .getUserPermissions(...)
* .inspect(...)
* .installApp(...)
* .read(...)
* .readByName(...)
* .readByQuery(...)
* .readMore(...)
* .readRelated(...)
* .readReport(...)
* .readView(...)
* .update(...)

## Static Function: readMore

This static function is special in that, instead of passing a parameters object to it, you can pass it a successful ControlFunction. This is important because to paginate using Intacct's API, you have to pass it a cursor they understand. Passing the successful ControlFunction allows this function to properly construct a readMore control function for you to then request. See this example:

```javascript
const cid1 = IntacctApi.readByQuery({ object: 'PROJECT', pagesize: 1 });

const result1 = await obj.request(cid1);

const cid2 = IntacctApi.readMore(cid1);

const result2 = await obj.request(cid2);
```
