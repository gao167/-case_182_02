var express = require('express');
const nodemailer = require("nodemailer");
const stripe = require('stripe')('sk_test_t6DXq5S3BB0J8Sl8pjPthNXe00VEugTSJQ');
var router = express.Router();
const cors = require('cors');
let Cart = require('../models/cartModel');
let Order = require('../models/orderModel');

router.use(cors());

router.post('/checkonline', async (req, res) => {
  let error
  let status
  try {
    const { token, collectionOrder } = req.body
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    })
    const charge = await stripe.charges.create({
      amount: collectionOrder.total,
      currency: 'usd',
      customer: customer.id,
    })
    status = 'success'
    const newOrder = new Order({
      name: collectionOrder.name,
      phone: collectionOrder.phone,
      adress: collectionOrder.adress,
      total: collectionOrder.total,
      paymentType: collectionOrder.paymentType
    })
    newOrder.save((err) => {
      debugger;
      if (err) {
        res.json({
          result: 'failed',
          data: {},
          message: `Err is : ${err}`
        })
      } else {
        res.json({
          result: 'ok',
          data: {
            name: collectionOrder.name,
            phone: collectionOrder.phone,
            adress: collectionOrder.adress,
            total: collectionOrder.total,
            paymentType: collectionOrder.paymentType
          },
          message: `ok`,
          status: status
        })
      }
    })
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'nguyenhung16795@gmail.com', // generated ethereal user
        pass: 'Gaoteam95' // generated ethereal password
      },
      tls:{
        rejectUnauthorized: false
      }
    });
    let info = await transporter.sendMail({
      from: '"Order Faceshop" <nguyenhung16795@gmail.com>', // sender address
      to: token.email, // list of receivers
      subject: "Thanh toán thành công", // Subject line
      text: "Số tiền đã thanh toán" + collectionOrder.total , // plain text body
      html: `<h3>Nhóm 02</h3>
              <ul>
              <li>Số tiền thanh toán: ${collectionOrder.total}</li>
              <li>Kiểu thanh toán: Online</li>
              </ul>` // html body
    });
  } catch (error) {
    console.error('Error: ', error)
  }
})

router.post('/add_order', (req, res) => {
  const newOrder = new Order({
    name: req.body.name,
    phone: req.body.phone,
    adress: req.body.adress,
    total: req.body.total,
    paymentType: req.body.paymentType
  })
  newOrder.save((err) => {
    debugger;
    if (err) {
      res.json({
        result: 'failed',
        data: {},
        message: `Err is : ${err}`
      })
    } else {
      res.json({
        result: 'ok',
        data: {
          name: req.body.name,
          phone: req.body.phone,
          adress: req.body.adress,
          total: req.body.total,
          paymentType: req.body.paymentType
        },
        message: `ok`
      })
    }
  })
})
router.get('/add_order', (req, res) => {
  res.send('get add')
})

router.post('/add_cart', (req, res, next) => {
  const newCart = new Cart({
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
    quantity: req.body.quantity
  })
  newCart.save((err) => {
    debugger;
    if (err) {
      res.json({
        result: 'failed',
        data: {},
        message: `Err is : ${err}`
      })
    } else {
      res.json({
        result: 'ok',
        data: {
          name: req.name,
          image: req.body.image,
          price: req.body.price,
          quantity: req.body.quantity
        },
        message: `ok`
      })
    }
  })
})
/* GET home page. */
router.get('/get_cart', function (req, res, next) {
  Cart.find({}).limit(10).sort({ name: 1 }).select({
    name: 1,
    image: 1,
    price: 1,
    quantity: 1
  }).exec((err, cart) => {
    if (err) {
      res.json({
        result: 'failed',
        data: [],
        message: `Err is : ${err}`
      })
    } else {
      res.json({
        result: `ok`,
        data: cart,
        message: `Query list of cart successfully`
      })
    }
  })
});

module.exports = router;
