import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "something",
  host: "something",
  database: "something",
  password: "something",
  port: 5432,
});

export default pool;

//jadi disini bikin connetion doang, yaitu pakai pool.
//terus tinggal export ke index
