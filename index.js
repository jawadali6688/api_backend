import express from "express"
import cors from "cors"
import { ZyphraClient } from "@zyphra/client";
const app = express()

app.use(cors())
app.use(express.static("public"));
app.use(express.urlencoded({extended: true, limit: "100mb"}));
app.use(express.json({limit: "100mb"}))


app.post("/jawad_voice_generating", async (req, resp) => {
    const { text, sampleAudio, apiKey } = req.body;
    try {
        const client = new ZyphraClient({ apiKey });
        const audioData = await client.audio.speech.create({
            text,
            speaker_audio: sampleAudio,
            language_iso_code: 'en-us',
            mime_type: 'audio/mpeg',
            model: 'zonos-v0.1-hybrid',
            vqscore: 0.6,       
            speaker_noised: true,  
            speaking_rate: 15
            
        });

        const arrayBuffer = await audioData.arrayBuffer(); 
        const buffer = Buffer.from(arrayBuffer); 

        const fileName = "jawad_ai.mp3";
        resp.set({
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': 'audio/mpeg',
        });

        resp.status(201).send(buffer);

    } catch (error) {
        console.log(error)
        console.error('Error generating voice:', error.message);
        return resp.json({success: false, message: "Error while generating the audio", error})
    }
})

app.get("/health", async (req, resp) => {
    return resp.json({success: true, message: "Working Great", data: [{name: "Jawad"}]})
})


app.listen(8000, () => {
    console.log("App is running on port 8000")
})