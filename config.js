const SUPABASE_URL =
"https://xnxpvykezuigdhkmvdvk.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueHB2eWtlenVpZ2Roa212ZHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NjMxMzYsImV4cCI6MjA5MzQzOTEzNn0.hVluf7TVg719lkrLbRpgeenv698dDZTzaIH7o4hQt64";

const supabase =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
