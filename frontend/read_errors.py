import json

with open('test_results.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

for test_result in data['testResults']:
    if test_result['status'] == 'failed':
        print(f"File: {test_result['name']}")
        for assertion in test_result['assertionResults']:
            if assertion['status'] == 'failed':
                print(f"  Test: {assertion['title']}")
                print(f"  Error: {assertion['failureMessages'][0][:300]}...")
