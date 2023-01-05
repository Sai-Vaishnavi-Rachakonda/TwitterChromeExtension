detectedTeweets = [];
englishTweets = [];
// let proxy = "http://127.0.0.1:5000/"
let proxy = "https://twitterextension.wl.r.appspot.com/"
function appendCustomNode() {
  const cards = document.getElementsByTagName("article");
  let tweets = [];
  //   console.log(cards);
  Array.from(cards).forEach((elem) => {
    elem.id = elem.id ? elem.id : Math.random() * Math.random() * 10000000;
    let post = elem.querySelectorAll("[data-testid=tweetText]");
    if (post[0] && post[0].innerText)
      tweets.push({ tweet_text: post[0].innerText, id: elem.id });
  });
  //   console.log(tweets);
  fetch(proxy+"api/language-detection", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tweets),
  })
    .then((response) => response.json())
    .then((response) => {
      let engResponses = response.filter((a) => a.is_english);
      // console.log(engResponses,response)
      engResponses.forEach((res) => {
        delete res.is_english;
      });
      fetch(proxy+"api/sentiment-score", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(engResponses),
      })
        .then((response) => response.json())
        .then((response) => addSentiment(response));
    });
}
const observer = new MutationObserver(appendCustomNode);
observer.observe(document.body, {
  attributes: false,
  subtree: true,
  childList: true,
});
// console.log("called!@$%%$#@!");
function addSentiment(tweets) {
  tweets.forEach((tweet) => {
    // console.log(tweet)
    if (!detectedTeweets.includes(tweet.id)) {
      detectedTeweets.push(tweet.id);
      let elem = document.getElementById(tweet.id);
      let anchor = elem.getElementsByTagName("time");
      let happy = "😊";
      let sad = "🙁";
      let neu = "😐";
      let moodicon =
        tweet.detected_mood === "POSITIVE"
          ? happy
          : tweet.detected_mood === "NEGATIVE"
          ? sad
          : neu;
      let innerText = "  Detected Mood: " + moodicon;
      let dot = `<div dir="ltr" aria-hidden="true" class="css-901oao r-1bwzh9t r-1q142lx r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-s1qlax r-qvutc0"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">·</span></div> <span>${innerText}</span>`
    //   anchor[0].insertAdjacentHTML("afterend", innerText);
      anchor[anchor.length-1].insertAdjacentHTML("afterend", dot);
    }
  });
}
