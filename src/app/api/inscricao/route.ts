
import { supabase } from "../../services/supabase";

export async function POST(req: Request){

    const {nome, city, conheceu, course, email, ingresso, tel} = await req.json()

    try{
        const { error } = await supabase
            .from("inscricoes")
            .insert({
                nome: nome,
                cidade: city,
                conheceu: conheceu,
                curso: course,
                email: email,
                ingresso: ingresso,
                telefone: tel
            });

        if (error) {
            throw error;
        }
    
        return Response.json({success: true}, {status: 200})
    } catch(e){
        return Response.json({error: e}, {status: 400})
    }
}
