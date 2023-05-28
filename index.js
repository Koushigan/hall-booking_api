import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT;
// const PORT = 3001;
const app = express();

app.use(express.json());
app.use(cors());
//rooms collection
let rooms = [{
 "name": "Standard",
 "seats": "150", "price": "15000",
 "amenities": "Wifi,non-ac,screen with projector,dj",
 "roomID": "50",
 "bookedDetails": [{
  "customerName": "Arun", "bookedDate": new Date('2023-04-05'),
  "startTime": "2023-04-05T08:30", "endTime": "2023-04-06T11:30", "status": "confirmed", "roomID": "100"
 }]
},
 {
  "name": "Premium", 
  "seats": "250", "price": "25000",
  "amenities": "wifi,ac,screen with projector,light music", 
  "roomID": "100",
  "bookedDetails": [{
   "customerName": "Koushik", "bookedDate": new Date('2023-05-05'),
   "startTime": "2023-05-05T15:30", "endTime": "2023-05-06T17:30", "status": "confirmed", "roomID": "101"
  }]
 }, {
  "name": "Elite", "seats": "350", "price": "35000",
  "amenities": "wifi,ac,screen with projector,light music,games", "roomID": "150",
  "bookedDetails": [{
   "customerName": "Madesh", "bookedDate": new Date('2023-05-25'),
   "startTime": "2023-05-25T20:30", "endTime": "2023-05-26T22:30", "status": "Payment_Pending", "roomID": "102"
  }],
 }]

app.get("/", (req, res) => {
 res.send({
  message: "server running!!!"
 })

})
//create a Room
app.post("/createRoom", (req, res) => {

 const { name, seats, price, amenities, roomID, bookedDetails  } = req.body;
 rooms.push([{
  name, seats, price, amenities, roomID, bookedDetails

 }])
res.send("Room Created")

})
//booking room
app.post("/bookRoom",(req, res)=> {

 let { customerName, bookedDate, startTime, endTime, status, roomID } = req.body;

 let startTS = Date.parse(startTime);
 let endTS = Date.parse(endTime);
 for (let i = 0; i < rooms.length;i++) {

  if (rooms[i].roomID === roomID) {

   let tobeBooked =
   {
    customerName,
    bookedDate, startTime, endTime, status, roomID
   }
   let isBooked = null;
   isBooked = rooms[i].bookedDetails.every((booking) => {

     let startBookedTS = Date.parse(booking.startTime);
    let endBookedTS = Date.parse(booking.endTime);
    return (booking.startTime !== startTime) && ((startTS > endBookedTS && endTS > endBookedTS)
    || (startTS < startBookedTS && endTS < startBookedTS))
   }
      );
   if (isBooked) 
   {
    rooms[i].bookedDetails.push(tobeBooked)
    return res.status(200).send({ message: "Booking confirmed", rooms })
   }

   else
    return res.status(400).send({ message: "This room has been booked already, Please Select Different Time slot" })
   }
  }
 }
)

//list all rooms along with booked data
app.get("/listRooms",(req,res)=>{
res.send(rooms)
})

//list all customers with booked data along with room name included
app.get("/listCustomers", (req, res) => {

 const customers = rooms.map((room) => {
  return [...room.bookedDetails,{roomName:room.name}]
 })
res.send(customers)
})

app.listen(PORT,()=>console.log("Server Started"))