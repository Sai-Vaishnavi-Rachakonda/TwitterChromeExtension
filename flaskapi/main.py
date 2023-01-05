from flask import Flask
from flask_cors import CORS
from langdetect import detect
from nltk.sentiment import SentimentIntensityAnalyzer
from flask import jsonify
from flask import request
import nltk

app = Flask(__name__)
CORS(app)
nltk.downloader.download('vader_lexicon')

@app.route("/")
def hello():
  return "Hello World!"

# end point for lang detection
# used langdetect library to achive the desired results
@app.route("/api/language-detection",methods=['POST']) 
def language_detection():
    data = request.get_json()
    body = data
    # body = [{ "tweet_text": "Stats on Twitter World Cup"},{"tweet_text": "As the saying goes, be careful what you wish, as you might get it"},{"tweet_text": "شب یلدا مبارک! ❤️"}]
    for i in range(len(body)):
        body[i]["is_english"] = detect(body[i]["tweet_text"])=="en"
    return jsonify(body)

# end point for sentiment analysis
# used NLTK for the process.
@app.route("/api/sentiment-score",methods=['POST']) 
def sentiment_score():
    data = request.get_json()
    body=data
    # body = [{ "tweet_text": "Stats on Twitter World Cup"},{"tweet_text": "As the saying goes, be careful what you wish, as you might get it"}]
    sia = SentimentIntensityAnalyzer()
    for i in range(len(body)):
        a = sia.polarity_scores(body[i]["tweet_text"])
        object = {
            "positive": a["pos"],
            "neutral": a["neu"],
            "negative":a["neg"]
        }
        body[i]["sentiment_score"] = object
        body[i]["detected_mood"]= str(max(object, key=object.get)).upper()
    return jsonify(body)

if __name__ == "__main__":
  app.run()