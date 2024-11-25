from flask import Blueprint
from utils.query_executor import execute_query

product_line_routes = Blueprint('product_line_routes', __name__)

@product_line_routes.route('/distribution', methods=['GET'])
def product_line_distribution():
    query = """
    SELECT Product line as ProductLine, SUM(Total) as TotalSales
    FROM `your_dataset.sales_data`
    GROUP BY ProductLine
    ORDER BY TotalSales DESC
    """
    return execute_query(query, "ProductLine", "TotalSales")
