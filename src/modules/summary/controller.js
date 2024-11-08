const validateTermsConditions = require('./schemas/termsConditions.js');
const validateSummary = require('./schemas/summary.js');
const validateParamId = require('../../utils/schemas/paramId.js');
const validateParamPage = require('../../utils/schemas/paramPage.js');
const response = require('../../utils/responses.js');
const {OpenAI} = require("openai");
const {createSummary,getSummary,getAllSummaries,getNumberOfPages, deleteSummary} = require('../../databaseUtils/summary.js');

async function getAll(req,res)
{
    try {
        const validation = validateParamPage(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;

        let [numberOfPages,summaries] = await Promise.all([getNumberOfPages(res.locals.idAuth),getAllSummaries(params.page, res.locals.idAuth)]);

        if(numberOfPages === 0)
        {
            response.error(req,res,'Sin registros',404);
            return;
        }
        else if(params.page > numberOfPages)
        {
            response.error(req,res,'Pagina fuera de los limites',404);
            return;
        }

        const resObject = {numberOfPages:numberOfPages,page: params.page,summaries:summaries};
        response.success(req,res,resObject,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function getSearchId(req,res)
{
    try {
        const validation = validateParamId(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;

        let summary = await getSummary(params.id, res.locals.idAuth);
        if(!summary)
        {
            response.error(req,res,'No se encuentra un resumen con el ID proporcionado o no tiene acceso',404);
            return;
        }

        summary.content = summary.content.split("--");
    
        response.success(req,res,summary,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

async function postSign(req,res)
{
    try {
        const validation = validateSummary(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;
    
        const content = formatContent(body.content);
    
        const summary = await createSummary(body.site,content,body.notes, res.locals.idAuth);
    
        response.success(req,res,summary,201)
        
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

function formatContent(paragraphs)
{
    let content = "";

    const numberOfParagraphs = paragraphs.length;
    let paragraphNumber = 0;
    let paragraph = "";

    while(paragraphNumber<numberOfParagraphs)
    {
        paragraph = paragraphs[paragraphNumber];

        if(paragraph.search("--")!==-1)
        {
            paragraph = paragraph.replace("--","-");
        }

        content += paragraph;

        //if is not last element
        if((paragraphNumber+1) < numberOfParagraphs)
        {
            content+="--";
        }

        paragraphNumber++;
    }

    return content;
}

async function postRoot(req,res)
{
    try {
        const validation = validateTermsConditions(req.body);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const body = validation.value;
        
        let proccessedParagraphs = [];
        let paragraphNumber = 0;
        while(paragraphNumber<body.termsConditions.length)
        {
            const chatGTPResponse = await requestChatGPT(body.termsConditions[paragraphNumber]);

            if(chatGTPResponse !== 'Descartado')
            {
                proccessedParagraphs.push(chatGTPResponse);
            }

            paragraphNumber++;
        }

        if(proccessedParagraphs.length===0)
        {
            response.error(req,res,'No se ha podido resumir',400);
            return;
        }
    
        response.success(req,res,proccessedParagraphs,200);
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const systemPrompt = "Dado un párrafo de términos y condiciones de una red social, responde según corresponda:\n\nSi el párrafo aporta información sobre derechos o responsabilidades, responde `Resumen - $resumen_va_aqui`.\nSi el párrafo parece un subtítulo, responde `Subtitulo - $subtitulo_va_aqui`.\nSi no se cumple ninguna de las dos condiciones, responde `Descartado`";

async function requestChatGPT(paragraph)
{
    const completion = await openai.chat.completions.create({
        model: "ft:gpt-3.5-turbo-0125:personal:plainlaw:AQVf33MU",
        messages: [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: paragraph,
            },
        ],
    });

    return completion.choices[0].message.content;
}

async function deleteSearchId(req,res)
{
    try {
        const validation = validateParamId(req.params);
        if(validation.error)
        {
            response.error(req,res,validation.error.details[0].message,400);
            return;
        }
        const params = validation.value;
    
        let summary = await getSummary(params.id,res.locals.idAuth);
        if(!summary)
        {
            response.error(req,res,"No se encuentra un resumen con el ID proporcionado o no tiene acceso",400);
            return;
        } 
    
        summary = await deleteSummary(params.id, res.locals.idAuth);
    
        response.success(req,res,summary,200);
        
    } catch (error) {
        console.log(`Hubo un error con ${req.method} ${req.originalUrl}`);
        console.log(error);
        response.error(req,res,'Hubo un error con el servidor',500);
    }
}

module.exports={postRoot,postSign,getSearchId, getAll, deleteSearchId};