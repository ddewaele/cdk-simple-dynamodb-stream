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