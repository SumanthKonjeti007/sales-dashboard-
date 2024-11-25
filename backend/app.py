# from flask import Flask
# from routes.sales import sales_routes
# from routes.product_line import product_line_routes
# from routes.customer_analysis import customer_routes
# from routes.profit import profit_routes

# app = Flask(__name__)

# # Register blueprints
# app.register_blueprint(sales_routes, url_prefix="/api/sales")
# app.register_blueprint(product_line_routes, url_prefix="/api/product-line")
# app.register_blueprint(customer_routes, url_prefix="/api/customer")
# app.register_blueprint(profit_routes, url_prefix="/api/profit")

# @app.route('/health', methods=['GET'])
# def health_check():
#     return {"status": "success", "message": "Backend is running!"}

# if __name__ == "__main__":
#     app.run(debug=True)


import os
from flask import Flask, jsonify
from google.cloud import bigquery
from dotenv import load_dotenv
from flask_cors import CORS
from flask import Flask, jsonify, request

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app) 
# Initialize BigQuery client
client = bigquery.Client()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "success", "message": "Backend is running!"}), 200


# -------------------------------------
# SALES ANALYSIS ENDPOINTS
# -------------------------------------

@app.route('/api/piechart-sales-by-city', methods=['GET'])
def piechart_sales_by_city():
    """Fetch total sales by city for a pie chart."""
    query = """
    SELECT City, SUM(Total) as TotalSales
    FROM fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data
    GROUP BY City
    ORDER BY TotalSales DESC
    """
    return execute_query(query, "City", "TotalSales")



@app.route('/api/sales-by-branch', methods=['GET'])
def sales_by_branch():
    """Fetch total sales by branch, optionally filtered by branch."""
    branch = request.args.get("branch", "all")
    query = """
    SELECT Branch, SUM(Total) as TotalSales
    FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
    WHERE Branch = '{}' OR '{}' = 'all'
    GROUP BY Branch
    ORDER BY TotalSales DESC
    """.format(branch, branch)
    return execute_query(query, "Branch", "TotalSales")



@app.route('/api/payment-method-distribution', methods=['GET'])
def payment_method_distribution():
    """Fetch payment method distribution with an optional branch filter."""
    branch = request.args.get("branch", "all")
    query = """
    SELECT Payment, COUNT(*) as Count
    FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
    WHERE Branch = '{}' OR '{}' = 'all'
    GROUP BY Payment
    ORDER BY Count DESC
    """.format(branch, branch)
    return execute_query(query, "Payment", "Count")



from flask import request

@app.route('/api/sales-trend', methods=['GET'])
def sales_trend():
    branch = request.args.get("branch", "all")
    query = """
        SELECT DATE(Date) as SaleDate, SUM(Total) as TotalSales
        FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
        WHERE Branch = '{}' OR '{}' = 'all'
        GROUP BY SaleDate
        ORDER BY SaleDate
    """.format(branch, branch)
    return execute_query(query, "SaleDate", "TotalSales")



# -------------------------------------
# PRODUCT LINE ANALYSIS ENDPOINTS
# -------------------------------------

@app.route('/api/product-line-distribution', methods=['GET'])
def product_line_distribution():
    """Fetch product line distribution."""
    query = """
    SELECT `Product line` as ProductLine, SUM(Total) as TotalSales
    FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
    GROUP BY ProductLine
    ORDER BY TotalSales DESC
    """
    return execute_query(query, "ProductLine", "TotalSales")


@app.route('/api/revenue-distribution-by-product-line', methods=['GET'])
def revenue_distribution_by_product_line():
    """Fetch revenue distribution by product line."""
    query = """
    SELECT `Product line`, Total
    FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
    """
    return execute_query(query, "Product line", "Total")


@app.route('/api/sales-contribution-product-line', methods=['GET'])
def sales_contribution_product_line():
    """Fetch sales contribution by product line."""
    query = """
    SELECT `Product line`, SUM(`Total`) as TotalSales
    FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
    GROUP BY `Product line`
    """
    return execute_query(query, "Product line", "TotalSales")

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    """Fetch overall metrics for the dashboard."""
    branch = request.args.get("branch", "all")  # Fetch branch query parameter
    where_clause = f"WHERE Branch = '{branch}'" if branch != "all" else ""

    query = f"""
    SELECT 
        SUM(Total) as TotalRevenue, 
        COUNT(*) as TotalProductsSold,
        AVG(Rating) as AverageRating,
        MAX(`Product line`) as TopSellingProduct
    FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
    {where_clause}
    """
    return execute_query(query, "TotalRevenue", "TotalProductsSold", "AverageRating", "TopSellingProduct")








