from flask import Flask, jsonify, request
from flask_cors import CORS
import algo

app = Flask(__name__)
CORS(app)

@app.route('/run-algo', methods=['GET'])
def run_algo():
    try:
        start_x = int(request.args.get('start_x', 0))
        start_y = int(request.args.get('start_y', 0))
        solution = algo.main(start_x, start_y)
        return jsonify({"solution": solution})
    except Exception as e:
        return jsonify({"erreur": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
