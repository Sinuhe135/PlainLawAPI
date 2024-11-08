const pool = require('./databaseCon.js');

const numberOfResultRows = 20;

async function getAllSummaries(pageNumber,idUser)
{
    const rowsToSkip = (pageNumber-1)*numberOfResultRows;
    const pagination = 'order by id desc LIMIT '+numberOfResultRows.toString()+' offset ?'; //rowsToSkip
    
    const dataSelection = "id,site, DATE_FORMAT(registerDate, '%Y-%m-%d') as registerDate";
    const [rows] = await pool.query('select ' + dataSelection + ' from SUMMARY where idUser = ? '+pagination, [idUser,rowsToSkip]);
    return rows;
}

async function getNumberOfPages(idUser)
{
    const [rows] = await pool.query('select COUNT(id) as row_num from SUMMARY where idUser = ?',[idUser]);
    let numberOfPages = rows[0].row_num / numberOfResultRows;

    if(numberOfPages !== Math.trunc(numberOfPages))
    {
        numberOfPages = Math.trunc(numberOfPages) +1;
    }

    return numberOfPages;    
}

async function getSummary(id, idUser)
{
    const dataSelection = "id,site, content,notes, DATE_FORMAT(registerDate, '%Y-%m-%d') as registerDate";
    const [rows] = await pool.query('select ' + dataSelection + ' from SUMMARY where id = ? and idUser = ?',[id,idUser]);
    return rows[0];
}

async function deleteSummary(id, idUser)
{
    await pool.query('delete from SUMMARY where id = ? and idUser = ?',[id, idUser]);
    return {id:id};
}

async function createSummary(site,content,notes,idUser)
{
    const [result] = await pool.query('insert into SUMMARY (site,content,notes,idUser) values (?,?,?,?)',[site,content,notes,idUser]);
    return {id:result.insertId};
}

module.exports={getAllSummaries,getNumberOfPages,getSummary,createSummary, deleteSummary};