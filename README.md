# intacct-api

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
