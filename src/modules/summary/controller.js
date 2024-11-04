const validateSummary = require('./schemas/summary.js');
const validateParamId = require('../../utils/schemas/paramId.js');
const validateParamPage = require('../../utils/schemas/paramPage.js');
const response = require('../../utils/responses.js');
//const {getAllBranches,getNumberOfPages,getBranch, editBranch, deleteBranch, createBranch} = require('../../databaseUtils/branch.js');

// async function getAll(req,res)
// {
//     try {
//         const validation = validateParamPage(req.params);
//         if(validation.error)
//         {
//             response.error(req,res,validation.error.details[0].message,400);
//             return;
//         }
//         const params = validation.value;

//         let [numberOfPages,branches] = await Promise.all([getNumberOfPages(),getAllBranches(params.page)]);

//         if(numberOfPages === 0)
//         {
//             response.error(req,res,'Sin registros',404);
//             return;
//         }
//         else if(params.page > numberOfPages)
//         {
//             response.error(req,res,'Pagina fuera de los limites',404);
//             return;
//         }

//         const resObject = {numberOfPages:numberOfPages,page: params.page,branches:branches};
//         response.success(req,res,resObject,200);
//     } catch (error) {
//         console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
//         console.log(error);
//         response.error(req,res,'Hubo un error con el servidor',500);
//     }
// }

// async function getSearchId(req,res)
// {
//     try {
//         const validation = validateParamId(req.params);
//         if(validation.error)
//         {
//             response.error(req,res,validation.error.details[0].message,400);
//             return;
//         }
//         const params = validation.value;

//         const branch = await getBranch(params.id);
//         if(!branch)
//         {
//             response.error(req,res,'No se encuentra una sucursal con el ID proporcionado',404);
//             return;
//         }
    
//         response.success(req,res,branch,200);
//     } catch (error) {
//         console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
//         console.log(error);
//         response.error(req,res,'Hubo un error con el servidor',500);
//     }
// }

async function postRoot(req,res)
{
    try {
        const validation = validateSummary(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;

        let proccessedParagraphs = [];

        body.termsConditions.forEach(paragraph => {
            proccessedParagraphs.push(paragraph);
        });
    
        response.success(req,res,proccessedParagraphs,201);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}



module.exports={postRoot};