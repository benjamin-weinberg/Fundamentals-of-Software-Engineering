
(function (){
    console.log("here");
    var innerScript = document.getElementById("ride-temp").innerHTML;
    var theTemplate = hbs.comple(innerScript)
    var context = {start: "Iowa City", dest: "Cedar Rapids", startTime: "12:00pm", rideDate: "Today"};
    var compleData = theTemplate(context);
    document.getElementById('box1').innerHTML = compleData;

});

function loginClick(){
    var userName = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    console.log(userName + " " + password);

}

function addUser(){
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var userName = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var password2 = document.getElementById("confirm").value;

    
}