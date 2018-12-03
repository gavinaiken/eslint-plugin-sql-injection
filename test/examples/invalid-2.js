const express = require('express');
const router = express.Router();
const connection = require('./database');

router.put('/company/:id', function (req, res) {
    if (!req.body.company_name || !req.params.id) {
        return res.status(400).json({ msg: 'Request is invalid.' });
    }

    var q = "UPDATE customer SET company_name = '" + req.body.company_name + "' WHERE id = " + req.params.id;

    connection.query(q, function (err, result) {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        res.status(200).json({ data: result, msg: "Company name has been saved successfully." });
    });
});
