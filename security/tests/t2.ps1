$b='http://localhost:4173'
function post($body){ $f=[IO.Path]::GetTempFileName(); [IO.File]::WriteAllText($f,$body); curl.exe -s -o - -w " [%{http_code}]" -X POST "$b/api/marina-trial" -H 'Content-Type: application/json' -H 'Origin: http://localhost:4173' --data-binary "@$f"; Remove-Item $f; "" }
"--- insert real (teste)"; post '{"name":"TESTE SEGURANCA ANTUM","whatsapp":"47900000001","email":"teste-seguranca@example.com","company":"teste","consent":true,"utm":{"utm_source":"fb","utm_campaign":"teste"}}'
"--- duplicado (mesmo whatsapp)"; post '{"name":"TESTE SEGURANCA ANTUM","whatsapp":"47900000001","email":"teste-seguranca@example.com","consent":true}'
"--- 5a"; post '{"name":"x","whatsapp":"1","email":"x","consent":false}'
"--- 5b"; post '{"name":"x"}'
"--- 6a (esperado 429)"; post '{"name":"x","whatsapp":"1","email":"x","consent":false}'
$u='https://vlqfwdpgdqusugwebfwx.supabase.co/rest/v1/marina_trials'; $k='sb_publishable_G9JhPOfn-rPV93AgBFM0ig_UNvAXiMf'
"--- RLS: anon SELECT"; curl.exe -s -w " [%{http_code}]" "$u`?select=id,name,email&limit=3" -H "apikey: $k" -H "Authorization: Bearer $k"; ""
"--- RLS: anon PATCH (marcador)"; curl.exe -s -w " [%{http_code}]" -X PATCH "$u`?name=eq.TESTE%20SEGURANCA%20ANTUM" -H "apikey: $k" -H "Authorization: Bearer $k" -H 'Content-Type: application/json' -H 'Prefer: return=representation' --data-binary "@security\patch.json"; ""
"--- RLS: anon DELETE (marcador)"; curl.exe -s -w " [%{http_code}]" -X DELETE "$u`?name=eq.TESTE%20SEGURANCA%20ANTUM" -H "apikey: $k" -H "Authorization: Bearer $k" -H 'Prefer: return=representation'; ""
