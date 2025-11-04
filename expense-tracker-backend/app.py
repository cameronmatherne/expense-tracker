from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['expense-tracker-db']
collection = db['transaction']
balance_collection = db['balance']
buckets_collection = db['buckets']


@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    
    data = request.json
    transaction_type = data.get("type", "withdrawal").lower()
    amount = float(data.get("amount", 0))

    if transaction_type == "withdrawal":
        amount = -abs(amount)
    else:
        amount = abs(amount)

    transaction = {
        "amount": amount,
        "description": data.get("description", ""),
        "category": data.get("category", "Uncategorized"),
        "date": data.get("date", ""),
        "due_date": data.get("due_date", ""),
        "type": transaction_type,
    }

    result = collection.insert_one(transaction)
    return jsonify({'message': 'Transaction added', 'id': str(result.inserted_id)}), 201


@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    transactions = []
    for tx in collection.find():
        tx['_id'] = str(tx['_id'])
        transactions.append(tx)
    return jsonify(transactions), 200


@app.route('/api/transactions/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    result = collection.delete_one({'_id': ObjectId(transaction_id)})
    if result.deleted_count == 1:
        return jsonify({'message': 'Transaction deleted'}), 200
    return jsonify({'error': 'Transaction not found'}), 404


@app.route('/api/transactions/<transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    data = request.json

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        transaction_type = data.get("type", "withdrawal").lower()
        amount = float(data.get("amount", 0))

        if transaction_type == "withdrawal":
            amount = -abs(amount)
        else:
            amount = abs(amount)

        updated_data = {
            "amount": amount,
            "description": data.get("description", ""),
            "category": data.get("category", "Uncategorized"),
            "date": data.get("date", ""),
            "due_date": data.get("due_date", ""),
            "type": transaction_type,
        }

        result = collection.update_one(
            {'_id': ObjectId(transaction_id)},
            {'$set': updated_data}
        )

        if result.matched_count == 1:
            return jsonify({'message': 'Transaction updated'}), 200
        else:
            return jsonify({'error': 'Transaction not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/summary', methods=['GET'])
def transaction_summary():
    deposits = withdrawals = 0
    for tx in collection.find():
        amount = tx.get("amount", 0)
        if amount >= 0:
            deposits += amount
        else:
            withdrawals += abs(amount)

    return jsonify({
        "total_deposits": deposits,
        "total_withdrawals": withdrawals
    }), 200


@app.route('/api/balance', methods=['GET'])
def get_balance():
    doc = balance_collection.find_one({"_id": "main"})
    if doc:
        return jsonify({"balance": doc["balance"]}), 200
    else:
        return jsonify({"balance": 0}), 200


@app.route('/api/balance', methods=['POST'])
def set_balance():
    data = request.json
    new_balance = float(data.get("balance", 0))
    balance_collection.update_one(
        {"_id": "main"},
        {"$set": {"balance": new_balance}},
        upsert=True
    )
    return jsonify({"message": "Balance updated", "balance": new_balance}), 200


@app.route('/api/buckets', methods=['GET'])
def get_buckets(): 
    buckets = []
    for bucket in buckets_collection.find():
        bucket['_id'] = str(bucket['_id'])
        buckets.append(bucket)
    return jsonify(buckets), 200

@app.route('/api/buckets', methods=['POST'])
def create_bucket():
    
    data = request.json
    bucket = {
        "name": data.get("name", ""),
        "limit": float(data.get("limit", 0)),
        "spent": 0
    }
    result = buckets_collection.insert_one(bucket)
    return jsonify({'message': 'Bucket created', 'id': str(result.inserted_id)}), 201



if __name__ == '__main__':
    app.run(debug=True)
