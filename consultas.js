const pool = require("./dbConfig");
//prueba coneccion base de datos
const conectarDB = async () => {
    try {
        const res = await pool.query(`SELECT NOW()`);
        console.log("Conexion exitosa, fecha y hora actuales:", res.rows[0]);
    } catch (error) {
        console.error("Error al conectar a la Base de datos", error);
    }
}
//Llamar a la funcion de conectarDB
conectarDB();

const agregarUsuario = async (nombre, balance) => {
 const consulta = {
  text: "INSERT INTO usuarios (nombre, balance) values ($1, $2)",
  values: [nombre, balance], 
};
  const result = await pool.query(consulta);
  return result;
}

const getUsuarios = async () => {
  const consulta = {
    text: "SELECT * FROM usuarios",
  };
  const result = await pool.query(consulta);
  return result.rows;
};

const eliminarUsuario = async (id) => {
  const result = await pool.query(`DELETE FROM usuarios WHERE id =  '${id}'`);
  return result;
};
const editUsuario = async (id, nombre, balance) => {
  const consulta = {
    text: "UPDATE usuarios SET nombre = $2, balance = $3 WHERE id = $1 RETURNING *",
    values: [id, nombre, balance],
  };
  const result = await pool.query(consulta);
  return result.rows[0];
};

const getTransferencias = async () => {
  try {
    const consulta = {
      text: "SELECT * FROM transferencias",
    };
    const result = await pool.query(consulta);
    return result.rows;
  } catch (error) {
    console.error("Error al obtener transferencias:", error);
    throw error; // Re-lanza el error para que pueda ser capturado por el bloque catch en el controlador de ruta
  }
};

const nuevaTransferencia = async ({ emisor, receptor, monto }) => {
  console.log(emisor, receptor, monto);
  const actualizarCuentaOrigen = {
    text: `UPDATE usuarios SET balance = balance - $1 WHERE id = $2`,
    values: [monto, emisor],
  };

  const actualizarCuentaDestino = {
    text: `UPDATE usuarios SET balance = balance + $1 WHERE id = $2`,
    values: [monto, receptor],
  };

  const nueva = {
    text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW())",
    values: [emisor, receptor, monto],
  };

  try {
    await pool.query("BEGIN");
    const result = await pool.query(nueva);
    await pool.query(actualizarCuentaOrigen);
    await pool.query(actualizarCuentaDestino);
    await pool.query("COMMIT");
    console.log("Transacción realizada con éxito");
    console.log("Última transacción: ", result.rows[0]);
  } catch (e) {
    await pool.query("ROLLBACK");
    throw e;
  }
};





module.exports = {agregarUsuario, getUsuarios, eliminarUsuario, editUsuario, getTransferencias,nuevaTransferencia };
