function updateCount() {
    $("#read").text($(".listitem.complete").length + "/" + $(".listitem").length);
}

function getData(key) {
    return localStorage.getItem(key);
}
function setData(key, value) {
    localStorage.setItem(key, value);
}

$(function () {
    window.scrollTo(0, 1);
    window.applicationCache.addEventListener("updateready", function () {
        alert("BiblePeruse Updated!");
        window.applicationCache.swapCache();
    });

    // initValue
    var date = getData("date");
    var startDate;
    if (null == date) {
        var d = new Date();
        var month = d.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = d.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        startDate = d.getFullYear() + "-" + month + "-" + day;
    } else {
        startDate = date;
    }
    $("#startdate")[0].value = startDate;

    // initUI
    var arrWeek = ["일", "월", "화", "수", "목", "금", "토"];
    var innerData = [];
    var dayOffset = 0;
    for (var i = 0; i < BP_DATA.length; i++, dayOffset++) {
        var d = new Date(startDate);
        d.setDate(d.getDate() + dayOffset);
        while(d.getDay() == 0 || d.getDay() == 6) {
            dayOffset++;
            d.setDate(d.getDate() + 1);
        }
        var day = (i + 1);
        var complete = getData("day" + day) == "true" ? " complete" : "";
        var spanDay = "<span class='day'>" + day + "일차</span>";
        var spanDate = "<span class='date'>" + d.toLocaleDateString() + " " + arrWeek[d.getDay()]+ "</span>";
        var spanTime = "<span class='time'>" + BP_DATA[i].time + "</span>";
        var divContent = "<div class='bible_content'>" + BP_DATA[i].content + "</div>";
        innerData.push("<div class='listitem" + complete + "' data-id='day" + day + "'>" + "<b>완료</b>" + spanDay + spanDate + spanTime + divContent + "</div>");
    }
    $("#contents")[0].innerHTML = innerData.join("");

    // event handler
    $("#startdate").on("change", function (e) {
        startDate = $("#startdate")[0].value;
        // console.log(startDate);
        setData("date", startDate);

        var els = $("span.date");
        var loop = els.length;
        for(var i = 0; i < loop; i++) {
            var $el = $(els[i]);
            $el.text(i + " -~~");
        }
    });

    $("div.listitem").on("click", function (e) {
        var $el = $(this);
        if ($el.hasClass("complete")) {
            setData($el.data("id"), "null");
        } else {
            setData($el.data("id"), "true");
        }
        $el.toggleClass("complete");

        updateCount();
    });

    updateCount();
});