# -------------------------------------
# CUSTOMER AND GENDER ANALYSIS ENDPOINTS
# -------------------------------------

@app.route('/api/sales-by-customer-type', methods=['GET'])
def sales_by_customer_type():
    """Fetch sales by customer type."""
    query = """
    SELECT `Customer type`, SUM(`Total`) as TotalSales
    FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
    GROUP BY `Customer type`
    """
    return execute_query(query, "Customer type", "TotalSales")


@app.route('/api/sales-by-gender', methods=['GET'])
def sales_by_gender():
    """Fetch total sales by gender."""
    query = """
    SELECT Gender, SUM(Total) as TotalSales
    FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
    GROUP BY Gender
    """
    return execute_query(query, "Gender", "TotalSales")


@app.route('/api/rating-vs-gender', methods=['GET'])
def rating_vs_gender():
    """Fetch average rating by gender."""
    query = """
    SELECT Gender, AVG(Rating) as AvgRating
    FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
    GROUP BY Gender
    """
    return execute_query(query, "Gender", "AvgRating")


@app.route('/api/customer-type-payment-preference', methods=['GET'])
def customer_type_payment_preference():
    """Fetch payment preference by customer type."""
    query = """
    SELECT `Customer type`, `Payment`, COUNT(*) as Count
    FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
    GROUP BY `Customer type`, `Payment`
    """
    return execute_query(query, "Customer type", "Count", extra="Payment")


# -------------------------------------
# GROSS MARGIN AND PROFIT ANALYSIS
# -------------------------------------

@app.route('/api/gross-margin-product-line', methods=['GET'])
def gross_margin_product_line():
    """Fetch average gross margin percentage by product line."""
    query = """
    SELECT `Product line`, AVG(`gross margin percentage`) as AvgMargin
    FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
    GROUP BY `Product line`
    """
    return execute_query(query, "Product line", "AvgMargin")


@app.route('/api/gross-income-by-branch', methods=['GET'])
def gross_income_by_branch():
    """Fetch total gross income by branch."""
    query = """
    SELECT Branch, SUM(`gross income`) as TotalIncome
    FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
    GROUP BY Branch
    """
    return execute_query(query, "Branch", "TotalIncome")

@app.route('/api/lineplot-rating-unitprice', methods=['GET'])
def lineplot_rating_unitprice():
    """
    Endpoint to fetch data for line plot: Rating vs Unit Price.
    """
    try:
        # Query to calculate average unit price and its variability by rating
        query = """
        SELECT Rating, AVG(`Unit price`) as AvgUnitPrice, STDDEV(`Unit price`) as StdDevUnitPrice
        FROM `fa24-i535-bkonjeti-sales.supermarket_sales_data.sales_data`
        GROUP BY Rating
        ORDER BY Rating
        """
        query_job = client.query(query)  # Send query to BigQuery
        results = query_job.result()  # Wait for query results

        # Process results into a format suitable for frontend
        data = []
        for row in results:
            data.append({
                "rating": row["Rating"],
                "avgUnitPrice": row["AvgUnitPrice"],
                "stdDevUnitPrice": row["StdDevUnitPrice"]
            })

        return jsonify(data), 200

    except Exception as e:
        # Return error details if something goes wrong
        return jsonify({"error": str(e)}), 500


# -------------------------------------
# HELPER FUNCTION
# -------------------------------------

def execute_query(query, *keys):
    """
    Helper function to execute a query and return results dynamically based on keys.
    :param query: SQL query to execute
    :param keys: Keys for JSON response
    :return: JSON response with query results
    """
    try:
        query_job = client.query(query)  # Send query to BigQuery
        results = query_job.result()  # Wait for query results

        # Process results dynamically
        data = []
        for row in results:
            entry = {key: row[key] for key in keys}
            data.append(entry)
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
