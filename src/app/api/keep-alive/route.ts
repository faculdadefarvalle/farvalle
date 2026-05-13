import { supabase } from "../../services/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (cronSecret && authorization !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("keep_supabase_awake");

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  return Response.json({
    success: true,
    lastPingAt: data,
  });
}
