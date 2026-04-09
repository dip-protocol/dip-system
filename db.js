const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://absmfucyowhthtfrxxtg.supabase.co",
  "sb_publishable_Fj9ILCURXzVcnqsGaM3hfA_ZSAdoE2_"
);

module.exports = { supabase };