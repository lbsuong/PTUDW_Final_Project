const express = require('express');

const router = express.Router();

router.get('/:id', function(req, res) {
  const id = req.params.id;
  res.send(`This is category page by id ${id}`);
});

module.exports = router;