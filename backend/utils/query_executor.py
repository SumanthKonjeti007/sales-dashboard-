from google.cloud import bigquery

client = bigquery.Client()

def execute_query(query, key1, key2):
    try:
        query_job = client.query(query)
        results = query_job.result()

        data = [{"key1": row[key1], "key2": row[key2]} for row in results]
        return {"data": data}, 200

    except Exception as e:
        return {"error": str(e)}, 500
