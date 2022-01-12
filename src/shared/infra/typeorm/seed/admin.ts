import { v4 as uuidV4 } from "uuid";
import createConnection from '../index';
import { hash } from "bcrypt";

async function create() {
  const connection = await createConnection("localhost");
  
  const id = uuidV4();
  const hashPassword = await hash("admin", 8);
  
  await connection.query(
    `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${id}', 'admin', 'admin@rentx.com.br', '${hashPassword}', true, 'now()', 'xxxxxxxxx')`
  );

  await connection.close();
}
    
create().then(() => console.log("User admin created!"))