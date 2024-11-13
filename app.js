const fs = require('fs');           
const axios = require('axios');     

const readArticle = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('article.txt', 'utf8', (err, data) => {
            if (err) reject('Помилка при зчитуванні статті:', err);
            else resolve(data);
        });
    });
};

const sendToOpenAI = async (articleContent) => {
    const apiKey = 'z';  

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'text-davinci-003',  
                prompt: `${articleContent}\n\nCreate an HTML article structure with tags, image hints, and captions.`,
                max_tokens: 1500,
                temperature: 0.5
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].text;  
    } catch (error) {
        console.error('Помилка при з\'єднанні з OpenAI API:', error);
    }
};

const saveToFile = (htmlContent) => {
    const outputPath = 'output/artykul.html';
    fs.writeFile(outputPath, htmlContent, 'utf8', (err) => {
        if (err) console.error('Помилка при записі файлу:', err);
        else console.log('HTML файл успішно збережено у папці output!');
    });
};

const main = async () => {
    try {
        const articleContent = await readArticle();              
        const htmlContent = await sendToOpenAI(articleContent);  
        saveToFile(htmlContent);                                 
    } catch (error) {
        console.error('Сталася помилка:', error);
    }
};

main();
