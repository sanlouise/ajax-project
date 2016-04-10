
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // This is to render the Google Maps image in the background.

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('Here is info on ' + address + '!');

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + ' ">'); 

    // The code below is to render the New York Times data.

    //Define URL
    // NY Times AJAX request
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=56f2be64bc49604739f4ac50190cbe05:0:74964173'
    $.getJSON(nytimesUrl, function (data) {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + '<a href="' + article.web_url + '">' + article.headline.main + '</a>'
                    + '<p>' + article.snippet + '</p>' +
                    '</li>');
        };
    }).error(function (e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });


    // Wikipedia AJAX Request
    var wikiUrl ='http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
   
   //Wiki error handling, invoked after 8 seconds.
    var wikiRequestTimeout = setTimeout(function(){ 
        $wikiElem.text("Failed to get Wikipedia resources.");
    }, 8000); 
   
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",

        success: function(response)
        {
            var articleList = response[1];
            for(var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
               
                var url ='http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>'); 
            };
            // Ensure that if the request was successful, wikiRequestTimeOut is not called!
            // JSONP does not have an error method.
            clearTimeout(wikiRequestTimeout);
        }
    });
    return false;
};
 
$('#form-container').submit(loadData);
