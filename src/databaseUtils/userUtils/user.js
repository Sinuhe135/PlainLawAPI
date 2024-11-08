const pool = require('../databaseCon.js');

const numberOfResultRows = 20;

// async function getAllUsers(pageNumber)
// {
//     const rowsToSkip = (pageNumber-1)*numberOfResultRows;
//     const pagination = 'order by USER.id desc LIMIT '+numberOfResultRows.toString()+' offset ?'; //rowsToSkip

//     const dataSelection = 'USER.id, USER.name, USER.patLastName, USER.matLastName, USER.phone, AUTH.email';
//     const [rows] = await pool.query('select ' + dataSelection + ' from USER left join AUTH on USER.id = AUTH.id where USER.status = ?'+pagination,[rowsToSkip,'active']);
//     return rows;
// }

// async function getNumberOfPages()
// {
//     const [rows] = await pool.query('select COUNT(id) as row_num from USER where status = ?',['active']);
//     let numberOfPages = rows[0].row_num / numberOfResultRows;

//     if(numberOfPages !== Math.trunc(numberOfPages))
//     {
//         numberOfPages = Math.trunc(numberOfPages) +1;
//     }

//     return numberOfPages;    
// }

async function getUser(id)
{
    const dataSelection = 'USER.id, USER.name, USER.patLastName, USER.matLastName, USER.phone, AUTH.username';
    const [rows] = await pool.query('select ' + dataSelection + ' from USER left join AUTH on USER.id = AUTH.id where USER.status = ? and USER.id = ?',['active',id]);
    return rows[0];
}

async function deleteUser(id)
{
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
    
        await pool.query('delete from SESSION where idAuth = ?',[id]);
        await pool.query('update USER set status = ? where id = ?',['unactive',id]);
        await pool.query('delete from AUTH where id = ?',[id]);
        await pool.query('delete from SUMMARY where iduser = ?',[id]);
    
        await conn.commit();
        conn.release();

        return {id:id};
    } catch (error) {
        await conn.rollback();
        conn.release();

        throw (error);
    }   
}

async function editUser(name,patLastName,matLastName,phone,id)
{
    await pool.query('update USER set name = ?,patLastName = ?,matLastName = ?,phone = ? where id = ?',[name,patLastName,matLastName,phone,id]);
    return await getUser(id);
}

async function createUser(name,patLastName,matLastName,phone,username,password)
{
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
    
        const [result] = await conn.query('insert into USER (name,patLastName,matLastName,phone) values (?,?,?,?)',[name,patLastName,matLastName,phone]);
        await conn.query(`insert into AUTH (id,username,password) values (${result.insertId},?,?)`,[username,password]);
    
        await conn.commit();
        conn.release();

        return await getUser(result.insertId);
    } catch (error) {
        await conn.rollback();
        conn.release();

        throw (error);
    }   
}

module.exports={getUser,editUser,createUser, deleteUser};