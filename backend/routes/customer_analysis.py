from flask import Blueprint
from utils.query_executor import execute_query

customer_routes = Blueprint('customer_routes', __name__)

@customer_routes.route('/rating-gender', methods=['GET'])
def rating_gender():
    query = """
    SELECT Gender, AVG(Rating) as AvgRating
    FROM `your_dataset.sales_data`
    GROUP BY Gender
    """
    return execute_query(query, "Gender", "AvgRating")
