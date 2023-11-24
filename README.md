# Simple DynamoDB Streams

Simple CDK project that sets up a DynamoDB Table and a Lambda.
Setups up a DynamoDB stream hooked up to a lambda.



You can insert a single item
```
export TABLE_NAME=CdkSimpleDynamodbStreamStack-StreamingDataTable0F476BA9-CMNYI4IC45AG

for i in {1..10}; do
    aws dynamodb put-item \
        --table-name $TABLE_NAME  \
        --item \
            "{\"id\": {\"S\": \"$i\"}, \"name\": {\"S\": \"User${i}\"}, \"metric\": {\"N\": \"4.321\"}, \"date\": {\"S\": \"2023-10-23T18:36:06.642Z\"}}"
done
```

Or us the provided batch.sh to insert some records. 

```
for batch in {1..5}; do
    # Start of the JSON request body
    json='{"'$TABLE_NAME'": ['

    for batch_item in {1..25}; do
        # Construct each item in the batch

        json+='{"PutRequest": {"Item": {"id": {"S": "'$batch-$batch_item'"}, "name": {"S": "User'$batch-$batch_item'"}, "metric": {"N": "4.321"}, "date": {"S": "2023-10-23T18:36:06.642Z"}}}},'
    done

    # Remove the last comma and close the JSON request body
    json=$(echo $json | sed 's/,$//')
    json+=']}'


    echo $json

    # Execute the batch write command
    aws dynamodb batch-write-item --request-items "$json"
done
```


## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
