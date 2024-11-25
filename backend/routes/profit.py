from flask import Blueprint
from utils.query_executor import execute_query

profit_routes = Blueprint('profit_routes', __name__)

@profit_routes.route('/gross-income', methods=['GET'])
def gross_income():
    query = """
    SELECT Branch, SUM(gross income) as TotalGrossIncome
    FROM `your_dataset.sales_data`
    GROUP BY Branch
    """
    return execute_query(query, "Branch", "TotalGrossIncome")
