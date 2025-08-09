export interface Env {
    DB: D1Database;
    API_KEY: string;
  }
  
  function jsonResponse(data: any, status: number = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
  
  export default {
    async fetch(request: Request, env: Env) {
      const url = new URL(request.url);
  
      // ✅ API key check
      const apiKey = request.headers.get("x-api-key");
      if (!apiKey || apiKey !== env.API_KEY) {
        return jsonResponse({ error: "Unauthorized" }, 401);
      }
  
      // ✅ Ensure table exists
      await env.DB.prepare(
        `CREATE TABLE IF NOT EXISTS brandkits (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          brand_name TEXT,
          slogan TEXT,
          website TEXT
        )`
      ).run();
  
      // ✅ GET /brandkits → fetch all rows
      if (request.method === "GET" && url.pathname.replace(/\/$/, "") === "/brandkits") {
        const { results } = await env.DB.prepare("SELECT * FROM brandkits").all();
        return jsonResponse(results);
      }
  
      // ✅ POST /brandkits → insert a row
      if (request.method === "POST" && url.pathname.replace(/\/$/, "") === "/brandkits") {
        try {
          const { brand_name, slogan, website } = await request.json();
  
          await env.DB.prepare(
            "INSERT INTO brandkits (brand_name, slogan, website) VALUES (?, ?, ?)"
          ).bind(brand_name, slogan, website).run();
  
          return jsonResponse({ success: true });
        } catch (err) {
          return jsonResponse({ error: "DB insert failed", details: String(err) }, 500);
        }
      }
  
      // ✅ Default 404
      return jsonResponse({ error: "Not found" }, 404);
    }
  };
  