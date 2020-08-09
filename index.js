/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

function connectCallback(msg) {  
  document.getElementById('stomp-status').innerHTML = " successfully connected to a stomp server ";
  var subscription = client.subscribe("/fx/prices", callbackfunc);
  setTimeout(function(){  displayelement() }, 5000);  
  
}

client.connect({}, connectCallback, function(error) {  
})
var array=[]

function callbackfunc (message) {
  
  // called when the client receives a STOMP message from the server
  
  if (message.body) {     
    
    array.push(JSON.parse(message.body))
    
  } else {
    alert("got empty message");
  }
};

function displayelement (message) { 
  var table = document.getElementById("myTable");
  
    var uniqueArray = array.map(item => item.name)
  .filter((value, index, self) => self.indexOf(value) === index)

  var sparklinearray=[]

  uniqueArray.sort(function(a, b) {
    return a - b;
  });
 
    uniqueArray.map(function(item, dataindex){
      array.map(function(data, index){      
      if(item === data.name){
        sparklinearray.push(data)
      }
    })
  })
  
  uniqueArray.sort(function(a, b){
    return a.lastChangeBid-b.lastChangeBid
})

  uniqueArray.map(function(data, index){
    var narray=[]
    var arraytoinclude = sparklinearray.map(function(data){
      if(data.name == array[index].name){
        narray.push((array[index].bestBid+array[index].bestAsk)/2)
      }
    })    

    var row = table.insertRow(-1);    
      
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      var cell7 = row.insertCell(6);
      var cell8 = row.insertCell(7);

    cell1.innerHTML = array[index].name;
    cell2.innerHTML = array[index].bestBid;
    cell3.innerHTML = array[index].bestAsk;
    cell4.innerHTML = array[index].openBid;
    cell5.innerHTML = array[index].openAsk;
    cell6.innerHTML = array[index].lastChangeAsk;
    cell7.innerHTML = array[index].lastChangeBid;
    
    new Sparkline(cell8).draw(narray);
    
  })  
}



