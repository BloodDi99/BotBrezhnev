const { Telegraf , Markup } = require('telegraf');
require('dotenv').config();
const text =require ('./const');
const axios = require("axios");
const city = require('./russian_city.js');

function GiveDate(){
    let yourDate = new Date();
    const date = yourDate.toISOString().split('T')[0];
    return date;
}
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
    ctx.replyWithHTML(`Привет ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Салага '}👋. Я тестовый бот, могу дать тебе информацию по погоде практически по любому городу, нашей необъятной страны🇷🇺🇷🇺🇷🇺.
Для того что бы получить информацию о погоде, небоходимо в чат написать город. Для более подробной информации напиши команду /help`)
});
bot.help((ctx) => ctx.reply(text.commands));

bot.on('message', (ctx) => {
    let mess = ctx.message.text;
    console.log(mess);
    givApi(mess, ctx);
})
async function givApi(mess,ctx){
    let coord={};
    for (let index = 0; index < city.city.length ; index++) {
        if(mess===city.city[index].name){
            Object.assign(coord,city.city[index]);
        }
    }
    if(Object.keys(coord).length!==0){
       const date =  GiveDate();
        const weather = await axios.get(`https://api.open-meteo.com/v1/jma?latitude=${coord.coords.lat}&longitude=${coord.coords.lon}&hourly=temperature_2m&start_date=${date}&end_date=${date}`);
        WriteAnswer(coord.name,weather.data,ctx)
    }
    else{
        WriteEror(ctx);
    }
function WriteEror(ctx) {
    let mes='Ошибка, не правильно введеный город или город не найден';
    ctx.replyWithHTML(mes);
}}
function WriteAnswer(Name,data, ctx){
    let Answer = '';
        Answer = `Погода в городе <b>${Name} на сегодня \n 
        ${data.hourly.time[6].split('T')[1]} ${Math.ceil(data.hourly.temperature_2m[6])} Градуса(ов) по цельсию \n
        ${data.hourly.time[9].split('T')[1]} ${Math.ceil(data.hourly.temperature_2m[9])} Градуса(ов) по цельсию \n
        ${data.hourly.time[12].split('T')[1]} ${Math.ceil(data.hourly.temperature_2m[12])} Градуса(ов) по цельсию \n
        ${data.hourly.time[15].split('T')[1]} ${Math.ceil(data.hourly.temperature_2m[15])} Градуса(ов) по цельсию \n
        ${data.hourly.time[18].split('T')[1]} ${Math.ceil(data.hourly.temperature_2m[18])} Градуса(ов) по цельсию \n
        ${data.hourly.time[21].split('T')[1]} ${Math.ceil(data.hourly.temperature_2m[21])} Градуса(ов) по цельсию \n </b>`;
        ctx.replyWithHTML(Answer);
}
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
//const coord = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=Almetyevsk&limit=5&appid=9748a46a0ba3134b4670fead1f1c43df`);
//const weather = await axios.get(`https://api.open-meteo.com/v1/jma?latitude=${coord.data[0].lat}&longitude=${coord.data[0].lon}&hourly=temperature_2m&start_date=${date}&end_date=${date}`);
//const weather = await axios.get(`https://api.open-meteo.com/v1/jma?latitude=${city.city[index].coords.lat}&longitude=${city.city[index].coords.lon}&hourly=temperature_2m&start_date=${date}&end_date=${date}`)
//const weather = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=52.66&longitude=90.09&hourly=temperature_2m&start_date=${date}&end_date=${date}`)
//console.log(weather.data)
// Enable graceful stop
/*function addActionBot (name,src,text){
    bot.action(name, async (ctx)=>{
        try{

            await ctx.answerCbQuery()
            if (src !== false){
                await ctx.replyWithPhoto({
                    source: src
                })
            }
            await ctx.replyWithHTML('ХУли мы тут ищем'),{
                disable_web_page_preview:true
            }

        }catch (e){
            console.error(e)
        }
    })
}
addActionBot('btn_1',false, text.text);*/
