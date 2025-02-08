from flask import Flask, render_template, jsonify, request
from mlxtend.frequent_patterns import apriori, association_rules
import pandas as pd

app = Flask(__name__)

# หน้าแรก (หน้า HTML)
@app.route('/')
def index():
    return render_template('index.html')

# API ที่รับข้อมูลการซื้อแล้วคำนวณ Apriori
@app.route('/get_recommendations', methods=['POST'])
def get_recommendations():
    data = request.json['data']
    df = pd.DataFrame(data)

    # หาความสัมพันธ์ด้วย Apriori
    frequent_itemsets = apriori(df, min_support=0.6, use_colnames=True)
    rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1)

    # ส่งผลลัพธ์กลับเป็น JSON
    recommendations = rules.to_dict('records')
    return jsonify({'recommendations': recommendations})

if __name__ == "__main__":
    app.run(debug=True)
