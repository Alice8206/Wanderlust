const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main()
.then((res)=>{
    console.log("connected to db");
}).catch((e)=>{
    console.log(e);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
const initdb=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68f38f5899878bac6556a443"}));
    await Listing.insertMany(initData.data);
    console.log("db initialized");
};
initdb();