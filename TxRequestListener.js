/*
HYFERx Project
Tx Request Listener
Listens for a client request to broadcast and sign transactions to a given output set
output set is hard coded for testing purposes
*/
//-o_O===<..>===================================================~|
'use strict';
//-o_O===modules================================================~|
var errorSet = require('./errors.js');
var express = require('express');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var tx_build = require('./build-tx-complete')
//-o_o===init======================================================|
var app = express();
const L_PORT=2020;
app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
//Outputs will have to be provided by listening to a client
//Hardcoded for testing
//-o_o===server-===================================================|
app.post('/test_send',(req,res)=>{
 try{
  //console.log("IN");
  //one apprach is to take outputs as part of req.body
  let outputs = [{
   "address": "DBDAhnDHhs1qRdW2tURnc95JrAy5eK5WbW",
   "amount": parseInt(1*10000)
  }];
  tx_build.broadcast_tx(outputs)
  .then((result)=>{
   console.log("tx_build_broadcast_tx().then(result=>{\n", result);
   if(result.status){
    let response = errorSet.errorFunc("success", result.message);
    console.log(`Success Respons: `, response);
    res.send(response);
   }
   if(!result.status){
    let response = errorSet.errorFunc("fail", result.message);
    console.log(`Fail Response 0: ${response}`);
    res.send(response);
   }
  })
  .catch((err)=>{
   if(!err.status){
    console.log("At  TX REQUEST LSITENER: ", err.message);
    console.log(err);
    let response = errorSet.errorFunc("fail", err.message);
    console.log(`Fail Response 1:` ,response);
    res.send(response);
   }
   else{
    let response = errorSet.errorFunc("fail: ", err);
    console.log(`Fail Response 2:${response}`);
    res.send(response);
   }
  });
 }
 catch(e){
   let response = errorSet.errorFunc("fail",e);
   console.log("Fail Respnse 3: ",response);
   res.send(response);
 }
});
//
//-o_o===server-===================================================|
app.listen(L_PORT,()=>
 console.log(`TxRequest Listener running on port ${L_PORT}`)
);
//-o_o===fin=======================================================|
