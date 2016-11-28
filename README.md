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

### .request([controlFunctions])

Make a request to Intacct's API to fulfill the given control functions.

## Static Functions

### .create(params, [controlId])
