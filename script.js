function getURLParams(search) {
    var queryParams = {}, queryArray, singleQuery;
    queryArray = search.substr(1).split("&");
    for (var i = 0; i < queryArray.length; i++) {
        if (queryArray[i].indexOf("=") > -0) {
            singleQuery = queryArray[i].split("=");
            if (singleQuery.length == 2) {
                queryParams[decodeURIComponent(singleQuery[0])] = decodeURIComponent(singleQuery[1]);
            }
        }
    }
    return queryParams;
}

var queryParamSite = getURLParams(window.location.search).site;

var site = getURLParams(window.location.search).site || "";
var username = getURLParams(window.location.search).username || "";
var url = "https://ec2-52-16-155-233.eu-west-1.compute.amazonaws.com:1980";

if (site) {
    $("#lp_account").attr("disabled", "disabled");
    $("#lp_account").val(site);
}

if (site && username) {
    $("#lp_username").attr("disabled", "disabled");
    $("#lp_username").val(username);

    $("#lp_btn_login").hide();

    lpTag.sdes.push({"type": "ctmrinfo", "info": {customerId: username}});

    window.LPJsMethodName = function (callback) {
        $.ajax({
            url: url + '/login',
            contentType: "application/json",
            data: {
                username: username
            },
            success: function (data) {
                $.ajax(url + "/generateSsoKey?rt=json&username=" + username, {
                    type: 'get',
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (XMLHttpRequest.responseJSON === undefined || XMLHttpRequest.responseJSON.message === undefined) {
                            callback('UNKNOWN ERROR', 'error occured');
                        } else {
                            callback('ERROR', XMLHttpRequest.responseJSON.message);
                        }

                    },
                    success: function (ssoData) {
                        callback(ssoData.ssoKey);

                    }
                });
            }
        });
    }
}
else {
    $("#lp_form").submit(function (e) {
        e.preventDefault();
        var url = "https://ec2-52-16-155-233.eu-west-1.compute.amazonaws.com:1980";
        var site = $("#lp_account").val();
        var username = $("#lp_username").val();
        var href;

        $.ajax(url + "/generateSsoKey?rt=json&username=" + username, {
            type: 'get',
            error: function (XMLHttpRequest, textStatus, errorThrown) {


            },
            success: function (ssoData) {
                href = updateQueryStringParameter(window.location.href, "site", site);
                window.location.href = updateQueryStringParameter(href, "username", username);
            }
        });


        function updateQueryStringParameter(uri, key, value) {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            else {
                return uri + separator + key + "=" + value;
            }
        }
    });
}

