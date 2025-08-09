from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import scrape_website

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.route("/scrape", methods=["POST", "OPTIONS"])
def scrape():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    website_url = request.form.get("website")
    if not website_url:
        return jsonify({"error": "Missing website URL"}), 400
    data = scrape_website(website_url)
    return jsonify(data)

@app.route("/generate-ad", methods=["POST", "OPTIONS"])
def generate_ad():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    try:
        payload = request.get_json()
        prompt = payload.get("prompt")
        brand = payload.get("brand")
        # TODO: replace this mock ad with your real AI logic
        ad_copy = {
            "headline": f"{brand.get('brand_name', 'Your Brand')} - {prompt}",
            "body": f"Engage with {brand.get('brand_name', 'our brand')} now!"
        }
        return jsonify(ad_copy)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def _build_cors_preflight_response():
    response = jsonify({"message": "CORS preflight success"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    return response

if __name__ == "__main__":
    app.run(host="localhost", port=5001, debug=True)
