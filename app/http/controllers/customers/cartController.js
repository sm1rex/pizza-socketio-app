const {json} = require('express')

function cartController() {
    return {
        index(req, res) {
            res.render('customer/cart')
        },

        update(req, res) {
            if(!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }

            let cart = req.session.cart

            //Check if item does not exist in cacrt

            if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
            }

        }
    }
}