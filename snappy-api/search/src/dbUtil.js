const {Pool} = require('pg');
const pool = new Pool();

const getPool = () => pool;

module.exports = {getPool};
