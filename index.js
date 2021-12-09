const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 5000
var cors = require('cors')


app.use(fileUpload());


require('dotenv').config();


// middleware
app.use(cors());
app.use(express.json());


const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const { json } = require('express');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i7sij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hrcwj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const E_lor_db = client.db("E_lor");

        const categoryCollection = E_lor_db.collection("categories");
        const usersCollection = E_lor_db.collection("users");
        const serviceCollection = E_lor_db.collection("services");
        // const itemCollection = rifles_db.collection("items");
        // const reviewCollection = rifles_db.collection("reviews");
        app.get('/home', async (req, res) => {
            // packageCollection.insertOne({ name: 'John', address: 'Highway 71'});
            res.send({ name: 'shahin', address: 'ahnabshahin@gmail.com', projectName: "AssaultRifles" })
        });

        app.post('/add-category', async (req, res) => {
            categoryCollection.insertOne({"categoryName":req.body.categoryName,"subCategoryName":[]});
            res.send({"flash":"New category is successfully added","categoryName":req.body.categoryName});
        });
        app.get('/get-categories', async (req, res) => {
            const categories = await categoryCollection.find().toArray();
            res.send(categories);
        });
        app.get('/get-subcategories/:category', async (req, res) => {
            const categoryName = req.params.category
            const categories = await categoryCollection.findOne({ "categoryName": categoryName});
            res.send(categories);
        });
        app.get('/get-services', async (req, res) => {
            const services = await serviceCollection.find().toArray();
            res.send(services);
        });
        app.post('/add-subCategory', async (req, res) => {
            console.log(req.body.categoryName)
            //categoryCollection.insertOne(req.body.categoryName);
            categoryCollection.updateOne({ "categoryName": req.body.categoryName }, { $set: { "categoryName": req.body.categoryName, "subCategoryName": req.body.subCategoryName } });
            res.send("New category is successfully added");
        });
        app.post('/add-user', async (req, res) => {
            const email= req.body.email
            const user = await usersCollection.findOne({"email":email});
            if(user==null){
                usersCollection.insertOne(req.body);
            }
            res.send("Successfully Added New user.");
        });
        app.post('/get-user-role', async (req, res) => {
            if(Object.keys(req.body).length==0){
                res.send({role:"guest"})
            }else{
                console.log("Asda")
                const user = await usersCollection.findOne(req.body);
                user==null? res.send({role:"guest"}):res.send({role:user.role});
            }
     
        });
        app.post('/save-service', async (req, res) => {
            console.log(req.body)
            serviceCollection.insertOne(req.body);
            res.send('Success fully added new services');
        });   
 
        app.post('/customer-login', async (req, res) => {
            const email = req.body.email 
            const password = req.body.password
            const user = await usersCollection.findOne({ "email": email, "password": password });
            user?res.send(user):res.send('Wrong Information.');
        });

        // app.post('/make-admin', async (req, res) => {
        //     const email = req.body.email
        //     const user = await usersCollection.findOne({ "email": email});
        //     if(user){
        //         if(user.role =='admin'){
        //             res.send('The user of this email is already an admin');
        //         }else{
        //             usersCollection.updateOne({ "email": email }, { $set: { "role": "admin" } });
        //             res.send(`Successfully made admin ${user.displayName}, Mail is ${user.email}`);
        //         }
        //     }else{
        //         res.send('Please write a valid user Email.');
        //     }
        // });
        // app.post('/users', async (req, res) => {
        //     const role  = req.body.role;
        //     if(role){
        //         const users = await usersCollection.find({ "role": role }).toArray();
        //         console.log(users);
        //         res.send(users);
        //     }else{
        //         const users = await usersCollection.find({}).toArray();
        //         console.log(users);
        //         res.send(users);
        //     }


        // });
        // app.get('/orders', async (req, res) => {
        //     const { email } = req.query;
        //     console.log(email)
        //     if(email){
        //         const orders = await ordersCollection.find({ "email": email }).toArray();
        //         res.send(orders);
        //     }else{
        //         const orders = await ordersCollection.find().toArray();
        //         res.send(orders);
        //     }
        // });
        // app.post('/individual-orders', async (req, res) => {
        //     const email  = req.body.email;
        //     console.log(email)
        //     if(email){
        //         const orders = await ordersCollection.find({ "email": email }).toArray();
        //         res.send(orders);
        //     }
        // });
        // app.get('/items', async (req, res) => {
        //     const { limit } = req.query;
        //     if(limit){
        //         const items = await itemCollection.find().limit(parseInt(limit)).toArray();
        //         res.send(items);
        //     }else{
        //         const items = await itemCollection.find().toArray();
        //         res.send(items);
        //     }
        // });
        // app.get('/reviews', async (req, res) => {
        //     const { limit } = req.query;
        //     if(limit){
        //         const reviews = await reviewCollection.find().limit(parseInt(limit)).toArray();
        //         res.send(reviews);
        //     }else{
        //         const reviews = await reviewCollection.find().toArray();
        //         res.send(reviews);
        //     }
        // });

        // app.post('/add-item', async (req, res) => {
        //     itemCollection.insertOne(req.body);
        //     res.send("Successfully Added New Item.");
        // });
        // app.post('/add-review', async (req, res) => {
        //     reviewCollection.insertOne(req.body);
        //     res.send("Successfully Added New Review.");
        // });
        // app.post('/add-order', async (req, res) => {
        //     ordersCollection.insertOne(req.body);
        //     res.send("Your order completed");
        // });

        // app.get('/item-details/:id', async (req, res) => {
        //     const { id } = req.params;
        //     const item = await itemCollection.findOne({ "_id": ObjectId(id) });
        //     res.send(item);
        // });
        // app.get('/review-details/:id', async (req, res) => {
        //     const { id } = req.params;
        //     const review = await reviewCollection.findOne({ "_id": ObjectId(id) });
        //     res.send(review);
        // });
        // app.post('/login', async (req, res) => {
        //     const email = req.body.email
        //     const password = req.body.password
        //     const user = await usersCollection.findOne({ "email": email, "password": password });
        //     user?res.send(user):res.send('Wrong Information.');
        // });
        // app.post('/user-details', async (req, res) => {
        //     const email = req.body.email
        //     const user = await usersCollection.findOne({ "email": email});
        //     user?res.send(user):res.send('Wrong Information. User doesnt exist');
        // });

        // app.post('/registration', async (req, res) => {
        //     req.body['role'] = 'user';
        //     usersCollection.insertOne(req.body);
        //     res.send(req.body);
        // });

        // app.delete('/delete-order/:id', async (req, res) => {
        //     const id = req.params.id;
        //     ordersCollection.deleteOne({ "_id": ObjectId(id) });
        //     res.send({ id: id, massage: `your order successfully deleted...` });
        // });

        // app.put('/update-order-status/:orderId/:value', async (req, res) => {
        //     const { orderId, value } = req.params;
        //     ordersCollection.updateOne({ "_id": ObjectId(orderId) }, { $set: { "status": value } });
        //     res.send({ orderId: orderId,status:value, massage: `Your order status successfully updated...` });
        // });

        // app.get('/my-bookings/:email', async (req, res) => {
        //     const { email } = req.params;
        //     const myBookings = await bookingCollection.find({ "email": email }).toArray();
        //     res.send(myBookings);
        // });

        // app.get('/all-bookings', async (req, res) => {
        //     const myBookings = await bookingCollection.find().toArray();
        //     res.send(myBookings);
        // });
    }
    finally {
        // client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Welcome to E-lor backend api...");
});

app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})