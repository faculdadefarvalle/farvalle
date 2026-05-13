import { mailOptions, transporter } from '../../services/nodemailer' 
import juice from "juice";
import "react-quill-new/dist/quill.snow.css"

export async function POST(request: Request) {

    const {nome, sobrenome, email, tel, text} = await request.json()

    const htmlInline = juice(text)
    // PRECISA COLOCAR A URL DA LOGO NO HTML
    try {
        await transporter.sendMail({
           ...mailOptions,
           subject: 'Novo Contato | FARVALLE',
           //cc: 'ouvidoria@fazag.edu.br',
           //bcc: 'caroll_moutinho@hotmail.com',
           text: text,
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
 
               
           
               <h1 style="font-size: 36px;">Novo Contato</h1>
               </div>

               <div style="font-size: 16px;">
                    <strong>Nome:</strong> ${nome} ${sobrenome}
               </div>
               <div style="font-size: 16px; margin-top: 16px;">
                <strong>Celular / Whatsapp:</strong> ${tel}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>E-mail:</strong> ${email}
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
           <h2 style="text-align: center;"> Mensagem </h2>

           ${htmlInline}
        </div>`,
           
        })
        return Response.json({success: true}, {status: 200})
       }catch(err){
           console.log(err)
           return Response.json({err}, {status: 400})
       }
}
