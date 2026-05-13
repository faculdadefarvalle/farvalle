import { NextApiRequest, NextApiResponse } from "next";
import { mailOptions, transporter} from '../../../services/nodemailer';
import juice from "juice";
import "react-quill-new/dist/quill.snow.css"

export async function POST(request: Request) {

    const {nome, email, tel, text, course, city, ingresso, conheceu} = await request.json()

    const htmlInline = juice(text)

    // PRECISA COLOCAR A URL DA LOGO NO HTML
    try {
        await transporter.sendMail({
           ...mailOptions,
           subject: '🗣️ Nova Inscrição | FARVALLE 🗣️',
           //cc: 'ouvidoria@fazag.edu.br',
           //bcc: 'caroll_moutinho@hotmail.com',
           text: htmlInline,
           replyTo: email,
           html: `    <div style=" padding: 8px 10px;
           background: #ececec;
           font-family:'Open Sans','Roboto','Helvetica Neue','Helvetica','Arial', sans-serif;
           color: #757575;">
               <div style="max-width: 600px;
               margin: auto;
           padding: 15px 30px 25px 30px;
           background: white;
           border-radius: 4px;
           text-align: justify;">
               <div style="
           display: block;
           text-align: center;
           margin-top: 1rem;
           margin-bottom: 1rem;">
           <a href="/">
                <img src="https://www.farvalle.edu.br/images/novainscricao.jpg" style="border-radius: 16px;" alt="Logo da Farvalle" width=600px />
           </a>
               
           
               <h1 style="font-size: 36px;">Nova Inscrição</h1>
               </div>

               <div style="font-size: 16px;">
                    <strong>Nome:</strong> ${nome}
               </div>
               <div style="font-size: 16px; margin-top: 16px;">
                <strong>Celular / Whatsapp:</strong> ${tel}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>E-mail:</strong> ${email}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>Cidade:</strong> ${city}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>Como conheceu a FAZAG:</strong> ${conheceu}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>Forma de Ingresso:</strong> ${ingresso}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>Curso desejado:</strong> ${course}
            </div>
               </div>

           </div>
           
           <div style=" padding: 8px 10px;
           background: #ececec;
           font-family:'Open Sans','Roboto','Helvetica Neue','Helvetica','Arial', sans-serif;
           color: #757575;">
               <div style="max-width: 600px;
               margin: auto;
           padding: 15px 30px 25px 30px;
           background: white;
           border-radius: 4px;
           text-align: justify;">
               <div style="
           display: block;
           text-align: center;
           margin-top: 1rem;
           margin-bottom: 1rem;">
           <h2 style="text-align: center;"> Redação </h2>

           ${text}
        </div>`,
           
        })
        return Response.json({success: true}, {status: 200})
       }catch(err){
           console.log(err)
           return Response.json({err}, {status: 400})
       }
}
