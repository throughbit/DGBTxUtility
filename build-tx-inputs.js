/*
Developed at ThroughBit Technologies Pvt.Ltd
HYFERx Project
Transaction input builder (UTxO)
Requests remote node for unspent outputs of given addresses, which are used as inputs to a new transaction
*/
//-o_O===<o..o>=================================================~|
'use strict';
//-o_o===modules=================================================|
var request = require('request');
var bodyParser = require('body-parser');
//-o_O===init===================================================~|
//NI_PORT: Port running node interface
var NI_PORT = process.env.NI_PORT;
const RPC_AUTH = process.env.RPC;
const server_url = `http://localhost:${NI_PORT}/get_utxo`;

//Link all addresses of the given key containing UTxO
//-o_o===request-utxo============================================|
function build_TxInputs(addresses) {
return new Promise((resolve,reject)=>{
 try{
  let options = {
     headers:{ "content-type": "application/JSON" },
     url: server_url,
     method: 'POST',
     body:{"addresses":addresses},
     json: true
  }
  console.log(options);
  console.log("Here to build Tx inputs");
  request.post(options, (error, response, body)=>{
   if(error){
    console.log("ERROR:",error);
    reject (error);
   }
   console.log("LEBODYYY",body);
   let utxo_set=body;

   utxo_format(utxo_set)
   .then((utxo_form)=>{
    resolve (utxo_form);
    });
   });
  }
  catch(e){
   console.log(e);
   reject(e);
  }
 });
}
/*var processItems = function(x){
  if( x < urls.length ) {
    http.get(urls[x], function(res) {

      // add some code here to process the response

      processItems(x+1);
    });
  }*/
//-o_O===format-utxo============================================~|
function utxo_format (utxos_response){
 return new Promise((resolve,reject)=>{
  try{
   const utxos = utxos_response.message;
   // var uform = utxos.map((val,i,utxos)=>{
   //  return val = {
   //    "txId" : utxos[i].txid,
   //    "outputIndex" : utxos[i].vout,
   //    "address" : utxos[i].address,
   //    "script":utxos[i].scriptPubKey,
   //    "satoshis" : parseInt(utxos[i].amount * 100000000)
   //  }
   // });
   // resolve(uform);
   console.log("UTXOSS",utxos);
   console.log(utxos.length);
   var uform = new Array();
   var collect_utxoform = function(i){
    if(i < utxos.length){
     console.log("rec round: ", i);
     uform.push({
       "txId" : utxos[i].txid,
       "outputIndex" : utxos[i].vout,
       "address" : utxos[i].address,
       "script":utxos[i].scriptPubKey,
       "satoshis" : parseInt(utxos[i].amount * 100000000)
     });
    collect_utxoform(i+1);
    }
    if(i>=utxos.length){
     console.log("UFORM:",uform)
     resolve(uform);
    }
   }
   collect_utxoform(0);
  }
  catch(e){
   reject(e);
  }
 });
}
//-o_O===exports===============================================~|
module.exports = {build_TxInputs};
//-o_0===fin====================================================|