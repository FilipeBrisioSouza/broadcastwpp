const axios = require("axios");

exports.handler = async (event, context) => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const { numbers, textMessage } = body;

        if (!numbers || numbers.length === 0 || !textMessage) {
            console.error("Erro: Números e mensagem são obrigatórios");
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Números e mensagem são obrigatórios" }),
            };
        }

        console.log(`Enviando mensagem para ${numbers.length} números...`);

        const requests = numbers.map(async (number) => {
            try {
                const response = await axios.post(
                    `${process.env.EVOLUTION_API_URL}`, 
                    {
                        number,
                        textMessage: { text: textMessage },
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            apikey: process.env.EVOLUTION_API_KEY,
                        },
                    }
                );

                console.log(`Mensagem enviada para ${number}:`, response.data);
                return { number, status: "Success", response: response.data };
            } catch (error) {
                console.error(`Erro ao enviar para ${number}:`, error.response?.data || error.message);
                return {
                    number,
                    status: "Failed",
                    error: error.response?.data || error.message,
                };
            }
        });

        const results = await Promise.all(requests);

        console.log("Envio concluído:", results);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Mensagens enviadas", results }),
        };
    } catch (error) {
        console.error("Erro ao processar requisição:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro interno do servidor" }),
        };
    }
};
