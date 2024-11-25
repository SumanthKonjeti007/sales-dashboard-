from flask import Blueprint
from utils.query_executor import execute_query

sales_routes = Blueprint('sales_routes', __name__)

@sales_routes.route('/by-city', methods=['GET'])
def sales_by_city():
    query = """
    SELECT City, SUM(Total) as TotalSales
    FROM `your_dataset.sales_data`
    GROUP BY City
    ORDER BY TotalSales DESC
    """
    return execute_query(query, "City", "TotalSales")

@sales_routes.route('/by-branch', methods=['GET'])
def sales_by_branch():
    query = """
    SELECT Branch, SUM(Total) as TotalSales
    FROM `your_dataset.sales_data`
    GROUP BY Branch
    ORDER BY TotalSales DESC
    """
    return execute_query(query, "Branch", "TotalSales")
